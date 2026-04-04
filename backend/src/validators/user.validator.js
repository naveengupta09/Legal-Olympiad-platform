const { body } = require("express-validator");

const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[+]?[\d\s\-()]{7,15}$/).withMessage("Invalid phone number"),

  body("bio")
    .optional()
    .isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters"),

  body("socialLinks.linkedin")
    .optional()
    .isURL().withMessage("LinkedIn must be a valid URL"),

  body("socialLinks.twitter")
    .optional()
    .isURL().withMessage("Twitter must be a valid URL"),
];

module.exports = { updateProfileValidator };