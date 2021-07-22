//Get ID of current publicacion

const href = window.location.href.toString()
var n = href.lastIndexOf('/');
var id = href.substring(n + 1);

// Set current info to inputs
async function placeinfo() {

	var info = await getData("/get_post/"+id);

	info = info[0];
	var fecha = info.date.substring(0, info.date.lastIndexOf('T')); //fix date-time

	document.getElementById("title").value = info.title;

	if(info.status == 1){
		document.getElementById("output_checkbox").innerHTML += '<input class="form-check-input" type="checkbox" id="destacado">';
	}
	else {
		document.getElementById("output_checkbox").innerHTML += '<input class="form-check-input" type="checkbox" id="destacado" checked>';
	}

	document.getElementById("date").value = fecha;
	document.getElementById("descr").value = info.descr;
	document.getElementById("main_text").value = info.main_text;
	document.getElementById("secondary_text").value = info.secondary_text;
}

// Prepare current info to db
async function prepare_data() {

	var title = document.getElementById("title").value;
	var date = document.getElementById("date").value;
	var descr = document.getElementById("descr").value;
	var main_text = document.getElementById("main_text").value;
	var secondary_text = document.getElementById("secondary_text").value;

	if(!title || !date || !descr || !main_text || !secondary_text) {
		alert("Missing Fields");
	}
	else {
		send_data(title,date,descr,main_text,secondary_text);
	}

}

// Send current info to server
function send_data(p_title,p_date,p_descr,p_main_text,p_secondary_text) { 

	var data = new FormData();

	data.append('title', p_title);
	data.append('descr', p_descr);

	data.append('date',p_date);
	data.append('main_text', p_main_text);
	data.append('secondary_text', p_secondary_text);

	let destacado = document.getElementById('destacado');
	if(destacado.checked == true){
		data.append('status', "2"); 
	} 
	else {
		data.append('status', "1"); 
	}

	$.ajax({
	url :  "/edit_post/"+id,
	type: 'PUT',
	data: data,
	contentType: false,
	processData: false,
	success: function(data) {
	  alert("Información actualizada correctamente");
	  location.replace("/admin_all");
	},    
	error: function() {
	  alert("Ocurrió un error");
	}
	});

}
// feat
async function placeinfo_feat() {

	var info = await getData("/get_feat/"+id);

	info = info[0];
	var fecha = info.date.substring(0, info.date.lastIndexOf('T')); //fix date-time

	document.getElementById("title").value = info.title;

	if(info.status == 1){
		document.getElementById("output_checkbox").innerHTML += '<input class="form-check-input" type="checkbox" id="destacado">';
	}
	else {
		document.getElementById("output_checkbox").innerHTML += '<input class="form-check-input" type="checkbox" id="destacado" checked>';
	}

	document.getElementById("date").value = fecha;
	document.getElementById("descr").value = info.descr;
	document.getElementById("main_text").value = info.main_text;
	document.getElementById("secondary_text").value = info.secondary_text;
}

// -------- COLUMNAS DE MODA --------
// Set current info to inputs
async function placeinfo2() {

	var info = await getData("/get_col/"+id);

	info = info[0];
	var fecha = info.date.substring(0, info.date.lastIndexOf('T')); //fix date-time

	document.getElementById("title").value = info.title;
	document.getElementById("date").value = fecha;
	document.getElementById("columnista").value = info.columnista;
	document.getElementById("main_text").value = info.main_text;
	document.getElementById("insta").value = info.insta;
	document.getElementById("ocupacion").value = info.ocupacion;
	document.getElementById("loc").value = info.loc;
}
// Prepare current info to db
async function prepare_data2() {

	var title = document.getElementById("title").value;
	var date = document.getElementById("date").value;
	var columnista = document.getElementById("columnista").value;
	var insta = document.getElementById("insta").value;
	var ocupacion = document.getElementById("ocupacion").value;
	var loc = document.getElementById("loc").value;
	var main_text = document.getElementById("main_text").value;

	if(!ocupacion || !insta || !columnista || !title || !date || !loc || !main_text) {
		alert("Missing Fields");
	}
	else {
		send_data2(title,date,columnista,main_text,ocupacion,insta,loc);
	}

}
// Send current info to server
function send_data2(p_title,p_date,p_columnista,p_main_text,p_ocupacion,p_insta,p_loc) { 

	var data = new FormData();

	data.append('title', p_title);
	data.append('ocupacion', p_ocupacion);
	data.append('insta', p_insta);
	data.append('loc', p_loc);
	data.append('columnista', p_columnista);

	data.append('date',p_date);
	data.append('main_text', p_main_text);

	$.ajax({
	url :  "/edit_col/"+id,
	type: 'PUT',
	data: data,
	contentType: false,
	processData: false,
	success: function(data) {
	  alert("Información actualizada correctamente");
	  location.replace("/admin_all");
	},    
	error: function() {
	  alert("Ocurrió un error");
	}
	});
}

