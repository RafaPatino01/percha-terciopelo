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

function countWords(str) {
    str = str.replace(/(^\s*)|(\s*$)/gi,"");
    str = str.replace(/[ ]{2,}/gi," ");
    str = str.replace(/\n /,"\n");
    return str.split(' ').length;
 }
