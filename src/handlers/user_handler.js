import prisma from "../db/prisma.js";
import {
  registerUserValidator,
  loginUserValidator,
  updateUserProfileValidator,
} from "../validators/user_validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const result = registerUserValidator.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      return { field: issue.path[0], message: issue.message };
    });
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", errors });
  }

  const { name, email, password } = result.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (e) {
    console.error("Error registering user:", e);
    if (e.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const result = loginUserValidator.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      return { field: issue.path[0], message: issue.message };
    });
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", errors });
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (e) {
    console.error("Error logging in user:", e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    console.error("Error fetching user profile:", e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.user.userId;

  const result = updateUserProfileValidator.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      return { field: issue.path[0], message: issue.message };
    });
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", errors });
  }

  const { name, email } = result.data;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
      },
    });
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (e) {
    console.error("Error updating user profile:", e);
    if (e.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
