const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const connection = mongoose.createConnection(
  "mongodb+srv://bt22:xQ8BdgzsZt1f1iwc@cluster0.9auii05.mongodb.net/social?retryWrites=true&w=majority"
);

autoIncrement.initialize(connection);

const userSchema = new mongoose.Schema({
  u_id: {
    type: Number,
  },

  username: {
    type: String,
    required: [true, "Username is required"],
  },
  // email: {
  //   type: String,
  //   required: [true, "Email is required"],
  // },
  // dob: {
  //   type: String,
  //   required: [true, "Date of Birth is required"],
  // },
  // zipcode: {
  //   type: String,
  //   required: [true, "Zipcode is required"],
  // },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  created: {
    type: Date,
    required: [true, "Created date is required"],
  },
});

userSchema.plugin(autoIncrement.plugin, {
  model: "user",
  field: "u_id",
  startAt: 1,
});

module.exports = userSchema;
