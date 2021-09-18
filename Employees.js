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
app.use(express.static('public'));

// app.get("/",(req, res)=>{
//     res.redirect("/index.html");
// });

const client = new Client({
    "user": "postgres",
    "host": "localhost",
    "database": "tmdc1",
    "password": "tmdc",
    "port": 5432,
});

let conn = client.connect();

console.log("Connection : ", conn);

if (conn) {
    console.log('database connected ..')
}
class Employee
{
    constructor(code, name, age){
        this.code = code;
        this.name = name;
        this.age = age;
    }
    getName(){
        return this.name;
    }
    getAge(){
        return this.age;
    }
    getCode(){
        return this.code;
    }
}


app.get("/employees", async (req, res) => {
    var employees = [];
    let result = await client.query("select * from employee");
    result.rows.forEach((row) => {
        employees.push(new Employee(row.code, row.name.trim(), row.age));
    });
    console.log(employees);
    res.send(employees);
})

app.post("/addEmployee", async (req, res) => {

    //let code = req.body.code;
    //let name = req.body.name;
    //let age = req.body.age;
    //let {...employee} = { code, name, age };

    let employee = req.body;
    let emp = await client.query(`select code from employee where code=${employee.code}`);

    if (emp.rowCount === 1) {
        res.send({
            "success": false,
            "error": true,
            "errorMessage": `employee already exist with code ${employee.code}`
        });
    }

    let result = await client.query(`insert into employee values(${employee.code},'${employee.name}', ${employee.age})`);

    if (result.command === 'INSERT') {
        res.send({
            "success": true,
            "error": false
        });
    }
    else {
        res.send({
            "success": false,
            "error": true
        });
    }
});


app.post("/updateEmployee",async (req, res)=>{
    const { ...employee } = req.body;

    let result = await client.query(`select * from employee where code=${employee.code}`);

    if(!result.rowCount)
    {
        res.status(400).json("Invalid code, user does not exists.")
    }
    else{
        result = await client.query(`update employee set name='${employee.name}', age=${employee.age} where code = ${employee.code}`);
        console.log(result);

        res.json({
        "success": true,
        "error": false
    })
    }
});

app.post("/deleteEmployee", async(req, res)=>{
    const {...employee} = req.body;
    let result = client.query(`select code from employee where code=${employee.code}`);
    console.log(result);
    if(result.rowCount)
    {
        res.status(404).json({
            "success": false,
            "message": `emplyee with code ${employee.code} does not exists`
        });
    }else{
        result = client.query(`delete from employee where code=${employee.code}`);
        res.json({
            "success": true,
            "message": `Employee delete with code ${employee.code}`
        });
    }
});

app.listen(PORT, (req, res) => {
    console.log(`Server is listening on port ${PORT}`);
});