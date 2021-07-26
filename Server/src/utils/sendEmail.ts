import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, text: string) {
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: "s363eupn36kiuhdh@ethereal.email", // generated ethereal user
			pass: "GKGpREHwfwrxhWVu5q", // generated ethereal password
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Emil Kjærgaard Eybye" <Emil.Eybye.24@gmail.com>', // sender address
		to, // list of receivers
		subject: "Change Password", // Subject line
		html: text,
	});

	console.log("Message sent: %s", info.messageId);

	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
