import { serverEncounterError } from "@/constants/error";
import { pages } from "@/constants/pages";
import { InternalServerError } from "@/exceptions/internalServerError";
import { Unauthorized } from "@/exceptions/unauthorized";
import { useAppDispatch } from "@/redux/reduxHook";
import { batchActions } from "@/redux/store";
import { getDoctorProfile, updateActiveStatus } from "@/services/doctor";
import { FormState, defaultFormState } from "@/types/form";
import { UpdateDoctorActiveStatus } from "@/types/requests/profile";
import { Switch, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

const SetOnlineStatusForm = ({ access_token }: SetOnlineStatusFormProps) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const router = useRouter();
  const [formState, setFormState] = React.useState<FormState>(defaultFormState);
  const [isOnline, setIsOnline] = React.useState<boolean>();

  React.useEffect(() => {
    const getDoctorProfileData = async () => {
      try {
        if (access_token) {
          const res = await getDoctorProfile(access_token);
          dispatch(batchActions(setIsOnline(res?.data?.doctor.is_active)));
        }
      } catch (e) {
        if (e instanceof Unauthorized) {
          router.push(pages.LOGIN);
        }
      }
    };

    getDoctorProfileData();
    setIsLoading(false);
  }, [dispatch, access_token, router]);

  const onUpdateActiveStatus = async (req: boolean) => {
    try {
      setFormState((prev) => ({ ...prev, isLoading: true }));
      await updateActiveStatus(
        {
          is_active: req,
        },
        access_token
      );
      dispatch(batchActions(setIsOnline(req)));
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
  };

  return (
    <>
      <Text>Online Status</Text>
      <Switch
        size="lg"
        isChecked={isOnline}
        onChange={() => onUpdateActiveStatus(!isOnline)}
      />
    </>
  );
};

interface SetOnlineStatusFormProps {
  access_token: string;
}

export default SetOnlineStatusForm;
