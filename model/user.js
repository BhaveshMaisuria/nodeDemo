import mongoose  from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt  from 'bcrypt-nodejs';

let UserSchema = mongoose.Schema({

    username: {
        type: String
    },
    mail: {
        type: String
    },
    password: {
        type: String
    },
    mailcode: {
        type: String
    }
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', UserSchema, 'user');
