// const { Client } = require("pg");
const router = require('express').Router();
const { Client } = require('pg');

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

router.get("/employees", async (req, res) => {

    console.log("Base URL : ", req.baseUrl);

    var employees = [];
    try {
        const result = await client.query("select * from employee");
        result.rows.forEach((row) => {
            employees.push(new Employee(row.code, row.name.trim(), row.age));
        });
    } catch (error) {

    }
    res.send(employees);
})

router.get("/getEmployeeByCode/:id", async (req, res) => {
    const { id } = req.params;

    console.log(code);
    try {


        let result = await client.query(`select * from employee where code=${id}`);
        if (result.rows.length < 1) {
            res.status(404).send({
                success: false,
                message: "Employee not found"
            })
        } else if (result) {
            result.rows[0].name = result.rows[0].name.trim();
            console.log(result.rows)
            res.send(result.rows[0]);
        }
    } catch (error) {
    }
});

router.get("/getEmployeeByName", async (req, res) => {
    let { name } = req.query;
    console.log(name);
    try {
        const result = await client.query(`select * from employee where name='${name}'`);
        if (result.rows.length < 1) {
            res.status(404).send({
                success: false,
                message: "Employee not found"
            });
        }
        else if (result) {
            result.rows[0].name = result.rows[0].name.trim()
            res.send(result.rows);
        }
    } catch (error) {

    }
    res.send(result.rows);
});

router.post("/addEmployee", async (req, res) => {

    let employee = req.body;
    try {
        const emp = await client.query(`select code from employee where code=${employee.code}`);

    if (emp.rowCount === 1) {
        res.send({
            "success": false,
            "error": true,
            "errorMessage": `employee already exist with code ${employee.code}`
        });
    }

    const result = await client.query(`insert into employee values(${employee.code},'${employee.name}', ${employee.age})`);

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
    } catch (error) {
        
    }
    res.send({
        success: true,
        error: false
    });
});


router.post("/updateEmployee", async (req, res) => {

    const { ...employee } = req.body;
    try{
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
    }catch(error){

    }
    res.send({success: true,
        error: false
    });
});

router.post("/deleteEmployee", async (req, res) => {
    const { ...employee } = req.body;
    try{
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
    }catch(error){
        
    }

});

//to handle any unappropriate request
router.get("*", (req, res) => {
    res.redirect("/error.html");
});


module.exports = router;