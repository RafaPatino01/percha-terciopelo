import LocomotiveScroll from 'locomotive-scroll';
import 'regenerator-runtime/runtime';

async function getData(p_endpoint) {
    const response = await fetch(p_endpoint);
    const data = await response.json(); 
    return data;
}
async function wrapperFunc() {
    try {
        var posts = await getData("/get_allposts"); // get publicaciones

        // Ordenar por año los posts
        var sorted_posts = posts;
        var n = sorted_posts.length;
        bubbleSort(sorted_posts, n);

        var images = [];

        for(var i = 0; i < posts.length; i++) {
            var imgURL = await getData("/get_im_url/"+sorted_posts[i].id);
            imgURL = imgURL[0]["url"]+".png";

            images.push(imgURL);
        }

        var res = [sorted_posts, images];

        
        return res;

    } catch(e) {
        console.log("Errrrr");
        console.log(e);
        throw e;      // let caller know the promise was rejected with this reason
    }
}

// Waited until all data is fetched, then output posts and update locomotive
wrapperFunc().then(res => {

    var sorted_posts = res[0];
    var imgURL = res[1];
    
    var no_result = '{"error":"no_result"}';

    if (JSON.stringify(sorted_posts) != no_result)
    {
        
        var d = new Date();
        var current_año = d.getFullYear();

        //Output titulo año actual
        document.getElementById("output_titles").innerHTML += `
        <h1 data-scroll data-scroll-direction="horizontal" data-scroll-speed="-10" class="super-large-text m-5">`+current_año+`</h1>
        <div class="row mb-large" id="row-`+current_año+`">
        </div>
        `;
        

        for(var i = 0; i < sorted_posts.length; i++)
        {
            
            var año_post = parseInt(sorted_posts[i].date.substring(0, 4));
            
            if (año_post == current_año)
            {
                //output sin título
                document.getElementById("row-"+año_post).innerHTML += `
                <div data-scroll data-scroll-direction="vertical" data-scroll-speed="2" class="col-sm-4">
                    <div class="hvr-rotate card bg-dark text-white">
                        <img class="card-img" src="/uploads/`+imgURL[i]+`" alt="Card image">
                        <div class="card-img-overlay">
                            <h5 class="card-title">`+sorted_posts[i].title+`</h5>
                        </div>
                        </div>
                </div>
                `;
            }
            else 
            {
                //Output titulo año diferente
                document.getElementById("output_titles").innerHTML += `
                <h1 data-scroll data-scroll-direction="horizontal" data-scroll-speed="-10" class="super-large-text m-5">`+año_post+`</h1>
                <div class="row mb-large" id="row-`+año_post+`">
                </div>
                `;
                document.getElementById("row-"+año_post).innerHTML += `
                <div data-scroll data-scroll-direction="vertical" data-scroll-speed="2" class="col-sm-4">
                    <div class="hvr-rotate card bg-dark text-white">
                        <img class="card-img" src="/uploads/`+imgURL[i]+`" alt="Card image">
                        <div class="card-img-overlay">
                            <h5 class="card-title">`+sorted_posts[i].title+`</h5>
                        </div>
                        </div>
                </div>
                `;
                
            }

            current_año = año_post;
        }
    }
    const scroll = new LocomotiveScroll({
        el: document.querySelector("[data-scroll-container]"),
        smooth: true
    });
    
    setTimeout(() => {
        scroll.update();
    }, 600);
    

}).catch(err => {
    // got error
    console.log("Houston, tenemos un problema");

});



// An optimized version of Bubble Sort
function swap(arr, xp, yp)
{
    var temp = arr[xp];
    arr[xp] = arr[yp];
    arr[yp] = temp;
}

function bubbleSort(arr, n)
{
    for (var i = 0; i < n-1; i++)
    {
        for (var j = 0; j < n-i-1; j++)
        {
            if (parseInt(arr[j].date.substring(0, 4)) < parseInt(arr[j+1].date.substring(0, 4)))
            {
                console.log("bubbleSort workin")
                swap(arr,j,j+1);
            }
        }
    }
}

