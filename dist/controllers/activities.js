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
import { createActivities, deleteAllActivitiesFromOneUser, getAllActivities, getAllActivitiesFromOneUser } from "../DB/nodePG/activities.js";
export const activities = Router();
activities.get('/hello', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activities = yield getAllActivities();
    res.json({
        msg: 'Hello World',
        activities
    });
}));
activities.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const user_id=req.cookies
    // if(!user_id){
    //     res.status(401).json({
    //       msg:"Something went wrong"
    //     })
    //   return 
    // }
    const user_id = "12345"; //TESTING
    try {
        const activities = yield getAllActivitiesFromOneUser(user_id);
        res.json({
            msg: "Activities listed",
            activities
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Something went wrong"
        });
    }
}));
activities.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const user_id=req.cookies
    const user_id = "12345";
    const { newActivities } = req.body;
    console.log({ newActivities });
    try {
        yield deleteAllActivitiesFromOneUser(user_id);
        yield createActivities(user_id, newActivities);
        res.status(201).json({
            msg: "Activities have been created"
        });
    }
    catch (e) {
        console.log("error creating activities: ", e);
        res.status(500).json({});
    }
}));
