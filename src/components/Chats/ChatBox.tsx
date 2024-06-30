import React, { lazy, useEffect, useMemo, useRef, useState } from "react";
import {
	query,
	collection,
	orderBy,
	onSnapshot,
	doc,
	Timestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";

const MessageBubble = lazy(() => import("./MessageBubble"));

import ChatField from "./ChatField";
import { Room } from "@/types/room";
import { Select, chakraComponents } from "chakra-react-select";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardHeader,
	Divider,
	Flex,
	HStack,
	IconButton,
	Image,
	Img,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useDisclosure,
	useToast,
	VStack,
} from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import ChatDate from "./ChatDate";
import { Message } from "@/types/message";
import { colors } from "@/constants/colors";
import { useAppSelector } from "@/redux/reduxHook";
import { role } from "@/constants/role";
import useSession from "@/hooks/useSession";
import { FormState, defaultFormState } from "@/types/form";
import { endChat, sendDoctorNotes } from "@/services/chats";
import { InternalServerError } from "@/exceptions/internalServerError";
import { serverEncounterError } from "@/constants/error";
import { AccountProfile } from "@/types/responses/profile";
import { SessionData } from "@/utils/session";
import useAPIInfinite from "@/hooks/useAPIInfinite";
import { ProductPaginatedResponse } from "@/types/responses/product";
import { Product } from "../../types/responses/product";
import { postPrescription } from "@/services/chats";

interface PrescribeModalProps {
	open: boolean;
	onClose: () => void;
	roomId: string;
}

