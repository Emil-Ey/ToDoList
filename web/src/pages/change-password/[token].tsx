import { withUrqlClient } from "next-urql";
import React from "react";
import { createUrqlClient } from "../../utils/createUrqlClient";

const token = () => {
	return <div>Hello</div>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(token);
