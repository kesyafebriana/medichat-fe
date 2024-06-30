import { colors } from "@/constants/colors";
import { serverEncounterError } from "@/constants/error";
import { InternalServerError } from "@/exceptions/internalServerError";
import useAPIFetcher from "@/hooks/useAPIFetcher";
import useSession from "@/hooks/useSession";
import { uploadPayment } from "@/services/payment";
import { FormState, defaultFormState } from "@/types/form";
import {
  PaymentResponse,
  defaultPaymentResponse,
} from "@/types/responses/payment";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

interface PaymentFormProps {
  closeModal: () => void;
  invoiceNumber: string;
}

export default function PaymentForm({
  closeModal,
  invoiceNumber,
}: PaymentFormProps) {
  const { session } = useSession();
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const { data, mutate, isLoading } = useAPIFetcher<PaymentResponse>(
    `/payments/${invoiceNumber}`,
    {
      fallbackData: defaultPaymentResponse,
      accessToken: session?.access_token,
      requireToken: true,
    }
  );
  const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);

  const payment = data?.data ?? defaultPaymentResponse;

  const inputFileRef = useRef<HTMLInputElement>(null);

  const onSelectImageFile = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const toast = useToast();

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    try {
      if (!currentFile) return;
      setFormState((prev) => ({ ...prev, isLoading: true }));
      await uploadPayment(
        {
          invoiceNumber,
          file: currentFile,
        },
        session?.access_token ?? ""
      );
      closeModal();
      toast({
        title: "File Uploaded",
        description: "successfully uploaded file.",
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
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  }

  return (
    <form className="flex flex-col gap-y-8 py-6" onSubmit={onSubmit}>
      <Flex
        h={"full"}
        w={"full"}
        flexDirection={"column"}
        justifyContent={"space-around"}
        gap={"15px"}
      >
        <Flex justifyContent={"space-between"} w={"full"}>
          <Text fontSize={"14px"}>Invoice Number</Text>
          <Text>{payment.invoice_number}</Text>
        </Flex>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Text fontSize={"14px"}>Amount</Text>
          <Text>Rp {payment.amount.toLocaleString()}</Text>
        </Flex>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Text fontSize={"14px"}>Status</Text>
          <Text>{payment.is_confirmed ? "Confirmed" : "Not Confirmed"}</Text>
        </Flex>
        {!isLoading &&
          (payment.file_url ? (
            <Link target="_blank" href={payment.file_url}>
              <Text
                fontWeight={600}
                color={colors.primary}
                className="hover:underline hover:underline-offset-2"
              >
                Open File
              </Text>
            </Link>
          ) : (
            <Flex justifyContent={"center"} flexDirection={"column"}>
              {currentFile ? (
                <Flex flexDirection={"column"} gap={"20px"}>
                  <Flex gap={"20px"} alignItems={"center"}>
                    <Text>{currentFile.name}</Text>
                    <Button
                      color={colors.danger}
                      fontSize={"20px"}
                      onClick={() => {
                        setCurrentFile(undefined);
                      }}
                      type="button"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </Button>
                  </Flex>
                  <Button
                    width={"full"}
                    variant={"brandPrimary"}
                    isLoading={formState.isLoading}
                    type="submit"
                  >
                    Upload
                  </Button>
                </Flex>
              ) : (
                <Button
                  width={"full"}
                  variant={"brandPrimary"}
                  onClick={onSelectImageFile}
                  type="button"
                >
                  Select File
                </Button>
              )}
              <Input
                type="file"
                className="hidden"
                accept="image/png"
                id="file`"
                name="file"
                ref={inputFileRef}
                onChange={(ev) => {
                  const f = ev.target.files?.[0];
                  setCurrentFile(f);
                }}
              />
            </Flex>
          ))}
      </Flex>
    </form>
  );
}
