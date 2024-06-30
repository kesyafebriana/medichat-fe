import { colors } from "@/constants/colors";
import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const brandPrimary = defineStyle({
	background: colors.primary,
	color: "white",
	_disabled: {
		backgroundColor: `${colors.primary} !important`,
		opacity: `0.4 !important`,
		_hover: {
			backgroundColor: `${colors.primary} !important`,
			opacity: `0.4 !important`,
		},
	},
	_hover: {
		background: "#0B42AB",
	},
	_loading: {
		_hover: {
			background: colors.primary,
		},
	},
});

const brandSecondary = defineStyle({
	background: colors.secondary,
	color: colors.primary,
	_hover: {
		background: colors.hoverSecondary,
	},
	_loading: {
		_hover: {
			background: colors.secondary,
		},
	},
});

export const buttonTheme = defineStyleConfig({
	variants: { brandPrimary, brandSecondary },
});
