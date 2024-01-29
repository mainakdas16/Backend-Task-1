require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connect");
const contactRouter = require("./routes/contacts");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/v1/contacts", contactRouter)

const start = async () => {
    try {
        connectDB();
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    } catch (error) {
        console.log(error);
    }
}

start();