import jwt from 'jsonwebtoken'; 
import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import cors from "cors";
import axios from "axios";
const app = express(); 
// Middleware to parse JSON request bodies
app.use(bodyParser.json());
// Middleware to validate Bearer token
/*
const authenticateBearerToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    // Replace 'YOUR_SECRET_TOKEN' with your actual secret token
    if (bearerToken === "binh-dep-trai") {
      next();
    } else {
      res.status(403).json({ error: "Invalid token" });
    }
  } else {
    res.status(401).json({ error: "Token is missing" });
  }
};
*/

/*

const whitelist = ["http://localhost:8080","http://localhost:5173","https://theheai.com"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))
*/
//ALLOW ALL
const corsOptions = {
  origin: "*", // Allow all origins (not recommended for production without proper security measures)
  credentials: true,
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send("Just Testing.....!");
  });
// Endpoint to verify JWT token and fetch user information
app.post("/api/verify-token", async (req, res) => {
    try {
      const token = req.body.token; // Assuming the token is sent in the request body
      // Fetch JWT secret key from an external source
      const url_get_jwt_key = "https://sandbox.theheai.xyz/theheai-sandbox/get-jwt-key";
      const getSecretkey = await axios.get(url_get_jwt_key);
      const secretKey = getSecretkey.data.jwtSecretKey;
  
      // Verify the JWT token using the fetched secret key
      const userIdToken = jwt.verify(token, secretKey);
      const userId = userIdToken.userId;
  
      // Fetch user information using the userId
      const getUserInfoUrl = "https://sandbox.theheai.xyz/theheai-sandbox/check-userinfo";
      axios.post(getUserInfoUrl, { id: userId })
        .then((getUserResponse) => {
          const userResponse = getUserResponse.data.userInfo;
          console.log('userResponse:', userResponse);
          res.send({ userInfo: userResponse });
        })
        .catch((error) => {
          res.status(500).json({ error: error.message }); // Handle error if fetching user info fails
        });
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle error if JWT verification fails
    }
  });
  
  const port = parseInt(process.env.PORT) || 8080;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });