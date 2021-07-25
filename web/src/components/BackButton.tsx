import { useColorMode, Flex, Button } from "@chakra-ui/react";
import React from "react";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

export const BackButton = ({}) => {
	const router = useRouter();
	const { colorMode } = useColorMode();
	const colorSchemeButton = { light: "blackAlpha", dark: undefined };
	return (
		<>
			<Flex position="fixed" top="4rem" left="1rem">
				<Button
					colorScheme={colorSchemeButton[colorMode]}
					onClick={() => {
						if (!isServer()) {
							router.back();
						}
					}}
				>
					Back
				</Button>
			</Flex>
		</>
	);
};
