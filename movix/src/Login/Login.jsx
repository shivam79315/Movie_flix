// Login.js

import React, { useState } from "react";

import { useNavigate } from "react-router";
import "./Login.css";
const Login = ({
  handleLogin,
  handleChangePass,
  handleEnable,
  sendDataToParent,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4001/signup/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);

      localStorage.setItem("token", JSON.stringify(data.token));
      handleLogin();

      setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/login2");
      }, 1000 * 3600);
      alert("Login Successfull");
      handleEnable();
      let username = formData.email.charAt(0).toUpperCase();
      sendDataToParent(username, formData.email);
      navigate("/");
    } else {
      alert("Invalid Credentials.........");
    }
    setFormData({ email: "", password: "" });
  };
  const onHandleChangePassword = (e) => {
    e.preventDefault();
    handleChangePass();

    navigate("/changePass");
  };
  return (
    <div className="login-background">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Login</button>
          <a href="/changePass" onClick={onHandleChangePassword}>
            Forgot Password
          </a>
          <br />
          <a href="/register">Register</a>
        </form>
      </div>
    </div>
  );
};

export default Login;
