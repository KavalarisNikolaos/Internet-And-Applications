const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    url:String,
    brief_summary: String,
    criteria: String,
    condition: [{cond_name: String}]

});

module.exports= mongoose.model('trial',PostSchema,'data');

