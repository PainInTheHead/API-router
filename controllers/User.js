const User = require("./../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.userRegister = async (req, res) => {
  try {
  const validNewUser = await User.findOne({ email: req.body.email });
  if (validNewUser) {
    return res.status(409).json({ message: "not Valid email, try again :(" });
  }
  const salt = bcrypt.genSaltSync(10);
  const password = req.body.password;
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(password, salt),
  });
    await user.save().then(() => console.log("User created"));
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Такой парень уже создан" })
  }
};

exports.userLog = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    const password = bcrypt.compareSync(req.body.password, user.password);
    if (!password) {
      return res.status(401).json({ message: "Неверный пароль" });
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      "dev-jwt",
      { expiresIn: 60 * 60 }
    );
    return res
      .status(200)
      .json({ token: `Bearer ${token}`, id: user._id, avatar: user.avatar });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};

exports.userMakeAva = async (req, res) => {
  try {
    const { id, avatar } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    await User.findByIdAndUpdate(id, { avatar });

    res.status(200).json({ message: "Аватар изменен" });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};

exports.getUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};

exports.getMe = async (req, res) => {
  const id = req.user._id;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      res.json(false);
    }
    res.json(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};

// exports.userLog = async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (user) {
//     const password = bcrypt.compareSync(req.body.password, user.password);
//     if (password) {
//       const token = jwt.sign(
//         {
//           email: user.email,
//           userId: user._id,
//         },
//         "dev-jwt",
//         { expiresIn: 60 * 60 }
//       );
//       res
//         .status(200)
//         .json({ token: `Bearer ${token}`, id: user._id, avatar: user.avatar });
//     } else {
//       res.status(401).json({ message: "password not valid" });
//     }
//   } else {
//     res.status(404).json({ message: "User not Found" });
//   }
// };
// exports.userMakeAva = async (req, res) => {
//   try {
//     const user = await User.findOne({ _id: req.body.id });
//     if (user) {
//       await User.updateOne({ _id: req.body.id }, { avatar: req.body.avatar });
//       res.status(200).send({ message: "Avatar changed" });
//     } else {
//       res.status(404).send({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).send({ message: "Internal server error" });
//   }
// };
// exports.getUser = async (req, res) => {
//   const id = req.user.id;
//   try {
//     const user = await User.findOne({ _id: id });
//     if (user) {
//       res.send(user);
//     } else {
//       res.status(404).send({ message: "Not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: "Internal server error" });
//   }
// };

// exports.getMe = async (req, res) => {
//   const id = req.user._id;
//   try {
//     const user = await User.findOne({ _id: id });
//     if (user) {
//       res.json(true);
//     } else {
//       res.json(false);
//     }
//   } catch (error) {
//     res.status(500).send({ message: "Internal server error" });
//   }
// };
