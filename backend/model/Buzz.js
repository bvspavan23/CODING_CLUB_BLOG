const mongoose = require('mongoose');
const RoomSchema = mongoose.Schema;

const BuzzSchema = new RoomSchema({
    name: {
        type: String,
        required: true,
    },
    roomId: {
        type: String,
        required: true,
    }     
});

module.exports = mongoose.model('Buzz', BuzzSchema);