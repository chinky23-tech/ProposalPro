import { hash, compare } from "bcrypt";
import pool from "../config/db.js";
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }


    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await hash(password, 10);

   
    const newUser = await pool.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
      `,
      [name, email, hashedPassword]
    );

    const user = newUser.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = userResult.rows[0];

    const isPasswordValid = await compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getMe = async (req, res) => {
  try {

    const userResult = await pool.query(
      `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    res.status(200).json(userResult.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export {
  register,
  login,
  getMe,
};