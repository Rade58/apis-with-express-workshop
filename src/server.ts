import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200);

  res.json({ message: "hello world " });
});

// module.exports = app;
export default app;
