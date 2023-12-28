import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, Course } from "../db/serverDatabase.js";
import { authenticateUser } from "../middlewares/auth.js";
import { loginSchema, signupSchema } from "@pulkitkakar7/common";
import Stripe from "stripe";
import express from "express";

// const customer = await stripe.customers.create({
//   email: 'customer@example.com',
// });
dotenv.config();
const stripeKey = process.env.STRIPE_SECRET_KEY;
const clientDomain = process.env.CLIENT_DOMAIN;
const stripe = new Stripe("sk_test_51Nm248JaKrI2aUZQIIS2TlnTuIEevxTY94fyLZAxCK4lXMZfXwVvwOSK9VARegDDAjTtx4ddQtlLonacrYzPqc5N00Xs9tQMXO", {
  apiVersion: "2023-08-16",
});

export const app = Router();
const USER_SECRET = process.env.USER_SECRET as string;

app.get("/isLoggedIn", authenticateUser, async (req, res) => {
  res.status(200).json({ message: "User logged in" });
});

app.get("/userdata", authenticateUser, async (req, res, next) => {
  console.log("Req recvd");
  try {
    console.log("TRY block");
    console.log(res.locals.user);

    const user = await User.findOne({ username: res.locals.user.username });
    if (user) {
      console.log("USERRRR");
      console.log(user);

      res.status(200).json({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } else {
      next(new Error("User not found"));
    }
  } catch (error) {
    next(error);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (result.success) {
      const { username, password } = result.data;
      const user = await User.findOne({ username, password });
      console.log(user);
      if (user) {
        console.log("User");

        const token = jwt.sign({ username, password }, USER_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).json(token);
      } else {
        res.status(403).json({ message: "Invalid username or password" });
      }
    } else res.status(411).json({ message: result.error.issues[0].message });
  } catch (error) {
    next(error);
  }
});

app.post("/signup", async (req, res, next) => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (result.success) {
      const { username, password, email, firstName, lastName } = result.data;

      let checkDb = await User.findOne({ username });

      if (checkDb) {
        res.status(409).json({ message: "username already used" });
        return;
      }

      checkDb = await User.findOne({ email });

      if (checkDb) {
        res.status(409).json({ message: "email already used" });
        return;
      }

      const user = new User({ username, password, email, firstName, lastName });
      user.save();
      const token = jwt.sign({ username, password }, USER_SECRET, {
        expiresIn: "1h",
      });
      res.status(201).json({ message: "User Created", token });
    } else res.status(411).json({ message: result.error.issues[0].message });
  } catch (error) {
    next(error);
  }
});

app.get("/buy-course/:courseId", authenticateUser, async (req, res, next) => {
  const courseId = req.params.courseId;
  console.log("CID="+courseId);
  try {
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      res.sendStatus(400).json({ message: "Course Does not exist" });
      return;
    }

    let userData = await User.findOne({
      username: res.locals.user.username,
      password: res.locals.user.password,
    }).populate("purchasedCourses");
    console.log("Upto user data");
    
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price_data: {
            currency: "cad",
            product_data: {
              name: course.courseName,
              description: course.courseSmallDescription,
              images: [course.courseImageLink],
            },
            unit_amount: course.price * 100,
            tax_behavior: "exclusive",
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { courseId: "" + course._id, userId:"" + userData?._id },
      currency: "cad",
      customer_email: userData?.email,

      client_reference_id: "" + userData?._id,
      success_url: `${clientDomain}/user/payment_success`,
      cancel_url: `${clientDomain}/user/payment_failed`,
    });
    console.log("url="+session.url);
    
    res.status(303).json({url:session.url!});
  } catch (error) {
    next(error);
  }
});

app.delete(
  "/delete-course/:courseId",
  authenticateUser,
  async (req, res, next) => {
    const courseId = req.params.courseId;
    try {
      let userData = await User.findOne({
        username: res.locals.user.username,
        password: res.locals.user.password,
      }).populate("purchasedCourses");
      const newCourses = userData?.purchasedCourses.filter(
        (user) => user.purchasedCourses._id !== courseId
      );
      await User.updateOne(
        {
          username: res.locals.user.username,
          password: res.locals.user.password,
        },
        {
          purchasedCourses: newCourses,
        }
      );
      userData = await User.findOne({
        username: res.locals.user.username,
        password: res.locals.user.password,
      }).populate("purchasedCourses");
      res
        .status(200)
        .json({ message: "Course Deleted Successfully", userData });
    } catch (error) {
      next(error);
    }
  }
);
app.get("/my-courses", authenticateUser, async (req, res, next) => {
  try {
    const courses = await User.findOne({
      username: res.locals.user.username,
      password: res.locals.user.password,
    }).populate("purchasedCourses");
    if (!courses) res.status(200).json([]);
    else res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
});

app.get("/course/:courseId", authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.courseId;
    const course = await Course.findById(id);
    if (course) res.status(200).json(course);
    else res.status(400).json({ message: "Course Does not exist" });
  } catch (error) {
    next(error);
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);

  res
    .status(500)
    .json({ message: "Something went wrong in the server or database" });
});
