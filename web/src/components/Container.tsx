import { Flex, useColorMode } from "@chakra-ui/react";

export const Container = (props: any) => {
	const { colorMode } = useColorMode();

	const bgColor = { light: "gray.100", dark: "gray.800" };

	const color = { light: "black", dark: "white" };
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
