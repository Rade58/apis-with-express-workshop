import express from "express";
import type { Request, Response, NextFunction } from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";

import { protect } from "./modules/auth";

import { createNewUser, signIn } from "./handlers/user";

const app = express();

// YOU CAN LOOK THIS AS AN INFO TO THE BROWSER
// OF WHO CAN ACCESS OUR API
// IN THIS CASE WE ARE ALLOWING EVERYONE TO ACCESS
// YOU CAN ALLOW/DISALLOW ALL KINDS OF THINGS WITH THIS
// CROSS ORIGIN RESOURCE SHARING
// YOU CAN PROVIDE FUNCTION WHERE YOU WOULD FILTER OUT
// ORIGINS FROM WHERE YOU DON'T WANT YOUR API TO BE ACCESSIBLE
// OR OTHER WAY AROUND
// LIKE I SAID WE ARE ALLOWING EVERYONE IN THIS CASE (CHECK DOCKS FOR OTHER INFO)
app.use(cors());

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

// EXAMPLE OF SOME MIDDLEWARE THAT AUGMENTS REQUEST OBJECT
// BUT WHEN DOING THIS DON'T FORGET TO ALSO MAKE AUGMENTATION INSIDE
// TYPE DEFINITIONS (I DID IN  types.d.ts FILE)
/* app.use((req, res, next) => {
  // THIS WILL NOW BE AVAILABLE IN ANY ROUTER DEFINED AFTER THIS
  req.shsh_secret = "shiba";
  next();
}); */

//
app.use("/api", [protect], router);

// WE CAN PUT MIDDLEWARE THAT WILL SIT ONLY IN FRON OF
// SPECIFIC ROUTE
// YOU CAN PUT THEM INTO ARRAY OR YOU CAN JUST ADD THE COMMA SEPARATED,
// BEFORE YOUR ROUTE
/* app.get("/", [list of your middlewares], (req, res) => {
  res.status(200);

  res.json({ message: "hello world " });
});
 */
// -----------------------------------------
// RMEMBER THAT protect MIDDLEWARE DOESN'T APPLY HERE
// IT IS ONLY FOR THE /api
// IT WOULD BE STUPID IF IT WOULD APPLY BECAUSE IN HERE
// WE DARE DEFINING ROUTES FOR SIGNUP/IN
// WHY WOULD YOU HAVE JSONWEBTOKEN IF
// YOU DIDN'T CREATE USER OR YOU DIDN'T SIGN IN

app.post("/user", createNewUser);
app.post("/signin", signIn);

// -----------------------------
// -----------------------------
// -----------------------------
// -----------------------------
// THIS TIME ERROR IS BING PASSED TO next
app.get("/hello-world", async (req, res, next) => {
  next(new Error("Hello World Error!"));
});
// ALSO IN THIS ROUTE I ALSO PASSED ERROR TO THE next
app.get("/foo-bar", (req, res, next) => {
  setTimeout(() => {
    next(new Error("Foo Bar!"));
  }, 200);
});

// A GOOD PLACE TO PUT ERROR ANDLER SINCE IT WILL
// CATCH ERRORS THAT COME FROM HANDLERS ABOVE

// REMMBER THAT THIS WILL NOT CATCH ERROR IF ERROR IS THROWN FROM async

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  //
  console.log({ err: err.message });
  //
  res.json({ message: "oooooooooooops" });
  //
});

export default app;
