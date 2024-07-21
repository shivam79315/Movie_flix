import { useNavigate } from "react-router";
import React, { useState } from "react";
import "./Login.css";
const ChangePassword = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityQuestionAnswer: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  console.log("Data is :  ", data);
  const CheckDetails = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      alert("Password and ConfirmPassword must be same");
      return;
    }
    const changePassword = {
      email: data.email,
      password: data.password,
      securityQuestion: data.securityQuestion,
      securityQuestionAnswer: data.securityQuestionAnswer,
    };
    const res = await fetch("http://localhost:4001/signup/changePass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changePassword),
    });
    if (res.ok) {
      navigate("/login2");
    } else {
      alert("Error....");
    }
  };
  return (
   <div className="change-password-background">
     <div className="change-password-container">
      <form onSubmit={CheckDetails} id="change-password-form">
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" onChange={handleChange} />
        <br />
        <label htmlFor="securityQuestion">Security Question</label>
        <select
          name="securityQuestion"
          id=""
          onChange={handleChange}
        >
          <option  value="">Select Security Question</option>

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
        <label htmlFor="password">New Password</label>
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
        <button type="submit">Change Password</button>
      </form>
    </div>
   </div>
  );
};

export default ChangePassword;
