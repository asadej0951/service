const express = require('express')
const app = express()
var http = require('http')

const bodyparser = require("body-parser")
const bodyParser = require("body-parser")
const jwt = require("jwt-simple")
const SECRET = "MY_SECRET_KEY"

var server = http.createServer(app)
server.listen(4000);
console.log('server listening port 4000...')
app.use('/imageregister',express.static(__dirname + "/imageregister"));
app.use('/imageStadium',express.static(__dirname + "/imageStadium"));
//เรียกใช้ db.js
const db = require('./db.js')
var fs = require('fs');

app.use(bodyparser.json({
    limit:'50mb',
    extended : true
}));
app.use(bodyparser.urlencoded({
    limit:'50mb',
    extended : true
}));

//POST LOGIN Data
app.post('/login', function (req, res) {
    //รับค่า
    let u_user = req.body.u_user
    let u_pass = req.body.u_pass
    let u_status = req.body.u_status
    
    if(u_user&&u_pass&&u_status){

    let sql = 'SELECT * FROM user_tb WHERE u_user = ? AND u_pass=? AND u_status = ?'
    db.query(sql, [u_user,u_pass,u_status], (err, results, fields) => {
        if (results.length > 0) {
                
            res.status(200).json(results)
        } else {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        }
        res.end()
    })
    }
})
//Select image user
app.get('/imageUser/:id', function (req, res) {
    let id = req.params.id
    let sql = 'select * from image_user WHERE u_id =?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})
app.get('/imageOPT/:id', function (req, res) {
    let id = req.params.id
    let sql = 'select * from image_opt WHERE o_id =?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})

app.post('/loginOPT', function (req, res) {
    //รับค่า
    let o_user = req.body.o_user
    let o_pass = req.body.o_pass
    let Status = req.body.o_status
    
    if(o_user&&o_pass&&Status){

    let sql = 'SELECT * FROM operator_tb WHERE o_user = ? AND o_pass=? AND o_status = ?'
    db.query(sql, [o_user,o_pass,Status], (err, results, fields) => {
        if (results.length > 0) {
                
            res.status(200).json(results)
        } else {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        }
        res.end()
    })
    }
})


app.post('/Check', (req, res) => {

    let user_id = req.body.user_id
    let ac_id = req.body.ac_id


    if (user_id) {
        let sql = 'SELECT * FROM tb_join WHERE user_id = ? AND ac_id = ?'
        db.query(sql, [user_id,ac_id], function (error, results, fields) {

            if (results.length > 0) {
                res.status(200).json(results)
            } else {
                res.status(500).json({ "status": 500, "message": "Internal Server Error." })
            }
            res.end()
        }
        )
    } else {
        res.send('Please enter Username and passsword')
        res.end()
    }
})

//GET DATA ALL
app.get('/', function (req, res) {
    let sql = 'select * from user_tb'
    db.query(sql, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})

app.get('/activity', function (req, res) {
    
    let sql = 'SELECT tn.*,(select ti.u_img from image_user ti where ti.u_id = tn.user_id LIMIT 1) as u_img FROM activity_tb tn WHERE ac_number != ac_numberjoin ORDER BY ac_id DESC'

    db.query(sql, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})
app.get('/Post', function (req, res) {
    let sql = 'select * from tb_post ORDER BY p_id DESC'
    db.query(sql, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})

app.get('/selectActivity/:id', function (req, res) {
    let id = req.params.id
    let sql = 'SELECT tn.*,(select ti.u_img from image_user ti where ti.u_id = tn.user_id LIMIT 1) as u_img FROM activity_tb tn WHERE  ac_type = ? AND ac_number != ac_numberjoin ORDER BY ac_id DESC '
    db.query(sql,[id], (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})

app.post('/activityuser',function(req,res){
    let user_id = req.body.user_id
    if(user_id){
        let sql = 'SELECT tn.*,(select ti.u_img from image_user ti where ti.u_id = tn.user_id LIMIT 1) as u_img FROM activity_tb tn WHERE user_id = ? ORDER BY ac_id DESC'

    
        db.query(sql, [user_id], function (error, results, fields) {

            if (results.length > 0) {
                res.status(200).json(results)
            } else {
                res.status(500).json({ "status": 500, "message": "Internal Server Error." })
            }
            res.end()
        }
        )
    }
    else {
        res.send('Please enter Username and passsword')
        res.end()
    }
})
//Comment
app.post('/getComment',function(req,res){
    let p_id = req.body.p_id
    if(p_id){
        let sql = 'SELECT * FROM tb_comment WHERE p_id = ? ORDER BY com_id DESC'
        db.query(sql,[p_id], function (error, results, fields) {

            if (results.length > 0) {
                res.status(200).json(results)
            } else {
                res.status(500).json({ "status": 500, "message": "Internal Server Error." })
            }
            res.end()
        }
        )
    }
    else {
        res.send('Please enter Username and passsword')
        res.end()
    }
})
app.post('/getPostProfile',function(req,res){
    let user_id = req.body.user_id
    let user_status = req.body.user_status
    if(user_id&&user_status){
        let sql = 'SELECT * FROM tb_post WHERE user_id = ? AND user_status =?'
        db.query(sql,[user_id,user_status], function (error, results, fields) {

            if (results.length > 0) {
                res.status(200).json(results)
            } else {
                res.status(500).json({ "status": 500, "message": "Internal Server Error." })
            }
            res.end()
        }
        )
    }
    else {
        res.send('Please enter Username and passsword')
        res.end()
    }
})
//checkStadium
app.post('/getcheckStadiumOPT',function(req,res){
    let o_id = req.body.o_id
    if(o_id){
        let sql = 'SELECT tn.*,(select ti.u_img from image_user ti where ti.u_id = tn.u_id LIMIT 1) as img FROM tb_reserve tn WHERE tn.o_id = ? ORDER BY r_status ASC'
        db.query(sql,[o_id], function (error, results, fields) {

            if (results.length > 0) {
                res.status(200).json(results)
            } else {
                res.status(500).json({ "status": 500, "message": "Internal Server Error." })
            }
            res.end()
        }
        )
    }
    else {
        res.send('Please enter Username and passsword')
        res.end()
    }
})
app.post('/getcheckTimeStadium',function(req,res){
    let s_id = req.body.s_id
    let r_Date = req.body.r_Date
    let r_status = req.body.r_status
    if(s_id&&r_Date&&r_status){
        let sql = 'SELECT * FROM tb_reserve WHERE s_id = ? AND r_Date = ? AND r_status =?'
        db.query(sql,[s_id,r_Date,r_status], function (error, results, fields) {

            if (results.length > 0) {
                res.status(200).json(results)
            } else {
                res.status(500).json({ "status": 500, "message": "Internal Server Error." })
            }
            res.end()
        }
        )
    }
    else {
        res.send('Please enter Username and passsword')
        res.end()
    }
})
app.delete('/deleteJoinStadium/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let sql = 'DELETE from tb_reserve WHERE r_id = ?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": "delete success!!" })
        }
    })
})
app.delete('/deleteJoinStadium_sID/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let sql = 'DELETE from tb_reserve WHERE s_id = ?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": "delete success!!" })
        }
    })
})

app.delete('/deleteStadium/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let sql = 'DELETE from tb_stadium WHERE s_id = ?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": "delete success!!" })
        }
    })
})
app.get('/ManageStadium/:id', function (req, res) {
    let id = req.params.id
    let sql = 'SELECT tn.*,(select ti.s_img from image_stadium ti where ti.s_id = tn.s_id LIMIT 1) as Simg,(select ti.o_img from image_opt ti where ti.o_id = tn.o_id LIMIT 1) as img FROM tb_stadium tn WHERE tn.o_id = ?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})

app.get('/jn', function (req, res) {
    let sql = 'select * from tb_join'
    db.query(sql, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})

//GET DATA BY ID
app.get('/operator/:id', function (req, res) {
    let id = req.params.id
    let sql = 'SELECT tn.*,(select ti.o_img from image_opt ti where ti.o_id = tn.o_id LIMIT 1) as img FROM operator_tb tn WHERE tn.o_id = ?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})
app.get('/User/:id', function (req, res) {
    let id = req.params.id
    let sql = 'SELECT tn.*,(select ti.u_img from image_user ti where ti.u_id = tn.u_id LIMIT 1) as img FROM user_tb tn WHERE tn.u_id = ?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})

//POST DATA
app.post('/registeruser',function(req,res){
   
    let user_tb = {
        "u_user" : req.body.u_user,
        "u_pass"  : req.body.u_pass,
        "u_name"   : req.body.u_name,
        "u_lname" : req.body.u_lname,
        "u_tel" : req.body.u_tel,
        "u_email" : req.body.u_email,
        "u_status" : req.body.u_status 
    }
   
    let sql = 'INSERT INTO user_tb SET ?'
  
    db.query(sql,user_tb,(err,results,fields)=>{

        if(err){
            let u_id = {

            "u_id":results[0].u_id

            }
            console.log (results)
            res.status(500).json({"status":500,"message":"Internal Server Error."})
            res.status(200).json({"status":200,"u_id":u_id,"message":user_tb})

        }else{
            db.query("select nt.u_id from user_tb nt order by nt.u_id desc limit 1", function (err, result, fields) {
                if (err) throw err;
                console.log(result[0].u_id);
                res.status(200).json({"status":200,"u_id": result[0].u_id, "message":user_tb})
            });

        }
    })
})
//POST Image
app.all('/uploadimageUser', async (req, res) => {
    let get = req.query;
    let post = req.body;
    let params = Object.assign(get, post);


    //let conf = database.get('default');
    
    console.log('setImg');
    
    var data = params.data;
    
    var return_value = []
    console.log(data.length);
//var result = [];
    //เช็คว่ามีข้อมูลส่งมาไหม
  if(data.length > 0){
        for (let i=0; i<data.length; ++i) {
            let v = data[i];
            // console.log(v.notic_id);
            // ข้อมูลที่เราส่งมากจาก body ในแอนดรอย
           // var notic_id = v.notic_id;
            var name = v.u_img; // เอา v.name ไปใช้ insert ลง database
            var base64Data = v.img;
            let base64Image = base64Data.split(';base64,').pop();
    //var path_img = 'img/';
    
            //กำหนด path ที่จะเก็บรูปไว้ในไหนของเครื่อง **แก้ไขได้
            var path_img = 'D:/service/imageregister/'
  
            //แปลง base64 เป็น รูป ** ไม่ต้องแก้
            fs.writeFile(path_img + name, base64Image, {encoding: 'base64'}, function(err) {
                if(err != 'null' && err != null){
                    console.log('setImg: error ' + err);
                }
    });
    // Insert ลง db
    let image_user = {
         "u_id" :v.u_id,
         "u_img" : v.u_img

    }
    let sql = 'INSERT INTO image_user SET ?'
    db.query(sql,image_user,(err,results,fields)=>{
        console.log('inserted data')

    })

  }

        //ส่งค่ากลับว่าอัพโหลดเสร็จ
  return_value.push({'isSuccessful': true, 'message': "Successfully! uploaded"});

    }else{
        return_value.push({'isSuccessful': false});
}

res.json(return_value[0]); 

})

app.all('/uploadimageOPT', async (req, res) => {
    let get = req.query;
    let post = req.body;
    let params = Object.assign(get, post);


    //let conf = database.get('default');
    
    console.log('setImg');
    
    var dataOPT = params.dataOPT;
    
    var return_value = []
    console.log(dataOPT.length);
//var result = [];
    //เช็คว่ามีข้อมูลส่งมาไหม
  if(dataOPT.length > 0){
        for (let i=0; i<dataOPT.length; ++i) {
            let v = dataOPT[i];
            // console.log(v.notic_id);
            // ข้อมูลที่เราส่งมากจาก body ในแอนดรอย
           // var notic_id = v.notic_id;
            var name = v.o_img; // เอา v.name ไปใช้ insert ลง database
            var base64Data = v.img;
            let base64Image = base64Data.split(';base64,').pop();
    //var path_img = 'img/';
    
            //กำหนด path ที่จะเก็บรูปไว้ในไหนของเครื่อง **แก้ไขได้
            var path_img = 'D:/service/imageregister/'
  
            //แปลง base64 เป็น รูป ** ไม่ต้องแก้
            fs.writeFile(path_img + name, base64Image, {encoding: 'base64'}, function(err) {
                if(err != 'null' && err != null){
                    console.log('setImg: error ' + err);
                }
    });
    // Insert ลง db
    let image_user = {
         "o_id" :v.o_id,
         "o_img" : v.o_img

    }
    let sql = 'INSERT INTO image_opt SET ?'
    db.query(sql,image_user,(err,results,fields)=>{
        console.log('inserted data')

    })

  }

        //ส่งค่ากลับว่าอัพโหลดเสร็จ
  return_value.push({'isSuccessful': true, 'message': "Successfully! uploaded"});

    }else{
        return_value.push({'isSuccessful': false});
}

res.json(return_value[0]); 

})
app.all('/uploadimageStadium', async (req, res) => {
    let get = req.query;
    let post = req.body;
    let params = Object.assign(get, post);


    //let conf = database.get('default');
    
    console.log('setImg');
    
    var dataStadium = params.dataStadium;

    
    var return_value = []
    console.log(dataStadium.length);
//var result = [];
    //เช็คว่ามีข้อมูลส่งมาไหม
  if(dataStadium.length > 0){
        for (let i=0; i<dataStadium.length; ++i) {
            let v = dataStadium[i];
            // console.log(v.notic_id);
            // ข้อมูลที่เราส่งมากจาก body ในแอนดรอย
           // var notic_id = v.notic_id;
            var name = v.s_img; // เอา v.name ไปใช้ insert ลง database
            var base64Data = v.img;
            let base64Image = base64Data.split(';base64,').pop();
    //var path_img = 'img/';
    
            //กำหนด path ที่จะเก็บรูปไว้ในไหนของเครื่อง **แก้ไขได้
            var path_img = 'D:/service/imageStadium/'
  
            //แปลง base64 เป็น รูป ** ไม่ต้องแก้
            fs.writeFile(path_img + name, base64Image, {encoding: 'base64'}, function(err) {
                if(err != 'null' && err != null){
                    console.log('setImg: error ' + err);
                }
    });
    // Insert ลง db
    let image_user = {
         "s_id" :v.s_id,
         "s_img" : v.s_img

    }
    let sql = 'INSERT INTO image_stadium SET ?'
    db.query(sql,image_user,(err,results,fields)=>{
        console.log('inserted data')

    })

  }

        //ส่งค่ากลับว่าอัพโหลดเสร็จ
  return_value.push({'isSuccessful': true, 'message': "Successfully! uploaded"});

    }else{
        return_value.push({'isSuccessful': false});
}

res.json(return_value[0]); 

})

app.post('/operator', function (req, res) {
    //รับค่า
    let members = {
        "o_user": req.body.o_user,
        "o_pass": req.body.o_pass,
        "o_name": req.body.o_name,
        "o_lname": req.body.o_lname,
        "o_email": req.body.o_email,
        "o_tel": req.body.o_tel,
        "o_Sname":req.body.o_Sname,
        "o_address":req.body.o_address,
        "o_status":req.body.o_status
    }
    let sql = 'INSERT INTO operator_tb SET ?'
  
    db.query(sql,members,(err,results,fields)=>{

        if(err){
            let o_id = {

            "o_id":results[0].o_id

            }
            console.log (results)
            res.status(500).json({"status":500,"message":"Internal Server Error."})
            res.status(200).json({"status":200,"u_id":o_id,"message":members})

        }else{
            db.query("select nt.o_id from operator_tb nt order by nt.o_id desc limit 1", function (err, result, fields) {
                if (err) throw err;
                console.log(result[0].o_id);
                res.status(200).json({"status":200,"o_id": result[0].o_id, "message":members})
            });

        }
    })
})

app.post('/Stadium', function (req, res) {
    //รับค่า
    let Stadium = {
        "s_name":req.body.s_name,
        "s_lat":req.body.s_lat,
        "s_long":req.body.s_long,
        "s_address":req.body.s_address,
        "s_type":req.body.s_type,
        "s_price":req.body.s_price,
        "s_timeopen":req.body.s_timeopen,
        "s_timeclose":req.body.s_timeclose,
        "o_id":req.body.o_id,
        "o_user":req.body.o_user
    }
    let sql = 'INSERT INTO tb_stadium SET ?'
    db.query(sql,Stadium,(err,results,fields)=>{

        if(err){
            let s_id = {

            "s_id":results[0].s_id

            }
            console.log (results)
            res.status(500).json({"status":500,"message":"Internal Server Error."})
            res.status(200).json({"status":200,"u_id":s_id,"message":Stadium})

        }else{
            db.query("select nt.s_id from tb_stadium nt order by nt.s_id desc limit 1", function (err, result, fields) {
                if (err) throw err;
                console.log(result[0].s_id);
                res.status(200).json({"status":200,"s_id": result[0].s_id, "message":Stadium})
            });

        }
    })
})
app.post('/JoinStadium', function (req, res) {
    //รับค่า
    let Stadium = {
        "u_id":req.body.u_id,
        "s_id":req.body.s_id,
        "o_id":req.body.o_id,
        "u_name":req.body.u_name,
        "s_name":req.body.s_name,
        "r_timein":req.body.r_timein,
        "r_timeout":req.body.r_timeout,
        "r_Date":req.body.r_Date,
        "u_phone":req.body.u_phone,
        "u_price":req.body.u_price,
        "r_type":req.body.r_type,
        "r_status":req.body.r_status
    }
    let sql = 'INSERT INTO tb_reserve SET ?'
    db.query(sql, Stadium, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": Stadium})
        }
    })
})

app.get('/ShowStadium', function (req, res) {
    let sql = 'SELECT tn.*,(select ti.s_img from image_stadium ti where ti.s_id = tn.s_id LIMIT 1) as Simg ,(select ti.o_img from image_opt ti where ti.o_id = tn.o_id LIMIT 1) as img FROM tb_stadium tn ORDER BY s_id DESC'
    db.query(sql, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})

app.get('/showJoinActivity/:id', function (req, res) {
    let id = req.params.id
    let sql = 'SELECT tn.*,(select ti.ac_name from activity_tb ti where ti.ac_id = tn.ac_id LIMIT 1) as name_activity ,(select ti.user_name from activity_tb ti where ti.ac_id = tn.ac_id LIMIT 1) as name_user,(select ti.ac_type from activity_tb ti where ti.ac_id = tn.ac_id LIMIT 1) as type_activity FROM tb_join tn WHERE tn.user_id = ? ORDER BY j_id DESC'
    db.query(sql,id,(err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})

//get Image
app.get('/showimageStadium/:id', function (req, res) {
    let id = req.params.id
    let sql = 'select * from image_stadium WHERE s_id =?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})
app.get('/ShowJoinStadium', function (req, res) {
    let sql = 'select * from tb_reserve ORDER BY s_id DESC'
    db.query(sql, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})


app.post('/Post', function (req, res) {
    //รับค่า
    let Post = {
        "user_id": req.body.user_id,
        "username":req.body.username,
        "u_img":req.body.u_img,
        "p_message": req.body.p_message,
        "p_time":req.body.p_time,
        "user_status":req.body.user_status
    }
    let sql = 'INSERT INTO tb_post SET ?'
    db.query(sql, Post, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": Post})
        }
    })
})
app.post('/Comment', function (req, res) {
    //รับค่า
    let Post = {
        "user_id": req.body.user_id,
        "p_id":req.body.p_id,
        "com_message": req.body.com_message,
        "username":req.body.username,
        "img":req.body.img,
        "com_time":req.body.com_time
    }
    let sql = 'INSERT INTO tb_comment SET ?'
    db.query(sql, Post, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": Post})
        }
    })
})

app.get('/getDataActivity/:id', function (req, res) {
    let id = req.params.id
    let sql = 'select * from activity_tb WHERE ac_id =?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})

app.get('/getMessageChat/:id', function (req, res) {
    let id = req.params.id
    let sql = 'SELECT tn.*,(select ti.u_lname from user_tb ti where ti.u_id = tn.u_id LIMIT 1) as lnameUser ,(select ti.u_img from image_user ti where ti.u_id = tn.u_id LIMIT 1) as img,(select ti.u_name from user_tb ti where ti.u_id = tn.u_id LIMIT 1) as nameUser FROM chat_tb tn WHERE tn.ac_id = ? ORDER BY chat_id DESC'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.json(results)
        }
    })
})



app.post('/Chat', function (req, res) {
    //รับค่า
    let Chat = {
        "ac_id":req.body.ac_id,
        "u_id":req.body.u_id,
        "message": req.body.message,
        "time": req.body.time
    }
    let sql = 'INSERT INTO chat_tb SET ?'
    db.query(sql, Chat, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": Chat})
        }
    })
})

app.put('/updateDataCommentImage/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let img = req.body.img
       
    console.log("commnet")
    console.log(img)
    let sql = 'UPDATE tb_comment SET img = ? WHERE user_id = ?'
    db.query(sql, [img, id], (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": img })
        }
    })
})


app.post('/activity', function (req, res) {
    //รับค่า
    let activity = {
        "user_id": req.body.user_id,
        "ac_name": req.body.ac_name,
        "ac_type": req.body.ac_type,
        "ac_time": req.body.ac_time,
        "ac_number": req.body.ac_number,
        "ac_numberjoin": req.body.ac_numberjoin,
        "ac_lat": req.body.ac_lat,
        "ac_long": req.body.ac_long,
        "user_name":req.body.user_name

    }
    let sql = 'INSERT INTO activity_tb SET ?'
    db.query(sql, activity, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": activity })
        }
    })
})

