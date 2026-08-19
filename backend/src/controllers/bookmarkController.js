import User from "../models/User.js";

export const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("bookmarks");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, bookmarks: user.bookmarks || [] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load bookmarks.",
    });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const movie = req.body;
    if (!movie?.id) {
      return res.status(400).json({ success: false, message: "Valid movie data with id is required." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const movieId = Number(movie.id);
    const existingIndex = user.bookmarks.findIndex((b) => b.id === movieId);
    const exists = existingIndex !== -1;

    if (exists) {
      user.bookmarks.splice(existingIndex, 1);
    } else {
      user.bookmarks.push({
        id: movieId,
        title: movie.title || "",
        poster_path: movie.poster_path || null,
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date || "",
        overview: movie.overview || "",
        addedAt: new Date(),
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      isBookmarked: !exists,
      bookmarks: user.bookmarks,
      message: !exists ? "Movie added to your bookmarks." : "Movie removed from your bookmarks.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update bookmark.",
    });
  }
};

