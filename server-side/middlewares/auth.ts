import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, Admin, Course } from "../db/serverDatabase.js";
import { log } from "console";
dotenv.config();

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.headers.authorization) {
    const token: string = req.headers.authorization.split(" ")[1];
    try {
      if (process.env.USER_SECRET) {
        const user = jwt.verify(token, process.env.USER_SECRET) as {
          username: string;
          password: string;
        };
        const databaseUser = await User.findOne({
          username: user.username,
          password: user.password,
        });
        if (user && databaseUser) {
          res.locals.user = user;
          next();
        } else res.sendStatus(403);
      } else res.sendStatus(500);
    } catch (e) {
      res.sendStatus(403);
    }
  } else res.sendStatus(401);
}
export async function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {  
  if (req.headers.authorization) {
    console.log("step 1");
    const token: string = req.headers.authorization.split(" ")[1];
    try {
      if (process.env.ADMIN_SECRET) {
        console.log("step 2");
        console.log("token = "+token);
        console.log("admin secret = "+process.env.ADMIN_SECRET);
        const user = jwt.verify(token, process.env.ADMIN_SECRET) as {
          username: string;
          password: string;
        };
        console.log("step 3 = ");
        console.log(user);
        
        const databaseUser = await Admin.findOne({
          username: user.username,
          password: user.password,
        });
        console.log("step 4 = "+databaseUser);
        if (user && databaseUser) {
          res.locals.user = user;
          next();
          console.log("step 5 done");
        }
        else res.sendStatus(403);
      } else res.sendStatus(500);
    } catch (e) {
      res.sendStatus(403);
    }
  } else res.sendStatus(403);
}