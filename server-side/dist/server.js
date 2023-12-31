var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { app as usersRouter } from "./routes/user.js";
import { app as adminsRouter } from "./routes/admin.js";
import cors from "cors";
import { Course, User } from "./db/serverDatabase.js";
import Stripe from "stripe";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const mongoUrl = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;
const stripeKey = process.env.STRIPE_SECRET_KEY;
const clientUrl = process.env.CLIENT_DOMAIN;
const stripeSecret2 = process.env.STRIPE_SECRET_2;
const apiPort = (process.env.PORT);
console.log(mongoUrl);
console.log(dbName);
console.log(stripeKey);
console.log(clientUrl);
console.log(stripeSecret2);
console.log(apiPort);
mongoose.connect(mongoUrl, { dbName });
const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-08-16",
});
const app = express();
// app.use(cors({origin:clientUrl}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.post("/api/user/payment-fulfilment", express.raw({ type: "application/json" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Webhook call");
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, stripeSecret2);
        console.log("Event created");
    }
    catch (err) {
        console.log("In Catch");
        console.log(err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // Handle the event
    switch (event.type) {
        case "checkout.session.completed":
            try {
                const session = event.data.object;
                console.log("In try");
                console.log(session.id);
                try {
                    const x = yield stripe.checkout.sessions.retrieve(session.id);
                    console.log(x);
                }
                catch (error) {
                    console.log("xxxxxxx");
                    console.log(error);
                }
                console.log("Success");
                const courseId = session.metadata.courseId;
                const userId = session.metadata.userId;
                console.log(`cid=${courseId} and uid=${userId}`);
                let userData = yield User.findOne({ _id: userId }).populate("purchasedCourses");
                userData === null || userData === void 0 ? void 0 : userData.purchasedCourses.push(courseId);
                yield (userData === null || userData === void 0 ? void 0 : userData.save());
                const course = yield Course.findOne({ _id: courseId });
                if (!course) {
                    // res.sendStatus(400).json({ message: "Course Does not exist" });
                    console.log("Course Does not exist");
                    return;
                }
                course.numberOfStudents = course.numberOfStudents + 1;
                yield course.save();
                res
                    .status(200)
                    .json({ message: "Course Bought Successfully", userData });
                return;
            }
            catch (e) {
                console.log("500 catch");
                res.sendStatus(500);
                return;
            }
        default:
            console.log(`Unhandled event type ${event.type}`);
            res.sendStatus(500);
    }
}));
app.use(bodyParser.json());
app.use("/api/admin", adminsRouter);
app.use("/api/user", usersRouter);
app.get("/api/courses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield Course.find();
        res.status(200).json(courses);
    }
    catch (error) {
        res.sendStatus(500);
    }
}));
app.get("/api/course/:courseId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(" cid");
    try {
        const id = req.params.courseId;
        const course = yield Course.findById(id);
        if (course)
            res.status(200).json(course);
        else
            res.status(400).json({ message: "Course Does not exist" });
    }
    catch (error) {
        next(error);
    }
}));
app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.listen(3000, () => {
    console.log("Listening at http://localhost:" + apiPort);
});
