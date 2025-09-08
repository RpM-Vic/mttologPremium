var _a;
// main.ts
import express from "express";
import { testConnection } from "./DB/nodePG/dbConnection.js";
import { pages } from "./controllers/pages.js";
import { activities } from "./controllers/activities.js";
import 'dotenv/config';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/activities", activities);
app.use("/", pages);
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
