const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');


Router.post('/sign-up', (req, res, next) => {

    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >=1){
            res.status(409).json({
                Message: "User already exists"
            })
        }
        else{

            bcrypt.hash(req.body.password, 10, (err, hash) => {

                if(err){
                    res.status(500).json({
                        Error: "Error whilst hasting"+req.body.email+ " pass" + req.body.password
                    });
                }
                else{
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
        
                    user
                    .save()
                    .then( result => {
                        console.log(result);
                        res.status(200).json({
                            Message: "Saved User"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            Error: err,
                            Message:"Not Saved"
                        })
                    });
                }
        
        
           });

        }
    })
    .catch();


});

Router.post('/login',(req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {

        if(user.length < 1){

          return  res.status(401).json({
                "Auth": "Auth Failed"
            });
        }
        bcrypt.hash(req.body.email,user[0].password, (err, result)=>{
            if(err){

                return  res.status(401).json({
                    "Auth": "Auth Failed"
                });
            }
            if(result){

              const token =  jwt.sign({
                    email: user[0].email,
                    id: user[0]._id

                },
                "hidden",
                {
                    expiresIn: "1h"
                }
                )
                return  res.status(401).json({
                    Auth: "Auth Successfull",
                    Token : token
                });

            }
            return  res.status(401).json({
                "Auth": "Auth Successfull"
            });
        })
    })
    .catch(err => {



    });
})

//Detele user is pending


module.exports = Router;