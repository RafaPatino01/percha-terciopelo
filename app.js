// REQUIRED STUFF --------------------------------------------------------------------
const bodyParser = require('body-parser');
const express = require('express')
const path = require('path');
const multer = require('multer');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 9000;

// Set Favicon
var favicon = require('serve-favicon');
app.use(favicon(path.join(__dirname, 'src/img/', 'icon.ico')));

var upload = multer();

// Parse json data
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// For multi form data
app.use(upload.array());

//Secure SHA256
let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}

// Admin Login -----------------------------------------------------------------
var session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secret_perchamagasin',
  resave: false,
  saveUninitialized: false
}))

app.get('/check_login/:pass', function(req, res) {

	const {pass } = req.params; //sin hash

	var hashed_input = crypto.createHmac('sha256', pass)
				   .digest('hex');

	if(hashed_input=="6d6cd63284be4a47ba7aec4a3458939a95dcbdd5cd0438f23d7457099b4b917c")
	{
		req.session.flag = 1;
		res.send("1"); // OUI correcto paswordo
	}
	else 
	{
		req.session.flag = 0;
		res.send("0"); // Not so correctou
	}
});





// MYSQL  ----------------------------------------------------------------------------

// Heroku DB
// mysql://b375ab530b6efd:cf4ade3a@us-cdbr-east-03.cleardb.com/heroku_a16f974a985f837?reconnect=true

var db_config = {
	host:"us-cdbr-east-03.cleardb.com",
	user:"b375ab530b6efd",
	password: "cf4ade3a",
	database:"heroku_a16f974a985f837"
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }
    else {
    	console.log("Database server running...");
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();


// ENDPOINTS --------------------------------------------------------------------

// get all posts
app.get('/get_allposts', function(req, res) {

    const sql = 'SELECT * FROM posts WHERE status>0';

    connection.query(sql,(err,result)=>{
    	if(err){
    		throw err;
    	}
    	if(result.length > 0) {
    		res.json(result);
    	}
    	else {
    		res.send('{"error":"no_result"}');
    	}
    });
});

// get DESTACADOS posts
app.get('/get_destacados', function(req, res) {

    const sql = 'SELECT * FROM posts WHERE status=2';

    connection.query(sql,(err,result)=>{
    	if(err){
    		throw err;
    	}
    	if(result.length > 0) {
    		res.json(result);
    	}
    	else {
    		res.send('{"error":"no_result"}');
    	}
    });
});

// get post by ID
app.get('/get_post/:id', function(req, res) {
    
    const {id } = req.params
    const sql = `SELECT * FROM posts WHERE id=${id} AND status>0`;

    connection.query(sql,(err,result)=>{
    	if(err){
    		throw err;
    	}
    	if(result.length > 0) {
    		res.json(result);
    	}
    	else {
    		res.send('{"error":"no_result"}');
    	}
    });
});

// get all cols
app.get('/get_allcols', function(req, res) {

    const sql = 'SELECT * FROM cols WHERE status>0';

    connection.query(sql,(err,result)=>{
    	if(err){
    		throw err;
    	}
    	if(result.length > 0) {
			
    		res.json(result);
    	}
    	else {
    		res.send('{"error":"no_result"}');
    	}
    });
});

// get col by ID
app.get('/get_col/:id', function(req, res) {
    
    const {id } = req.params
    const sql = `SELECT * FROM cols WHERE id=${id} AND status>0`;

    connection.query(sql,(err,result)=>{
    	if(err){
    		throw err;
    	}
    	if(result.length > 0) {
    		res.json(result);
    	}
    	else {
    		res.send('{"error":"no_result"}');
    	}
    });
});

// get image URL by post ID
app.get('/get_im_url/:id', function(req, res) {

	const id = req.params["id"];

    const sql = 'SELECT * FROM posts_images WHERE post_id='+id;

    connection.query(sql,(err,result)=>{
    	if(err){
    		throw err;
    	}
    	if(result.length > 0) {
    		res.json(result);
    	}
    	else {
    		res.send('{"error":"no_result"}');
    	}
    });
});

// get image URL by col ID
app.get('/get_im_col/:id', function(req, res) {

	const id = req.params["id"];

    const sql = 'SELECT * FROM cols_images WHERE post_id='+id;

    connection.query(sql,(err,result)=>{
    	if(err){
    		throw err;
    	}
    	if(result.length > 0) {
    		res.json(result);
    	}
    	else {
    		res.send('{"error":"no_result"}');
    	}
    });
});


// add post
app.post('/add_post', function (req, res) {

	console.log('Recieved: ' + typeof(req.body.title)) //ACCESS DATA FROM FORM
	console.log('Recieved: ' + typeof(req.body.im0))

	const sql = 'INSERT INTO posts SET ?';

	const postObject = {
		title: req.body.title,
		descr: req.body.descr,
		date: req.body.date,
		main_text: req.body.main_text,
		secondary_text: req.body.secondary_text,
		status: req.body.status
	}

	connection.query(sql, postObject, (err, result)=> {
		if(err) {
			throw err;
		}
		else {
			res.send("Added post");

			console.log("LAST INSERTED ID: " + result.insertId);

			const sql2 = 'INSERT INTO posts_images SET ?';
			let base64Data = req.body.im;

			for (var i = 0; i < req.body.n; i++) { // For each image

				let postObject2 = {
					url: req.body.title+i,
					post_id: result.insertId
				}

				connection.query(sql2, postObject2, (err, result)=> { // Write to database
					if(err) { 
						throw err;
					}
				});

				// Write image to folder
				require("fs").writeFile("src/uploads/" + req.body.title + i + ".png", base64Data.split('|')[i], 'base64', function(err) {
		  		console.log(err);
				});

				console.log("Added image: " + req.body.title+ i + ".png")
			}
		}
	});

})

// add post
app.post('/add_col', function (req, res) {

	console.log('Recieved: ' + typeof(req.body.title)) //ACCESS DATA FROM FORM
	console.log('Recieved: ' + typeof(req.body.im0))

	const sql = 'INSERT INTO cols SET ?';

	const postObject = {
		title: req.body.title,
		descr: req.body.descr,
		date: req.body.date,
		main_text: req.body.main_text,
		status: 1
	}

	connection.query(sql, postObject, (err, result)=> {
		if(err) {
			throw err;
		}
		else {
			res.send("Added col");

			console.log("LAST INSERTED ID: " + result.insertId);

			const sql2 = 'INSERT INTO cols_images SET ?';
			let base64Data = req.body.im;

			for (var i = 0; i < req.body.n; i++) { // For each image

				let postObject2 = {
					url: req.body.title+i,
					post_id: result.insertId
				}

				connection.query(sql2, postObject2, (err, result)=> { // Write to database
					if(err) { 
						throw err;
					}
				});

				// Write image to folder
				require("fs").writeFile("src/uploads/" + req.body.title + i + ".png", base64Data.split('|')[i], 'base64', function(err) {
		  		console.log(err);
				});

				console.log("Added image: " + req.body.title+ i + ".png")
			}
		}
	});
})


// edit post
app.put('/edit_post/:id', function (req, res) {
    const id = req.params["id"];
    const title = req.body.title;
    const descr = req.body.descr;

    const date = req.body.date;
    const main_text = req.body.main_text;
    const secondary_text = req.body.secondary_text;
	const status = req.body.status;

    const sql = 'UPDATE posts SET status='+'"'+status+'"'+', title='+'"'+title+'"'+', descr='+'"'+descr+'"'+', date='+'"'+date+'"'+', main_text='+'"'+main_text+'"'+', secondary_text='+'"'+secondary_text+'"'+' WHERE id='+id;

    connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("Post updated");
		}
	});

})
// edit col
app.put('/edit_col/:id', function (req, res) {
    const id = req.params["id"];
    const title = req.body.title;
    const descr = req.body.descr;

    const date = req.body.date;
    const main_text = req.body.main_text;

    const sql = 'UPDATE cols SET title='+'"'+title+'"'+', descr='+'"'+descr+'"'+', date='+'"'+date+'"'+', main_text='+'"'+main_text+'"'+' WHERE id='+id;

    connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("Cols updated");
		}
	});

})

