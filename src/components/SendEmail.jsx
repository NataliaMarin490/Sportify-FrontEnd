import emailjs from "emailjs-com";

export const sendEmail = (toEmail, toName) => {
  const serviceID = "service_edv50sz"; // Reemplázalo con tu Service ID
  const templateID = "template_n2rbv27"; // Reemplázalo con tu Template ID
  const userID = "IfKR54al3A5eq3RhV"; // Reemplázalo con tu User ID

  const templateParams = {
    from_name: "Sportify", // Tu nombre o el nombre que desees
    from_email: "sportify737@gmail.com", // Tu correo de "remitente"
    to_email: toEmail, // El correo del destinatario
    to_host: "5176", //cambiar dependiendo del host en que se ejecute.
    subject: "Bienvenido a Sportify",
    message: `${toName}, te has registrado con el correo ${toEmail}`,
  };

  console.log(toEmail, toName);

  return emailjs
    .send(serviceID, templateID, templateParams, userID)
    .then((response) => {
      console.log("Correo enviado con éxito:", response);
      return true;
    })
    .catch((error) => {
      console.error("Error enviando el correo:", error);
      return false;
    });
};
