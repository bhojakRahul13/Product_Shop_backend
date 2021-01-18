const express = require("express");
const router = express();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const config = require("config");
var jwt = require("jsonwebtoken");
const { check, validationResult, body } = require("express-validator");

router.get("/", (req, res) => {
    res.send("GET user to the homepage");
});


//Signup user By id
router.post(
    "/signup", [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "enter password").not().isEmpty(),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        try {
            //See if user exist
            let user = await User.findOne({ email });
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "user Already exist!!" }] });
            }
            user = new User({
                name,
                email,
                password,
            });
    
            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            return res.status(200).json({ msg: "User Signup Succesfully", user });
        } catch (err) {
            console.error(err.message);
            return res.status(500).send("Server Error!");
        }
    }
    
);

//Login User

router.post(
    "/login", [
        check("email", "Please include a valid email").isEmail(),
        check("password", "enter password").not().isEmpty(),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
    
        try {
            //See if user exists
            let user = await User.findOne({ email });
            if (!user) {
                res.status(400).json({ errors: [{ msg: "Invalid Credentials !" }] });
            }
    
            //Match password
            const isMatch = await bcrypt.compare(password, user.password);
    
            if (!isMatch) {
                res.status(400).json({ errors: [{ msg: "Invalid Password !" }] });
            }
            //Jwt Token
            const payload = {
                user: {
                    id: user.id,
                    email: user.email, //
                    role: user.role,
                },
            };
    
            jwt.sign(
                payload,
                config.get("jwtToken"), { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ msg: "Login success", token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("server error");
        }
    }    
);


//Delete user By id
router.delete("/:userId", async(req, res) => {
    try {
        const id = req.params.userId;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(400).json({ msg: "No User Id  Found!", id });
        return res
            .status(200)
            .json({ msg: "User Delete Successfully", UserDelete: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
};);

//Forget Password
router.get("/forgot-password", async(req, res) => {
    try {
        const { email } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ msg: "Invalid Email !", Invalid: req.body.email });
        } else {
            const token = jwt.JsonWebToken.sign({
                // payload: use's email id
            });

            // resetToken: token

            return res.status(200).json({ msg: "Your email", user });

            //Jwt Token
            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                config.get("jwtToken"), { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ msg: "Login success", token });
                }
            );
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error!");
    }
});

module.exports = router;