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
    serviceTimeRange: { type: String },
    serviceTimeStart: { type: String },
    serviceTimeEnd: { type: String },
    hallDetails: [
      {
        hallAc: {
          type: String,
          enum: ["ac", "nonAc"],
        },
        hallCapacity: {
          type: Number,
        },
        hallMaxHours: {
          type: Number,
        },
        hallStartTime: {
          type: String,
        },
        hallEndTime: {
          type: String,
        },
        hallTimeRange: {
          type: String,
        },
        hallMinHours: {
          type: Number,
        },
      },
    ],
    cateringMaxHours: { type: Number },
    cateringMinHours: { type: Number },
    decorationPackages: [
      {
        packageName: { type: String },
        packagePrice: { type: Number },
        packageDescription: { type: String },
      },
    ],
    cateringPackages: [
      {
        packageName: { type: String, required: true },
        pricePerPerson: { type: Number, required: true },
        packageDescription: { type: String },
      },
    ],
    location: { type: String, default: null },
    address: { type: String, default: null },
    description: { type: String, default: null },
    serviceName: { type: String },
    price: { type: Number },
    image: [{ type: String }],
    thumbnail: { type: String },
    mobileNumber: { type: Number },
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
