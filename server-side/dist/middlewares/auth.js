var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../db/serverDatabase.js";
dotenv.config();
export function authenticateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            try {
                if (process.env.USER_SECRET) {
                    const user = jwt.verify(token, process.env.USER_SECRET);
                    const databaseUser = yield User.findOne({
                        username: user.username,
                        password: user.password,
                    });
                    if (user && databaseUser) {
                        res.locals.user = user;
                        next();
                    }
                    else
                        res.sendStatus(403);
                }
                else
                    res.sendStatus(500);
            }
            catch (e) {
                res.sendStatus(403);
            }
        }
        else
            res.sendStatus(401);
    });
}
export function authenticateAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            try {
                if (process.env.ADMIN_SECRET) {
                    const user = jwt.verify(token, process.env.ADMIN_SECRET);
                    const databaseUser = yield User.findOne({
                        username: user.username,
                        password: user.password,
                    });
                    if (user && databaseUser) {
                        res.locals.user = user;
                        next();
                    }
                    else
                        res.sendStatus(403);
                }
                else
                    res.sendStatus(500);
            }
            catch (e) {
                res.sendStatus(403);
            }
        }
        else
            res.sendStatus(403);
    });
}
