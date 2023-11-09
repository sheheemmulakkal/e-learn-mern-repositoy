import { body } from "express-validator";

export const signupValidation = [
  body("firstname")
    .trim()
    .matches(/^[A-Za-z]+$/)
    .withMessage("First name must contain only letters")
    .not()
    .isEmpty()
    .withMessage("Enter a valid name"),
  body("lastname")
    .trim()
    .matches(/^[A-Za-z]+$/)
    .withMessage("First name must contain only letters")
    .not()
    .isEmpty()
    .withMessage("Enter a valid name"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage("password must be between 4 & 10")
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
    .withMessage("Password must contain both letters and numbers"),
  body("email").trim().isEmail().withMessage("Enter valid email"),
  body("mobile")
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage("Enter valid 10-digit mobile number"),
];

export const courseValidation = [
  body("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),

  body("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  body("level")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Level is required")
    .isString()
    .withMessage("Level must be a string"),

  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => {
      if (value < 0) {
        throw new Error("Price must not be negative");
      }
      return true;
    }),

  body("language")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Language is required")
    .isString()
    .withMessage("Language must be a string"),

  body("category")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Category is required")
    .isString()
    .withMessage("Category must be a string"),
];
