import prisma from "../db/prisma.js";
import {
  categoryValidator,
  categoryQueryValidator,
} from "../validators/category_validator.js";

export const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = categoryQueryValidator.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => {
        return { field: issue.path[0], message: issue.message };
      });
      return res
        .status(400)
        .json({ success: false, message: "Validation failed", errors });
    }
    const categories = await prisma.category.findMany({
      where: { userId, ...(result.data.type && { type: result.data.type }) },
    });
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (e) {
    console.error("Error fetching categories:", e);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
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
  } catch (e) {
    console.error("Error creating category:", e);
    if (e.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal Server error",
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

  const userId = req.user.id;
  const categoryId = Number(req.params.id);

  try {
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name, type },
    });
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (e) {
    console.error("Error updating category:", e);
    if (e.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  const userId = req.user.id;
  const categoryId = Number(req.params.id);
  try {
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting category:", e);
    if (e.code === "P2003") {
      return res.status(409).json({
        success: false,
        message:
          "Cannot delete category because it is being used by existing transactions or budgets",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
