var express = require('express');
var bodyParser = require('body-parser');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var mysql = require('mysql');
var app = express();
var db_config = require('./mysql_db_config.js');
var mysqlConnection = mysql.createConnection(db_config.data_con);
const dotenv = require('dotenv');

dotenv.config();
// user api log insert
const api_log_insert = function(req, res, next){
    try{
        var header_data = req.headers;
        console.log(header_data);
            if(!header_data.user_id || !header_data.session_id){
                res.status(200).json({
                    status:1,
                    msg: `Empty Session id or User id`
                })
            }
            else{
                if(header_data.user_id == 0 && header_data.session_id == 'null'){
                    next();
                }
                else{
                    let user_val_query = `select * from login_log where user_id = '${req.headers.user_id}' and status = 'A' and session_id = '${req.headers.session_id}'`;
                    let log_query = `Insert into api_log set url='${req.headers.url}', user_id='${req.headers.user_id}', platform='${req.headers.platform}', data='${req.body}'`;

                    mysqlConnection.query(user_val_query, function(err, docs){
                        if(err){
                                console.log(err);
                            res.status(200).json({
                                status: 0,
                                msg : 'Error while inserting log...!'
                            })
                        }
                        else{
                        if(docs == undefined || docs.length < 1){
                            res.status(200).json({
                                status: 3,
                                msg : 'Invalid user accessing api call...!'
                            })
                        }

                        }
                    })
                }
            }

    }
    catch(e){
        console.log(e);
        res.status(200).json({
            status: 0,
            msg: 'Error in validation',
            err: e
        })
    }
}



var PORT = 7000;
const cors = require('cors');
const mysql_db_config = require('./mysql_db_config.js');
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json()); 

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.charset = 'utf-8';
    next();
});
const JWT_SECRET = process.env.JWT_SECRET 

app.use(bodyParser.urlencoded({"limit":'50mb',"extended" : true, parameterLimit:1000000}));
app.use(bodyParser.json({limit:'50mb'}));

var login = require('./login/login_api.js');
// var shellBIWSCPT = require('./Dashboard/fetchActualSales.js');

app.use('/api/login',login)
// app.use('/shellBIWSCPT',shellBIWSCPT)


var server = app.listen(PORT, function () {
    console.log('Node js server is running on PORT: ', PORT);
});
