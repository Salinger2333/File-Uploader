import { Router } from "express";
import passport from "passport";
import { body, validationResult } from "express-validator";
import {
  registerController,
  logoutController,
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/auth/login",
  }),
);

authRouter.get("/register", (req, res) => {
  res.render("register");
});

authRouter.post(
  "/register",
  registerController,
);

authRouter.get("/logout", logoutController);

export default authRouter;
