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

    document.getElementById("subtitle").innerHTML += '<b>'+ post[0].descr +'</b>';
    document.getElementById("text1").innerHTML += '<b>'+ post[0].main_text +'</b>';
    document.getElementById("text2").innerHTML += '<b>'+ post[0].secondary_text +'</b>';

    var imgURLs = await getData("/get_im_url/"+post[0].id);
    console.log(imgURLs);

    var portadaURL = imgURLs[0]["url"]+".png";
    document.getElementById("output_img").innerHTML += '<img class="w-100" src="/uploads/'+portadaURL+'">';

    for(var i = 1; i<imgURLs.length; i++) {
        var currentURL = imgURLs[i]["url"]+".png";
        document.getElementById("output_img2").innerHTML += '<img class="w-100" src="/uploads/'+currentURL+'"><br><br><br><br>';

    }
}




