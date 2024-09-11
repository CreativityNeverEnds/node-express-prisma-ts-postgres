import { Router } from "express";
import { getAllUserInfos, getMyUserInfo, changePassword, tokenVerify } from "../controller/userinfocontroller";

const UserinfoRouter = Router();

UserinfoRouter.get("/get", getAllUserInfos);
UserinfoRouter.post("/get_my_info", getMyUserInfo);
UserinfoRouter.put("/change_password", changePassword);
UserinfoRouter.post("/token_verify", tokenVerify);

export default UserinfoRouter;