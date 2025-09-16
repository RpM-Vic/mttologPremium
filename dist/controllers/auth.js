var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { verifySync } from "@node-rs/bcrypt";
import { createUser, getUserByEmail } from "../DB/nodePG/users.js";
import z from "zod";
import { eAccessGranted, emptyCookie, generateAndSerializeToken } from "../middlewares/cookies.js";
import { strictLimiter } from "../middlewares/rateLimit.js";
export const auth = Router();
// Define Zod schema for login input
const loginSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters")
});
auth.post('/', strictLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const validationResult = loginSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Invalid input",
                errors: validationResult.error
            });
        }
        const { email, password } = validationResult.data;
        const user = yield getUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (!verifySync(password, user.password)) {
            return res.status(401).json({
                message: "Access denied, try again"
            });
        }
        const token = generateAndSerializeToken(email, eAccessGranted.Granted, user === null || user === void 0 ? void 0 : user.user_id, user.name, user.roles);
        res.setHeader('Set-Cookie', token).status(201).json({
            ok: true,
            message: "Welcome",
            user: { id: user.email, email: user.email }
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}));
auth.post('/signup', strictLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({
            message: "Some fields are missing"
        });
    }
    const prospect = { name, email, password };
    const user = yield getUserByEmail(email);
    if (user) {
        res.status(409).json({
            message: "User already exists"
        });
        return;
    }
    try {
        const newUser = yield createUser(prospect);
        if (!newUser) {
            res.status(500).json({
                message: `We couldn't create the user`
            });
            return;
        }
        const token = generateAndSerializeToken(email, eAccessGranted.Granted, newUser === null || newUser === void 0 ? void 0 : newUser.user_id, newUser.name, newUser.roles);
        res.setHeader('Set-Cookie', token).status(201).json({
            ok: true,
            message: "User created",
            user: { id: newUser.email, email: newUser.email }
        });
    }
    catch (e) {
        console.log(e);
        res.status(409).json({
            message: "An error ocurred, we are working on it"
        });
    }
}));
auth.get('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serialized = yield emptyCookie();
    // Set the cleared cookie in the response header
    res.setHeader('Set-Cookie', serialized).json({
        message: "You are logged out now",
        ok: true
    });
}));
