const { body } = require("express-validator");

const createCompetitionValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("description").notEmpty().withMessage("Description is required"),

  body("type")
    .notEmpty()
    .isIn(["moot_court", "quiz", "essay", "debate", "client_counselling", "negotiation", "other"])
    .withMessage("Invalid competition type"),

  body("startDate")
    .notEmpty().withMessage("Start date is required")
    .isISO8601().withMessage("Invalid start date format"),

  body("endDate")
    .notEmpty().withMessage("End date is required")
    .isISO8601().withMessage("Invalid end date format")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("registrationDeadline")
    .notEmpty().withMessage("Registration deadline is required")
    .isISO8601().withMessage("Invalid date format"),

  body("entryFee")
    .optional()
    .isNumeric().withMessage("Entry fee must be a number")
    .isFloat({ min: 0 }).withMessage("Entry fee cannot be negative"),

  body("prizePool")
    .optional()
    .isNumeric().isFloat({ min: 0 }),
];

module.exports = { createCompetitionValidator };