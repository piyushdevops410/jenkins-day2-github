const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.ENVIRONMENT || "dev";

app.get("/", (req, res) => {
    res.json({
        message: "Jenkins Day 13 CI/CD Application",
        environment: ENVIRONMENT,
        version: process.env.BUILD_VERSION || "local"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy"
    });
});

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});
