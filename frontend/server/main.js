const express = require("express");
const app = express();
require("dotenv").config();
const FRONTEND_PORT = process.env.FRONTEND_PORT;

// middleware
app.use(express.static("public"));

// listening
app.listen(FRONTEND_PORT, function () {
    console.log(`App started on port http://localhost:${FRONTEND_PORT}`);
});
