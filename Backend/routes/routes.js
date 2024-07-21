const express = require("express");
const registeredData = require("../models/Register");
const routes = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const OTP_generator = () => {
  return Math.floor(Math.random() * 900000 + 100000);
};
const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    // service: "Gmail",
    host: process.env.HOST,

    port: process.env.PORT,
    // secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  const info = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for verification",
    text: `Your OTP is ${otp}`,
  };
  await transporter.sendMail(info, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email send");
    }
  });
  console.log("Message sent: ", info);
};

routes.post("/sendOtp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send("Email is required");
  }
  const userExist = await registeredData.findOne({ email: email });
  if (userExist) {
    return res.status(409).send("User already exists");
  }
  const otp = OTP_generator();
  await new registeredData({
    email: email,
    otp: otp,
  }).save();
  await sendOTP(email, otp);
  res.send("OTP send to your email...");
  // res.status(200).json(data);
});

routes.post("/checkUser", async (req, res) => {
  const { otp } = req.body;
  const findUser = await registeredData.findOne({ otp: parseInt(otp) });
  if (!findUser) {
    res.status(500).json("Wrong otp..");
  }
  res.status(200).json("Email is verified successfully..");
});

routes.post("/register", async (req, res) => {
  const { email, password, securityQuestion, securityQuestionAnswer } =
    req.body;

  if (!email || !password || !securityQuestion || !securityQuestionAnswer) {
    return res.status(500).json("All fields are required....");
  }
  try {
    const user = await registeredData.findOne({ email: email });
    const hashPassword = await bcrypt.hash(password, 10);
    const data = {
      password: hashPassword,
      securityQuestion,
      securityQuestionAnswer,
    };
    await user.updateOne(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

routes.get("/getUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await registeredData.findById(id);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json("No User Found");
    }
  } catch (error) {
    console.log(error);
  }
});

routes.get("/all", async (req, res) => {
  try {
    const allData = await registeredData.find();
    if (allData) {
      res.status(200).json(allData);
    } else {
      res.status(500).json("Database is empty");
    }
  } catch (error) {
    console.log(error);
  }
});

routes.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deleteUser = await registeredData.findByIdAndDelete(id);
    if (!deleteUser) {
      res.status(500).json("User not Exist");
    } else {
      res.status(201).json("User Removed...");
    }
  } catch (error) {
    console.log(error);
  }
});

routes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email", email, "password", password);
    const user = await registeredData.findOne({ email: email });
    console.log("USer", user);

    if (!user) {
      return res.status(500).json("User not Exist");
    }
    const hashPassword = await bcrypt.compare(password, user.password);
    console.log("hashPassword  ", hashPassword);
    console.log("USer password", user.password);
    console.log("entered PAssword", password);
    // const user_password = await registeredData.findOne({ password: password });

    // console.log("user_password", user_password);
    if (!hashPassword) {
      return res.status(401).json("Password does not match");
    }

    const token = jwt.sign({ userId: user._id }, "passwordkey", {
      expiresIn: "1m",
    });
    user.token = token;
    await user.save();
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.log(error);
  }
});

routes.post("/changePass", async (req, res) => {
  try {
    const { email, password, securityQuestion, securityQuestionAnswer } =
      req.body;
    const user = await registeredData.findOne({ email: email });
    if (!user) {
      return res.status(500).json("User not Exist");
    }
    const checkSecurityQuestion = user.securityQuestion;
    const checkSecurityQuestionAnswer =
      user.securityQuestionAnswer.toLowerCase();

    if (
      checkSecurityQuestion !== securityQuestion ||
      checkSecurityQuestionAnswer !== securityQuestionAnswer.toLowerCase()
    ) {
      return res.status(500).json("Given details does not match......");
    }
    // console.log("checkSecurityQuestion", checkSecurityQuestion);
    // console.log("checkSecurityQuestionAnswer", checkSecurityQuestionAnswer);
    // console.log("SecurityQuestion", securityQuestion);
    // console.log("SecurityQuestionAnswer", securityQuestionAnswer);
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json("Password Changed Successfully");
  } catch (error) {
    console.log("error", error);
  }
});

module.exports = routes;
