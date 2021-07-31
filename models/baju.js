const mongoose = require("mongoose")

const schema = mongoose.Schema({
	url_gambar: String
})

module.exports = mongoose.model("Baju", schema)
