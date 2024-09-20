const mongoose = require('mongoose');

const Estate = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
})

module.exports = mongoose.model('Estate', Estate);