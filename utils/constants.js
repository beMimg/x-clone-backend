require("dotenv").config();

let BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://backendxclone-production.up.railway.app"
    : "http://localhost:3000";

let FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://x-clone-bemimg.netlify.app" ||
      "https://deploy-preview-1--x-clone-bemimg.netlify.app/"
    : "http://localhost:5173";

exports.BASE_URL = BASE_URL;
exports.FRONTEND_URL = FRONTEND_URL;
