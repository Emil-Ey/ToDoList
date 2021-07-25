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
} from "@chakra-ui/react";
import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	name: string;
	textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
	label,
	textarea,
	size: _,
	...props
}) => {
	const [show, setShow] = React.useState(false);
	const handleClick = () => setShow(!show);
	const { colorMode } = useColorMode();
	const bgColor = { light: "black", dark: "none" };
	const bColor = { light: "grey", dark: "default" };
	const buColor = { light: "blackAlpha", dark: undefined };
	const [field, { error }] = useField(props);
	let InputOrTextarea = Input;
	let icon: any;
	let button: any;

	if (textarea) {
		InputOrTextarea = Textarea as any;
	}
	if (field.name === "usernameOrEmail" || field.name === "username") {
		icon = <Avatar w={6} h={6} bg={bgColor[colorMode]} />;
	} else if (field.name === "password") {
		icon = <UnlockIcon w={6} h={6} bg="none" />;
		show ? (props.type = "text") : (props.type = "password");
		button = (
			<InputRightElement width="4.5rem">
				<Button
					colorScheme={buColor[colorMode]}
					h="1.75rem"
					size="sm"
					onClick={handleClick}
				>
					{show ? "Hide" : "Show"}
				</Button>
			</InputRightElement>
		);
	} else if (field.name === "email") {
		icon = <EmailIcon w={6} h={6} bg="none" />;
	}

	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<InputGroup>
				{icon ? (
					<InputLeftElement pointerEvents="none" children={icon} />
				) : null}
				<InputOrTextarea
					border="2px"
					borderColor={bColor[colorMode]}
					{...field}
					{...props}
					id={field.name}
				/>
				{button}
			</InputGroup>
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
