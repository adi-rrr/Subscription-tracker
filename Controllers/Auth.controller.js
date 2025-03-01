import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../Models/User.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../../Config/Env.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;

        // Log the request body to verify its content
        console.log("Request Body:", req.body);

        // Check if password is defined
        if (!password) {
            return res.status(400).json({ success: false, error: "Password is required" });
        }

        const existingUser = await User.findOne({ email: email }).session(session);
        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create([{ name, email, password: hashedPassword }], { session });
        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUser[0]
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const signIn = async (req, res, next) => {
            try{
                const { email, password } = req.body;
                const user = await User.findOne({email: email});
                if(!user){
                    const error = new Error("User doesn't exist");
                    error.statusCode = 404;
                    throw error;
                }
                const validPassword = await bcrypt.compare(password, user.password);
                if(!validPassword){
                    const error = new Error("Invalid password");
                    error.statusCode = 401;
                    throw error;
                }
                const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
                res.status(200).json({
                    success: true,
                    message: "User signed in successfully",
                    data: {
                        token,
                        user
                    }
                });
            }
            catch(error){
                next(error);
            }
};
