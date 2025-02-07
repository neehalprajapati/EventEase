const UserModel = require("../models/User");
const cloudinary = require("../config/cloudinary");
const Wishlist = require("../models/Wishlist");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer')

exports.user = async (req, res) => {
  const userId = req.userId;
  try {
    if (userId) {
      const user = await UserModel.findById(userId).select("-password");

      if (!user) {
        return res.status(404).send("User not found");
      }

      return res.status(200).send(user);
    }
    const services = await UserModel.find({ role: "service" }).select(
      "-password"
    );

    if (services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }

    return res.status(200).json(services);
  } catch (err) {
    return res.status(500).send("Server error", err);
  }
};

exports.getById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "server error", err });
  }
};

// Update User Profile
exports.updateById = async (req, res) => {
  try {
    const updatedData = req.body; // Assume the body contains the new profile details
    const user = await UserModel.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const { userId } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).send({ message: "no files uploaded" });
    }
    cloudinary.uploader
      .upload_stream({ folder: "service_images" }, async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Cloudinary upload failed.", error });
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { $push: { image: result.secure_url } },
          { new: true }
        );
        if (!updatedUser) {
          return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({
          message: "Image uploaded and saved successfully.",
          user: updatedUser,
        });
      })
      .end(file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  const { userId } = req.params; // Use userId from params
  const { imageUrl } = req.body; // Get the image URL to be deleted

  try {
    // Find the user and their service
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate user.image exists and is an array
    if (!Array.isArray(user.image)) {
      return res.status(400).json({ error: "User has no images to delete" });
    }

    // Check if the image exists in the user's service images
    const imageIndex = user.image.indexOf(imageUrl);
    if (imageIndex === -1) {
      return res
        .status(422)
        .json({ error: "Image not found in user's service" });
    }

    // Remove the image URL from the array
    user.image.splice(imageIndex, 1);

    // If the deleted image was the thumbnail, reset the thumbnail
    if (user.thumbnail === imageUrl) {
      user.thumbnail = user.image.length > 0 ? user.image[0] : "";
    }

    // Save the updated user document
    await user.save();

    // Optionally, delete the image from Cloudinary
    const urlParts = imageUrl.split("/");
    const publicId = urlParts[urlParts.length - 1].split(".")[0]; // Extract public ID
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion failed:", cloudinaryError);
      return res
        .status(500)
        .json({ error: "Failed to delete image from Cloudinary" });
    }

    res.status(200).json({
      message: "Image deleted successfully",
      images: user.image,
    });
  } catch (error) {
    console.error("Error in deleteImage:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};

exports.setThumbnail = async (req, res) => {
  const { userId } = req.params; // Extract the userId from the request parameters
  const { thumbnailUrl } = req.body; // Extract the thumbnailUrl from the request body

  if (!thumbnailUrl) {
    return res.status(400).json({ error: "Thumbnail URL is required." });
  }

  try {
    // Find the user by userId
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the provided thumbnailUrl exists in the user's uploaded images
    if (!user.image.includes(thumbnailUrl)) {
      return res
        .status(400)
        .json({ error: "The provided URL does not exist in uploaded images." });
    }

    // Update the user's thumbnail field
    user.thumbnail = thumbnailUrl;

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: "Thumbnail updated successfully.",
      thumbnail: user.thumbnail,
    });
  } catch (error) {
    console.error("Error updating thumbnail:", error.message);
    res.status(500).json({ error: "Failed to update thumbnail." });
  }
};

exports.getHallService = async (req, res) => {
  try {
    const services = await UserModel.find({
      role: "service",
      serviceType: "hall",
    });

    if (services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }

    return res.status(200).json(services);
  } catch (error) {
    console.error("Error in getServiceData:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getCateringService = async (req, res) => {
  try {
    const services = await UserModel.find({
      role: "service",
      serviceType: "catering",
    });

    if (services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }

    return res.status(200).json(services);
  } catch (error) {
    console.error("Error in getServiceData:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getDecorationService = async (req, res) => {
  try {
    const services = await UserModel.find({
      role: "service",
      serviceType: "decoration",
    });

    if (services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }

    return res.status(200).json(services);
  } catch (error) {
    console.error("Error in getServiceData:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//Add to Wishlist-----
exports.addToWishlist = async (req, res) => {
  const { customer_id, service_id } = req.body;

  try {
    // Check if the service is already in the customer's wishlist
    const existingItem = await Wishlist.findOne({ customer_id, service_id });
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Service is already in your wishlist." });
    }

    // Add to wishlist
    const newWishlistItem = new Wishlist({
      customer_id,
      service_id,
    });

    await newWishlistItem.save();
    res.status(201).json({ message: "Service added to wishlist!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to add service to wishlist." });
  }
};

exports.getWishlist = async (req, res) => {
  const { customer_id } = req.params;

  try {
    // Fetch wishlist items and join with the user collection to get service details
    const wishlistItems = await Wishlist.aggregate([
      {
        $match: { customer_id: new mongoose.Types.ObjectId(customer_id) }, // Filter by customer
      },
      {
        $lookup: {
          from: "users", // Join with the user collection
          let: { service_id: "$service_id" }, // Define a variable for service_id
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$service_id"] }, // Match service_id
                role: "service", // Only include service providers
              },
            },
          ],
          as: "service_details", // Output array field
        },
      },
      {
        $unwind: "$service_details", // Unwind the joined array
      },
      {
        $project: {
          _id: 1,
          customer_id: 1,
          service_id: 1,
          added_on: 1,
          serviceName: "$service_details.serviceName",
          serviceType: "$service_details.serviceType",
          price: "$service_details.price",
          thumbnail: "$service_details.thumbnail",
          location: "$service_details.location",
          email:"$service_details.email",
          mobileNumber:"$service_details.mobileNumber",
          image:"$service_details.image"
        },
      },
    ]);

    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to fetch wishlist." });
  }
};

//delete wishlist data

exports.deleteWishlist = async (req, res) => {
  const { customer_id, service_id } = req.body;

  try {
    const result = await Wishlist.deleteOne({ customer_id, service_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found in wishlist." });
    }

    res.status(200).json({ message: "Item removed from wishlist." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Failed to remove item from wishlist." });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail as the email service
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

// API endpoint to send email
exports.sendQuery = async (req, res) => {
  const { to_email, from_email, message } = req.body;

  try {
    // Send email
    await transporter.sendMail({
      from: `"Your Service Team" <${process.env.EMAIL_USER}>`, // Sender address
      to: to_email, // Recipient address (service provider's email)
      subject: "New Inquiry from " + from_email, // Email subject
      text: `Hello,\n\nYou have received a new inquiry from ${from_email}:\n\n${message}\n\nBest regards,\nYour Service Team`, // Email body
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};