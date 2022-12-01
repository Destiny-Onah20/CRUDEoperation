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


// endpoint route for home
app.get("/",(req,res)=>{
    res.status(200).send("Welcome to the server")
})

// to get all students
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

// to get all tutors
app.get("/tutors", (req,res)=>{
    sqlConnect.query(`SELECT * FROM tutorRecords`, (err,rows,fields)=>{
        if(err){
            res.status(404).json({
                message : err.message
            })
        }else{
            res.status(200).json({
                data : rows
            })
        }
    })
});


//to get One student
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

// to get one tutor
app.get("/tutors/:id", (req,res)=>{
    let id = req.params.id
    sqlConnect.query(`SELECT * FROM tutorRecords WHERE id=${id}`, (err,rows,fields)=>{
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


// delete one student
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


// delete one tutor
app.delete("/tutors/:id", (req,res)=>{
    let id = req.params.id
    sqlConnect.query(`DELETE FROM tutorRecords WHERE id=${id}`, (err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message : `Tutor with id: ${id} has been deleted`,
            })
        }else{
            res.status(404).json({
                message : err.message
            })
        }
    })
});

// create new students
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

// create new tutor
app.post("/tutors", (req,res)=>{
    let body = req.body;
    let sql = `SET @id=?;SET @name=?; SET @phoneNumber=?; SET @course=?;SET @email=?;  SET @password=?;
    CALL tutorEdit(@id,@name,@phoneNumber,@course,@email,@password);`;
    sqlConnect.query(sql, [body.id,body.name,body.phoneNumber,body.course,body.email,body.password], (err,rows,fields)=>{
        if(err){
            console.log(err.message)
        }else{
            rows.forEach((item)=>{
                if(item.constructor == Array){
                    res.status(200).json({
                        message : "Successfully created new record with the id of " + item[0].id
                    })
                }
            })
        }
    })
})


// update student
app.put("/students", (req,res)=>{
    let body = req.body;
    let sql = `SET @id=?; SET @name=?; SET @phoneNumber=?; SET @email=?; SET @password=?;
    CALL addOredit( @id, @name, @phoneNumber,@email, @password);`;
    sqlConnect.query(sql,[body.id,body.name,body.phoneNumber,body.email,body.password], (err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message: "Updated successfully.",
            })
        }else{
            res.status(404).json({
                message: err.message
            })
        }
    })
});

// update a tutor
app.put("/tutors", (req,res)=>{
    let body = req.body;
    let sql = `SET @id=?; SET @name=?; SET @phoneNumber=?; SET @course=?; SET @email=?; SET @password=?;
    CALL tutorEdit( @id, @name, @phoneNumber,@course,@email, @password);`;
    sqlConnect.query(sql,[body.id,body.name,body.phoneNumber,body.course,body.email,body.password], (err,rows,fields)=>{
        if(!err){
            res.status(200).json({
                message: "Updated successfully.",
            })
        }else{
            res.status(404).json({
                message: err.message
            })
        }
    })
});


app.listen(port, ()=>{
    console.log(`Listening to port: ${port}`)
})