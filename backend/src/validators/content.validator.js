const { body } = require("express-validator");

const createContentValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 200 }).withMessage("Title cannot exceed 200 characters"),

  body("type")
    .notEmpty().withMessage("Content type is required")
    .isIn(["blog", "article", "news", "update"]).withMessage("Invalid content type"),

  body("body")
    .notEmpty().withMessage("Content body is required"),

  body("excerpt")
    .optional()
    .isLength({ max: 500 }).withMessage("Excerpt cannot exceed 500 characters"),

  body("tags")
    .optional()
    .isArray().withMessage("Tags must be an array"),

  body("isPublished")
    .optional()
    .isBoolean().withMessage("isPublished must be boolean"),
];

const updateContentValidator = [
  body("title").optional().trim().isLength({ max: 200 }),
  body("type").optional().isIn(["blog", "article", "news", "update"]),
  body("body").optional().notEmpty(),
  body("isPublished").optional().isBoolean(),
];

module.exports = { createContentValidator, updateContentValidator };