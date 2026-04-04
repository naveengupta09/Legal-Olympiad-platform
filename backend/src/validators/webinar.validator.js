const { body } = require("express-validator");

const createWebinarValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("description").notEmpty().withMessage("Description is required"),

  body("scheduledAt")
    .notEmpty().withMessage("Scheduled date/time is required")
    .isISO8601().withMessage("Invalid date format")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Webinar must be scheduled in the future");
      }
      return true;
    }),

  body("durationMinutes")
    .optional()
    .isInt({ min: 15, max: 480 }).withMessage("Duration must be between 15 and 480 minutes"),

  body("speakers")
    .optional()
    .isArray().withMessage("Speakers must be an array"),

  body("speakers.*.name")
    .if(body("speakers").exists())
    .notEmpty().withMessage("Speaker name is required"),

  body("maxAttendees")
    .optional()
    .isInt({ min: 1 }).withMessage("Max attendees must be a positive integer"),
];

module.exports = { createWebinarValidator };