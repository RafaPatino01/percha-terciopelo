//Get ID of current publicacion
const href = window.location.href.toString()
var n = href.lastIndexOf('/');
var id = href.substring(n + 1);

// Cargar el post necesario
loadPost(id);

// ----- MY FUNCTIONS -----

async function getData(p_endpoint) {
    const response = await fetch(p_endpoint);
    const data = await response.json(); 
    return data;
}

// Cargar todos los posts al html 
async function loadPost(p_id) {
    var post = await getData("/get_post/"+p_id);

    document.getElementById("title").innerHTML += '<b>'+ post[0].title +'</b>';
    document.getElementById("date").innerHTML += '<b>'+ post[0].date.substring(0, 7) +'</b>';
    document.getElementById("descr").innerHTML += '<b>'+ post[0].descr +'</b>';

    
}




