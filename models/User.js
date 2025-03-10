const mongoose = require('mongoose')
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    userName: { 
        type: String,
         unique: true 
        },
    email: { 
        type: String,
         unique: true 
        },
    password: String,
   createdAt: {
    type: Date,
    default: Date.now
   } 
})

// Password hash middleware.
UserSchema.pre("save", function save(next) {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  });

// Helper method for validating user's password.
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

module.exports = mongoose.model('User', UserSchema)