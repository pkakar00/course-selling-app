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
const mongoUrl = process.env.MONGO_URL as string;
const dbName = process.env.DB_NAME as string;
const stripeKey = process.env.STRIPE_SECRET_KEY as string;
const clientUrl = process.env.CLIENT_DOMAIN as string;
const stripeSecret2 = process.env.STRIPE_SECRET_2 as string;
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
app.post(
  "/user/payment-fulfilment",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("Webhook call");

    const sig: any = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        stripeSecret2
      );
      console.log("Event created");
    } catch (err: any) {
      console.log("In Catch");
      console.log(err);

      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        try {
          const session: any = event.data.object;
          console.log("In try");
          console.log(session.id);
          try {
            const x = await stripe.checkout.sessions.retrieve(session.id);
            console.log(x);
          } catch (error) {
            console.log("xxxxxxx");

            console.log(error);
          }

          console.log("Success");
          const courseId = session.metadata.courseId;
          const userId = session.metadata.userId;

          console.log(`cid=${courseId} and uid=${userId}`);

          let userData = await User.findOne({ _id: userId }).populate(
            "purchasedCourses"
          );

          userData?.purchasedCourses.push(courseId);
          await userData?.save();
          const course = await Course.findOne({ _id: courseId });
          if (!course) {
            // res.sendStatus(400).json({ message: "Course Does not exist" });
            console.log("Course Does not exist");
            return;
          }
          course.numberOfStudents = course.numberOfStudents + 1;
          await course.save();
          res
            .status(200)
            .json({ message: "Course Bought Successfully", userData });
          return;
        } catch (e) {
          console.log("500 catch");

          res.sendStatus(500);
          return;
        }
      default:
        console.log(`Unhandled event type ${event.type}`);
        res.sendStatus(500);
    }
  }
);
app.use(bodyParser.json());
app.use("/admin", adminsRouter);
app.use("/user", usersRouter);
app.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.sendStatus(500);
  }
});
app.get("/course/:courseId", async (req, res, next) => {
  console.log(" cid");

  try {
    const id = req.params.courseId;
    const course = await Course.findById(id);
    if (course) res.status(200).json(course);
    else res.status(400).json({ message: "Course Does not exist" });
  } catch (error) {
    next(error);
  }
});
app.use('/*',(req,res)=>{
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.listen(3000, () => {
  console.log("Listening at http://localhost:"+apiPort);
});