const UserModel = require("../models/userModel");

exports.Register = (req,res) => {
    return res.render("register");
}

exports.Login = (req,res) => {
    return res.render("login");
}

exports.RegisterController = async (req,res) => {
    const { fullName, email , password} = req.body;
    if(!fullName || !email || !password) {
        return res.status(400).json( {
            msg: "Please fill all the fields",
        } );
    }
    await UserModel.create({
        fullName,
        email,
        password
    });
    return res.redirect('/user/login');
}

exports.LoginController = async (req,res) => {
   try {
        const { email , password } = req.body;
        const token = await UserModel.matchPasswordAndGenerateToken(email,password);
        return res.cookie('token',token,{
            httpOnly: true
        }).redirect('/');
   } catch (error) {
         return res.render("login",{
            error: "Incorrect email or Password"
         });
   }
}

exports.LogoutController = (req,res) => {
    return res.clearCookie("token").render("login");
}

