import { Button, ButtonProps, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import google from "../../../public/assets/svg/google.svg";
import { colors } from "@/constants/colors";

const GoogleAuthButton = ({ variant, ...props }: GoogleAuthButtonProps) => {
	return (
		<Button
			variant={"brandSecondary"}
			className={`w-full rounded-md py-6 px-4 bg-red-400`}
			columnGap={4}
			{...props}
		>
			<Image src={google} alt="google" />
			<Text color={colors.primary}>{variant} with Google</Text>
		</Button>
	);
};

interface GoogleAuthButtonProps extends ButtonProps {
	variant: "Sign in" | "Sign up";
}

export default GoogleAuthButton;