// -------- NEWS --------
// Set current info to inputs
async function placeinfo_news() {

	var info = await getData("/get_news/"+id);

	info = info[0];
	var fecha = info.date.substring(0, info.date.lastIndexOf('T')); //fix date-time

	document.getElementById("title").value = info.title;
	document.getElementById("date").value = fecha;
	document.getElementById("subtitle").value = info.subtitle;
	document.getElementById("main_text").value = info.main_text;
}
// Prepare current info to db
async function prepare_data_news() {

	var title = document.getElementById("title").value;
	var date = document.getElementById("date").value;
	var subtitle = document.getElementById("subtitle").value;
	var main_text = document.getElementById("main_text").value;

	if(!title || !date || !subtitle || !main_text) {
		alert("Missing Fields");
	}
	else {
		send_data_news(title,date,subtitle,main_text);
	}
}
// Send current info to server
function send_data_news(p_title,p_date,p_subtitle,p_main_text) { 

	var data = new FormData();

	data.append('title', p_title);
	data.append('subtitle', p_subtitle);

	data.append('date',p_date);
	data.append('main_text', p_main_text);

	$.ajax({
	url :  "/edit_news/"+id,
	type: 'PUT',
	data: data,
	contentType: false,
	processData: false,
	success: function(data) {
	  alert("Información actualizada correctamente");
	  location.replace("/admin_all");
	},    
	error: function() {
	  alert("Ocurrió un error");
	}
	});
}



// -------- INTERVIEW --------
// Set current info to inputs
async function placeinfo_interview() {

	var info = await getData("/get_interview/"+id);

	info = info[0];
	var fecha = info.date.substring(0, info.date.lastIndexOf('T')); //fix date-time

	document.getElementById("title").value = info.title;
	document.getElementById("location").value = info.location;
	document.getElementById("author").value = info.author;
	document.getElementById("date").value = fecha;
	document.getElementById("descr").value = info.descr;
	document.getElementById("spotify").value = info.spotify;
	document.getElementById("main_text").value = info.main_text;
	document.getElementById("secondary_text").value = info.secondary_text;
}
// Prepare current info to db
async function prepare_data_interview() {

	var title = document.getElementById("title").value;
	var date = document.getElementById("date").value;
	var descr = document.getElementById("descr").value;
	var main_text = document.getElementById("main_text").value;
	var secondary_text = document.getElementById("secondary_text").value;
	var location = document.getElementById("location").value;
	var author = document.getElementById("author").value;
	var spotify = document.getElementById("spotify").value;


	if(!secondary_text || !spotify || !author || !location || !title || !date || !descr || !main_text) {
		alert("Missing Fields");
	}
	else {
		send_data_interview(title,date,descr,main_text,location,author,spotify,secondary_text);
	}
}
// Send current info to server
function send_data_interview(p_title,p_date,p_descr,p_main_text,p_location,p_author,p_spotify,p_secondary_text) { 

	var data = new FormData();

	data.append('title', p_title);
	data.append('location', p_location);
	data.append('author', p_author);
	data.append('descr', p_descr);
	data.append('date',p_date);
	data.append('main_text', p_main_text);
	data.append('secondary_text', p_secondary_text);
	data.append('spotify', p_spotify);

	$.ajax({
	url :  "/edit_interview/"+id,
	type: 'PUT',
	data: data,
	contentType: false,
	processData: false,
	success: function(data) {
	  alert("Información actualizada correctamente");
	  location.replace("/admin_all");
	},    
	error: function() {
	  alert("Ocurrió un error");
	}
	});
}