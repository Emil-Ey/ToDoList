import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
//import { useRouter } from "next/router";
import React from "react";
import { BackButton } from "../../../components/BackButton";
import { Container } from "../../../components/Container";
import { DarkModeSwitch } from "../../../components/DarkModeSwitch";
import { Footer } from "../../../components/Footer";
import { InputField } from "../../../components/InputField";
import Wrapper from "../../../components/Wrapper";
import {
	useListQuery,
	useUpdateListMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetIntId } from "../../../utils/useGetIntId";

const editLists = () => {
	//const router = useRouter();
	const intId = useGetIntId();
	const [{ data, fetching }] = useListQuery({
		pause: intId === -1,
		variables: {
			id: intId,
		},
	});
	const [, updateList] = useUpdateListMutation();

	if (fetching) {
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

	if (!data?.list) {
		return (
			<Container height="auto" minHeight="100vh">
				<BackButton />
				<Wrapper variant="regular">
					<Box textAlign="center">
						<Box textAlign="center" mb="10%">
							<Heading size="2xl">To-Do List App</Heading>
						</Box>
						<Text fontSize="20">Could not find the list</Text>
						<Button
							//onClick={() => router.back()}
							mt={5}
							colorScheme="teal"
						>
							Go Back
						</Button>
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
				<Formik
					initialValues={{
						title: data.list.title,
						desc: data.list.desc,
					}}
					onSubmit={async (values, { setErrors }) => {
						await updateList({ id: intId, ...values });

						//router.back();
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Heading mb={5}>Edit List</Heading>
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
								mt={5}
								type="submit"
								isLoading={isSubmitting}
								colorScheme="teal"
							>
								Edit List
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

export default withUrqlClient(createUrqlClient)(editLists);
