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
dotenv.config();
mongoose.connect(`mongodb+srv://pulkitkakkar6:Pinternational1@cluster0.dypwgt2.mongodb.net/?retryWrites=true&w=majority`, { dbName: "Course-Selling" });
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe("sk_test_51Nm248JaKrI2aUZQIIS2TlnTuIEevxTY94fyLZAxCK4lXMZfXwVvwOSK9VARegDDAjTtx4ddQtlLonacrYzPqc5N00Xs9tQMXO", {
    apiVersion: "2023-08-16",
});
const app = express();
//app.use(cors({origin:"http://localhost:5173"}));
app.use(cors());
app.post("/user/payment-fulfilment", express.raw({ type: "application/json" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Webhook call");
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, "whsec_0890b5ae817da99a413e847d849e292a28e2aeef32823b5b9bdb107d291f58d1");
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
                //const sessionRetrived = await stripe.checkout.sessions.retrieve(session.id);
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
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
            res.sendStatus(500);
    }
    // Return a 200 res to acknowledge receipt of the event
}));
app.use(bodyParser.json());
app.use("/admin", adminsRouter);
app.use("/user", usersRouter);
app.get("/courses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield Course.find();
        res.status(200).json(courses);
    }
    catch (error) {
        res.sendStatus(500);
    }
}));
app.get("/course/:courseId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
app.listen(3000, () => {
    console.log("Listening at http://localhost:3000");
});
