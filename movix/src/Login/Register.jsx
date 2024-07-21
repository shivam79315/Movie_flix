import { useNavigate } from "react-router";
import "./Login.css";
import React, { useState } from "react";
import axios from "axios";
function Register() {
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityQuestionAnswer: "",
    otp: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  console.log("data is : ", data);
  const submit = async (e) => {
    e.preventDefault();
    if (data.password === data.confirmPassword && data.password.length >= 8) {
      const obj = {
        email: data.email,
        password: data.password,
        securityQuestion: data.securityQuestion,
        securityQuestionAnswer: data.securityQuestionAnswer,
      };
      try {
        const res = await fetch("http://localhost:4001/signup/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(obj),
        });

        // console.log("Response is : ", res);
        if (res.ok) {
          console.log("Successfully");
          navigate("/login2");
        } else {
          alert("Email already registered......");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Fill the details properly....");
    }
  };
  const verify = async () => {
    try {
      const res = await axios.post("http://localhost:4001/signup/sendOtp", {
        email: data.email,
      });
      if (res.status === 200) {
        console.log("OTP send scuccessfully..");
      }
    } catch (error) {
      alert("Email already exist..");
      console.log("email already exist ");
    }
  };
  const checkUser = async () => {
    try {
      const res = await axios.post("http://localhost:4001/signup/checkUser", {
        otp: parseInt(data.otp),
      });
      if (res.status === 200) {
        console.log("Verified..");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
   <div className="register-background">
     <div className="register-container">
      <form onSubmit={submit} className="login-form">
        <label htmlFor="email" style={{ display: "block" }}>
          Email
        </label>
        <input type="email" name="email" id="email" onChange={handleChange} />
        <button type="button" onClick={() => verify()}>
          Send OTP
        </button>
        <br />
        <label htmlFor="OTP">OTP</label>
        <input type="number" name="otp" id="OTP" onChange={handleChange} />
        <button type="button" onClick={() => checkUser()}>
          Verify
        </button>
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleChange}
        />
        <br />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          onChange={handleChange}
        />
        <br />
        <label htmlFor="securityQuestion">SecurityQuestion</label>
        <select name="securityQuestion" id="" onChange={handleChange}>
          <option value="">Select SecurityQuestion</option>
          <option value="What is your favorite color?">
            What is your favorite color?
          </option>
          <option value="What is your nickName">What is your nickName</option>
        </select>
        <br />
        <label htmlFor="securityQuestionAnswer">Answer</label>
        <input
          type="text"
          name="securityQuestionAnswer"
          id="securityQuestionAnswer"
          onChange={handleChange}
        />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
   </div>
  );
}

export default Register;
