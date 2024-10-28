var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const CLIENT_ID = "Ov23li6ZqMBNQxKqlgsV";
const CLIENT_SECRET = "cccd93610fe65f65dd9f5060f77fda7a965b3d09";

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken', async function (req, res) {
    try {
        const code = req.query.code;
       
        console.log("Authorization Code:", code);

        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
        }).toString();

        const response = await fetch(`https://github.com/login/oauth/access_token?${params}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
               // "Content-Type": "application/x-www-form-urlencoded",
            },
           // body: params.toString(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching access token:", errorData);
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        console.log("Access Token Data:", data);
        res.json(data);
    } catch (error) {
        console.error("Error in /getAccessToken:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/getUserData', async function (req, res) {
    try {
        const accessToken = req.get("Authorization");
       

        const response = await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                "Authorization": accessToken,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching user data:", errorData);
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        console.log("User Data:", data);
        res.json(data);
    } catch (error) {
        console.error("Error in /getUserData:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(4000, function () {
    console.log("CORS server running on port 4000");
});
