const express = require('express');
require('dotenv').config();
const path = require('path');
const { connectDB } = require('./config/db');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/userBlogs');
const { checkforAuth } = require('./middleware/auth');
const Blog = require('./models/blogs');
const app = express();

const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));


app.set("view engine","ejs");
app.set('views',path.resolve('./views'));


app.get('/',checkforAuth('token'),async (req,res) => {
    const allblogs = await Blog.find({}).sort({createdAt: -1});
    return res.render("home", {
        user: req.USER,
        blogs: allblogs
    });
});

app.use("/user",userRoutes);
app.use("/blog",blogRoutes);



(async () => {
    try {
        await connectDB();
        app.listen(PORT,()=> {
            console.log(`Server Started at port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
 } )();