import { Box, Heading, Flex, Link, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { BackButton } from "../../components/BackButton";
import { Container } from "../../components/Container";
import { DarkModeSwitch } from "../../components/DarkModeSwitch";
import { Footer } from "../../components/Footer";
import { InputField } from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { createUrqlClient } from "../../utils/createUrqlClient";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { toErrorMap } from "../../utils/toErrorMap";
import { useChangePasswordMutation } from "../../generated/graphql";

const token = () => {
	const router = useRouter();
	const [, changePassword] = useChangePasswordMutation();
	const [tokenError, setTokenError] = useState("");
	return (
		<Container height="auto" minHeight="100vh">
			<BackButton />
			<Wrapper variant="small">
				<Box textAlign="center" mb="10%">
					<Heading size="2xl">To-Do List App</Heading>
				</Box>
				<Formik
					initialValues={{ newPassword: "", newPassword1: "" }}
					onSubmit={async (values, { setErrors }) => {
						const response = await changePassword({
							token:
								typeof router.query.token === "string"
									? router.query.token
									: "",
							newPassword: values.newPassword,
							newPassword1: values.newPassword1,
						});
						if (response.data?.changePassword.errors) {
							const errorMap = toErrorMap(
								response.data.changePassword.errors
							);
							if ("token" in errorMap) {
								setTokenError(errorMap.token);
							}
							setErrors(errorMap);
						} else if (response.data?.changePassword.user) {
							// worked
							router.push("/");
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Heading mb={5}>Change Password</Heading>
							<InputField
								name="newPassword"
								placeholder="new password"
								label="New Password"
								type="password"
							/>
							<Box mt={4}>
								<InputField
									name="newPassword1"
									placeholder="new password"
									label="Repeat new Password"
									type="password"
								/>
							</Box>
							{tokenError ? (
								<Flex>
									<Box mr={2} style={{ color: "red" }}>
										{tokenError}
									</Box>
									<NextLink href="/forgot-password">
										<Link>Click here to get a new one</Link>
									</NextLink>
								</Flex>
							) : null}
							<Button
								mt={4}
								type="submit"
								isLoading={isSubmitting}
								colorScheme="teal"
							>
								Change Password
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

export default withUrqlClient(createUrqlClient)(token);
