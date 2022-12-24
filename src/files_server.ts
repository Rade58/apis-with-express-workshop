// THI WILL BE A NO-OP,
// JUST SHOWING HOT TO SEND FILES

import path from "path";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  console.log(process.env.HELLO);

  // res.sendFile(path.resolve("src/files/index.html"));
  res.sendFile(path.resolve("src/files/Cap-Brave.png"));

  // res.status(200);

  // res.json({ message: "hello world a" });
});

// module.exports = app;
export default app;
