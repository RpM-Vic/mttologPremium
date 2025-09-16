var _a;
// main.ts
import express from "express";
import { testConnection } from "./DB/nodePG/dbConnection.js";
import { pages } from "./controllers/pages.js";
import { activities } from "./controllers/activities.js";
import 'dotenv/config';
import { auth } from "./controllers/auth.js";
import cookieParser from 'cookie-parser';
import { limiter } from "./middlewares/rateLimit.js";
const app = express();
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/activities", limiter, activities);
app.use("/api/login", auth);
app.use("/", limiter, pages);
// Run testConnection at cold start
testConnection().catch(err => {
    console.error("DB connection failed:", err);
});
export default app; // ✅ don't call app.listen()
if (process.env.NODE_ENV !== "production") {
    const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
}
