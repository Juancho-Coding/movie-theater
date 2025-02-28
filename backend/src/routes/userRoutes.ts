import { Router, Request, Response, NextFunction } from "express";
import {
  authValidator,
  loginValidator,
  signupValidator,
} from "../validators/authValidators";
import { loginUser, signupUser } from "../controllers/userController";

const router = Router();

// users/login: makes a post request to login a user
router.post("/login", loginValidator, loginUser);
// users/signup: makes a post request to signup a user
router.post("/signup", signupValidator, signupUser);

export default router;
