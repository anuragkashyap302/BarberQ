
import jwt from 'jsonwebtoken';

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const aToken = req.headers.atoken;
        if(!aToken){
            return res.json({success: false, message: "Unauthorized Access What Boss Dont Have Token!"});
        }
       // console.log("Token received:", req.headers.aToken);
        const decoded = jwt.verify(aToken, process.env.JWT_SECRET);
        // Token is valid if JWT verification succeeds, no need to check email/password 
        next();
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}   
export default authAdmin;   