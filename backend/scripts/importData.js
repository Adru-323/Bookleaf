
require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");  // json read krne k liye 
const path = require("path"); //correct path bananek liye

const User = require("../models/users");
const Book = require("../models/book");

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const filePath = path.join(
      __dirname,
      "../data/bookleaf_sample_data.json"
    );

    const data = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    ); //read file //fs.read --> txt k isme read krta hai ..then json.parse txt ko json mai convert


    //file ka data json mai krke loop
    for (const authorData of data.authors) {
      let user = await User.findOne({
        email: authorData.email.toLowerCase(),
      });

      if (!user) {
        user = await User.create({
          name: authorData.name,
          email: authorData.email,
          password: process.env.DEMO_PASSWORD,
          role: "author",
          authorId: authorData.author_id,
        });
      }

      for (const bookData of authorData.books) {
        await Book.updateOne(
          { book_id: bookData.book_id },
          {
            $set: {
              ...bookData,
              author: user._id,
              authorId: authorData.author_id,
            },
          },
          { upsert: true }
        );
      }
    }

    console.log("Dataset imported successfully!");
    console.log("Authors in dataset:", data.authors.length);
    console.log(
      "Books in dataset:",
      data.authors.reduce(
        (total, author) => total + author.books.length,
        0
      )
    );

const adminEmail = "admin@bookleaf.com";

let admin = await User.findOne({    
  email: adminEmail,
});

if (!admin) {
  admin = await User.create({
    name: "BookLeaf Admin",
    email: adminEmail,
    password: process.env.DEMO_PASSWORD,
    role: "admin",
    authorId: null,
  });

  console.log("Admin account created");
} else {
  console.log("Admin account already exists");
}

  } catch (error) {
    console.error("Import failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

importData();