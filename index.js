const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

connectToMongo();

app.use(express.json());

/* ✅ CORS CONFIG (PRODUCTION READY) */
const allowedOrigins = [
  "http://localhost:3000", // for local development
  "https://jovial-zabaione-d7c013.netlify.app" 
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`);
});