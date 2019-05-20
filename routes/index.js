const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
    res.render('home');
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        firstName: req.user.firstName,
        lastName: req.user.lastName
    })
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Succesful Logout');
    res.redirect('/account/signin');
})

module.exports = router;