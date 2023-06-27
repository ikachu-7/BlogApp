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
   const blog = await Blog.findById(id).populate('createdBy');
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

router.post('/delete/:id', checkforAuth('token'), async (req, res) => {
  try {
    const id = req.params.id;
    await Blog.findByIdAndDelete(id);
    return res.redirect('/'); // Redirect to the homepage or any other desired page
  } catch (error) {
    console.error('Error deleting blog:', error);
    return res.status(500).send('Internal Server Error');
  }
});


router.post('/edit/:id', (req, res) => {
  try {
    const id = req.params.id;
    return res.render('editblog', { id });
  } catch (error) {
    console.error('Error rendering edit page:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



router.post("/edit/:id",upload.single("coverImageUrl"),async (req, res) => {
  try {
    // Get the blog ID from the URL parameter
    const blogId = req.params.id;

    // Fetch the blog from the database based on the blogId
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }


    if (req.body.title) {
      blog.title = req.body.title;
    }

    if (req.body.body) {
      blog.body = req.body.body;
    }

    // Handle the cover image upload
    if (req.file) {
      blog.coverImageUrl = '/uploads/' + req.file.filename;
    }
    await blog.save();
    return res.redirect('/blog/' + blogId);
  } catch (error) {
    console.error('Error updating blog:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;