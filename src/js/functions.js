// Fetch de la base de datos
async function getData(p_endpoint) {
    const response = await fetch(p_endpoint);
    const data = await response.json();
    return data;
}


// load image by Id
async function loadImages(p_id) {

    var images = await getData("/get_im_url/"+p_id);

    var urls =[];
    for(var i = 0; i < images.length; i++)
    {
        urls.push(images[i].url);
    }
    return urls
}
//load Stories carousel
async function loadStoriesMenu(){
    var stories = await getData("/get_allposts");
    var no_result = '{"error":"no_result"}';
    var l = stories.length;
    if (JSON.stringify(stories) != no_result ){

        var images = await loadImages(stories[0].id) ;
        document.getElementById("carouselMain").innerHTML = `
        <div class="carousel-item col-12 col-sm-6 col-md-4 active">
            <img src="`+  `/stories_img/`+ images[0] +`.png"`  +` class="img-fluid mx-auto d-block w-100" alt="img2">
        </div>
        `;

        for(var i = 1; i < l; i++){
            images = await loadImages(stories[i].id) ;
            document.getElementById("carouselMain").innerHTML += `
            <div class="carousel-item col-12 col-sm-6 col-md-4 ">
                <img src="`+  `/stories_img/`+ images[0] +`.png"`  +` class="img-fluid mx-auto d-block w-100" alt="img2">
            </div>
            `;
        }

        for(var i = l; i < 6; i++) {
            document.getElementById("carouselMain").innerHTML += `
            <div class="carousel-item col-12 col-sm-6 col-md-4">
                <img src="https://via.placeholder.com/150" class="img-fluid mx-auto d-block w-100" alt="img8">
            </div>
            `;
        }
    }
}