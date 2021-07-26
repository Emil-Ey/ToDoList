import { Flex, useColorMode } from "@chakra-ui/react";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

export const Container = (props: any) => {
	const { colorMode } = useColorMode();
	const color = { light: "black", dark: "white" };
	const bgColor = { light: "gray.200", dark: "gray.800" };
	return (
		<Flex
			direction="column"
			alignItems="center"
			justifyContent="flex-start"
			bg={bgColor[colorMode]}
			color={color[colorMode]}
			{...props}
		/>
	);
};
