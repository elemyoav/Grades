const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
            type: String,
            required: true
        },
    grades: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Grade'
        }
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;