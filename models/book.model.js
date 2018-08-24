const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    Title: String,
    SubTitle: String,
    ImageURL: {
        type: String,
        validate: {
            validator: v => {
                return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(v);
            },
            message: v => {
                return v + ' is not a valid URL!';
            }
        }   
    },
    Categories: [String],
    Authors: [String],
    ISBN: String
});

module.exports = mongoose.model('Book', bookSchema);
