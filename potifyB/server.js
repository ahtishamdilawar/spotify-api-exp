const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const crypto = require("crypto");

var REDIRECT_URI = "http://localhost:8000/callback";

var AUTH_URL = "https://accounts.spotify.com/authorize";
var TOKEN_URL = "https://accounts.spotify.com/api/token";
var API_BASE_URL = "https://api.spotify.com/v1";

//CODE VERIFICATION
/////////
const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};
var statKey = "spotify_auth_state";
/////////

//allow Access-Control-Allow-Origin

app.use(
  cors({
    origin: "*",
    credentials: true,
    //preflight
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.get("/login", (req, res) => {
  const scopes = "user-read-private user-read-email";
  const authUrl = new URL(AUTH_URL);
  var state = generateRandomString(16);
  const params = {
    client_id: process.env.CLIENT_ID,
    response_type: "code",
    scope: scopes,
    redirect_uri: REDIRECT_URI,
    show_dialog: true,
    state: state,
    // code_challenge: codeChallenge,
    // code_challenge_method: "S256",
  };
  //set header for request

  authUrl.search = new URLSearchParams(params).toString();
  console.log(authUrl);
  // res.redirect(authUrl);
  // res.redirect(
  //   `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=http://localhost:8000/callback`
  // );
  //get respnse and send response back to client

  //   axios.get(authUrl).then((response) => {
  //     res.send(response.data);
  //   });
  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  if (req.query.error) {
    res.send("Error: " + req.query.error);
    return;
  }
  const code = req.query.code;
  const req_body = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.app_secret_key,
  };

  //post request to get access token
  try {
    const response = await axios.post(TOKEN_URL, req_body);
    const access_token = response.data.access_token;
    const refresh_token = response.data.refresh_token;
    res.send({ access_token, refresh_token });
    console.log("SUCCESSFULLY LOGGED IN");
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
});

app.get("/playlists", async (req, res) => {
  if (!req.query.access_token) {
    res.send("Access Token not found");
    return;
  }
  const access_token = req.query.access_token;

  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  try {
    const response = await axios.get(`${API_BASE_URL}/me/playlists`, {
      headers,
    });
    console.log(response.data);
    res.send(response.data.items);
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
