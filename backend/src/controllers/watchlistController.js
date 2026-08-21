import User from "../models/User.js";

export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("watchlist");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      watchlist: user.watchlist || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load watchlist.",
    });
  }
};

export const toggleWatchlist = async (req, res) => {
  try {
    const movie = req.body;
    const movieId = Number(movie?.id);
    if (!movie || isNaN(movieId)) {
      return res.status(400).json({
        success: false,
        message: "Valid movie data with numeric id is required.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const existingIndex = user.watchlist.findIndex(
      (item) => Number(item.id) === movieId
    );

    const exists = existingIndex !== -1;

    if (exists) {
      user.watchlist.splice(existingIndex, 1);
    } else {
      user.watchlist.unshift({
        id: movieId,
        title: movie.title || "",
        poster_path: movie.poster_path || null,
        vote_average: typeof movie.vote_average === "number" ? movie.vote_average : Number(movie.vote_average) || 0,
        release_date: movie.release_date || "",
        overview: movie.overview || "",
        addedAt: new Date(),
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      isInWatchlist: !exists,
      watchlist: user.watchlist,
      message: !exists
        ? "Movie added to watchlist."
        : "Movie removed from watchlist.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update watchlist.",
    });
  }
};