app.post('/jn', function (req, res) {
    //รับค่า
    let activity = {
        "user_id": req.body.user_id,
        "ac_id": req.body.ac_id,
        "j_status": req.body.j_status
    }
    let sql = 'INSERT INTO tb_join SET ?'
    db.query(sql, activity, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": activity })
        }
    })
})

//DELETE DATA
app.delete('/deleteactivity/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let sql = 'DELETE from activity_tb WHERE ac_id = ?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": "delete success!!" })
        }
    })
})

app.delete('/deletePost/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let sql = 'DELETE from tb_post WHERE p_id = ?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": "delete success!!" })
        }
    })
})


app.delete('/deleteComment/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let sql = 'DELETE from tb_comment WHERE p_id = ?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": "delete success!!" })
        }
    })
})
app.delete('/deleteUser/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let sql = 'DELETE from user_tb WHERE u_id = ?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": "delete success!!" })
        }
    })
})
app.delete('/deleteOPT/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let sql = 'DELETE from operator_tb WHERE o_id = ?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": "delete success!!" })
        }
    })
})


app.post('/deleteJoin', function (req, res) {
    //รับค่า
    let user_id = req.body.user_id
    let ac_id = req.body.ac_id
    if(user_id&&ac_id){
        let sql = 'DELETE from tb_join WHERE user_id = ? AND ac_id = ?'
        db.query(sql,[user_id,ac_id], function (error, results, fields) {
            if (error) {
                res.status(500).json({ "status": 500, "message": "Internal Server Error." })
            } else {
                res.status(200).json({ "status": 200, "message": "delete success!!" })
            }
            res.end()
        }
        )
    }
    else {
        res.send('Please enter Username and passsword')
        res.end()
    }
})

