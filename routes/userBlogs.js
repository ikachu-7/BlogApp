const { Router } = require("express");
const multer = require("multer");
const path = require('path');
const Blog = require("../models/blogs");
const { checkforAuth } = require("../middleware/auth");
const router = Router();
router.get("/addblogs",checkforAuth("token"),(req,res) => {
    return res.render("addBlog",{
        user: req.USER
    });
});
router.get('/:id',checkforAuth("token"),async (req,res) => {
  try {
   const { id } = req.params;
   const blog = await Blog.findById(id);
   return res.render("blog.ejs",{
    user: req.USER,
    blog
   })
  } catch (error) {
   return res.json({
     status: false,
     error
   });
  }
 });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null,fileName);
    }
});
const upload = multer({ storage: storage });


router.post("/",checkforAuth("token"),upload.single("coverImageUrl"),async (req,res) => {
    const { title,body} = req.body;
    const blog = await Blog.create({
      title,
      body,
      createdBy: req.USER._id,
      coverImageUrl: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/`);
});


module.exports = router;