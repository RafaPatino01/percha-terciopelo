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
                var source = data[0].creditos;
                var img = await getData("/get_im_interview/" + id)
                var l_arr = "/interviews_img/"+img[0].url+".png";

                document.getElementById("title").innerHTML = title;
                document.getElementById("descr").innerHTML = descr;
                document.getElementById("author").innerHTML = author;
                document.getElementById("location_date").innerHTML = location_date;
                document.getElementById("main_text").innerHTML = main_text;
                document.getElementById("secondary_text").innerHTML = `
                    
                    <div class="int_img" style="position: relative; margin: 0 0; margin-bottom: 10px">
                        <div>
                            <img class="int_img" style="position: absolute;top: 0;left: 0;" src="`+ l_arr +`">
                        </div>
                        <div class="row w-100 int_source" style="position: absolute;top: 0;left: 0; height: 100%">
                            <div class="" style="position: absolute; bottom: 0; background-color: white; width: inherit; height: 20px;">
                                <p><b>`+ source +`</b></p>
                            </div>
                        </div>
                    </div>` + secondary_text;

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

        var flag = 1;
        for(var i = l; i < 6; i++) {
            if(flag > 2) {
            document.getElementById("carouselMain").innerHTML += `
            <div class="carousel-item col-12 col-sm-6 col-md-4">
                <img src="/img/PERCHA.jpg" class="img-fluid mx-auto d-block w-100" alt="img8">
            </div>
            `;
            }
            else {
            document.getElementById("carouselMain").innerHTML += `
            <div class="carousel-item col-12 col-sm-6 col-md-4">
                <img src="/img/comingsoon`+flag+`.jpg" class="img-fluid mx-auto d-block w-100" alt="img8">
            </div>
            `;
            }
            flag++;
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
            <div style="background-image:url('`+ l_arr +`'); background-size: cover; width:460px !important; height:460px; margin:5px; box-shadow:inset 0 0 0 2000px rgba(0, 0, 0, 0.25);"><br><br><br><br><br><br>
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

//load news
async function loadNewsMenu(){
    var news = await getData("/get_allnews");
    console.log(news)
    var no_result = '{"error":"no_result"}';

    if (JSON.stringify(news) != no_result )
    {
        for(var i = 0; i < news.length; i++)
        {
            var img = await getData("/get_im_news/" + news[i].id)
            var l_arr = "/news_img/"+img[0].url+".png";
            document.getElementById("output_news").innerHTML += `
            
                <div style="cursor: pointer" onclick="location.href='/news_post/`+ news[i].id +`'" class="m-5 noticia" url="`+ l_arr +`">
                    <h6><b>`+ news[i].subtitle +` / `+ formatDate( news[i].date) +` </b></h6>
                    <p class="lead">`+ news[i].title +`</p>
                </div>
            
            `;
        }
    }
    // Change noticia image on hover!
    $("div.noticia")
        .mouseenter(function() {
            console.log($( this ).attr("url"));

            var url = $( this ).attr("url"); // Read atribute from element
            $("#noticia-img").attr("src",url);
            $("#noticia-img").removeClass('not-visible');

        })
        .mouseleave(function() {
            console.log($( this ).attr("url"));
            // $("#noticia-img").attr("src","https://www.colorhexa.com/ffffff.png");
            $("#noticia-img").addClass('not-visible');
        })
}

async function loadNews(){
    const href = window.location.href.toString()
    var n = href.lastIndexOf('/');
    var id = href.substring(n + 1); // get id


    var news = await getData("/get_news/" + id);
    console.log(news)
    var no_result = '{"error":"no_result"}';
    console.log(news)
    if (JSON.stringify(news) != no_result ){

        document.getElementById("Title").innerText = news[0].subtitle;
        document.getElementById("mainText").innerText = news[0].main_text;
        document.getElementById("subTitle").innerText = news[0].title +` / `+ formatDate( news[0].date);


        var img = await getData("/get_im_news/" + id)
        document.getElementById("car_images").innerHTML =`
                  <div class="carousel-item active">
                    <img class="d-block w-100 fit-img" src="/news_img/`+img[0].url+`.png">
                  </div>
            `;
        for(var i = 1; i <= img.length ; i++) {
            document.getElementById("car_images").innerHTML +=`
                  <div class="carousel-item">
                    <img class="d-block w-100 fit-img" src="/news_img/`+img[i].url+`.png">
                  </div>
            `;
        }
    }
}

