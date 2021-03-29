
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

	switch(p_page)
	{
		case "all":
			for(var i = 0; i < posts.length; i++)
			{
				document.getElementById("output_posts").innerHTML += '<div class="row border" id="FadeIn"><div class="col-md-3 bg-orange"><h3>'+ posts[i].title +'</h3></div><div class="col-md-9 bg-lighter"><p class="lead">'+ posts[i].descr +'</p></div></div><br>';
			}
			break;

		case "delete":
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
			break;

		default:
			console.log("wrong parameter");
			break;
	}
}

// Delete post by id
async function deletePost(p_id) {
	const url = "/delete_post/"+p_id;
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






