
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["author", "admin"],
      default: "author",
      required: true,
    },

    authorId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Virtual relationship: one user can have many books
userSchema.virtual("books", {
  ref: "Book",
  localField: "_id",  //primary key
  foreignField: "author", // foreign key dono same
});

// Include virtual fields when converting documents to JSON
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcryptjs.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

module.exports = User;