const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
  },
  email: {
    type: String,
    required: [true, "please provide your email"],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  photo: {
    type: String,
  },
  role:{
    type: String,
    enum: ['admin','user','pharmacy'],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minLength: 8,
    select: false,
  },
  passwordChangedAt:{
    type:Date,
    default: new Date().toLocaleDateString()
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords do not match",
    },
  },
  
});
//hashing password before saving it to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined; // remove confirm password field from the document before saving it to the database
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.passwordChangedAfter =function (JWT_iat){
  const passwordChangedTime= parseInt(this.passwordChangedAt.getTime()/1000)
  if(passwordChangedTime > JWT_iat)return true;
  
  return false;
}
const User = mongoose.model("User", userSchema);

module.exports = User;
