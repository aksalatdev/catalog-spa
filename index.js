const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes")
var path = require('path');

mongoose
.connect("mongodb+srv://restapi:restapi@cluster0.dwbay.mongodb.net/uts?retryWrites=true&w=majority", { useNewUrlParser: true })
	.then(() => {
		const app = express()
		app.use(express.json()) // new
		app.use("/api", routes)
		app.use(express.static(path.join(__dirname,'cssdll')));

		app.listen(3000, () => {
			console.log("Server has started!")
		})
	})
