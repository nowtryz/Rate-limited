import mongoose from 'mongoose'
import bcrypt from 'bcrypt'


const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    surname : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        index: {
            unique: true,
        },
        required: true,
    },
    password : {
        type: String,
        required: true,
        select: false,
    },
})

// Hash the password before we even save it to the database
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt, null);
        next();
    } catch (err) {
        return next(err)
    }
})

// compare password in the database and the one that the user type in
// Arrow functions explicitly prevent binding this, so the method will
// not have access to the document. Hence we use es5 function.
UserSchema.methods.comparePassword = function(password) {
    console.log(password, this.password)
    return bcrypt.compareSync(password, this.password);
}

export default mongoose.model('User', UserSchema)
