const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const ejs = require('ejs');
var mysql = require('mysql');
var app = express();
var db_config = require('../mysql_db_config');
var mysqlConnection = mysql.createConnection(db_config.data_con);
const dotenv = require('dotenv');

const router = express.Router();


const JWT_SECRET = process.env.JWT_SECRET;


router.route('/').post(function(req, res) {
    const { email, password } = req.body;

    const decodedEmail = Buffer.from(email, 'base64').toString('utf-8');
    const decodedPassword = Buffer.from(password, 'base64').toString('utf-8');

    if (!email || !password) {
        return res.status(200).json({
            status: 0,
            msg: 'Internal Server Error...!'
        });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    
    mysqlConnection.query(query, [decodedEmail], function(err, result) {
        if (err) {
            return res.status(200).json({
                status: 0,
                msg: 'Internal Server Error',
                error: err
            });
        }
        
        if (result.length === 0) {
            return res.status(200).json({
                status: 0,
                msg: 'User not found.'
            });
        }

        const user = result[0];
        
        bcrypt.compare(decodedPassword.trim(), user.password.trim(), function(err, isMatch) {
            if (err) {
                return res.status(200).json({
                    status: 0,
                    msg: 'Internal Server Error.',
                    error: err
                });
            }
            

            if (isMatch) {
                const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
                    expiresIn: '1h'
                });

                return res.status(200).json({
                    status: 1,
                    msg: 'Login successful!',
                    token: token ,
                    data: result[0]
                });
            } else {
                return res.status(200).json({
                    status: 0,
                    msg: 'Invalid password.'
                });
            }
        });
    });
});


router.route('/register').post(function (req, res) {
    console.log("req",req);
    
    const { email, password, phoneNumber, role } = req.body;

    const decodedEmail = Buffer.from(email, 'base64').toString('utf-8');
    const decodedPassword = Buffer.from(password, 'base64').toString('utf-8');
    const decodedPhoneNumber = Buffer.from(phoneNumber, 'base64').toString('utf-8');

    if (!decodedEmail || !decodedPassword || !decodedPhoneNumber || !role) {
        return res.status(200).json({
            status: 0,
            msg: 'Missing required fields: email, password, phoneNumber, or role.',
        });
    }

    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';

    mysqlConnection.query(checkUserQuery, [decodedEmail], function (err, result) {
        if (err) {
            return res.status(200).json({
                status: 0,
                msg: 'Internal Server error.',
                error: err,
            });
        }

        if (result.length > 0) {
            return res.status(200).json({
                status: 0,
                msg: 'User already exists.',
            });
        }

        bcrypt.hash(decodedPassword.trim(), 10, function (hashErr, hashedPassword) {
            if (hashErr) {
                return res.status(200).json({
                    status: 0,
                    msg: 'Internal Server Error.',
                    error: hashErr,
                });
            }

            const insertUserQuery =
                'INSERT INTO users (email, password, phone, role, entered_by, entered_date) VALUES (?, ?, ?, ?, ?, now())';

            
            mysqlConnection.query(
                insertUserQuery,
                [decodedEmail, hashedPassword, decodedPhoneNumber, role, decodedEmail],
                function (insertErr, insertResult) {
                    if (insertErr) {
                        return res.status(200).json({
                            status: 0,
                            msg: 'Error inserting user',
                            error: insertErr,
                        });
                    }

                    return res.status(200).json({
                        status: 1,
                        msg: 'User registered succe4ssfully.',
                    });
                }
            );
        });
    });
});

router.route('/fetchBuses').post(function (req, res) {
    console.log("fetchreq",req);
    let id = req.body.id;
    console.log("id",id);
    
    let checkUserQuery = 'SELECT * FROM buses';

    let params = [];

    if (id) {
        checkUserQuery += ' WHERE id = ?';
        params.push(id);
    }
    console.log("checkUserQuery",checkUserQuery);
    
    mysqlConnection.query(checkUserQuery, params, function (err, result) {
        if (err) {
            return res.status(200).json({
                status: 0,
                msg: 'Internal Server error.',
                error: err,
            });
        }

        if (result.length == 0) {
            return res.status(200).json({
                status: 0,
                msg: 'No Buses Found',
            });
        }

        if (result.length > 0) {
            return res.status(200).json({
                status: 1,
                msg: 'Buses Found',
                data: result
            });
        }


    });
});

router.route('/addBuses').post(function (req, res) {
    console.log("req",req);
    const { bus_number, starting_point, ending_point, travel_date, seats_available, price, arrival_time, departure_time } = req.body;

    const checkUserQuery = `
        INSERT INTO buses (bus_number, starting_point, ending_point, travel_date, seats_available, price, arrival_time, departure_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [bus_number, starting_point, ending_point, travel_date, seats_available, price, arrival_time, departure_time];


    mysqlConnection.query(checkUserQuery, values, function (err, result) {
        if (err) {
            return res.status(200).json({
                status: 0,
                msg: 'Internal Server error.',
                error: err,
            });
        }


        if (result) {
            return res.status(200).json({
                status: 1,
                msg: 'Bus Added Successfully',
                busId: result.insertId
            });
        }


    });
});

router.route('/editBuses').post(function (req, res) {
    const { id, bus_number, starting_point, ending_point, travel_date, seats_available, price, arrival_time, departure_time } = req.body;

    if (!id) {
        return res.status(200).json({
            status: 0,
            msg: 'Bus ID is required for updating',
        });
    }

    const updateBusQuery = `
        UPDATE buses
        SET 
            bus_number = ?, 
            starting_point = ?, 
            ending_point = ?, 
            travel_date = ?, 
            seats_available = ?, 
            price = ?, 
            arrival_time = ?, 
            departure_time = ?
        WHERE id = ?
    `;
    console.log("updateBusQuery",updateBusQuery);
    
    const values = [bus_number, starting_point, ending_point, travel_date, seats_available, price, arrival_time, departure_time, id];

    mysqlConnection.query(updateBusQuery, values, function (err, result) {
        if (err) {
            return res.status(500).json({
                status: 0,
                msg: 'Internal Server Error',
                error: err,
            });
        }

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 1,
                msg: 'Bus Details updated successfully',
            });
        } else {
            return res.status(200).json({
                status: 0,
                msg: 'No bus found with the given ID',
            });
        }
    });
});




module.exports = router;

