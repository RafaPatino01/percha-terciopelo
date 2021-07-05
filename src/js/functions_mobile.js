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
        case "story":
            var story = await getData("/get_post/"+id);
            if (JSON.stringify(story) != no_result )
            {
                var images = await loadImages(id)
                document.getElementById("main").innerHTML = ``;
                for(var i = 1; i < images.length; i++){
                    document.getElementById("main").innerHTML+=`
                    <div class="section bg-black">
                        <div class="p fixed w-100 h-100">
                            <img class="w-100" src="/stories_img/`+ images[i] +`.png">
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

                document.getElementById("output_interview").innerHTML = `
                <img class="w-100 interview-img" src="`+l_arr+`">
                <div class="interview-title pl-3 pr-3">
                    <h2 class="text-center"><b>`+title+`</b></h2>
                    <p class="mb-3">`+descr+`</p>
                    <p class="text-small text-center m-0">Por `+author+`</p>
                    <p class="text-small text-center font-weight-bold">`+location_date+`</p>
                </div>
                `;
                document.getElementById("output_text").innerHTML = main_text;
                document.getElementById("output_spotify").innerHTML = spotify;
                document.getElementById("output_text2").innerHTML = secondary_text;
            }
            break;

            case "news":
                var data = await getData("/get_news/"+id);
    
                if (JSON.stringify(data) != no_result )
                {
                    var title = data[0].title;
                    var subtitle = data[0].subtitle;
                    var date = formatDate(data[0].date);
                    var main_text = data[0].main_text;
                    var img = await getData("/get_im_news/" + id);

                    var src = "/news_img/"+img[0].url+".png";
    
                    document.getElementById("title").innerHTML = `
                        <h2 class="w-100 text-center">`+title+`</h2>
                        <p class="text-small mb-1 text-center m-1"><b class="text-uppercase">`+subtitle+`</b> / `+date+`</p>
                    `;
                    document.getElementById("img").innerHTML = `
                        <img class="w-100" src="`+src+`" style="max-height: 280px; object-fit: cover;">
                    `;
                    document.getElementById("main_text").innerHTML = main_text;
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

// load interviews
async function loadInterviewsMenu() {
    var interviews = await getData("/get_allinterviews");
    var no_result = '{"error":"no_result"}';

    if (JSON.stringify(interviews) != no_result )
    {
        for(var i = 0; i < interviews.length; i++)
        {
            var imageURL = await getData("/get_im_interview/"+interviews[i].id);
            imageURL = imageURL[0].url + ".png";

            document.getElementById("output_interviews").innerHTML += `
            <div class="card bg-dark text-white mb-5" onclick="location.href='/interview_post/`+interviews[i].id+`';">
                <img class="card-img" src="/interviews_img/`+imageURL+`" alt="Card image" style="filter: brightness(60%);">
                <div class="card-img-overlay p-5 text-dark">
                    <h5 class="card-title mb-0">`+interviews[i].title+`</h5>
                    <p class="card-text">Por `+interviews[i].author+`</p>
                </div>
            </div>
            `;
        }
    }
}

// load stories
async function loadStoriesMenu() {
    var stories = await getData("/get_allposts");
    var no_result = '{"error":"no_result"}';

    if (JSON.stringify(stories) != no_result )
    {
        for(var i = 0; i < stories.length; i++)
        {
            if(stories[i].status == 2){ //Stories
                var imageURL = await getData("/get_im_url/"+stories[i].id);
                imageURL = imageURL[0].url + ".png";
    
                document.getElementById("output_stories").innerHTML += `
                <div class="story-post mr-5">
                    <a href="/stories_post/`+stories[i].id+`"><img src="/stories_img/`+imageURL+`" class="w-100 story-img"></a>
                </div>
                `;
            }
        }
    }
}

// load news
async function loadNewsMenu() {
    var news = await getData("/get_allnews");
    var no_result = '{"error":"no_result"}';

    if (JSON.stringify(news) != no_result)
    {
        for(var i = 0; i < news.length; i++)
        {
            var date = news[i].date;
            date = formatDate(date);

            document.getElementById("output_news").innerHTML += `
            <div class="pr-3 pl-3 w-100 pb-3" onclick="location.href = '/news_post/`+news[i].id+`';">
                <p class="text-small mb-1 text-left"><b class="text-uppercase">`+news[i].subtitle+`</b> / `+date+`</p>
                <p class="text-left">`+news[i].title+`</p>
            </div>
            `;
        }
    }
}


function countWords(str) {
    str = str.replace(/(^\s*)|(\s*$)/gi,"");
    str = str.replace(/[ ]{2,}/gi," ");
    str = str.replace(/\n /,"\n");
    return str.split(' ').length;
 }
