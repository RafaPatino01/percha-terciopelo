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


function formatDate_news(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate() + 1),
        year = d.getFullYear();

    switch(month){
        case "1":
            month = "Ene."
            break;
        case "2":
            month = "Feb."
            break;
        case "3":
            month = "Mar."
            break;
        case "4":
            month = "Abr."
            break;
        case "5":
            month = "May."
            break;
        case "6":
            month = "Jun."
            break;
        case "7":
            month = "Jul."
            break;
        case "8":
            month = "Ago."
            break;
        case "9":
            month = "Sep."
            break;
        case "10":
            month = "Oct."
            break;
        case "11":
            month = "Nov."
            break;
        case "12":
            month = "Dic."
            break;
    }

    return [month, day, year].join(' ');
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
            if(story[0].status == 1){
                document.location = "/stories";
            }
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
                    var date = formatDate_news(data[0].date);
                    var main_text = data[0].main_text;
    
                    document.getElementById("title").innerHTML = `
                        <h2 class="w-100 text-center">`+title+`</h2>
                        <p class="text-small mb-1 text-center m-1"><b class="text-uppercase">`+subtitle+`</b> / `+date+`</p>
                    `;

                    document.getElementById("main_text").innerHTML = main_text;


                    var img = await getData("/get_im_news/" + id)
                    document.getElementById("img").innerHTML =`
                          <div class="carousel-item active">
                            <img class="d-block w-100 fit-img" src="/news_img/`+img[0].url+`.png">
                          </div>
                    `;
                    for(var i = 1; i <= img.length ; i++) {
                        document.getElementById("img").innerHTML +=`
                              <div class="carousel-item">
                                <img class="d-block w-100 fit-img" src="/news_img/`+img[i].url+`.png">
                              </div>
                    `;
                    }
                }
                break;

                case "articles":
                    var data = await getData("/get_col/"+id);
        
                    if (JSON.stringify(data) != no_result )
                    {
                        var title = data[0].title;
                        var columnista = data[0].columnista;
                        var date = formatDate_news(data[0].date);
                        var main_text = data[0].main_text;
                        var ocupacion = data[0].ocupacion;
                        var insta = data[0].insta;
                        if(!insta.includes("@")){
                            insta = "@" + insta;
                        }
                        var loc = data[0].loc;

                        var img = await getData("/get_im_col/" + id)
                        console.log(img);
                        document.getElementById("title").innerHTML = `
                            <h1 class="text-title mb-5 text-center">_ARTICLES</h1>
                            <div class="col-md-6">
                                <img class="center" src="/cols_img/`+img[0].url+`.png" style="height:140px; object-fit:cover; width:110px;">
                            <h2 class="w-100 text-center mt-3 mb-0">`+title+`</h2>
                            <p class="text-small mb-1 mt-0 text-center"><b class="text-uppercase">`+ columnista +`_ </b><i>`+ ocupacion +`</i><b> `+insta+`</b></p>
                            <p class="text-small text-center mt-3 mb-0"><b class="text-uppercase" style="letter-spacing:3px;">`+loc+` / `+date+`</b></p>
                            </div>
                        `;
    
                        document.getElementById("main_text").innerHTML = main_text;
                        
                        document.getElementById("img").innerHTML =`
                              <div class="carousel-item active">
                                <img class="d-block w-100 fit-img" src="/cols_img/`+img[1].url+`.png" style="height:300px;">
                              </div>
                        `;
                        for(var i = 2; i <= img.length ; i++) {
                            document.getElementById("img").innerHTML +=`
                            <div class="carousel-item">
                            <img class="d-block w-100 fit-img" src="/cols_img/`+img[i].url+`.png" style="height:300px;">
                            </div> 
                        `;
                        }
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

async function loadArticlesMenu() {
    var cols = await getData("/get_allcols");
    var no_result = '{"error":"no_result"}';
    
    if (JSON.stringify(cols) != no_result )
    {
        for(var i = 0; i < cols.length; i++)
        {
            var imageURL = await getData("/get_im_col/"+cols[i].id);
            console.log(imageURL);
            imageURL = imageURL[1].url + ".png";

            document.getElementById("output_articles").innerHTML += `
            <div class="card pr-5 pl-5" onclick="location.href='/articles_post/`+cols[i].id+`';">
                <img class="card-img-top" src="/cols_img/`+imageURL+`" alt="Card image" style="height:350px; object-fit: cover;">
                <div class="card-body p-0">
                    <h5 class="card-title m-0" style="color: black; top:0;">`+cols[i].title+`</h5>
                    <p class="card-text" style="color: black; top:0;">Text by `+cols[i].columnista+`</p>
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
            date = formatDate_news(date);

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