//UPDATE DATA
app.put('/updateuser/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let members = {
        "u_user": req.body.u_user,
        "u_pass": req.body.u_pass,
        "u_name": req.body.u_name,
        "u_lname": req.body.u_lname,
        "u_tel": req.body.u_tel,
        "u_email": req.body.u_email,
        "u_status":req.body.u_status
    }
    let sql = 'UPDATE user_tb SET ? WHERE u_id = ?'
    db.query(sql, [members, id], (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": members })
        }
    })
})

app.put('/updateOPT/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let members = {
        "o_user": req.body.o_user,
        "o_pass": req.body.o_pass,
        "o_name": req.body.o_name,
        "o_lname": req.body.o_lname,
        "o_email": req.body.o_email,
        "o_tel": req.body.o_tel,
        "o_Sname":req.body.o_Sname,
        "o_address":req.body.o_address,
        "o_status":req.body.o_status
    }
    let sql = 'UPDATE operator_tb SET ? WHERE o_id = ?'
    db.query(sql, [members, id], (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": members })
        }
    })
})
//UPDATE IMAGE
app.all('/UpdateimageOPT/:id', async (req, res) => {
    let get = req.query;
    let put = req.body;
    let params = Object.assign(get, put);


    //let conf = database.get('default');
    
    console.log('setImg');
    
    var dataOPT = params.dataOPT;
    
    var return_value = []
    console.log(dataOPT.length);
//var result = [];
    //เช็คว่ามีข้อมูลส่งมาไหม
  if(dataOPT.length > 0){
        for (let i=0; i<dataOPT.length; ++i) {
            let v = dataOPT[i];
            // console.log(v.notic_id);
            // ข้อมูลที่เราส่งมากจาก body ในแอนดรอย
           // var notic_id = v.notic_id;
            var name = v.o_img; // เอา v.name ไปใช้ insert ลง database
            var base64Data = v.img;
            let base64Image = base64Data.split(';base64,').pop();
    //var path_img = 'img/';
    
            //กำหนด path ที่จะเก็บรูปไว้ในไหนของเครื่อง **แก้ไขได้
            var path_img = 'D:/service/imageregister/'
  
            //แปลง base64 เป็น รูป ** ไม่ต้องแก้
            fs.writeFile(path_img + name, base64Image, {encoding: 'base64'}, function(err) {
                if(err != 'null' && err != null){
                    console.log('setImg: error ' + err);
                }
    });
    // Insert ลง db
    let id = req.params.id
    let image_user = {
         "o_id" :v.o_id,
         "o_img" : v.o_img

    }
    let sql = 'UPDATE image_opt SET ? WHERE imgO_id = ?'
    db.query(sql,[image_user,id],(err,results,fields)=>{
        if (err) {
            console.log('Internal Server Error')
        } else {
            console.log('inserted data')
        }
    })

  }

        //ส่งค่ากลับว่าอัพโหลดเสร็จ
  return_value.push({'isSuccessful': true, 'message': "Successfully! uploaded"});

    }else{
        return_value.push({'isSuccessful': false});
}

res.json(return_value[0]); 

})

