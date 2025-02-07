const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "service"], required: true },
    serviceType: {
      type: String,
      enum: ["hall", "catering", "decoration"],
      default: null,
    },
    location: { type: String, default: null },
    description: { type: String, default: null },
    serviceName: { type: String },
    price: { type: Number },
    image: [{ type: String }],
    thumbnail:{type:String},
    mobileNumber:{type:Number},
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const UserModel = new mongoose.model("user", UserSchema);

module.exports = UserModel;
