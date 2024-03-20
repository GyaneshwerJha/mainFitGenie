const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const errorHandler = require('../middlewares/errorMiddlewares');
const authTokenHandler = require('../middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer'); // to send email


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gyaneshwer.0001@gmail.com',
        pass: 'obwtqjewosxdotrl'
    }
})

router.get('/test', async (req, res) => {
    res.json({ message: 'The Api is working!' })
})


function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data
    }
}

router.post('/register', async (req, res) => {
    console.log('req.body');

    try {
        const {
            name,
            email,
            password,
            weithtInKg,
            heightInCm,
            gender,
            dob,
            goal,
            activityLevel
        } = req.body;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(409).json(createResponse(false, 'Email already exists'));
        }

        const newUser = new User({
            name,
            password,
            email,
            weights: [
                {
                    weight: weithtInKg,
                    uint: "kg",
                    date: Date.now()
                }

            ],
            height: [
                {
                    height: heightInCm,
                    date: Date.now(),
                    unit: "cm"
                }
            ],
            gender,
            dob,
            goal,
            activityLevel
        });

        await newUser.save();
        res.status(201).json(createResponse(true, 'User registered successfully'))
    }
    catch (err) {
        next(err);
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json(createResponse(false, 'Invalid credentials'));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json(createResponse(false, 'Invalid credentials'));
        }
        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '50m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10d' });

        res.cookie('authToken', authToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(200).json(createResponse(true, 'User logged in successfully', {
            authToken,
            refreshToken
        }));
    }
    catch (err) {
        next(err);
    }
})

router.post('/sendotp', async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);

        const mailOptions = {
            from: 'gyaneshwer.jha2021@vitstudent.ac.in',
            to: email,
            subject: 'Otp for verification',
            text: `Your Otp is ${otp}`
        }

        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                console.log(err);
                res.status(500).json(createResponse(false, err.message));
            }
            else {
                res.json(createResponse(true, 'Otp sent successfully', { otp }))
            }
        })
    }
    catch (err) {
        next(err);
    }
})

router.post('/checklogin', authTokenHandler, async (req, res, next) => {
    res.json({
        ok: true,
        message: 'User authenticated successfully'
    })
})

router.use(errorHandler);
module.exports = router;