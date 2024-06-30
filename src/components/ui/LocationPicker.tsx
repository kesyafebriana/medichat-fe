import { ErrZeroResults } from "@/constants/map";
import {
	useJsApiLoader,
	GoogleMap,
	Autocomplete,
	Libraries,
} from "@react-google-maps/api";
import { getAddress } from "@/services/maps";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import React from "react";
import {
	Box,
	Button,
	ButtonGroup,
	Flex,
	HStack,
	Input,
	SkeletonText,
} from "@chakra-ui/react";
import { Position } from "@/types/map";
import { FormikErrors, FormikValues } from "formik";
const place: Libraries = ["places"];

const LocationPicker = ({
	centerPos,
	errors,
	setFieldValue,
	setErrors,
	setIsOpenMap,
}: LocationPickerProps) => {
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: apiKey ? apiKey : "",
		libraries: place,
	});
	const addressRef = React.useRef<HTMLInputElement | null>(null);
	const [map, setMap] = React.useState<google.maps.Map | null>();
	const [selectedMarker, setSelectedMarker] = React.useState();
	const [isOnSaveLoading, setIsOnSaveLoading] = React.useState<boolean>(false);

	const onLoadMap = React.useCallback(
		async (map: google.maps.Map) => {
			try {
				//@ts-ignore
				const { AdvancedMarkerElement } = await google.maps.importLibrary(
					"marker"
				);

				if (centerPos) {
					const res = await getAddress(centerPos.lat, centerPos.lng);
					const marker = new AdvancedMarkerElement({
						position: { lat: centerPos.lat, lng: centerPos.lng },
						map: map,
						title: "Hello",
					});
					if (addressRef.current && res) {
						addressRef.current.value = res[0].formatted_address;
					}
					setSelectedMarker(marker);
				}

				setMap(map);
			} catch (e) {}
		},
		[centerPos]
	);

	const onUnmountMap = React.useCallback(() => {
		setMap(null);
	}, []);

	const onSearch = React.useCallback(
		async (term: string | undefined) => {
			try {
				//@ts-ignore
				const { AdvancedMarkerElement } = await google.maps.importLibrary(
					"marker"
				);

				if (term !== "") {
					const res = await geocodeByAddress(term ?? "");
					const pos = await getLatLng(res[0]);

					setFieldValue("lat", pos.lat);
					setFieldValue("lng", pos.lng);
					if (selectedMarker) {
						//@ts-ignore
						selectedMarker.setMap(null);
					}
					const marker = new AdvancedMarkerElement({
						position: { lat: pos.lat, lng: pos.lng },
						map: map,
					});
					setSelectedMarker(marker);
				}
			} catch (e) {
				if (e === ErrZeroResults) {
					alert("Location not found");
				}
			}
		},
		[map, selectedMarker, setFieldValue]
	);

	const onSave = React.useCallback(async () => {
		try {
			setIsOnSaveLoading(true);
			const res = await getAddress(centerPos.lat, centerPos.lng);
			if (addressRef.current && res) {
				setFieldValue(
					"address",
					res[0].formatted_address ?? addressRef.current.value
				);
				setErrors({ ...errors, address: "" });
			}
		} catch (e) {
			if (addressRef.current) {
				setFieldValue("address", "User address");
				setErrors({ ...errors, address: "" });
			}
		} finally {
			setIsOpenMap(false);
			setMap(null);
			setIsOnSaveLoading(false);
		}
	}, [
		centerPos.lat,
		centerPos.lng,
		setIsOpenMap,
		setFieldValue,
		setErrors,
		errors,
	]);

	const onClickMap = React.useCallback(
		async (e: google.maps.MapMouseEvent) => {
			try {
				//@ts-ignore
				const { AdvancedMarkerElement } = await google.maps.importLibrary(
					"marker"
				);
				const pos = e.latLng;

				// @ts-ignore
				selectedMarker.setMap(null);
				if (pos) {
					setFieldValue("lat", pos.lat);
					setFieldValue("lng", pos.lng);
					const res = await getAddress(pos.lat(), pos.lng());
					if (res) {
						onSearch(res[0].formatted_address)
					}
					if (addressRef.current && res) {
						addressRef.current.value = res[0].formatted_address;
					}
				}
			} catch (e) {}
		},
		[centerPos, map, selectedMarker, setFieldValue]
	);

	if (!isLoaded) {
		return <SkeletonText />;
	}

	return (
		<Flex
			pos={"relative"}
			flexDirection={"column"}
			alignItems={"center"}
			h={"500px"}
			w={"full"}
			mt={"10px"}
			borderRadius={"20px"}
		>
			<Box position="absolute" left={0} top={0} h="100%" w="100%" zIndex={"1"}>
				<GoogleMap
					center={{ lat: centerPos.lat, lng: centerPos.lng }}
					zoom={15}
					mapContainerStyle={{ width: "100%", height: "100%" }}
					options={{
						zoomControl: false,
						streetViewControl: false,
						mapTypeControl: false,
						fullscreenControl: false,
						mapId: "PROFILE_MAP_ID",
					}}
					onLoad={onLoadMap}
					onUnmount={onUnmountMap}
					onClick={onClickMap}
				></GoogleMap>
			</Box>
			<Box
				p={4}
				borderRadius="lg"
				m={4}
				w={"95%"}
				bgColor="white"
				shadow="base"
				zIndex="1"
				position="absolute"
			>
				<HStack spacing={2} justifyContent="space-between">
					<Box flexGrow={1} style={{ zIndex: "1050 !important" }}>
						<Autocomplete>
							<Input type="text" placeholder="Address" ref={addressRef} />
						</Autocomplete>
					</Box>

					<ButtonGroup>
						<Button
							variant={"brandPrimary"}
							type="button"
							onClick={() => onSearch(addressRef.current?.value)}
						>
							Search
						</Button>
						<Button
							variant={"brandPrimary"}
							type="button"
							onClick={() => onSave()}
							isLoading={isOnSaveLoading}
						>
							Save
						</Button>
					</ButtonGroup>
				</HStack>
			</Box>
		</Flex>
	);
};

interface LocationPickerProps {
	centerPos: Position;
	setIsOpenMap: React.Dispatch<React.SetStateAction<boolean>>;
	errors: FormikErrors<FormikValues>;
	setErrors: (errors: FormikErrors<FormikValues>) => void;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean
	) => Promise<FormikErrors<FormikValues>> | Promise<void>;
}

export default LocationPicker;
