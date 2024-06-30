import useAPIFetcher from "@/hooks/useAPIFetcher";
import { PaginatedPharmacies } from "@/types/responses/pharmacies";
import {
	Button,
	Flex,
	Spinner,
	Text,
	useDisclosure,
	useToast,
	Tooltip,
	IconButton,
} from "@chakra-ui/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Table, { TableData } from "../ui/Table";
import {
	PharmaciesRowData,
	pharmaciesTableColumn,
	toPharmaciesTableData,
} from "@/types/table/pharmacy";
import Paginator from "../ui/Paginator";
import { colors } from "@/constants/colors";
import DetailPharmacyModal from "../modal/DetailPharmacyModal";
import CreatePharmacyModal from "../modal/CreatePharmacyModal";
import DeleteAlert from "../modal/DeleteAlert";
import { deletePharmacy } from "@/services/pharmacies";
import useSession from "@/hooks/useSession";
import UpdatePharmacyModal from "../modal/UpdatePharmacyModal";

const PharmacyTable = ({ access_token }: { access_token: string }) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const urlParams = new URLSearchParams(searchParams);
	const [selectedPharmacy, setSelectedPharmacy] = useState<PharmaciesRowData>();
	const toast = useToast();
	const { session } = useSession();

	const {
		isOpen: isOpenDetailModal,
		onClose: onCloseDetailModal,
		onOpen: onOpenDetailModal,
	} = useDisclosure();

	const {
		isOpen: isOpenCreateModal,
		onClose: onCloseCreatelModal,
		onOpen: onOpenCreateModal,
	} = useDisclosure();

	const {
		isOpen: isOpenUpdateModal,
		onClose: onCloseUpdateModal,
		onOpen: onOpenUpdateModal,
	} = useDisclosure();

	const {
		isOpen: isOpenDeleteModal,
		onClose: onCloseDeleteModal,
		onOpen: onOpenDeleteModal,
	} = useDisclosure();
	const deleteCancelRef = React.useRef();

	const openDetailModal = (data: PharmaciesRowData) => {
		setSelectedPharmacy(data);
		onOpenDetailModal();
	};

	const pageParam = urlParams.get("page");
	let page: number = 1;
	if (!pageParam) {
		urlParams.set("page", "1");
	}

	if (pageParam) {
		if (!isNaN(+pageParam)) {
			page = +pageParam;
			urlParams.set("page", pageParam);
		} else {
			urlParams.set("page", "1");
		}
	}

	const {
		data: pharmaciesRes,
		isLoading,
		mutate,
	} = useAPIFetcher<PaginatedPharmacies>(
		`pharmacies/own?${urlParams.toString()}&limit=8`,
		{
			accessToken: access_token,
		}
	);

	if (isLoading) {
		return (
			<Flex
				className="h-full w-full"
				justifyContent={"center"}
				alignItems={"center"}
			>
				<Spinner />
			</Flex>
		);
	}

	const onClickRow = (rowData: TableData) => {
		const data = rowData as unknown as PharmaciesRowData;
		openDetailModal(data);
	};

	const onNext = () => {
		urlParams.set("page", `${page + 1}`);
		router.replace(`${pathname}?${urlParams.toString()}`);
	};

	const onPrev = () => {
		if (page === 1) return;
		urlParams.set("page", `${page - 1}`);
		router.replace(`${pathname}?${urlParams.toString()}`);
	};

	const onDeletePharmacy = async () => {
		try {
			if (selectedPharmacy) {
				await deletePharmacy(
					selectedPharmacy.slug,
					session?.access_token ?? ""
				);
				toast({
					title: "Delete pharmacy",
					description: "Successfully delete pharmacy",
					status: "success",
					isClosable: true,
					duration: 3000,
					position: "top-right",
				});
				mutate();
				onCloseDeleteModal();
			}
		} catch (e) {
			toast({
				title: "Delete pharmacy",
				description: "Failed delete pharmacy",
				status: "error",
				isClosable: true,
				duration: 3000,
				position: "top-right",
			});
		}
	};

	const actionColumn = (rowData: TableData) => {
		const data = rowData as unknown as PharmaciesRowData;
		return (
			<Flex columnGap={4}>
				<Tooltip label="Update pharmacy">
					<IconButton
						aria-label="update pharmacy"
						colorScheme="yellow"
						onClick={(e) => {
							setSelectedPharmacy(data);
							onOpenUpdateModal();
							e.stopPropagation();
						}}
					>
						<i className="fa-solid fa-pen-to-square"></i>
					</IconButton>
				</Tooltip>
				<Tooltip label="Delete pharmacy">
					<IconButton
						aria-label="delete pharmacy"
						colorScheme="red"
						onClick={(e) => {
							setSelectedPharmacy(data);
							onOpenDeleteModal();
							e.stopPropagation();
						}}
					>
						<i className="fa-solid fa-trash"></i>
					</IconButton>
				</Tooltip>
			</Flex>
		);
	};

	return (
		<>
			<TableHeader onOpenCreatePharmacyModal={onOpenCreateModal} />
			<Flex rowGap={5} direction={"column"} justifyContent={"space-between"}>
				<Table
					columns={pharmaciesTableColumn}
					data={toPharmaciesTableData(pharmaciesRes?.data?.pharmacies ?? [])}
					onClickRow={onClickRow}
					actionColumn={actionColumn}
				/>
				<Flex columnGap={5} alignItems={"center"}>
					<Paginator
						onNext={onNext}
						onPrev={onPrev}
						pageInfo={pharmaciesRes?.data?.page_info}
					/>
				</Flex>
			</Flex>
			<UpdatePharmacyModal
				isOpen={isOpenUpdateModal}
				onClose={onCloseUpdateModal}
				mutate={mutate}
				pharmacy={selectedPharmacy}
			/>
			<DeleteAlert
				isOpen={isOpenDeleteModal}
				cancelRef={deleteCancelRef}
				onClose={onCloseDeleteModal}
				header="Delete pharmacy"
				onDelete={onDeletePharmacy}
			/>
			<CreatePharmacyModal
				isOpen={isOpenCreateModal}
				onClose={onCloseCreatelModal}
				mutate={mutate}
			/>
			<DetailPharmacyModal
				isOpen={isOpenDetailModal}
				onClose={onCloseDetailModal}
				access_token={access_token}
				pharmacyRowData={selectedPharmacy}
			/>
		</>
	);
};

const TableHeader = ({
	onOpenCreatePharmacyModal,
}: {
	onOpenCreatePharmacyModal: () => void;
}) => {
	return (
		<Flex alignItems={"center"} justifyContent={"space-between"}>
			<Text fontSize={30} color={colors.primary}>
				Pharmacies
			</Text>
			<Flex columnGap={4}>
				<Button
					leftIcon={<i className="fa-solid fa-plus"></i>}
					variant={"brandPrimary"}
					onClick={() => onOpenCreatePharmacyModal()}
				>
					Create
				</Button>
			</Flex>
		</Flex>
	);
};

export default PharmacyTable;
