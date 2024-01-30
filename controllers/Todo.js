const Todo = require("./../models/Todo");

exports.getTodos = async (req, res) => {
  try {
    const id = req.user.id;
    const todos = await Todo.find({ userId: id });
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json("Произошла ошибка при получении списка задач");
  }
};

exports.addTodo = async (req, res) => {
  try {
    if (!req.body)
      return res
        .sendStatus(400)
        .json({ message: "Надо же что-то отправить :)" });
    const id = req.user.id;
    const title = req.body.title;
    const todo = new Todo({
      title: title,
      userId: id,
      date: new Date(),
    });
    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Произошла ошибка при добавлении задачи :(" });
  }
};

exports.deletedTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo)
      return res.sendStatus(404).json({ message: "Задача не найдена" });
    res.json(todo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Произошла ошибка при удалении задачи :(" });
  }
};

exports.clearHolder = async (req, res) => {
  try {
    const id = req.user.id;
    const deleteResult = await Todo.deleteMany({ userId: id });
    if (deleteResult.deletedCount > 0) {
      res.status(200).json(deleteResult);
    } else {
      res.status(200).json({ message: "Нет задач для удаления" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера: " + error.message });
  }
};

exports.clearComplited = async (req, res) => {
  try {
    const id = req.user.id;
    const todo = await Todo.deleteMany({ done: true, userId: id });
    if (todo.deletedCount > 0) {
      res.json(todo);
    } else {
      res.status(200).json({ message: "Нет подходящих задач для удаления" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера: " + error.message });
  }
};

exports.selectTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findById(id);
    todo.done = !todo.done;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера: " + error.message });
  }
};

exports.allSelectTodo = async (req, res) => {
  try {
    const id = req.user.id;
    const todos = await Todo.find({ userId: id });
    const allValid = todos.every((todo) => todo.done);

    const updateTodo = await Todo.updateMany(
      { userId: id },
      { done: !allValid }
    );
    res.json(updateTodo);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера: " + error.message });
  }
};

exports.editTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findById(id);
    const title = req.body.title;
    todo.title = title;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера: " + error.message });
  }
};

// exports.paginationTodos = async (req, res) => {
//   const id = req.user.id;
//   let page = Number(req.query.page);
//   if (page === undefined) {
//     page = 1;
//   }
//   const limit = 4;
//   try {
//     const Tusks = await Todo.find({ userId: id })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec();

//     const count = (await Todo.find({ userId: id })).length;

//     res.json({
//       Tusks,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка сервера: " + error.message });
//   }
// };

exports.paginationTodos = async (req, res) => {
  const id = req.user.id;
  const filter = String(req.query.filter);
  let page = Number(req.query.page);
  const limit = 4;
  if (!page) {
    page = 1;
  }
  try {
    const options = {
      page,
      limit,
      sort: { date: -1 },
    };
    const paginateFilter = { userId: id };
    if (filter === "complete") {
      paginateFilter.done = true;
    } else if (filter === "active") {
      paginateFilter.done = false;
    }
    const result = await Todo.paginate(paginateFilter, options);
    const doneTodosCount = await Todo.countDocuments({
      userId: id,
      done: true,
    });
    const neDoneTodosCount = await Todo.countDocuments({
      userId: id,
      done: false,
    });
    const totalCount = await Todo.countDocuments({
      userId: id,
    });
    result.doneTodosCount = doneTodosCount;
    result.neDoneTodosCount = neDoneTodosCount;
    result.totalCount = totalCount;
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера: " + error.message });
  }
};
