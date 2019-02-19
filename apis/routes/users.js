const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Router = express.Router();
const User = require('../models/user');


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
                        Error: "Error whilst hasting"
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

//Detele user is pending


module.exports = Router;