import mongoose from "mongoose";
import { DB_URI,NODE_ENV} from '../../Config/Env.js';
if(!DB_URI){
    throw new Error("DB_URI is not defined"); 
}

const connecttodb = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Database connected in NODE_ENV: ",NODE_ENV);
    } catch (error) {
        console.log("Database connection failed");
        console.log(error);
    }
}

export default connecttodb;
