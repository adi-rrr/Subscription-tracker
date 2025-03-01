import { Router } from "express";
import { signIn, signUp } from "../../Controllers/Auth.controller.js";
const authRouter = Router();
authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", (req, res) => res.send({message:"Sign out"}));

export default authRouter;