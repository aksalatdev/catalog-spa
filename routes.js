const express = require("express")
const Baju = require("./models/baju") // new
const Sepatu = require("./models/sepatu") // new
const Topi = require("./models/topi") // new
const Hero = require("./models/hero") // new
const About = require("./models/about")
const Service = require("./models/service")
const Catalog = require("./models/catalog")
const Auth = require("./models/Auth")
const router = express.Router()
var jwt = require('jsonwebtoken')
var path = require('path');

var cors = require('cors')
router.use(cors())


// function untuk mengecek token
function isAuthenticated(req, res, next){
	var token = req.header('auth-token') ||req.params.id; //req.body.token || req.query.token || req.headers.authorization; // mengambil token di antara request
	if(token){ //jika ada token
	  jwt.verify(token, 'jwtsecret', function(err, decoded){ //jwt melakukan verify
		if (err) { // apa bila ada error
		  res.json({message: 'Failed to authenticate token'}); // jwt melakukan respon
		 
		

		}else { // apa bila tidak error
		  req.decoded = decoded; // menyimpan decoded ke req.decoded
		  next(); //melajutkan proses
		}
	  });
	}else { // apa bila tidak ada token
	  return res.status(403).send({message: 'No token provided.'}); // melkukan respon kalau token tidak ada
	}
  }

  // function untuk refresh token
  router.post("/refresh_token", async (req, res) => {
	var last_username=req.body.username;
	var last_token=req.body.last_token;

	jwt.verify(last_token, 'jwtsecret', function(err, decoded){ //jwt melakukan verify
		if (err) { // apa bila ada error
		  res.json({message: 'Failed to authenticate token'}); // jwt melakukan respon
		 
		}else { // apa bila tidak error
		  req.decoded = decoded; // menyimpan decoded ke req.decoded
		  
		 // terbitkan token baru
		  var token = jwt.sign({last_username}, 'jwtsecret', {algorithm: 'HS256', expiresIn:'10s'});
	
		  return res.status(200).json({
		  
		  
			  token:token,
			  status: res.statusCode,
			  message: 'Token Baru!'
		  })
		  



		}

	})
})

//function untuk cek apa boleh akses halaman
router.post("/cek_page", async (req, res) => {

	var old_token= req.body.old_token ;
	jwt.verify(old_token, 'jwtsecret', function(err, decoded){ //jwt melakukan verify
		if (err) { // apa bila ada error
		 // res.json({message: 'Halaman Tidak Diijinkan Diakses'}); // jwt melakukan respon
		 
		 return res.status(200).json({
			message: 'not_ok'
	  })
	
	
		}else { 
	
		  return res.status(200).json({
				message: 'ok'
		  })
		 
		}
	
		})
	
	})

	// Get all posts


router.get("/ambilpostadmin",isAuthenticated, async (req, res, next) => {

	const ambil = await Baju.find()
	res.send(ambil)
})





	// Router Untuk Authentication dan Token ====


router.post("/login_auth", async (req, res) => {


	const user = await Auth.findOne({username: req.body.username,pass: req.body.pass})
	if(!user) return res.status(400).json({
		status: res.statusCode,
		message: 'Gagal Login!'
	})
	else
	
	
	var token = jwt.sign({username: req.body.username}, 'jwtsecret', {algorithm: 'HS256', expiresIn:'10s'}); //token expire dalam 10 detik
	
	return res.status(200).json({
	
	
		token:token,
		username:req.body.username,
		status: res.statusCode,
		message: 'Sukses Login!'
	})
	
	})


//Router untuk GET SPA page
router.get("/", async (req, res) => {
	//	res.send('Hello helo dunia!')
	
		res.sendFile(path.join(__dirname + '/view/index.html'));
	
	
	})

	router.get("/admin/",async (req, res) => {

		res.sendFile(path.join(__dirname + '/view/admin_dashboard.html'));
	
	
	})

	router.get("/login",async (req, res) => {

		res.sendFile(path.join(__dirname + '/view/login.html'));
	
	
	})

//====Router Untuk baju====
// Get all posts
router.get("/ambilbaju", async (req, res) => {

	const ambilbaju = await Baju.find()
	res.send(ambilbaju)
})

