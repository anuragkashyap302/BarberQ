import jwt from "jsonwebtoken";

const authBarber = async (req, res, next) => {
  try {
    const { btoken } = req.headers;
    if (!btoken) {
      return res.json({
        success: false,
        message: "Unauthorized Access! No Token Provided.",
      });
    }

    const token_decode = jwt.verify(btoken, process.env.JWT_SECRET);
    req.barberId = token_decode.id; // ✅ store on req, not req.body agar yaha body use kiya to sab jav=gah body hi use karna hai
    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export default authBarber;
