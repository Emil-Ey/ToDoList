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

	if (bgColorL === "White") {
		bgColorL1 = "white";
	} else if (bgColorL === "Off White") {
		bgColorL1 = "gray.200";
	} else if (bgColorL === "Light Blue") {
		bgColorL1 = "gray";
	}

	if (buColorL === "Green") {
		buColorL1 = "green";
	} else if (buColorL === "Teal") {
		buColorL1 = "teal";
	} else if (buColorL === "Blue") {
		buColorL1 = "blue";
	}

	if (bgColorD === "Black") {
		bgColorD1 = "#121212";
	} else if (bgColorD === "Dark Blue") {
		bgColorD1 = "gray.800";
	} else if (bgColorD === "Blue") {
		bgColorD1 = "gray.600";
	}

	if (buColorD === "Green") {
		buColorD1 = "green";
	} else if (buColorD === "Teal") {
		buColorD1 = "teal";
	} else if (buColorD === "Blue") {
		buColorD1 = "blue";
	}

	return { bgColorL1, buColorL1, bgColorD1, buColorD1 };
};
