import { Box, Heading, Stack, Flex, Link, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { BackButton } from "../components/BackButton";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Footer } from "../components/Footer";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useRegisterMutation, useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";
import { toErrorMap } from "../utils/toErrorMap";
import NextLink from "next/link";
import { Container } from "../components/Container";

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
	const router = useRouter();
	const [, register] = useRegisterMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});

	return (
		<Container height="auto" minHeight="100vh">
			<BackButton />
			<Wrapper variant="small">
				<Box textAlign="center" mb="10%">
					<Heading size="2xl">To-Do List App</Heading>
				</Box>
				<Formik
					initialValues={{ email: "", username: "", password: "" }}
					onSubmit={async (values, { setErrors }) => {
						const response = await register({ options: values });
						if (response.data?.register.errors) {
							// Registration error
							setErrors(
								toErrorMap(response.data.register.errors)
							);
						} else if (response.data?.register.user) {
							// Registrated successfully
							if (!isServer()) {
								router.push(
									`/lists/${response.data.register.user.id}`
								);
							}
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Heading mb={5}>Register</Heading>
							<Stack spacing={4}>
								<InputField
									name="email"
									placeholder="email"
									label="Email"
								/>
								<InputField
									name="username"
									placeholder="username"
									label="Username"
								/>
								<InputField
									name="password"
									placeholder="password"
									label="Password"
									type="password"
								/>
							</Stack>
							<Flex mt={2}>
								<NextLink href="/">
									<Link ml={"auto"}>
										Already have a user?
									</Link>
								</NextLink>
							</Flex>
							<Button
								mt={0}
								type="submit"
								isLoading={isSubmitting}
								colorScheme="teal"
							>
								Register
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

export default withUrqlClient(createUrqlClient)(Register);
