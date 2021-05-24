//Get ID of current publicacion
const href = window.location.href.toString()
var n = href.lastIndexOf('/');
var id = href.substring(n + 1);

// Cargar el col necesario
loadCol(id);


// ----- MY FUNCTIONS -----
async function getData(p_endpoint) {
    const response = await fetch(p_endpoint);
    const data = await response.json(); 
    return data;
}

// Cargar todos los cols al html
async function loadCol(p_id) {

    var col = await getData("/get_col/"+p_id);

    document.getElementById("title").innerHTML += '<b>'+ col[0].title +'</b>';
    document.getElementById("date").innerHTML += '<b>'+ col[0].date.substring(0, 7) +'</b>';
    document.getElementById("descr").innerHTML += '<b>'+ col[0].descr +'</b>';

    document.getElementById("text1").innerHTML += '<b>'+ col[0].main_text +'</b>';

    var imgURLs = await getData("/get_im_col/"+col[0].id);
    console.log(imgURLs);

    var portadaURL = imgURLs[0]["url"]+".png";
    document.getElementById("output_img").innerHTML += '<img class="w-100" src="/uploads/'+portadaURL+'">';
}




