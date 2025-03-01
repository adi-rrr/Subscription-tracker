import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription Name is required"],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    price: {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [0, "Price cannot be negative"],
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "INR"],
        required: [true, "Subscription currency is required"],
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        required: [true, "Subscription frequency is required"],
    },
    category: {
        type: String,
        enum: ["sports", "news", "entertainment", "lifestyle", "education"],
        required: [true, "Subscription category is required"],
    },
    paymentMethod: {
        type: String,
        enum: ["card", "paypal", "upi", "netbanking"],
        required: [true, "Subscription payment method is required"],
    },
    status: {
        type: String,
        enum: ["active", "expired"],
        default: "active",
    },
    startDate: {
        type: Date,
        required: [true, "Subscription start date is required"],
        validate: {
            validator: (value) => value <= new Date(),
            message: "Start date cannot be in the future",
        },
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: "Renewal date must be after the start date",
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true,
    },
}, { timestamps: true });

subscriptionSchema.pre("save", function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    if (this.renewalDate < new Date()) {
        this.status = "expired";
    }
    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;