const PrescribeModal = ({ open, onClose, roomId }: PrescribeModalProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const session = useSession();

	const [chosenProduct, setChosenProduct] = useState<
		{ product: Product; amount: number; direction: string }[]
	>([]);

	let productFetchPath = useMemo(() => {
		let params: string[] = [];
		params.push(`term=${searchTerm}`);
		return "/product/list?" + params.join("&");
	}, [searchTerm]);

	const { data } = useAPIInfinite<ProductPaginatedResponse>(
		(pageIndex, previousePageData) => {
			return `${productFetchPath}&limit=10&page=1`;
		}
	);

	const productList = [];
	var products: Product[] = [];

	if (data != undefined) {
		products = data[0]?.data?.products ?? [];
	}

	if (products.length >= 0) {
		for (let index = 0; index < products!.length ?? 0; index++) {
			const element = products[index];
			productList.push({
				value: element,
				label: element.name,
				icon: <Img src={element.photo_url} alt={element.name}></Img>,
			});
		}
	}

	return (
		<>
			<Modal scrollBehavior="inside" isOpen={open} onClose={onClose}>
				<ModalOverlay />
				<ModalContent className="h-[700px]">
					<ModalHeader>Prescription</ModalHeader>
					<ModalCloseButton />
					<ModalBody className="flex flex-col gap-3 mb-4">
						<Select
							name="searchParams"
							options={productList}
							placeholder="Search..."
							onChange={(newTarget, newAction) => {
								const chosen = newTarget?.value;

								if (chosenProduct.find((item) => item.product === chosen)) {
									const index = chosenProduct.findIndex(
										(item) => item.product === chosen
									);
									const chosenProd = chosenProduct;
									const target = chosenProd[index];

									target.amount += 1;
									setChosenProduct([...chosenProd]);
								} else {
									if (chosen) {
										const tar = {
											product: chosen,
											amount: 1,
											direction: "",
										};
										setChosenProduct([...chosenProduct, tar]);
									}
								}
							}}
							onInputChange={(val, v) => {
								setSearchTerm(val);
							}}
						/>
						<Divider />
						{chosenProduct.map((val, i) => {
							return (
								<HStack key={i}>
									<Image
										src={val.product.photo_url}
										alt={val.product.name}
										width={24}
										height={24}
									/>
									<VStack flex={1}>
										<p className="flex-1">{val.product.name}</p>
										<HStack>
											<IconButton
												aria-label="-"
												icon={<i className="fa-solid fa-minus"></i>}
												onClick={() => {
													setChosenProduct((prev) => {
														const updatedState = [...prev];
														if (updatedState[i].amount > 1) {
															updatedState[i].amount -= 1;
														}
														return updatedState;
													});
												}}
											/>
											<p>Count : {val.amount} </p>
											<IconButton
												aria-label="+"
												icon={<i className="fa-solid fa-plus"></i>}
												onClick={() => {
													const chosen = chosenProduct;
													const target = chosen[i];

													target.amount += 1;
													setChosenProduct([...chosen]);
												}}
											/>
										</HStack>
										<HStack>
											<p>Dosage</p>
											<Input
												onChange={(e) => {
													const chosen = chosenProduct;
													const target = chosen[i];

													target.direction = e.target.value;
													chosen[i] = target;
													setChosenProduct([...chosen]);
												}}
											></Input>
										</HStack>
									</VStack>
									<IconButton
										aria-label="delete"
										onClick={() => {
											setChosenProduct((prev) => {
												const updatedState = [...prev];
												updatedState.splice(i, 1);
												return updatedState;
											});
										}}
										icon={
											<i className="text-red-500 text-2xl fa-solid fa-trash"></i>
										}
									/>
								</HStack>
							);
						})}
						<Button
							width={"auto"}
							padding={4}
							onClick={() => {
								postPrescription(
									roomId,
									() => {
										setChosenProduct([]);
										onClose();
									},
									session.session?.access_token ?? "0",
									chosenProduct
								);
							}}
							isDisabled={chosenProduct.length > 0 ? false : true}
						>
							Send Prescription
						</Button>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

interface ChatBoxProps {
	roomId: string;
	roleUser: string;
}

const ChatBox = ({ roomId, roleUser }: ChatBoxProps) => {
	const profileState = useAppSelector((state) => state.profile);
	const [room, setRoom] = useState<Room>();
	const [open, setOpen] = useState<boolean>(false);
	const session = useSession();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [formState, setFormState] = React.useState<FormState>(defaultFormState);
	const toast = useToast();
	const [page, setPage] = useState(0);

	const [messages, setMessages] = useState<Message[]>([]);
	const [notes, setNotes] = useState<string>();
	const [userId, setUserId] = useState<number>();

	const onEndChat = async () => {
		try {
      if (!roomId) return;
			setFormState((prev) => ({ ...prev, isLoading: true }));
			await endChat(
				{
					room_id: roomId ?? "",
				},
				session.session?.access_token ?? "0"
			);

			toast({
				title: "Consultation Ended",
				description: "successfully ended consultation with doctor.",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		} catch (e: any) {
			if (e instanceof InternalServerError) {
				setFormState((prev) => ({
					...prev,
					errorMessage: serverEncounterError,
				}));
			}
			setFormState((prev) => ({ ...prev, errorMessage: e.message }));
			toast({
				title: "Error End Chat",
				isClosable: true,
				description: "Please try again in a few moments.",
				duration: 3000,
				position: "top-right",
			});
		} finally {
			setFormState((prev) => ({ ...prev, isLoading: false }));
		}
	};

	const onSendNotes = async () => {
		try {
      if (!roomId) return;
			await sendDoctorNotes(
				{
					room_id: parseInt(roomId),
					user_id: userId ?? 0,
					message: notes ?? "",
				},
				session.session?.access_token ?? ""
			);

			setPage(0);

			toast({
				title: "Doctor Notes Sended",
				description: "successfully send doctor notes to patient.",
				status: "success",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		} catch (e: any) {
			if (e instanceof InternalServerError) {
				toast({
					title: "Error Send Doctor Notes",
					isClosable: true,
					description: "Please try again in a few moments.",
					duration: 3000,
					position: "top-right",
				});
			}
		}
	};

	const scroll = useRef<HTMLDivElement>();
	useEffect(() => {
    if (!roomId) return;
		const unsubscribe = onSnapshot(doc(db, "rooms", roomId), (docSnapshot) => {
			const fetchedRoom = {
				id: docSnapshot.id,
				doctorId: docSnapshot.data()?.doctorId,
				doctorName: docSnapshot.data()?.doctorName ?? "",
				userId: docSnapshot.data()?.userId ?? 0,
				userName: docSnapshot.data()?.userName ?? "",
				start: docSnapshot.data()?.start ?? Timestamp.now(),
				isTyping: docSnapshot.data()?.isTyping ?? [],
				end: docSnapshot.data()?.end ?? Timestamp.now(),
			};
			setRoom(fetchedRoom);
			setUserId(docSnapshot.data()?.userId);
		});
		return () => {
			unsubscribe();
		};
	}, [roomId]);

	useEffect(() => {
		if (!roomId) return;
		const q = query(
			collection(db, `rooms/${roomId}/chats`),
			orderBy("createdAt", "desc")
		);
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			let fetchedMessages: Message[] = [];

			querySnapshot.forEach((doc) => {
				fetchedMessages.push({
					id: doc.id,
					roomId: doc.data().roomId,
					message: doc.data().message,
					url: doc.data().url,
					type: doc.data().type,
					userId: doc.data().userId,
					userName: doc.data().userName,
					createdAt: doc.data().createdAt,
					role: doc.data().role,
				});
			});
			setMessages(fetchedMessages);
		});

		return () => {
			unsubscribe();
		};
	}, [roomId]);
	let temp = dayjs();

	if (roomId === "") {
		return <></>;
	}

	return (
		<>
			<PrescribeModal
				onClose={() => {
					setOpen(!open);
				}}
				open={open}
				roomId={roomId}
			/>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Details</ModalHeader>
					<ModalCloseButton />
					<ModalBody className="flex flex-col gap-3 mb-4">
						{page === 0 && (
							<>
								<p>
									{roleUser === role.USER ? room?.doctorName : room?.userName}
								</p>
								{(room?.end.toDate().getTime() ?? Date.now()) >= Date.now() ? (
									room?.id ? (
										roleUser === role.DOCTOR ? (
											<Flex className="flex-col gap-5">
												<Flex justifyContent={"space-around"} w={"full"}>
													<Button
														w={"45%"}
														variant={"brandPrimary"}
														onClick={() => {
															setOpen(true);
														}}
													>
														Make Prescription
													</Button>
													<Button
														w={"45%"}
														variant={"brandPrimary"}
														onClick={() => setPage(1)}
													>
														Make Doctor Notes
													</Button>
												</Flex>
												<Button
													w={"100%"}
													variant={"brandPrimary"}
													onClick={(e) => {
														e.preventDefault;
														onEndChat();
													}}
												>
													End Chat
												</Button>
											</Flex>
										) : (
											<Button
												w={"100%"}
												variant={"brandPrimary"}
												onClick={(e) => {
													e.preventDefault;
													onEndChat();
												}}
											>
												End Chat
											</Button>
										)
									) : (
										<></>
									)
								) : (
									<></>
								)}
							</>
						)}
						{page === 1 && (
							<>
								<form
									onSubmit={(ev) => {
										ev.preventDefault();
										onSendNotes();
									}}
								>
									<Text>Doctor&#39;s Notes</Text>
									<Textarea
										placeholder="Input your message here..."
										onChange={(ev) => setNotes(ev.target.value)}
									/>
									<Flex className="mt-8" gap={"5px"}>
										<Button type="submit" variant={"brandPrimary"}>
											Send Medical Certificate
										</Button>
										<Button
											bg={colors.warning}
											color={colors.white}
											onClick={() => setPage(0)}
										>
											Back
										</Button>
									</Flex>
								</form>
							</>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>

			<Card
				overflow="hidden"
				style={{
					overflowAnchor: "auto",
				}}
				variant="outline"
				className="m-8 w-full h-[80vh]"
			>
				<CardHeader
					paddingTop={"10px"}
					paddingBottom={"10px"}
					alignItems={"center"}
					gap={"18px"}
					verticalAlign={"middle"}
					className="bg-blue-600 flex-row flex justify-evenly"
				>
					<div
						className="flex-row flex justify-start flex-1 gap-4"
						style={{
							alignItems: "center",
							verticalAlign: "middle",
						}}
					>
						<Avatar />
						<div className="flex flex-col">
							<p className="text-white font-bold text-lg">
								{roleUser === role.USER ? room?.doctorName : room?.userName}
							</p>
							<p className="text-white font-semibold text-base">
								{room?.isTyping.find((val) => {
									return val === room.doctorName;
								})
									? "isTyping..."
									: ""}
							</p>
						</div>
					</div>

					<IconButton
						type="submit"
						aria-label="Information"
						onClick={onOpen}
						variant="ghost"
						colorScheme="white"
						fontSize={18}
						icon={
							<i className="text-white text-2xl fa-solid fa-circle-info"></i>
						}
					/>
				</CardHeader>
				<div className="overflow-auto flex flex-1 gap-5 p-4 flex-col-reverse">
					{messages?.map((message) => {
						return (
							<>
								{room ? (
									<MessageBubble
										roleUser={roleUser}
										session={session.session!}
										key={message.id}
										room={room}
										message={message}
										userId={profileState.id}
									/>
								) : (
									<></>
								)}
								{CheckDate(
									(now) => {
										temp = now;
									},
									temp,
									dayjs(message?.createdAt?.toDate() ?? Date.now())
								)}
							</>
						);
					})}
					<span ref={scroll as React.RefObject<HTMLDivElement>}></span>
				</div>
				{(room?.end.toDate().getTime() ?? Date.now()) >= Date.now() ? (
					room?.id ? (
						<ChatField roomId={room?.id ?? ""} scroll={scroll} />
					) : (
						<></>
					)
				) : (
					<Box className="flex justify-center align-middle mb-4">
						<Card
							className="p-4"
							bg={colors.warning}
							color={colors.white}
							fontWeight={600}
						>
							Chat Ended
						</Card>
					</Box>
				)}
			</Card>
		</>
	);

	function CheckDate(
		onMatch: (now: Dayjs) => void,
		before: Dayjs,
		now: Dayjs
	): React.ReactElement {
		if (
			before.format("DD-MM-YYYY") !==
			(now.format("DD-MM-YYYY") ?? dayjs().format("DD-MM-YYYY"))
		) {
			onMatch(now);
			return <ChatDate key={now.format("DD-MM-YYYY")} date={now} />;
		}
		return <></>;
	}
};
export default ChatBox;
