
// Functions.js tiene todas las funciones que se ejecutan en el cliente

// Fetch de la base de datos
async function getData(p_endpoint) {
	const response = await fetch(p_endpoint);
	const data = await response.json(); 
	return data;
}

// Cargar todos los posts al html
async function loadPosts(p_page) {
	var posts = await getData("/get_allposts");
	var cols = await getData("/get_allcols");

	var no_result = '{"error":"no_result"}';

	switch(p_page)
	{
		case "all":
			if (JSON.stringify(posts) != no_result){
				for(var i = 0; i < posts.length; i++)
				{
					if(posts[i].status == 2){
						var destacado = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-bookmark-star" viewBox="0 0 16 16">
						<path d="M7.84 4.1a.178.178 0 0 1 .32 0l.634 1.285a.178.178 0 0 0 .134.098l1.42.206c.145.021.204.2.098.303L9.42 6.993a.178.178 0 0 0-.051.158l.242 1.414a.178.178 0 0 1-.258.187l-1.27-.668a.178.178 0 0 0-.165 0l-1.27.668a.178.178 0 0 1-.257-.187l.242-1.414a.178.178 0 0 0-.05-.158l-1.03-1.001a.178.178 0 0 1 .098-.303l1.42-.206a.178.178 0 0 0 .134-.098L7.84 4.1z"/>
						<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
						</svg>`;
					}
					else {
						var destacado = "";
					}
					document.getElementById("output_posts").innerHTML += `
					<div class="row border" id="FadeIn">
						<div class="col-md-3 bg-orange p-3">
						<h3>`+ posts[i].title +`</h3>
						<p>`+ posts[i].date.substring(0, 7) +`</p>`+destacado+`
						</div>
						<div class="col-md-8 bg-lighter">
							<div class="row p-3">
							<p class="lead">`+ posts[i].descr +`</p>
							</div>
							
							<div class="row border-top p-3">
							<p>`+ posts[i].main_text.substring(0, 150) +`...</p>
							</div>
						</div>
						<div class="col-md-1 bg-lighter border-left pt-5">
							<h5><a href="/admin_edit/`+posts[i].id+`"><i>EDIT</i></a></h5>
						</div>
					</div><br>
					`;
				}
			}
			else {
				document.getElementById("output_posts").innerHTML += "No hay posts";
			}
			
			if (JSON.stringify(cols) != no_result){
				for(var i = 0; i < cols.length; i++)
				{
					document.getElementById("output_cols").innerHTML += `
					<div class="row border" id="FadeIn">
						<div class="col-md-3 bg-purple p-3">
						<h3>`+ cols[i].title +`</h3>
						<p>`+ cols[i].date.substring(0, 7) +`</p>
						</div>
						<div class="col-md-8 bg-lighter2">
							<div class="row p-3">
							<p class="lead">`+ cols[i].descr +`</p>
							</div>
							
							<div class="row border-top p-3">
							<p>`+ cols[i].main_text.substring(0, 150) +`...</p>
							</div>
						</div>
						<div class="col-md-1 bg-lighter2 border-left pt-5">
							<h5><a href="/admin_edit_col/`+cols[i].id+`"><i>EDIT</i></a></h5>
						</div>
					</div><br>
					`;
				}
			}
			else {
				document.getElementById("output_cols").innerHTML += "No hay cols";
			}
			
			break;

		case "delete":
			if (JSON.stringify(posts) != no_result){
				for(var i = 0; i < posts.length; i++)
				{
					document.getElementById("output_posts").innerHTML += `
						<div class="row border" id="FadeIn">
							<div class="col-md-1 bg-lighter text-right">
							<a class="btn" href="/admin_delete" onclick="deletePost(`+ posts[i].id +`);">
							  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
								<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
								<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
							  </svg>
							</a>
							</div>
							<div class="col-md-11 bg-orange">
							  <h3>`+ posts[i].title +`</h3>
							</div>
						</div><br>
					`;
				}
			}
			else {
				document.getElementById("output_posts").innerHTML += "No hay posts";
			}
			
			if (JSON.stringify(cols) != no_result){
				for(var i = 0; i < cols.length; i++)
				{
					document.getElementById("output_posts").innerHTML += `
					<div class="row border" id="FadeIn">
						<div class="col-md-1 bg-lighter2 text-right">
						<a class="btn" href="/admin_delete" onclick="deleteCol(`+ cols[i].id +`);">
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
							<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
							<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
						</svg>
						</a>
						</div>
						<div class="col-md-11 bg-purple">
						<h3>`+ cols[i].title +`</h3>
						</div>
					</div><br>
					`;
				}
			}
			else {
				document.getElementById("output_posts").innerHTML += "No hay cols";
			}
			break;

		default:
			console.log("wrong parameter xd");
			break;
	}
}

// Delete post by id
async function deletePost(p_id) {
	const url = "/delete_post/"+p_id;
	const response = await fetch(url, { method: 'PUT' });
}

// Delete col by id
async function deleteCol(p_id) {
	const url = "/delete_col/"+p_id;
	const response = await fetch(url, { method: 'PUT' });
}

// load image by Id
async function loadImages(p_id) {

	var images = await getData("/get_im_url/"+p_id);

	console.log(images);

	for(var i = 0; i < images.length; i++)
	{
		document.getElementById("output_images").innerHTML += "<img src='/uploads/" + images[i].url + ".png'><br><br>";
	}
}




