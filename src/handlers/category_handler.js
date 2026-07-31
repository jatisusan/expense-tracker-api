import prisma from "../db/prisma.js";
import { categoryValidator } from "../validators/category_validator.js";

export const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await prisma.category.findMany({
      where: { userId },
    });
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  const result = categoryValidator.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      return { field: issue.path[0], message: issue.message };
    });
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", errors });
  }

  try {
    const userId = req.user.id;
    const category = await prisma.category.create({
      data: {
        ...result.data,
        name: result.data.name.trim(),
        userId,
      },
    });
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Category already exists.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  const result = categoryValidator.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      return { field: issue.path[0], message: issue.message };
    });
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", errors });
  }

  const { name, type } = result.data;

  try {
    const category = await prisma.category.update({
      where: { id: Number(req.params.id) },
      data: { name, type },
    });
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: e.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await prisma.category.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: e.message,
    });
  }
};
