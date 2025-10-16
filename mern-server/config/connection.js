const mongoose = require("mongoose");
const db = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Bookinventary");
    console.log("database connected");
  } catch {
    console.log("error");
  }
};

module.exports = db;
