export const validateClientInput = (data) => {
  const { name, email, phone, company } = data;

  if (!name || name.trim() === "") {
    throw new Error("Client name is required");
  }

  if (!email || !email.includes("@")) {
    throw new Error("A valid client email address is required");
  }

  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : null,
    company: company ? company.trim() : null
  };
};