app.all('/UpdateimageUser/:id', async (req, res) => {
    let get = req.query;
    let put = req.body;
    let params = Object.assign(get, put);


    //let conf = database.get('default');
    
    console.log('setImg');
    
    var data = params.data;
    
    var return_value = []
    console.log(data.length);
//var result = [];
    //เช็คว่ามีข้อมูลส่งมาไหม
  if(data.length > 0){
        for (let i=0; i<data.length; ++i) {
            let v = data[i];
            // console.log(v.notic_id);
            // ข้อมูลที่เราส่งมากจาก body ในแอนดรอย
           // var notic_id = v.notic_id;
            var name = v.u_img; // เอา v.name ไปใช้ insert ลง database
            var base64Data = v.img;
            let base64Image = base64Data.split(';base64,').pop();
    //var path_img = 'img/';
    
            //กำหนด path ที่จะเก็บรูปไว้ในไหนของเครื่อง **แก้ไขได้
            var path_img = 'D:/service/imageregister/'
  
            //แปลง base64 เป็น รูป ** ไม่ต้องแก้
            fs.writeFile(path_img + name, base64Image, {encoding: 'base64'}, function(err) {
                if(err != 'null' && err != null){
                    console.log('setImg: error ' + err);
                }
    });
    // Insert ลง db
    let id = req.params.id
    let image_user = {
         "u_id" :v.u_id,
         "u_img" : v.u_img

    }
    let sql = 'UPDATE image_user SET ? WHERE imgU_id = ?'
    db.query(sql,[image_user,id],(err,results,fields)=>{
        if (err) {
            console.log('Internal Server Error')
        } else {
            console.log('inserted data')
        }
    })

  }

        //ส่งค่ากลับว่าอัพโหลดเสร็จ
  return_value.push({'isSuccessful': true, 'message': "Successfully! uploaded"});

    }else{
        return_value.push({'isSuccessful': false});
}

res.json(return_value[0]); 

})

