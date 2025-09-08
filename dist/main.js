var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// main.ts
import express from "express";
import { testConnection } from "./DB/nodePG/dbConnection.js";
import { pages } from "./controllers/pages.js";
import { activities } from "./controllers/activities.js";
const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use("/api/activities", activities);
app.use("/", pages);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        app.listen(PORT, () => __awaiter(this, void 0, void 0, function* () {
            yield testConnection();
            console.log(`🚀 Server listening on http://localhost:${PORT}`);
        }));
    });
}
startServer();
export default startServer;
