import { Request, Response, Express } from "express";
import { Login, Register } from "../controller/userinfocontroller";
import RiskParamsRouter from "./riskparamsRouter";
import UserinfoRouter from "./userinfoRouter";

const Routes = (app: Express) => {

    app.route("/").get((request: Request, response: Response) => {
      response.status(200).send({
        message: "GET request successfully.",
      });
    });

    app.route("/login").post(Login);
    app.route("/register").post(Register);
    app.use("/dashboard/riskparams", RiskParamsRouter);
    app.use("/user_info", UserinfoRouter);
};

export default Routes;