app.put('/updateDataActivity/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let members = {
        "user_id": req.body.user_id,
        "ac_name": req.body.ac_name,
        "ac_type": req.body.ac_type,
        "ac_time": req.body.ac_time,
        "ac_number": req.body.ac_number,
        "ac_numberjoin": req.body.ac_numberjoin,
        "ac_lat": req.body.ac_lat,
        "ac_long": req.body.ac_long,
        "user_name":req.body.user_name
    }
    let sql = 'UPDATE activity_tb SET ? WHERE ac_id = ?'
    db.query(sql, [members, id], (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": members })
        }
    })
})

app.put('/updateDataPost/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let Post = {
        "user_id": req.body.user_id,
        "username":req.body.username,
        "u_img":req.body.u_img,
        "p_message": req.body.p_message,
        "p_time":req.body.p_time,
        "user_status":req.body.user_status
    }
    let sql = 'UPDATE tb_post SET ? WHERE p_id = ?'
    db.query(sql, [Post, id], (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": Post })
        }
    })
})

//UPDATE tb_post SET u_img = 'images-2.jpg' WHERE user_id = 74

app.put('/updateDataPostImage/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let u_img = req.body.u_img
       
    console.log(u_img)
    let sql = 'UPDATE tb_post SET u_img = ? WHERE user_id = ?'
    db.query(sql, [u_img, id], (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": u_img })
        }
    })
})

