import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Heading,
	HStack,
	IconButton,
	Link,
	Spacer,
	Stack,
	StackDivider,
	Text,
	useColorMode,
	VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
//import { useRouter } from "next/router";
import React, { useState } from "react";
import { Container } from "../../components/Container";
import { DarkModeSwitch } from "../../components/DarkModeSwitch";
import { Footer } from "../../components/Footer";
import { InputField } from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import {
	useCreateListMutation,
	useDeleteListMutation,
	useListsQuery,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetIntId } from "../../utils/useGetIntId";
import NextLink from "next/link";

const Lists = ({}) => {
	const [error, setError] = useState(false);
	const [, deleteList] = useDeleteListMutation();
	const [, createList] = useCreateListMutation();
	const { colorMode } = useColorMode();
	const borderColor = { light: "black", dark: "gray.100" };
	//const router = useRouter();
	const userId = useGetIntId();
	const variables = {
		userId: userId,
	};
	const [{ data, error: ListsError, fetching }] = useListsQuery({
		variables,
	});
	if (ListsError) {
		return (
			<Container height="auto" minHeight="100vh">
				<Wrapper variant="regular">
					<Box textAlign="center">
						<Box textAlign="center" mb="10%">
							<Heading size="2xl">To-Do List App</Heading>
						</Box>
						<Text fontSize="30">
							You are trying to get the lists of another user.
						</Text>
						<br />
						<Text fontSize="20">
							If this is you, then please login as this user.
							<br />
							Rembember to log out before logging in if you are
							logged in.
						</Text>
						<Button
							//onClick={() => router.push("/")}
							mt={5}
							colorScheme="teal"
						>
							Login
						</Button>
					</Box>
					<DarkModeSwitch />
				</Wrapper>
				<Footer />
			</Container>
		);
	}

	if (!data && !fetching) {
		return (
			<Container height="auto" minHeight="100vh">
				<Wrapper variant="small">
					<Box textAlign="center">
						<Box textAlign="center" mb="10%">
							<Heading size="2xl">To-Do List App</Heading>
						</Box>
						<Text fontSize="30">Something went wrong.</Text>
						<br />
						<Text fontSize="20">Please try again later.</Text>
						<Button
							//onClick={() => router.push("/")}
							mt={5}
							colorScheme="teal"
						>
							Login
						</Button>
					</Box>
					<DarkModeSwitch />
				</Wrapper>
				<Footer />
			</Container>
		);
	}

	if (fetching) {
		return (
			<Container height="auto" minHeight="100vh">
				<Wrapper variant="regular">
					<Box textAlign="center">
						<Box textAlign="center" mb="10%">
							<Heading size="2xl">To-Do List App</Heading>
						</Box>
						<Text fontSize="20">Loading...</Text>
					</Box>
					<DarkModeSwitch />
				</Wrapper>
				<Footer />
			</Container>
		);
	}

	if (!data?.lists) {
		return (
			<Container height="auto" minHeight="100vh">
				<Wrapper variant="regular">
					<Box textAlign="center">
						<Box textAlign="center" mb="10%">
							<Heading size="2xl">To-Do List App</Heading>
						</Box>
						<Text fontSize="20">Could not find the lists</Text>
					</Box>
					<DarkModeSwitch />
				</Wrapper>
				<Footer />
			</Container>
		);
	}

	return (
		<Container height="auto" minHeight="100vh">
			<Wrapper variant="medium">
				<Box textAlign="center" mb="10%">
					<Heading size="2xl">To-Do List App</Heading>
				</Box>
				<Heading textAlign="center" mb={5}>
					Lists
				</Heading>
				{data.lists.length > 0 ? (
					<VStack
						divider={<StackDivider />}
						borderColor={borderColor[colorMode]}
						borderWidth="2px"
						p="4"
						borderRadius="lg"
						w="100%"
						alignItems="stretch"
					>
						{data.lists.map((list) => (
							<HStack mt={2} mb={2} key={list.id}>
								<Box w="80%">
									<NextLink
										href="/lists/list/[id]"
										as={`/lists/list/${list.id}`}
									>
										<Link>
											<Heading fontSize="xl">
												{list.title}
											</Heading>
										</Link>
									</NextLink>
									<Text mt={2}>{list.desc}</Text>
								</Box>
								<Spacer />
								<NextLink
									href="/lists/edit/[id]?next=/lists/[id]"
									as={`/lists/edit/${list.id}?next=/lists/${list.creator.id}`}
								>
									<IconButton
										tooltip="Edit list"
										color="whiteAlpha"
										aria-label="edit list"
										variant="solid"
										icon={<EditIcon w={4} h={4} />}
									/>
								</NextLink>
								<IconButton
									tooltip="Delete list"
									color="whiteAlpha"
									aria-label="delete list"
									variant="solid"
									icon={<DeleteIcon w={4} h={4} />}
									onClick={async () => {
										deleteList({
											id: list.id,
										});
									}}
								/>
							</HStack>
						))}
					</VStack>
				) : (
					<Box textAlign="center" mb="10%">
						<Text>You haven't created any lists yet.</Text>
					</Box>
				)}
				<Formik
					initialValues={{ title: "", desc: "" }}
					onSubmit={async (values) => {
						const { error } = await createList(values);

						if (error?.message.includes("logged in")) {
							// Not logged in
							setError(true);
						} else {
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Box textAlign="center" mt="10%" mb="0%">
								<Heading size="md">Create new list</Heading>
							</Box>
							<Stack spacing={4}>
								<InputField
									name="title"
									placeholder="title"
									label="Title"
								/>
								<InputField
									name="desc"
									placeholder="description"
									label="Description"
									textarea={true}
								/>
							</Stack>
							<Button
								mb="25%"
								mt={5}
								type="submit"
								isLoading={isSubmitting}
								colorScheme="teal"
							>
								Create List
							</Button>
						</Form>
					)}
				</Formik>
				<DarkModeSwitch />
			</Wrapper>
			<Footer />
		</Container>
	);
};

export default withUrqlClient(createUrqlClient)(Lists);
