import { Router } from "express"
import { getUser,getUsers } from "../../Controllers/User.controller.js";
import authorize from "../../Middlewares/Auth.middleware.js";
const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id",authorize, getUser);//we add teh authorize here to see if the user has access to the data
userRouter.post("/", (req, res) => res.send({ message: "create a new user" }));
userRouter.put("/:id", (req, res) => res.send({ message: "update a user" }));
userRouter.delete("/:id", (req, res) => res.send({ message: "delete a user" })); 

export default userRouter;