app.put('/updateactivity/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let ac = {
        "user_id": req.body.user_id,
        "ac_name": req.body.ac_name,
        "ac_type": req.body.ac_type,
        "ac_time": req.body.ac_time,
        "ac_number": req.body.ac_number,
        "ac_numberjoin": req.body.ac_numberjoin,
        "ac_lat": req.body.ac_lat,
        "ac_long": req.body.ac_long
    }
    let sql = 'UPDATE activity_tb SET ? WHERE ac_id = ?'
    db.query(sql, [ac, id], (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": ac })
        }
    })
})

app.put('/updatelogoutactivity/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let ac_numberjoing = req.body.ac_numberjoing
    
    let sql = 'UPDATE activity_tb SET ac_numberjoing =  ? WHERE ac_id = ?'
    db.query(sql, [ac_numberjoing, id], (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": ac_numberjoing })
        }
    })
})

app.put('/updateStatusJoinStadium/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let ac = {
        "u_id":req.body.u_id,
        "s_id":req.body.s_id,
        "o_id":req.body.o_id,
        "u_name":req.body.u_name,
        "s_name":req.body.s_name,
        "r_timein":req.body.r_timein,
        "r_timeout":req.body.r_timeout,
        "r_Date":req.body.r_Date,
        "u_phone":req.body.u_phone,
        "u_price":req.body.u_price,
        "r_type":req.body.r_type,
        "r_status":req.body.r_status
    }
    let sql = 'UPDATE tb_reserve SET ? WHERE r_id = ?'
    db.query(sql, [ac, id], (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": ac })
        }
    })
})
//Check Status JoinStadium
app.post('/getcheckStatusJoinStadium',function(req,res){
    let u_id = req.body.u_id
    if(u_id){
        let sql = 'SELECT * FROM tb_reserve WHERE u_id = ? ORDER BY r_id DESC'
        db.query(sql,[u_id], function (error, results, fields) {

            if (results.length > 0) {
                res.status(200).json(results)
            } else {
                res.status(500).json({ "status": 500, "message": "Internal Server Error." })
            }
            res.end()
        }
        )
    }
    else {
        res.send('Please enter Username and passsword')
        res.end()
    }
})
app.put('/UpdateDataStadium/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let tb_stadium = {
        "s_name":req.body.s_name,
        "s_lat":req.body.s_lat,
        "s_long":req.body.s_long,
        "s_address":req.body.s_address,
        "s_type":req.body.s_type,
        "s_price":req.body.s_price,
        "s_timeopen":req.body.s_timeopen,
        "s_timeclose":req.body.s_timeclose,
        "o_id":req.body.o_id,
        "o_user":req.body.o_user
    }
    console.log(tb_stadium)
       
    let sql = 'UPDATE tb_stadium SET ? WHERE s_id = ?'
    db.query(sql, [tb_stadium, id], (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": tb_stadium })
        }
    })
})

