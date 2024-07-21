const mongoose = require("mongoose");
const registerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  securityQuestion: {
    type: String,
    // required: true,
  },
  securityQuestionAnswer: {
    type: String,
    // required: true,
  },
  token: {
    type: String,
  },
  otp:{
    type:String,
  }
});
const registeredData = mongoose.model("register", registerSchema);
module.exports = registeredData;
