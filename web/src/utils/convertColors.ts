export const convertColors = (
	bgColorL: string,
	buColorL: string,
	bgColorD: string,
	buColorD: string
) => {
	let bgColorL1 = "123";
	let buColorL1 = "123";
	let bgColorD1 = "123";
	let buColorD1 = "123";

	if (bgColorL === "white") {
		bgColorL1 = "White";
	} else if (bgColorL === "gray.200") {
		bgColorL1 = "Off White";
	} else if (bgColorL === "gray") {
		bgColorL1 = "Light Blue";
	}

	if (buColorL === "green") {
		buColorL1 = "Green";
	} else if (buColorL === "teal") {
		buColorL1 = "Teal";
	} else if (buColorL === "blue") {
		buColorL1 = "Blue";
	}

	if (bgColorD === "#121212") {
		bgColorD1 = "Black";
	} else if (bgColorD === "gray.800") {
		bgColorD1 = "Dark Blue";
	} else if (bgColorD === "gray.600") {
		bgColorD1 = "Blue";
	}

	if (buColorD === "green") {
		buColorD1 = "Green";
	} else if (buColorD === "teal") {
		buColorD1 = "Teal";
	} else if (buColorD === "blue") {
		buColorD1 = "Blue";
	}

	return { bgColorL1, buColorL1, bgColorD1, buColorD1 };
};
