import aj from "../Config/Arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try{
        const decision = await aj.protect(req,{requested:1});//so tell me your decisionto allow this request or not according to rate limit and when requested onyl 1 token granted
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({ success: false, message: "Rate Limit Exceeded", error: decision.reason.message });
            }
            if(decision.reason.isBot()){
                return res.status(403).json({ success: false, message: "bot detected", error: decision.reason.message });

            }
            return res.status(403).json({ success: false, message: "access denied", error: decision.reason.message });
            
        }
        next();
    }
    catch(error){
        console.log(`Arcjet Middleware Error: ${error.message}`);
        next(error);
    }

}
export default arcjetMiddleware;