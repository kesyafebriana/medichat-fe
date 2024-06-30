import { Text, TextProps } from "@chakra-ui/react";
import React from "react";

const FormError = ({ children, ...props }: FormErrorProps) => {
	return (
		<Text className="text-red-500 text-sm" {...props}>
			{children}
		</Text>
	);
};

interface FormErrorProps extends React.PropsWithChildren, TextProps {}

export default FormError;
