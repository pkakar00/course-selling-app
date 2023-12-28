import { Request, Response, NextFunction, Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, Admin, Course } from "../db/serverDatabase.js";

import { authenticateAdmin, authenticateUser } from "../middlewares/auth.js";
import { loginSchema, signupSchema, courseSchema } from "@pulkitkakar7/common";
dotenv.config();

export const app = Router();

const ADMIN_SECRET = process.env.ADMIN_SECRET as string;

app.get("/isLoggedIn", authenticateAdmin, async (req, res) => {
  res.status(200).json({ message: "User logged in" });
});

app.get("/userdata", authenticateAdmin, async (req, res, next) => {
  try {
    const user = await Admin.findOne({ username: res.locals.user.username });
    if (user) {
      res.status(200).json({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } else {
      next(new Error("Admin not found"));
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
      const user = await Admin.findOne({ username, password });
      console.log(user);
      if (user) {
        console.log("User");

        const token = jwt.sign({ username, password }, ADMIN_SECRET, {
          expiresIn: "1h",
        });
        res.status(200).json(token);
      } else {
        res
          .status(403)
          .json({ message: "Invalid username or password" });
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

      let checkDb = await Admin.findOne({ username });

      if (checkDb) {
        res.status(409).json({ message: "username already used" });
        return;
      }

      checkDb = await Admin.findOne({ email });

      if (checkDb) {
        res.status(409).json({ message: "email already used" });
        return;
      }

      const user = new Admin({
        username,
        password,
        email,
        firstName,
        lastName,
      });
      user.save();
      const token = jwt.sign({ username, password }, ADMIN_SECRET, {
        expiresIn: "1h",
      });
      res.status(201).json(JSON.stringify({ message: "Admin Created", token }));
    } else res.status(411).json({ message: result.error.issues[0].message });
  } catch (error) {
    next(error);
  }
});

app.get("/courses", authenticateAdmin, async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.status(200).json(JSON.stringify({ courses }));
  } catch (error) {
    next(error);
  }
});
app.get("/users", authenticateAdmin, async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(JSON.stringify({ users }));
  } catch (error) {
    next(error);
  }
});

app.put("/edit-course/:courseId", authenticateAdmin, async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const courseExists = await Course.findOne({ _id: courseId });
    console.log(courseExists);
    if (!courseExists)
      res
        .status(400)
        .json(JSON.stringify({ message: "Course Does not exist" }));
    else {
      const result = courseSchema.safeParse(req.body);
      if (result.success) {
        const {
          courseName,
          teacherName,
          tags,
          courseSmallDescription,
          numberOfStudents,
          audioLanguages,
          subtitleLanguages,
          objectives,
          requirements,
          description,
          rating,
          courseImageLink,
          videos,
          price,
        } = result.data;
        await Course.updateOne(
          { _id: courseId },
          {
            courseName,
            teacherName,
            tags,
            courseSmallDescription,
            numberOfStudents,
            audioLanguages,
            subtitleLanguages,
            objectives,
            requirements,
            description,
            rating,
            courseImageLink,
            videos,
            price,
          }
        );
        res.status(200).json({ message: "Course updated" });
      } else res.status(411).json({ message: result.error.issues[0].message });
    }
  } catch (e) {
    next(e);
  }
});

app.post("/new-course", authenticateAdmin, async (req, res, next) => {
  console.log("Hello here in new cc");
  
  try {
    const result = courseSchema.safeParse(req.body);

    if (!result.success) {
      res.status(411).json({ message: result.error.issues[0].message });
      return;
    }
    const {
      courseName,
      teacherName,
      tags,
      courseSmallDescription,
      numberOfStudents,
      audioLanguages,
      subtitleLanguages,
      objectives,
      requirements,
      description,
      rating,
      courseImageLink,
      videos,
      price,
    } = result.data;
    const doesExist = await Course.findOne({ courseName });
    console.log(doesExist);
    if (doesExist)
    {
      res
        .status(400)
        .json(JSON.stringify({ message: "Course already exists" }));
      return;
    }
    else {
      await new Course({
        courseName,
        teacherName,
        tags,
        courseSmallDescription,
        numberOfStudents,
        audioLanguages,
        subtitleLanguages,
        objectives,
        requirements,
        description,
        rating,
        courseImageLink,
        videos,
        price,
      }).save();
      res.status(200).json({ message: "Course Created" });
    }
  } catch (e) {
    next(e);
  }
});

app.put("/edit-user/:userId", authenticateAdmin, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const doesExist = await User.findOne({ _id: userId });
    console.log(doesExist);
    if (!doesExist)
      res.status(400).json(JSON.stringify({ message: "User Does not exist" }));
    else {
      const result = signupSchema.safeParse(req.body);
      if (!result.success) {
        res.status(411).json({ message: result.error.issues[0].message });
        return;
      }
      const { username, password, email } = result.data;
      await User.updateOne({ _id: userId }, { username, password, email });
      res.status(200).json({ message: "User Updated" });
    }
  } catch (e) {
    next(e);
  }
});

app.get("/course/:courseId", authenticateAdmin, async (req, res, next) => {
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
    .send(500)
    .json({ message: "Something went wrong in the server or database" });
});