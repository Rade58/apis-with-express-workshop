import express from "express";
import router from "./router";
import morgan from "morgan";

const app = express();

// THIS WILL LOGG SOME CHARACTERISTICS OF THE REQUEST
app.use(morgan("dev"));

// WE ADDED COUPLE OF MIDDLEWARES ON THIS LEVEL (BEFORE EVERYTHING ELSE)

// THIS WILL DO HARD LIFTING FOR YOU IN CASE OF
// BODY OF THE REQUEST AND STREAMS
// IT WILL READ THE CHUNK (STRING) AFTER CHUNK
// OF THE STREAM, AND IT WILL COMBINE THEM INTO ONE STRING
// IT WILL THEN PRSE THAT JSON TO BE VALID JAVASCRIPT (OBJECT, ARRAY STRING, WHATEVER)
// IT IS CALLED BODY PARSER
app.use(express.json());

// THIS WILL ENCODE URL PROPERLY
// IT WILL ALSO ENCODE QUERY PARAMETERS PROPERLY
// FOR EXAMPLE QUERYSTRING VALUES WILL BE AVAILABLE INSIDE OBJECT
// SO YOU CAN ACCESS THEM PRETTY EASYLY
app.use(express.urlencoded({ extended: true }));

//
app.use("/api", router);

/* app.get("/", (req, res) => {
  res.status(200);

  res.json({ message: "hello world " });
});
 */

export default app;
