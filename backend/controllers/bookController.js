const User = require("../models/users");
const Book = require("../models/book");



const getMyBooks = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user || user.role !== "author") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const books = await Book.find({
      author: user._id,
    });

    return res.status(200).json({
      author: {
        name: user.name,
        email: user.email,
        authorId: user.authorId,
      },
      books,
    });
  } catch (error) {
    console.error("Get books error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch books",
    });
  }
};

module.exports = { getMyBooks };