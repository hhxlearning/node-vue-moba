module.exports = app => {
  const express = require("express");
  const router = express.Router({ mergeParams: true });
  const jwt = require("jsonwebtoken");
  const assert = require('http-assert')
  const AdminUser = require("../../models/AdminUser");


  // 接口-创建资源
  router.post("/", async (req, res) => {
    const model = await req.Model.create(req.body);
    res.send(model);
  });
  // 接口-获取资源列表
  router.get("/", async (req, res, next) => {
    // 校验用户是否登录
    // 1.获取请求传来的token
    const token = String(req.headers.authorization || '').split(' ').pop()
    // 2.通过该token取得对应id
    const { id } = jwt.verify(token, app.get('secret'))
    // 3.通过id查找用户
    req.user = await AdminUser.findById(id)

    await next()
  } , async (req, res) => {
    let queryOptions = {};
    if (req.Model.modelName === "Category") {
      queryOptions.populate = "parent";
    }
    const items = await req.Model.find()
      .setOptions(queryOptions)
      .limit(100);
    // 添加populate('parent')使请求返回对象的parent由一个id变为一个对象
    res.send(items);
  });
  // 接口-获取资源详情
  router.get("/:id", async (req, res) => {
    const model = await req.Model.findById(req.params.id);
    res.send(model);
  });
  // 接口-更新资源
  router.put("/:id", async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  // 接口-删除资源
  router.delete("/:id", async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body);
    res.send({
      success: true
    });
  });

  // 接口
  app.use(
    "/admin/api/rest/:resource",
    async (req, res, next) => {
      const modelName = require("inflection").classify(req.params.resource);
      req.Model = require(`../../models/${modelName}`);
      next();
    },
    router
  );

  const multer = require("multer");
  const upload = multer({ dest: __dirname + "/../../uploads" });
  app.use("/admin/api/upload", upload.single("file"), async (req, res) => {
    const file = req.file;
    file.url = `http://localhost:3000/uploads/${file.filename}`;
    res.send(file);
  });

  app.post("/admin/api/login", async (req, res) => {
    // res.send('ok')
    const { username, password } = req.body;
    // 1.根据用户名找用户
    const user = await AdminUser.findOne({ username }).select("+password");

    assert(user, 422, "用户不存在！")
    // 2.校验密码
    // compareSync返回一个布尔值
    const isValid = require("bcrypt").compareSync(password, user.password);
    if (!isValid) {
      return res.status(422).send({
        message: "密码错误！"
      });
    }
    // 3.返回token
    // jwt.sign的第二个参数为密钥
    const token = jwt.sign({id: user._id}, app.get("secret"));
    res.send({ token });
  });

  //错误处理
  app.use(async (err, req, res, next) => {
      res.status(err.statusCode).send({
        message: err.message
      })
  })
};
