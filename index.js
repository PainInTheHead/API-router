const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const mainRoute = require('./routes/appRoute')
require("./midleware/passport")(passport);

app.use(passport.initialize());
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use('/', mainRoute)

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://root:root@cluster0.9qclwyc.mongodb.net/?retryWrites=true&w=majority"
    );
    app.listen(3001);
    console.log("Server waiting connect");
  } catch (err) {
    return console.log(err);
  }
}
main();

// ALL USER

// app.post("/user/registration", async (req, res) => {
//   const validNewUser = await User.findOne({ email: req.body.email });
//   if (validNewUser) {
//     res.sendStatus(409).json({ message: "not Valid email, try again :(" });
//     console.log("Beda");
//   }
//   const salt = bcrypt.genSaltSync(10);
//   const password = req.body.password;
//   const user = new User({
//     email: req.body.email,
//     password: bcrypt.hashSync(password, salt),
//   });
//   try {
//     await user.save().then(() => console.log("User created"));
//     res.status(201).json(user);
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.post("/user/login", async (req, res) => {
//   const getUser = await User.findOne({ email: req.body.email });
//   if (getUser) {
//     const password = bcrypt.compareSync(req.body.password, getUser.password);
//     if (password) {
//       const token = jwt.sign(
//         {
//           email: getUser.email,
//           userId: getUser._id,
//         },
//         "dev-jwt",
//         { expiresIn: 60 * 60 }
//       );
//       res.status(200).json({ token: `Bearer ${token}` });
//     } else {
//       res.status(401).json({ message: "password not valid" });
//     }
//   } else {
//     res.status(404).json({ message: "User not Found" });
//   }
// });

// // midleware

// // ALL TODO

// //model todo

// // method todo
// app.get(
//   "/todos",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     const id = req.user.id;
//     const todos = await Todo.find({ userId: id });
//     res.send(todos);
//   }
// );

// app.post(
//   "/todos",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     if (!req.body) return res.sendStatus(400);
//     const id = req.user.id;
//     const title = req.body.title;
//     const todo = new Todo({
//       title: title,
//       userId: id,
//     });
//     await todo.save();
//     res.json(todo);
//   }
// );

// app.delete("/todos/:id", async (req, res) => {
//   const id = req.params.id;
//   const todo = await Todo.findByIdAndDelete(id);
//   if (todo) res.send(todo);
//   else res.sendStatus(404);
// });

// app.delete(
//   "/clearholder",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     try {
//       const id = req.user.id;
//       const todo = await Todo.deleteMany({ userId: id });
//       if (todo.deletedCount > 0) {
//         res.send(todo);
//       } else {
//         res.status(200).send({ message: "No todos found" });
//       }
//     } catch (error) {
//       res.status(500).send({ error: error.message });
//     }
//   }
// );

// app.delete("/clearComplited",
// passport.authenticate("jwt", { session: false }),
//  async (req, res) => {
//   try {
//     const id = req.user.id;
//     const todo = await Todo.deleteMany({ done: true, userId: id });
//     if (todo.deletedCount > 0) {
//       res.send(todo);
//     } else {
//       res.status(200).send({ message: "No todos found" });
//     }
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

// app.put("/todos/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const todo = await Todo.findById(id);
//     todo.done = !todo.done;
//     await todo.save();
//     res.send(todo);
//   } catch (error) {
//     res.sendStatus(500);
//   }
// });

// app.put("/allselected",
// passport.authenticate("jwt", { session: false }),
//  async (req, res) => {
//   try {
//     const id = req.user.id
//     const todos = await Todo.find({ userId: id });
//     const allValid = todos.every((todo) => todo.done);

//     const updateTodo = await Todo.updateMany({}, { done: !allValid });
//     res.send(updateTodo);
//   } catch (error) {
//     res.sendStatus(500);
//   }
// });

// app.put("/todos/edit/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const todo = await Todo.findById(id);
//     const title = req.body.title;
//     todo.title = title;
//     await todo.save();
//     res.send(todo);
//   } catch (error) {
//     res.sendStatus(500);
//   }
// });
