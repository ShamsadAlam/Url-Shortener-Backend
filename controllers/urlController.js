// controllers/urlController.js
const ShortUrl = require("../models/urlModel");
const crypto = require("crypto");

const generateUniqueShortCode = (length = 10) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomBytes = crypto.randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i++) {
    const index = randomBytes[i] % characters.length;
    result += characters.charAt(index);
  }
  return result;
};

exports.Shorten = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // Validate the URL format
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(originalUrl)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }
    // Check if the URL already exists
    const existingUrl = await ShortUrl.findOne({ originalUrl });
    if (existingUrl) {
      const shortUrl = `${req.protocol}://${req.get("host")}/${
        existingUrl.shortCode
      }`;
      return res.status(200).json({ shortUrl });
    }

    // Generate a unique short code
    const shortCode = generateUniqueShortCode();

    const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
    // Create a new ShortUrl entry
    const newShortUrl = new ShortUrl({
      originalUrl,
      shortCode,
      shortUrl,
      userId: req.user._id, // Assuming user information is available in req.user after authentication
    });

    await newShortUrl.save();

    res.status(201).json({ shortUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.Redirect = async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ shortCode: req.params.shortUrl });

    if (!shortUrl) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Increment the clicks count
    shortUrl.clicks++;
    await shortUrl.save();

    return res.redirect(shortUrl.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.GetUserUrls = async (req, res) => {
  try {
    const userUrls = await ShortUrl.find({ userId: req.user._id });

    res.status(200).json({ userUrls });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.DeleteUrl = async (req, res) => {
  try {
    const deletedUrl = await ShortUrl.findByIdAndDelete(req.params.id);

    if (!deletedUrl) {
      return res.status(404).json({ error: "URL not found" });
    }
    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
