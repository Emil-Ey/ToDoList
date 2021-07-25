import { HamburgerIcon } from "@chakra-ui/icons";
import {
	useColorMode,
	Switch,
	IconButton,
	Text,
	Flex,
	Box,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

export const DarkModeSwitch = () => {
	const router = useRouter();
	const { colorMode, toggleColorMode } = useColorMode();
	const isDark = colorMode === "dark";
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});
	const bColor = isDark ? undefined : "blackAlpha";
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
									onClick={() => {
										if (!isServer()) {
											router.push(
												`/customize-theme/${data.me.id}`
											);
										}
									}}
								>
									Customize Theme
								</MenuItem>
								<MenuItem
									p={4}
									onClick={async () => {
										await logout();
										router.push("/");
									}}
									loading={logoutFetching}
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
