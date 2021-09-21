// const { Client } = require("pg");
const express = require("express");
const router = express.Router();
const { Client } = require('pg');

// const url = require('url');
// const queryString = require('querystring');

//const bodyParser = require('body-parser');
//const urlEncodedBodyParser = bodyParser({"extended": false});
//app.use(bodyParser.urlencoded({"extended": false}));
//app.use(bodyParser.json());

// app.use(express.json());
// app.use(express.urlencoded({
//     extended: false
// }));
//app.use(express.static('public'));

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

class Employee {
    constructor(code, name, age) {
        this.code = code;
        this.name = name;
        this.age = age;
    }
    getName() {
        return this.name;
    }
    getAge() {
        return this.age;
    }
    getCode() {
        return this.code;
    }
}

router.get("/employees", async (req, res) => {
    
    console.log("Base URL : ", req.baseUrl);

    var employees = [];
    let result = await client.query("select * from employee");
    result.rows.forEach((row) => {
        employees.push(new Employee(row.code, row.name.trim(), row.age));
    });
    console.log(employees);
    res.send(employees);
})

router.get("/getEmployeeByCode/:id", async (req,res)=>{
    let code = req.params.id;
    console.log(req.params);
    let result = await client.query(`select * from employee where code=${code}`);
    if(result.rows.length < 1){
        res.status(404).send({
            success: false,
            message: "Employee not found"
        })
    }else if(result){
    result.rows[0].name = result.rows[0].name.trim();
    console.log(result.rows)
    res.send(result.rows[0]);
    }
});

router.get("/getEmployeeByName",async (req, res)=>{
    let name = req.query.name;
    console.log(name);
    let result = await client.query(`select * from employee where name='${name}'`);
    if(result.rows.length < 1){
        res.status(404).send({
            success: false,
            message: "Employee not found"
        });
    }
    else if(result){
    result.rows[0].name=result.rows[0].name.trim()
    res.send(result.rows);
    }
}); 

//to handle any unappropriate request
router.get("*",async (req,res)=>{
  res.redirect("/error.html");
    //res.redirect("back");
    //res.redirect('..');
});

router.get("/",(req, res)=>{
    var options = {
        root: path.join(__dirname)
    };

    let fileName = "time1.js";
    console.log('GETTING A FILE >>>>>>')
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

router.post("/addEmployee", async (req, res) => {

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


router.post("/updateEmployee", async (req, res) => {
    const { ...employee } = req.body;

    let result = await client.query(`select * from employee where code=${employee.code}`);

    if (!result.rowCount) {
        res.status(400).json("Invalid code, user does not exists.")
    }
    else {
        result = await client.query(`update employee set name='${employee.name}', age=${employee.age} where code = ${employee.code}`);
        console.log(result);

        res.json({
            "success": true,
            "error": false
        })
    }
});
router.post("/deleteEmployee", async (req, res) => {
    const { ...employee } = req.body;
    let result = client.query(`select code from employee where code=${employee.code}`);
    console.log(result);
    if (result.rowCount) {
        res.status(404).json({
            "success": false,
            "message": `emplyee with code ${employee.code} does not exists`
        });
    } else {
        result = client.query(`delete from employee where code=${employee.code}`);
        res.json({
            "success": true,
            "message": `Employee delete with code ${employee.code}`
        });
    }
});


module.exports = router;