// posting data
router.post("/ambilbaju", async (req, res) => {
	const ambilbaju = new Baju({
		judul: req.body.judul,
		isi: req.body.isi,
		url_gambar: req.body.url_gambar
	})
	await ambilbaju.save()
	res.send(ambilbaju)
})

// update salah satu data di database
router.patch("/ambilbaju/:id", async (req, res) => {
	try {
		const ambilbaju = await Baju.findOne({ _id: req.params.id })
	if (req.body.judul) {
		ambilbaju.judul = req.body.judul
	}
	if (req.body.isi) {
		ambilbaju.isi = req.body.isi
	}
	if (req.body.url_gambar) {
		ambilbaju.url_gambar = req.body.url_gambar
	}
	await ambilbaju.save()
		res.send(ambilbaju) 
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" }) }
})

//Delete data
router.delete("/ambilbaju/:id", async (req, res) => {
	try {
	await Baju.deleteOne({ _id: req.params.id })
		res.status(204).send() } catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" }) }
	})

//ambil data spesifik 
router.get("/ambilbaju/:id", async (req, res) => { 
	try { 
		const ambilbaju = await Baju.findOne({ _id: 
			req.params.id }) 
			res.send(ambilbaju) 
		} catch { 
			res.status(404) 
			res.send({ error: "Post doesn't exist!" }) 
		} 
	})	




//====Router Untuk sepatu====
// Get all posts
router.get("/ambilsepatu", async (req, res) => {

	const ambilsepatu = await Sepatu.find()
	res.send(ambilsepatu)
})

// posting data
router.post("/ambilsepatu", async (req, res) => {
	const ambilsepatu = new Sepatu({
		judul: req.body.judul,
		isi: req.body.isi,
		url_gambar: req.body.url_gambar
	})
	await ambilsepatu.save()
	res.send(ambilsepatu)
})

// update salah satu data di database
router.patch("/ambilsepatu/:id", async (req, res) => {
	try {
		const ambilsepatu = await Sepatu.findOne({ _id: req.params.id })
	if (req.body.judul) {
		ambilsepatu.judul = req.body.judul
	}
	if (req.body.isi) {
		ambilsepatu.isi = req.body.isi
	}
	await ambilsepatu.save()
		res.send(ambilsepatu) 
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" }) }
})

//Delete data
router.delete("/ambilsepatu/:id", async (req, res) => {
	try {
	await Sepatu.deleteOne({ _id: req.params.id })
		res.status(204).send() } catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" }) }
	})

//ambil data spesifik 
router.get("/ambilsepatu/:id", async (req, res) => { 
	try { 
		const ambilsepatu = await Sepatu.findOne({ _id: 
			req.params.id }) 
			res.send(ambilsepatu) 
		} catch { 
			res.status(404) 
			res.send({ error: "Post doesn't exist!" }) 
		} 
	})	

	//====Router Untuk topi====
// Get all posts
router.get("/ambiltopi", async (req, res) => {

	const ambiltopi = await Topi.find()
	res.send(ambiltopi)
})

// posting data
router.post("/ambiltopi", async (req, res) => {
	const ambiltopi = new Topi({
		judul: req.body.judul,
		isi: req.body.isi,
		url_gambar: req.body.url_gambar
	})
	await ambiltopi.save()
	res.send(ambiltopi)
})

// update salah satu data di database
router.patch("/ambiltopi/:id", async (req, res) => {
	try {
		const ambiltopi = await Topi.findOne({ _id: req.params.id })
	if (req.body.judul) {
		ambiltopi.judul = req.body.judul
	}
	if (req.body.isi) {
		ambiltopi.isi = req.body.isi
	}
	await ambiltopi.save()
		res.send(ambiltopi) 
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" }) }
})

//Delete data
router.delete("/ambiltopi/:id", async (req, res) => {
	try {
	await Topi.deleteOne({ _id: req.params.id })
		res.status(204).send() } catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" }) }
	})

//ambil data spesifik 
router.get("/ambiltopi/:id", async (req, res) => { 
	try { 
		const ambiltopi = await Topi.findOne({ _id: 
			req.params.id }) 
			res.send(ambiltopi) 
		} catch { 
			res.status(404) 
			res.send({ error: "Post doesn't exist!" }) 
		} 
	})

		//====Router Untuk topi====
// Get all posts
router.get("/ambilhero", async (req, res) => {

	const ambilhero = await Hero.find()
	res.send(ambilhero)
})

//====Router Untuk about====
// Get all posts
router.get("/ambilabout", async (req, res) => {

	const ambilabout = await About.find()
	res.send(ambilabout)
})

// posting data
router.post("/ambilabout", async (req, res) => {
	const ambilabout = new About({
		content: req.body.content
	})
	await ambilabout.save()
	res.send(ambilabout)
})

// update salah satu data di database
router.patch("/ambilabout/:id", async (req, res) => {
	try {
		const ambilabout = await About.findOne({ _id: req.params.id })
	if (req.body.content) {
		ambilabout.content = req.body.content
	}
	await ambilabout.save()
		res.send(ambilabout) 
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" }) }
})

//Delete data
router.delete("/ambilabout/:id", async (req, res) => {
	try {
	await about.deleteOne({ _id: req.params.id })
		res.status(204).send() } catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" }) }
	})

//ambil data spesifik 
router.get("/ambilabout/:id", async (req, res) => { 
	try { 
		const ambilabout = await About.findOne({ _id: 
			req.params.id }) 
			res.send(ambilabout) 
		} catch { 
			res.status(404) 
			res.send({ error: "Post doesn't exist!" }) 
		} 
	})


	//====Router Untuk service====
// Get all posts
router.get("/ambilservice", async (req, res) => {

	const ambilservice = await Service.find()
	res.send(ambilservice)
})

// posting data
router.post("/ambilservice", async (req, res) => {
	const ambilservice = new Service({
		content: req.body.content
	})
	await ambilservice.save()
	res.send(ambilservice)
})

// update salah satu data di database
router.patch("/ambilservice/:id", async (req, res) => {
	try {
		const ambilservice = await Service.findOne({ _id: req.params.id })
	if (req.body.content) {
		ambilservice.content = req.body.content
	}
	await ambilservice.save()
		res.send(ambilservice) 
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" }) }
})

//Delete data
router.delete("/ambilservice/:id", async (req, res) => {
	try {
	await service.deleteOne({ _id: req.params.id })
		res.status(204).send() } catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" }) }
	})

//ambil data spesifik 
router.get("/ambilservice/:id", async (req, res) => { 
	try { 
		const ambilservice = await Service.findOne({ _id: 
			req.params.id }) 
			res.send(ambilservice) 
		} catch { 
			res.status(404) 
			res.send({ error: "Post doesn't exist!" }) 
		} 
	})


	//====Router Untuk catalog====
// Get all posts
router.get("/ambilcatalog", async (req, res) => {

	const ambilcatalog = await Catalog.find()
	res.send(ambilcatalog)
})

// posting data
router.post("/ambilcatalog", async (req, res) => {
	const ambilcatalog = new Catalog({
		content: req.body.content
	})
	await ambilcatalog.save()
	res.send(ambilcatalog)
})

// update salah satu data di database
router.patch("/ambilcatalog/:id", async (req, res) => {
	try {
		const ambilcatalog = await Catalog.findOne({ _id: req.params.id })
	if (req.body.content) {
		ambilcatalog.content = req.body.content
	}
	await ambilcatalog.save()
		res.send(ambilcatalog) 
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" }) }
})

//Delete data
router.delete("/ambilcatalog/:id", async (req, res) => {
	try {
	await service.deleteOne({ _id: req.params.id })
		res.status(204).send() } catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" }) }
	})

//ambil data spesifik 
router.get("/ambilcatalog/:id", async (req, res) => { 
	try { 
		const ambilservice = await Catalog.findOne({ _id: 
			req.params.id }) 
			res.send(ambilcatalog) 
		} catch { 
			res.status(404) 
			res.send({ error: "Post doesn't exist!" }) 
		} 
	})
		

module.exports = router