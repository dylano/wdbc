var mongoose = require('mongoose');

var campSchema = mongoose.Schema({
    name: String,
    image: String, 
    description: String
});

module.exports = mongoose.model("Camp", campSchema);
