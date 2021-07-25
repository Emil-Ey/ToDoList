import { Box, Link, Text } from "@chakra-ui/react";
import React from "react";

export const Footer = ({}) => {
	return (
		<Box
			position="absolute"
			as="footer"
			role="copyright"
			mx="auto"
			bottom={10}
			textAlign="center"
			w="100%"
		>
			<Text fontSize="md">
				&copy; {new Date().getFullYear()} Emil Kjærgaard Eybye. All
				rights reserved.
			</Text>
			<Text fontSize="sm">
				Like this project? Check out some of my other projects at my{" "}
				<Link
					color="teal.500"
					href="https://github.com/Emil-Ey"
					target="_blank"
					id="git"
				>
					Github
				</Link>
				.
			</Text>
		</Box>
	);
};
