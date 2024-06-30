import DoctorCard from "@/components/ui/DoctorCard";
import ProductCard from "@/components/ui/ProductCard";
import { colors } from "@/constants/colors";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import useAPIInfinite from "@/hooks/useAPIInfinite";
import Layout from "@/layouts/layout";
import { GetDoctorProfile } from "@/types/responses/profile";
import { convertToRupiah } from "@/utils/convert";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  Image,
  Radio,
  RadioGroup,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Stack,
  Text,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const [sliderValue, setSliderValue] = useState([0, 500000]);
  const [specializationQuery, setSpecializationQuery] = useState("all");
  const [experienceQuery, setExperienceQuery] = useState("0");
  const [sortBy, setSortBy] = useState("name")
  const [sortAsc, setSortAsc] = useState("asc")
  const [searchTerm, setSearchTerm] = useState("")

  const doctorFetchPath = useMemo(() => {
    let params: string[] = [];
    if (specializationQuery !== "all") {
      params.push(`specialization_id=${specializationQuery}`)
    }
    if (experienceQuery !== "0") {
      params.push(`min_year_experience=${experienceQuery}`)
    }
    params.push(`min_price=${sliderValue[0]}`)
    params.push(`max_price=${sliderValue[1]}`)
    params.push(`sort_by=${sortBy}`)
    params.push(`sort=${sortAsc}`)
    params.push(`name=${searchTerm}`)
    return "/doctors?" + params.join("&");
  }, [specializationQuery, sliderValue, experienceQuery, sortAsc, sortBy, searchTerm])

  const { data: doctorPagesData, isLoading: pagesLoading, size, setSize } = useAPIInfinite<GetDoctorProfile[]>(
    (index: number, lastPage?: GetDoctorProfile[]): string | null => {
      if (index === 0) {
        return doctorFetchPath;
      }
      
      if ((lastPage?.length ?? 0) == 0) {
        return null;
      }

      lastPage = lastPage!
      const lastDoctor = lastPage[lastPage.length - 1];
      let cursor;
      switch (sortBy) {
      case "name":
        cursor = lastDoctor.name;
        break;
      case "price":
        cursor = lastDoctor.doctor.price;
        break;
      default:
        cursor = lastDoctor.name;
      }
      return `${doctorFetchPath}&cursor=${cursor}&cursor_id=${lastDoctor.doctor.id}`
    }
  )

  const showSeeMore = doctorPagesData !== undefined && 
    doctorPagesData.length > 0 &&
    (doctorPagesData[doctorPagesData.length - 1].data?.length ?? 0) > 0;

  const { data: specData, isLoading: specLoading } = useAPIFetcher<SpecializationResponse[]>(
    "/specializations", 
    {
      fallbackData: [],
    });
  const specializations = specData?.data;

  return (
    <Layout>
      <HStack
        width={"full"}
        height={{ base: "400px", lg: "300px" }}
        bg={colors.primary}
        className="px-8 lg:px-16 py-12 lg:py-16"
      >
        <Flex
          flexDirection={"column"}
          h={"full"}
          w={"full"}
          justifyContent={"space-between"}
        >
          <Flex flexDirection={"column"} gap={"10px"}>
            <Text fontSize={"36px"} color={colors.white} fontWeight={600}>
              Easy and Fast Consultation
            </Text>
            <Flex gap={"30px"} flexDirection={{ base: "column", lg: "row" }}>
              <Text color={colors.white} fontWeight={600}>
                <i className="fa-solid fa-circle-check"></i> Experienced Doctors
              </Text>
              <Text color={colors.white} fontWeight={600}>
                <i className="fa-solid fa-circle-check"></i> From the Best
                Hospital
              </Text>
              <Text color={colors.white} fontWeight={600}>
                <i className="fa-solid fa-circle-check"></i> 24/7 Standby
              </Text>
            </Flex>
          </Flex>
          <InputGroup size="md" bg={colors.white} borderRadius={"20px"}>
            <InputLeftElement bg={"transparent"} pointerEvents="none">
              <Text fontSize={"20px"}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </Text>
            </InputLeftElement>
            <Input
              borderRadius={"10px"}
              placeholder="Search for a doctor or specialist"
              onChange={(ev) => setSearchTerm(ev.target.value)}
            />
            <InputRightElement
              bg={colors.warning}
              color={colors.white}
              fontWeight={700}
              width={"150px"}
              borderRightRadius={"10px"}
              cursor={"pointer"}
            >
              Search
            </InputRightElement>
          </InputGroup>
        </Flex>
      </HStack>
      <Flex
        justifyContent={"end"}
        alignItems={{ base: "start", lg: "center" }}
        gap={"20px"}
        className="my-12 px-5 lg:px-20"
        flexDirection={{ base: "column", lg: "row" }}
      >
        <Text fontWeight={600}>Sort By</Text>
        <Select width={"200px"} size={"md"}
          onChange={(ev) => setSortBy(ev.target.value)}
        >
          <option value="name">Doctor Name</option>
          <option value="price">Price</option>
        </Select>
        <Text fontWeight={600}>Order</Text>
        <Select width={{ base: "200px", lg: "100px" }} size={"md"} 
          onChange={(ev) => setSortAsc(ev.target.value)}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </Select>
      </Flex>
      <Flex
        className="mb-24 px-5 lg:px-20"
        h={"full"}
        justifyContent={"space-between"}
      >
        <Box
          width={"25%"}
          height={"auto"}
          flexDirection={"column"}
          gap={"30px"}
          className="hidden lg:flex"
        >
          <Card width={"90%"} height={"auto"} className="shadow-2xl p-8">
            <Text fontSize={"18px"} fontWeight={"600"}>
              Filter by Speciality
            </Text>
            <Divider className="mt-4" color={`${colors.secondaryText}70`} />
            <RadioGroup name="specializationForm" defaultValue="all" className="mt-4"
              onChange={(v) => setSpecializationQuery(v) }
            >
              <Stack>
                <Radio size="sm" value="all">
                  All Specialist
                </Radio>
                {specializations?.map((spec) => (
                  <Radio size="sm" value={spec.id.toString()} key={spec.id}>
                    {spec.name}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Card>
          <Card width={"90%"} height={"auto"} className="shadow-2xl p-8">
            <Text fontSize={"18px"} fontWeight={"600"}>
              Price Range (IDR)
            </Text>
            <Divider className="mt-4" color={`${colors.secondaryText}70`} />
            <RangeSlider
              defaultValue={[0, 500000]}
              min={0}
              max={500000}
              step={10000}
              onChangeEnd={(val) => setSliderValue(val)}
              mt={12}
            >
              <RangeSliderMark
                value={sliderValue[0]}
                textAlign="center"
                bg={colors.primary}
                color="white"
                mt="-10"
                ml="-5"
                px="5"
                fontSize={"12px"}
              >
                {sliderValue[0]}
              </RangeSliderMark>
              <RangeSliderMark
                value={sliderValue[1]}
                textAlign="center"
                bg={colors.primary}
                color="white"
                mt="-10"
                ml="-5"
                fontSize={"12px"}
                px="5"
              >
                {sliderValue[1]}
              </RangeSliderMark>
              <RangeSliderTrack bg="red.100">
                <RangeSliderFilledTrack bg={colors.warning} />
              </RangeSliderTrack>
              <RangeSliderThumb
                boxSize={6}
                index={0}
                bg={colors.warning}
              ></RangeSliderThumb>
              <RangeSliderThumb
                boxSize={6}
                index={1}
                bg={colors.warning}
              ></RangeSliderThumb>
            </RangeSlider>
          </Card>
          <Card width={"90%"} height={"auto"} className="shadow-2xl p-8">
            <Text fontSize={"18px"} fontWeight={"600"}>
              Filter by Experience
            </Text>
            <Divider className="mt-4" color={`${colors.secondaryText}70`} />
            <RadioGroup name="exerienceForm" defaultValue="0" className="mt-4" 
              onChange={(v) => setExperienceQuery(v) }
            >
              <Stack>
                <Radio size="sm" value="0" defaultChecked={true}>
                  All
                </Radio>
                <Radio size="sm" value="3">
                  More than 3 years
                </Radio>
                <Radio size="sm" value="5">
                  More than 5 years
                </Radio>
                <Radio size="sm" value="10">
                  More than 10 years
                </Radio>
              </Stack>
            </RadioGroup>
          </Card>
        </Box>
        <Stack
          width={{ base: "100%", lg: "75%" }}
          className="flex justify-start items-center"
        >
          <Grid
            templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }}
            rowGap={"20px"}
            columnGap={"20px"}
          >
            {doctorPagesData?.map((page) => (
              page.data?.map((doctor) => {
                return <DoctorCard key={doctor.id} data={{
                  id:doctor.doctor.id,
                  isOnline: doctor.doctor.is_active,
                  name: doctor.name,
                  specialty: doctor.doctor.specialization.name,
                  yearOfExperience: doctor.doctor.year_experience,
                  price: convertToRupiah(doctor.doctor.price),
                  rating: 95,
                  photoUrl: doctor.photo_url,
                }} />
              })
            ))}
          </Grid>
          { showSeeMore && (
            <Button
              variant={"brandPrimary"}
              bg={colors.primary}
              color={colors.white}
              w={"150px"}
              fontSize={"14px"}
              className="mt-12"
              onClick={() => setSize(size + 1)}
            >
              See More
            </Button>
          )}
        </Stack>
      </Flex>
    </Layout>
  );
}