app.post('/notification', function (req, res) {
    //รับค่า
    let notification = {
        "u_id": req.body.u_id,
        "subject":req.body.subject,
        "message":req.body.message
    }
    let sql = 'INSERT INTO notification SET ?'
    db.query(sql, notification, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": notification})
        }
    })
})
app.get('/Checknotification/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    
    if(id){

    let sql = 'SELECT * FROM notification WHERE u_id = ?'
    db.query(sql, [id], (err, results, fields) => {
        if (results.length > 0) {
                
            res.status(200).json(results)
        } else {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        }
        res.end()
    })
    }
})
app.delete('/deletenotification/:id', function (req, res) {
    //รับค่า
    let id = req.params.id
    let sql = 'DELETE from notification WHERE nft_id = ?'
    db.query(sql, id, (err, results, fields) => {
        if (err) {
            res.status(500).json({ "status": 500, "message": "Internal Server Error." })
        } else {
            res.status(200).json({ "status": 200, "message": "delete success!!" })
        }
    })
})




//Admin

app.get('/getUser',function(req,res){

        let sql = 'SELECT tn.*,(select ti.u_img from image_user ti where ti.u_id = tn.u_id LIMIT 1) as img FROM user_tb tn ORDER BY u_id ASC'
        db.query(sql, function (error, results, fields) {

            if (results.length > 0) {
                res.status(200).json(results)
            } else {
                res.status(500).json({ "status": 500, "message": "Internal Server Error." })
            }
            res.end()
        }
        )
    
})
app.get('/getOPT',function(req,res){
        let sql = 'SELECT tn.*,(select ti.o_img from image_opt ti where ti.o_id = tn.o_id LIMIT 1) as img FROM operator_tb tn ORDER BY o_id ASC'
        db.query(sql, function (error, results, fields) {

            if (results.length > 0) {
                res.status(200).json(results)
            } else {
                res.status(500).json({ "status": 500, "message": "Internal Server Error." })
            }
            res.end()
        }
        )
})
