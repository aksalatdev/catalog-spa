const mongoose = require("mongoose")
const schema = mongoose.Schema({
    content: String
    })
module.exports = mongoose.model("Catalog", schema)