import Subscription from "../../Models/Subscription.model.js";
import { SERVER_URL } from "../../Config/Env.js";
//import { WorkflowClient } from "../Config/Upstash.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        // Use the correct method to send a request with QStash and capture the response
        const response = await fetch(`${SERVER_URL}/api/v1/workflows/subscription/reminder`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscriptionId: subscription._id }),
        });
        
        const workflowResponse = await response.json();
        console.log("Upstash API Response:", workflowResponse);

        console.log("Workflow response:", workflowResponse); // Log the entire workflow response
        subscription.workflowRunId = workflowResponse.workflowId;
        await subscription.save();
        res.status(201).json({
            success: true,
            data: subscription,
            workflowRunId: subscription.workflowId, // Include the workflow message ID in the response
        });
    } catch (error) {
        console.error("Error creating subscription:", error);
        next(error);
    }
};

export const getSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error("Unauthorized");
            error.statusCode = 401;
            throw error;
        }
        const subscriptions = await Subscription.find({ user: req.user._id });

        res.status(200).json({
            success: true,
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
};