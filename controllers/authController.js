import bcrypt from "bcryptjs";
import { body, matchedData, validationResult } from "express-validator";
import { prisma } from "../lib/prisma.js";

const registerValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isAlphanumeric()
    .withMessage("Username must only contain letters and numbers."),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters."),
];

const registerController = [
  registerValidationRules,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("register", { errors: errors.array() });
      }
      const { username, password } = matchedData(req);
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      res.redirect("/auth/login");
    } catch (error) {
      if (error.code === "P2002") {
        return res.render("register", {
          error: "Username already taken.",
        });
      }
      next(error);
    }
  },
];

function logoutController(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

export { registerController, logoutController };
