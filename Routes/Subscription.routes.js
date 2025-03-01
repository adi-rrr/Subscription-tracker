import { Router } from "express";
import authorize from "../../Middlewares/Auth.middleware.js";
import { createSubscription, getSubscriptions } from "../../Controllers/Subscription.controller.js";
const subscriptionRouter = Router();
subscriptionRouter.get("/", (req, res) => res.send("get all subscriptions"));
subscriptionRouter.get("/:id", (req, res) => res.send("get a specific subscription"));
subscriptionRouter.post("/", authorize ,createSubscription);
subscriptionRouter.put("/:id", (req, res) => res.send("update a subscription"));
subscriptionRouter.delete("/:id", (req, res) => res.send("delete a subscription"));
subscriptionRouter.get("/user/:id", authorize,getSubscriptions);
subscriptionRouter.put('/:id/cancel', (req, res) => res.send("cancel a subscription"));
subscriptionRouter.get('/upcoming-renewals',(req, res) => res.send("get all upcoming renewals"));

export default subscriptionRouter;