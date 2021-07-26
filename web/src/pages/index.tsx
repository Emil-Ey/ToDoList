import { Box, Button, Flex, Heading, Link, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Footer } from "../components/Footer";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useLoginMutation, useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

const Index = () => {
	const router = useRouter();
	const [, login] = useLoginMutation();

	return (
		<Container height="auto" minHeight="100vh">
			<Wrapper variant="small">
				<Box textAlign="center" mb="10%">
					<Heading size="2xl">To-Do List App</Heading>
				</Box>
				<Formik
					initialValues={{ usernameOrEmail: "", password: "" }}
					onSubmit={async (values, { setErrors }) => {
						const response = await login(values);
						if (response.data?.login.errors) {
							// Login error
							setErrors(toErrorMap(response.data.login.errors));
							return;
						} else if (response.data?.login.user) {
							// Login successfully
							router.push(
								`/lists/${response.data.login.user.id}`
							);
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Heading mb={5}>Login</Heading>
							<Stack spacing={4}>
								<InputField
									name="usernameOrEmail"
									placeholder="username or email"
									label="Username Or Email"
								/>
								<InputField
									name="password"
									placeholder="password"
									label="Password"
									type="password"
								/>
							</Stack>
							<Flex mt={2}>
								<NextLink href="/forgot-password">
									<Link ml={"auto"}>Forgot Password?</Link>
								</NextLink>
								<NextLink href="/register">
									<Link ml={2}>Or create a user</Link>
								</NextLink>
							</Flex>
							<Button
								mt={0}
								type="submit"
								isLoading={isSubmitting}
								colorScheme="teal"
							>
								Login
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
