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
import { createActivities, deleteAllActivitiesFromOneUser, getAllActivitiesFromOneUser } from "../DB/nodePG/activities.js";
import { validateTokenAPI } from "../middlewares/cookies.js";
// import { validateToken } from "../middlewares/cookies.js";
export const activities = Router();
activities.get('/', validateTokenAPI, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const user_id="12345"  //TESTING
    const payload = req.user;
    if (!payload) {
        res.status(401).json({
            message: "Something went wrong"
        });
        return;
    }
    try {
        const activities = yield getAllActivitiesFromOneUser(payload.user_id);
        res.json({
            message: "Activities listed",
            activities
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}));
activities.post('/', validateTokenAPI, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.user;
    if (!payload) {
        res.status(401).json({
            message: "Something went wrong"
        });
        return;
    }
    const { newActivities } = req.body;
    try {
        yield deleteAllActivitiesFromOneUser(payload.user_id);
        yield createActivities(payload.user_id, newActivities);
        res.status(201).json({
            message: "Activities have been created"
        });
    }
    catch (e) {
        console.log("error creating activities: ", e);
        res.status(500).json({});
    }
}));
