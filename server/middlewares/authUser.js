import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized Access! No Token Provided.",
      });
    }

    const token_decode = jwt.verify(token, secret);
    req.userId = token_decode.id; // ✅ store on req, not req.body agar yaha body use kiya to sab jav=gah body hi use karna hai
    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