// delete post (status 0)
app.put('/delete_post/:id', function (req, res) {
    const id = req.params["id"];

    const sql = 'UPDATE posts SET status=0 WHERE id='+id;

    connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("Post status set to 0");
		}
	});
})

// delete col (status 0)
app.put('/delete_col/:id', function (req, res) {
    const id = req.params["id"];

    const sql = 'UPDATE cols SET status=0 WHERE id='+id;

    connection.query(sql, err => {
		if(err) {
			throw err;
		}
		else {
			res.send("Col status set to 0");
		}
	});
})

// ADMIN ROUNTING --------------------------------------------------------------------

app.get('/admin', function(req, res) {
    res.sendFile(path.join(__dirname + '/admin/login.html'));
});
app.get('/admin_css', function(req, res) {
    res.sendFile(path.join(__dirname + '/admin/css/login_admin.css'));
});

// js files
app.get('/login_js', function(req, res) {
    res.sendFile(path.join(__dirname + '/admin/js/login.js'));
});
app.get('/functions_js', function(req, res) {
    res.sendFile(path.join(__dirname + '/admin/js/functions.js'));
});

//admin menu
app.get('/admin_all', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/all.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_new', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/new.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_new_col', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/new_columna.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_new_what', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/new_what.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_delete', function(req, res) {
	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/delete.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_edit/:id', function(req, res) {
	const id = req.params["id"];

	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/edit.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});
app.get('/admin_edit_col/:id', function(req, res) {
	const id = req.params["id"];

	if(req.session.flag == 1){ // Admin has logged in
		res.sendFile(path.join(__dirname + '/admin/edit_col.html'));
	}
	else {
		res.sendFile(path.join(__dirname + '/admin/login.html'));
	}
});

app.get('/uploadfile_js', function(req, res) {
    res.sendFile(path.join(__dirname + '/admin/js/uploadfile.js'));
});
app.get('/uploadfile_js2', function(req, res) {
    res.sendFile(path.join(__dirname + '/admin/js/uploadfile2.js'));
});
app.get('/edit_js', function(req, res) {
    res.sendFile(path.join(__dirname + '/admin/js/edit.js'));
});


// Public Routing ----------------------------------------------------------------------

// Send Uploads
app.get('/uploads/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/uploads/'+filename));
});
// Send IMG
app.get('/img/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/img/'+filename));
});
// Send CSS
app.get('/css/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/css/'+filename));
});
// Send JS
app.get('/js/:filename', function(req, res) {
	const filename = req.params["filename"];
	res.sendFile(path.join(__dirname + '/src/js/'+filename));
});

// Send home
app.get('/home', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/home.html'));
});
// Send feat
app.get('/feat', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/feat.html'));
});
// Send news
app.get('/news', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/news.html'));
});
// Send interviews
app.get('/interviews', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/interviews.html'));
});
// Send articles
app.get('/articles', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/articles.html'));
});
// Send contact
app.get('/contact', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/contact.html'));
});
// Send about
app.get('/about', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/about.html'));
});

// Send temp
app.get('/temp', function(req, res) {
	res.sendFile(path.join(__dirname + '/src/template.html'));
});

// SERVER PORT --------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})