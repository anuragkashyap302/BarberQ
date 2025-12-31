
import jwt from 'jsonwebtoken';

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const{ atoken }= req.headers
        if(!atoken){
            return res.json({success: false, message: "Unauthorized Access What Boss Dont Have Token!"});
        }
       // console.log("Token received:", req.headers.atoken);
        const decoded = jwt.verify(atoken, process.env.JWT_SECRET);
        if(decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
             return res.json({success: false, message: "Unauthorized Access What Boss False email and password!"});
        } 
        next();
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}   
export default authAdmin;   