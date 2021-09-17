const express = require("express");
const { Pool, Client } = require("pg");
const PORT = 3300;
const app = express();

const client = new Client({
    "user": "postgres",
    "host": "localhost",
    "database": "tmdc1",
    "password": "tmdc",
    "port": 5432,
});

let conn = client.connect();

console.log(conn);

if(conn){
    console.log('databse connected ..')
}

app.get("/employees",async (req,res)=>{
    let result = await client.query("select * from employee");
    let emps = result.rows;
    emps.forEach((emp)=>{
        emp.name = emp.name.trim();
    });
    console.log(emps);
    res.send(emps);
})

app.listen(PORT,(req,res)=>{
    console.log(`Server is listening on port ${PORT}`);
});