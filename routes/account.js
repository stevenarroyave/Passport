const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.post('/signup', (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    let errorMsgs = [];

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        errorMsgs.push({ msg: 'Please enter all fields' });
    }

    if (password != confirmPassword) {
        errorMsgs.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errorMsgs.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errorMsgs.length > 0) {
        res.render('signup', {
            errorMsgs,
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errorMsgs.push({ msg: 'User Already Exists' });
                    res.render('signup', {
                        errorMsgs,
                        firstName,
                        lastName,
                        email,
                        password,
                        confirmPassword
                    });
                } else {
                    const newUser = new User({
                        firstName,
                        lastName,
                        email,
                        password
                    });

                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Thanks for registering!')
                                    res.redirect('/account/signin');
                                })
                                .catch(err => console.log(err));
                        }
                    ))
                }
            })
    }
})

router.get('/signin', (req, res) => {
    res.render('signin');
})

router.post('/signin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/account/signin',
        failureFlash: true
    })(req, res, next)
})

module.exports = router;