// Simple validation utility
const { body, validationResult } = require("express-validator");

// Middleware to check validation results
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for user registration
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["viewer","analyst","admin"]).withMessage("Invalid role"),
];

// Validation rules for login
const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
];

// Validation rules for financial record
const recordValidation = [
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("type").isIn(["income","expense"]).withMessage("Type must be income or expense"),
  body("category").notEmpty().withMessage("Category is required"),
  body("date").optional().isISO8601().withMessage("Date must be valid"),
];

module.exports = {
  validateRequest,
  registerValidation,
  loginValidation,
  recordValidation
};