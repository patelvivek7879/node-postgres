const express = require("express");
const app = express();
require('dotenv').config();
const path = require("path");
const { Client } = require("pg");

const PORT = process.env.PORT || 3300

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use("/api",require("./Employees"));


app.listen(PORT, (error) => {
    if(error){
        console.log(`Server Error : ${error}`)
    }
    console.log(`Server is listening on port ${PORT}`);
});
