import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	IconButton,
	Spacer,
	Stack,
	StackDivider,
	Text,
	useColorMode,
	VStack,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { BackButton } from "../../../components/BackButton";
import { Container } from "../../../components/Container";
import { DarkModeSwitch } from "../../../components/DarkModeSwitch";
import { Footer } from "../../../components/Footer";
import { InputField } from "../../../components/InputField";
import Wrapper from "../../../components/Wrapper";
import {
	useCreateTaskMutation,
	useDeleteTaskMutation,
	useListQuery,
	useTasksQuery,
	useVoteMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { toErrorMap1 } from "../../../utils/toErrorMap1";
import { useGetIntId } from "../../../utils/useGetIntId";

const Lists = ({}) => {
	const [, vote] = useVoteMutation();
	const [, deleteTask] = useDeleteTaskMutation();
	const [, createTask] = useCreateTaskMutation();
	const { colorMode } = useColorMode();
	const borderColor = { light: "black", dark: "gray.100" };
	const buttonColor = { light: "blackAlpha", dark: "whiteAlpha" };
	const router = useRouter();
	const listId = useGetIntId();
	const variables = {
		listId: listId,
	};
	const [{ data, error: TasksError, fetching }] = useTasksQuery({
		variables,
	});
	const [{ data: listData, fetching: listFetching }] = useListQuery({
		pause: listId === -1,
		variables: {
			id: listId,
		},
	});
	if (TasksError) {
		return (
			<Container height="auto" minHeight="100vh">
				<BackButton />
				<Wrapper variant="regular">
					<Box textAlign="center">
						<Box textAlign="center" mb="10%">
							<Heading size="2xl">To-Do List App</Heading>
						</Box>
						<Text fontSize="30">Something went wrong.</Text>
						<br />
						<Text fontSize="20">
							Please check if you are logged in as the correct
							user.
						</Text>
						<Button
							onClick={() => router.push("/")}
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
				<BackButton />
				<Wrapper variant="small">
					<Box textAlign="center">
						<Box textAlign="center" mb="10%">
							<Heading size="2xl">To-Do List App</Heading>
						</Box>
						<Text fontSize="30">Something went wrong.</Text>
						<br />
						<Text fontSize="20">Please try again later.</Text>
						<Button
							onClick={() => router.push("/")}
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

	if (fetching || listFetching) {
		return (
			<Container height="auto" minHeight="100vh">
				<BackButton />
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

	if (!data?.tasks || !listData.list) {
		return (
			<Container height="auto" minHeight="100vh">
				<BackButton />
				<Wrapper variant="regular">
					<Box textAlign="center">
						<Box textAlign="center" mb="10%">
							<Heading size="2xl">To-Do List App</Heading>
						</Box>
						<Text fontSize="20">
							Could not find the tasks. Please try again later.
						</Text>
					</Box>
					<DarkModeSwitch />
				</Wrapper>
				<Footer />
			</Container>
		);
	}

	return (
		<Container height="auto" minHeight="100vh">
			<BackButton />
			<Wrapper variant="medium">
				<Box textAlign="center" mb="10%">
					<Heading size="2xl">To-Do List App</Heading>
				</Box>
				<Box mb={2}>
					<Heading textAlign="center" mb={5}>
						{listData.list.title}
					</Heading>
					<Text textAlign="center">{listData.list.desc}</Text>
				</Box>
				{data.tasks.length > 0 ? (
					<VStack
						divider={<StackDivider />}
						borderColor={borderColor[colorMode]}
						borderWidth="2px"
						p="4"
						borderRadius="lg"
						w="100%"
						alignItems="stretch"
					>
						{data.tasks.map((task) => (
							<HStack mt={2} mb={2} key={task.id}>
								<IconButton
									tooltip="Vote on task"
									color="whiteAlpha"
									aria-label="Vote on task"
									colorScheme={
										task.done
											? "green"
											: buttonColor[colorMode]
									}
									size="sm"
									variant="solid"
									isRound={true}
									icon={<CheckIcon w={4} h={4} />}
									onClick={async () => {
										vote({
											id: task.id,
											listId: task.listId,
										});
									}}
								/>
								<Box w="80%">
									<Text fontSize={20} ml={2}>
										{task.text}
									</Text>
								</Box>
								<Spacer />
								<IconButton
									tooltip="Delete task"
									color="whiteAlpha"
									aria-label="delete task"
									variant="solid"
									icon={<DeleteIcon w={4} h={4} />}
									onClick={() => {
										deleteTask({
											listId: task.listId,
											id: task.id,
										});
									}}
								/>
							</HStack>
						))}
					</VStack>
				) : (
					<Box textAlign="center" mb="10%">
						<Text>You haven't created any tasks yet.</Text>
					</Box>
				)}
				<Formik
					initialValues={{ listId: listData.list.id, text: "" }}
					onSubmit={async (values, { setErrors }) => {
						const response = await createTask(values);
						if (response.data?.createTask.errors) {
							// Create error
							setErrors(
								toErrorMap1(response.data.createTask.errors)
							);
							return;
						} else if (response.data?.createTask.task) {
							// created successfully
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Box textAlign="center" mt="5%" mb="0%">
								<Heading size="md">Create new task</Heading>
							</Box>
							<HStack mb="25%">
								<InputField
									width="95%"
									name="text"
									placeholder="text"
									label="Text"
								/>
								<Button
									position="relative"
									right="0"
									top="4"
									type="submit"
									isLoading={isSubmitting}
									colorScheme="teal"
								>
									Create Task
								</Button>
							</HStack>
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
