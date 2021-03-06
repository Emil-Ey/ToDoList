import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import router from "next/router";
import React, { useState } from "react";
import { BackButton } from "../components/BackButton";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Footer } from "../components/Footer";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const forgotPassword = () => {
	const [complete, setComplete] = useState(false);
	const [, forgotPassword] = useForgotPasswordMutation();
	return (
		<Container height="auto" minHeight="100vh">
			<BackButton />
			<Wrapper variant="small">
				<Box textAlign="center" mb="10%">
					<Heading size="2xl">To-Do List App</Heading>
				</Box>
				<Formik
					initialValues={{ email: "" }}
					onSubmit={async (values) => {
						const response = await forgotPassword(values);
						if (response.data.forgotPassword.token) {
							const token = response.data.forgotPassword.token;
							router.push(`/change-password/${token}`);
						} else {
							setComplete(true);
						}
					}}
				>
					{({ isSubmitting }) =>
						complete ? (
							<>
								<Box>
									<Text textAlign="center" fontSize="20">
										An account with that email does not
										exist.
										<br />
										<br />
										Please check if you have entered the
										correct email.
									</Text>
								</Box>
							</>
						) : (
							<Form>
								<Heading mb={5}>Get a new Password</Heading>
								<InputField
									name="email"
									placeholder="email"
									label="Email"
								/>
								<Flex mt={2}>
									<Text ml={"auto"}>
										<NextLink href="/">
											<Link>Remembered it?</Link>
										</NextLink>
									</Text>
								</Flex>
								<Button
									mt={4}
									type="submit"
									isLoading={isSubmitting}
									colorScheme="teal"
								>
									Change Password
								</Button>
							</Form>
						)
					}
				</Formik>
				<DarkModeSwitch />
			</Wrapper>
			<Footer />
		</Container>
	);
};

export default withUrqlClient(createUrqlClient)(forgotPassword);
