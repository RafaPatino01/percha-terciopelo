// formatea fecha

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}



// Fetch de la base de datos
async function getData(p_endpoint) {
    const response = await fetch(p_endpoint);
    const data = await response.json();
    return data;
}

// load individual post of section
async function load(p_section) {
    const href = window.location.href.toString()
    var n = href.lastIndexOf('/');
    var id = href.substring(n + 1); // get id
     
    var no_result = '{"error":"no_result"}';

    // Which section will be loaded
    switch(p_section) {
        case "stories":
            console.log("something");
            break;

        case "interview":
            var data = await getData("/get_interview/"+id);
            if (JSON.stringify(data) != no_result )
            {
                var title = data[0].title;
                var descr = data[0].descr;
                var author = data[0].author;
                var location = data[0].location;
                var date = data[0].date;
                var location_date = location.toUpperCase() + " / " + date.substring(0, date.length - 17);
                var main_text = data[0].main_text;
                var secondary_text = data[0].secondary_text;
                var spotify = data[0].spotify;
                var img = await getData("/get_im_interview/" + id)
                var l_arr = "/interviews_img/"+img[0].url+".png";

                document.getElementById("title").innerHTML = title;
                document.getElementById("descr").innerHTML = descr;
                document.getElementById("author").innerHTML = author;
                document.getElementById("location_date").innerHTML = location_date;
                document.getElementById("main_text").innerHTML = main_text;
                document.getElementById("secondary_text").innerHTML = '<img class="int_img" src="'+ l_arr +'">' + secondary_text;
                document.getElementById("spotify").innerHTML += spotify;

            }
            break;

        default:
            console.log("wrong parameter");
            break;
    }
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
    var stories_all = await getData("/get_allposts");
    var no_result = '{"error":"no_result"}';

    var stories = [];

    // Filtrar las que son para desktop
    for(var i = 0; i<stories_all.length; i++) {
        if(stories_all[i].status == 1) {
            stories.push(stories_all[i]);
        }
    }

    var l = stories.length;
    if (JSON.stringify(stories) != no_result ){

        var images = await loadImages(stories[0].id) ;
        document.getElementById("carouselMain").innerHTML = `
        <div class="carousel-item col-12 col-sm-6 col-md-4 active">
            <a href="/stories_post/`+ stories[0].id +`" role="button">
                <img src="`+  `/stories_img/`+ images[0] +`.png"`  +` class="img-fluid mx-auto d-block w-100" alt="img2">
            </a>
        </div>
        `;

        for(var i = 1; i < l; i++){
            images = await loadImages(stories[i].id) ;
            document.getElementById("carouselMain").innerHTML += `
            <div class="carousel-item col-12 col-sm-6 col-md-4 ">
                <a href="/stories_post/`+ stories[i].id +`" role="button" >
                    <img src="`+  `/stories_img/`+ images[0] +`.png"`  +` class="img-fluid mx-auto d-block w-100" alt="img2" style="object-fit: cover">
                </a>
            </div>
            `;
        }

        for(var i = l; i < 6; i++) {
            if(i % 2 == 0) {
            document.getElementById("carouselMain").innerHTML += `
            <div class="carousel-item col-12 col-sm-6 col-md-4">
                <img src="/img/comingsoon.jpg" class="img-fluid mx-auto d-block w-100" alt="img8">
            </div>
            `;
            }
            else {
            document.getElementById("carouselMain").innerHTML += `
            <div class="carousel-item col-12 col-sm-6 col-md-4">
                <img src="/img/comingsoon2.jpg" class="img-fluid mx-auto d-block w-100" alt="img8">
            </div>
            `;
            }
        }
    }
}

async function loadStory(){
    const href = window.location.href.toString()
    var n = href.lastIndexOf('/');
    var id = href.substring(n + 1); // get id


    var story = await getData("/get_post/" + id);
    var no_result = '{"error":"no_result"}';
    console.log(story)
    if (JSON.stringify(story) != no_result ){

        var images = await loadImages(id)
        document.getElementById("main").innerHTML = ``;
        for(var i = 1; i < images.length; i++){
            document.getElementById("main").innerHTML+=`
            <div class="section">
                <div class="p fixed w-100 ">
                    <img class="w-100" src="/stories_img/`+ images[i] +`.png" >
                </div>
            </div>
            `;
        }
        for(var i = 0; i <= images.length ; i++) {
            document.getElementById("mystyle").innerText +=`
                .section:nth-child(`+ (i+1) +`) {
                    background-color: #fff;
                    color: #000;
                    top:`+ (i * 100) +`vh;
                    z-index:`+ (i+1) +`;
                }       
                .section:nth-child(`+ (i+1) +`) .fixed {
                    transform: translate(-50%, -50%);
                }
            `;
        }
    }
}


// load interviews
async function loadInterviewsMenu() {
    var interviews = await getData("/get_allinterviews");
    var no_result = '{"error":"no_result"}';

    if (JSON.stringify(interviews) != no_result )
    {
        for(var i = 0; i < interviews.length; i++)
        {
            var img = await getData("/get_im_interview/" + interviews[i].id)
            var l_arr = "/interviews_img/"+img[0].url+".png";
            document.getElementById("output_interviews").innerHTML += `
            <div style="background-image:url('`+ l_arr +`'); background-size: cover; width:460px !important; height:460px; margin:5px;"><br><br><br><br><br><br>
            <a href="/interview_post/`+interviews[i].id+`" style="color:white;"><h1 class="pt-5 pr-5 pl-5 pb-0 text-center text-title text-uppercase">`+interviews[i].title+`</h1><p class="text-center" style="font-style:italic;">`+interviews[i].author+`</p></a>
            </div>
            `;
        }
        $('#output_interviews').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
          });
    }
}


