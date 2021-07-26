import { HamburgerIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	HStack,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Switch,
	Text,
	useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

export const DarkModeSwitch = () => {
	const router = useRouter();
	const { colorMode, toggleColorMode } = useColorMode();
	const isDark = colorMode === "dark";
	const [, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});

	if (fetching) {
		return (
			<Flex position="fixed" top="1rem" right="1rem">
				<Box mr={4}>
					{isDark ? (
						<Text color="white">Dark Mode</Text>
					) : (
						<Text color="teal">Light Mode</Text>
					)}
				</Box>
				<Switch
					colorScheme="teal"
					isChecked={isDark}
					onChange={toggleColorMode}
				/>
				Loading...
			</Flex>
		);
	}

	return (
		<>
			<Flex position="fixed" top="1rem" right="1rem">
				<Box mr={4}>
					{isDark ? (
						<Text color="white">Dark Mode</Text>
					) : (
						<Text color="teal">Light Mode</Text>
					)}
				</Box>
				<Switch
					colorScheme="teal"
					isChecked={isDark}
					onChange={toggleColorMode}
				/>
			</Flex>
			<Box position="fixed" top="4rem" right="1rem">
				{data?.me ? (
					<HStack>
						<Text mr={2}>
							Logged in as: <strong>{data.me.username}</strong>
						</Text>
						<Menu>
							<MenuButton
								colorScheme="teal"
								as={IconButton}
								aria-label="Options"
								icon={<HamburgerIcon />}
								variant="solid"
							/>
							<MenuList>
								<MenuItem
									p={4}
									onClick={() => {
										if (!isServer()) {
											router.push(`/lists/${data.me.id}`);
										}
									}}
								>
									My Lists
								</MenuItem>
								<MenuItem
									p={4}
									onClick={async () => {
										await logout();
										router.push("/");
									}}
								>
									Log out
								</MenuItem>
							</MenuList>
						</Menu>
					</HStack>
				) : null}
			</Box>
		</>
	);
};
