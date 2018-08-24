const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    Name: String,
    Email: {
        type: String,
        validate: {
            validator: v => {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: v => {
                return v + ' is not a valid email!';
            }
        }   
    },
    Password: String,
    Books: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model('User', userSchema);
