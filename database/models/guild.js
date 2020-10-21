const mongoose = require("mongoose");

const Guild = new mongoose.Schema({
    _id: String,

    roles: [{
        role: String,
        channels: Array,
        autorole: Boolean,
        time: Number
    }],

    auth: [ String ],

    time: [{
        user: String,
        channel: String,
        time: Number,
    }],

    roleMessage: String
});

module.exports = mongoose.model('Guild', Guild);