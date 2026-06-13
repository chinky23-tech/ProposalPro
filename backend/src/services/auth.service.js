import { hash, compare } from "bcrypt";
import { findUserByEmail, createUser, findUserById } from "../repositories/auth.repository.js";
import generateToken from "../utils/generateToken.js";

export const registerUserService = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hash(password, 10);
  const user = await createUser(name, email, hashedPassword);
  const token = generateToken(user);

  return { user, token };
};

export const loginUserService = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await compare(password, user.password_hash);
  if (!isPasswordValid) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  };
};

export const getMeService = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};