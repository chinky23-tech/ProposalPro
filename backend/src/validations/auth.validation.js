export const validateRegisterInput = (data) => {
  const { name, email, password } = data;
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }
  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }
  return { 
    name: name.trim(), 
    email: email.trim().toLowerCase(), 
    password 
  };
};

export const validateLoginInput = (data) => {
  const { email, password } = data;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  return { 
    email: email.trim().toLowerCase(), 
    password 
  };
};