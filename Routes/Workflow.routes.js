import { Router } from "express";
import sendReminders from "../Controllers/Workflow.controller.js";
const workflowRouter = Router();
workflowRouter.get("/", () => {});
workflowRouter.post("/subscription/reminder", sendReminders);
export default workflowRouter;
