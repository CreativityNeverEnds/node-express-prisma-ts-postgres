import { Router } from "express";
import { getRiskParams, addRiskParams, deleteRiskParams, updateRiskParams } from "../controller/riskparamscontroller";

const RiskParamsRouter = Router();

RiskParamsRouter.get("/get", getRiskParams);
RiskParamsRouter.post("/add", addRiskParams);
RiskParamsRouter.put("/update", updateRiskParams);
RiskParamsRouter.post("/delete", deleteRiskParams);

export default RiskParamsRouter;