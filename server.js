const mysql = require("mysql");
const express = require("express");
const app = express();
const port = 9876;
app.use(express.json());

const sqlConnect = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "root",
    database : "projectDB",
    multipleStatements : true
});

sqlConnect.connect((err)=>{
    if(err){
        console.log(err.message)
    }else{
        console.log("connected successfully")
    }
});

app.get("/",(req,res)=>{
    res.status(200).send("Welcome to the server")
})

app.get("/students",(req,res)=>{
    sqlConnect.query("SELECT * FROM studentRecords", (err,rows,fields)=>{
        if(err){
            res.status(404).json({
                message: err.message
            })
        }else{
            res.status(200).json({
                message: "All the student Records",
                data : rows
            })
        }
    })
});

app.get("/students/:id", (req,res)=>{
    let id = req.params.id
    sqlConnect.query(`SELECT * FROM studentRecords WHERE id=${id}`, (err,rows,fields)=>{
        if(err){
            res.status(404).json({
                message : err.message
            })
        }else{
            res.status(200).json({
                message : `the Student with id: ${id} is`,
                data : rows
            })
        }
    })
});

app.delete("/students/:id", (req,res)=>{
    let id = req.params.id
    sqlConnect.query(`DELETE FROM studentRecords WHERE id=${id}`, (err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message : `Student with id: ${id} has been deleted`,
            })
        }else{
            res.status(404).json({
                message : err.message
            })
        }
    })
});

app.post("/students", (req,res)=>{
    const body = req.body
    const sql = `SET @id=?;SET @name=?;SET @phoneNumber=?;SET @email=?;SET @password=?;
    CALL addOredit(@id,@name,@phoneNumber,@email,@password); `;
    sqlConnect.query(sql, [body.id,body.name,body.phoneNumber,body.email,body.password], (err,rows,fields)=>{
        if(err){
            console.log(err.message)
        }else{
            rows.forEach((item)=>{
                if(item.constructor == Array){
                    res.status(200).json({
                        message: "Successfully created new Records",
                        data: "student id" + item[0].id
                    })
                }
            })
        }
    })
});






app.listen(port, ()=>{
    console.log(`Listening to port: ${port}`)
})