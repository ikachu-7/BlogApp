const { Schema , model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../utils/authentication');
const userSchema = new Schema( {
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
    },
    profileImageUrl: {
        type: String,
        default: '/images/default.png'
    },
    role: {
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER"
    } 
}, { timestamps: true } );

userSchema.pre('save', function (next) {
    const user = this;
    if(!user.isModified('password')) return;
    
    const salt = randomBytes(10).toString();
    const hashedPassword = createHmac('sha256',salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});


userSchema.static("matchPasswordAndGenerateToken",async function (email,password) {
    const user = await this.findOne({email});
    if(!user) throw new Error("Kya be chomu");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userprovidedhash = createHmac('sha256',salt).update(password).digest("hex");
    const token = createTokenForUser(user);
    if (hashedPassword === userprovidedhash) {
        return token;
      } else {
        throw new Error("Password does not match");
      }
});
const UserModel = model('user',userSchema);

module.exports = UserModel;