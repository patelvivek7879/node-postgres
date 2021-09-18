const express = require("express");
const { Pool, Client } = require("pg");
const PORT = 3300;
const app = express();
//const bodyParser = require('body-parser');

//const urlEncodedBodyParser = bodyParser({"extended": false});

//app.use(bodyParser.urlencoded({"extended": false}));
//app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({
extended: false
}));

const client = new Client({
    "user": "postgres",
    "host": "localhost",
    "database": "tmdc1",
    "password": "tmdc",
    "port": 5432,
});

let conn = client.connect();

console.log("Connection : ", conn);

if(conn){
    console.log('database connected ..')
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

app.post("/addEmployee", async (req,res)=>{
//let code = req.body.code;
//let name = req.body.name;
//let age = req.body.age;
//let {...employee} = { code, name, age };

let employee = req.body;
let emp = await client.query(`select code from employee where code=${employee.code}`);

if(emp.rowCount === 1){
res.send({
"success": false,
"error": true,
"errorMessage": `employee already exist with code ${employee.code}`
});
}

let result = await client.query(`insert into employee values(${employee.code},'${employee.name}', ${employee.age})`);

if(result.command === 'INSERT')
{
res.send({
"success": true,
"error": false
});
}
else
{
res.send({
"success": false,
"error": true
});
}
});


app.listen(PORT,(req,res)=>{
    console.log(`Server is listening on port ${PORT}`);
});