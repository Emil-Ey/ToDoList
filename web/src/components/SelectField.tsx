import { UnlockIcon, EmailIcon } from "@chakra-ui/icons";
import {
	useColorMode,
	Input,
	Textarea,
	Avatar,
	InputRightElement,
	Button,
	FormControl,
	FormLabel,
	InputGroup,
	InputLeftElement,
	FormErrorMessage,
	Select,
} from "@chakra-ui/react";
import React, { InputHTMLAttributes } from "react";
import { Field, useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	name: string;
};

export const InputField: React.FC<InputFieldProps> = ({
	label,
	size: _,
	children,
	...props
}) => {
	const [field, { error }] = useField(props);
	return (
		<FormControl>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<Select id={field.name}>{children}</Select>
		</FormControl>
	);
};
