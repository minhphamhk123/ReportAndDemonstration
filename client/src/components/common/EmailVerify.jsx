import emailjs from "@emailjs/browser";

async function EmailVerify(props) {
  const serviceId = "service_ofqsb8o";
  const templateId = "template_5r9elb9";
  const publicKey = "mFP79zLU1PPDR1CNa";
  const code = Math.floor(1000 + Math.random() * 9000);
  const templateParams = {
    from_name: "UIT's Team",
    to_name: props.email.split("@")[0],
    to_email: props.email,
    code: code,
  };

  try {
    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );
    console.log(result.text);

    // Trả về giá trị code khi mọi thứ diễn ra thành công
    return code;
  } catch (error) {
    console.log(error.text);
    // Xử lý lỗi nếu cần
    throw new Error("Failed to send email");
  }
}

export default EmailVerify;
