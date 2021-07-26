import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
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
						await forgotPassword(values);
						setComplete(true);
					}}
				>
					{({ isSubmitting }) =>
						complete ? (
							<>
								<Box>
									<Text textAlign="center" fontSize="20">
										If an account exists with that email,
										<br />
										then you should have received an email.
										<br />
										<br />
										If not then please try again.
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
										<NextLink href="/login">
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
									Send Link
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
