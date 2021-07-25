import { Box } from "@chakra-ui/react";
import React from "react";

export type WrapperVariant = "small" | "regular" | "medium";

interface WrapperProps {
	variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
	children,
	variant = "regular",
}) => {
	if (variant === "medium") {
		return (
			<Box mt="5%" mx="auto" maxW={"600px"} w="100%">
				{children}
			</Box>
		);
	}
	return (
		<Box
			mt="5%"
			mx="auto"
			maxW={variant === "regular" ? "800px" : "400px"}
			w="100%"
		>
			{children}
		</Box>
	);
};

export default Wrapper;
