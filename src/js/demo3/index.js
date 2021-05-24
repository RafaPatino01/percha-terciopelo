import {preloadImages, preloadFonts, clamp, map} from '../utils';
import Cursor from '../cursor';
import LocomotiveScroll from 'locomotive-scroll';
import 'regenerator-runtime/runtime';

// Cargar los posts actuales
loadPosts();

const lscroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    direction: 'horizontal'
});

// let's scale the images when scrolling.
lscroll.on('scroll', (obj) => {
    for (const key of Object.keys(obj.currentElements)) {
        if ( obj.currentElements[key].el.classList.contains('gallery__item-imginner') ) {
            let progress = obj.currentElements[key].progress;
            const scaleVal = progress < 0.5 ? clamp(map(progress,0,0.5,0.2,1),0.2,1) : clamp(map(progress,0.5,1,1,0.2),0.2,1);
            obj.currentElements[key].el.parentNode.style.transform = `scale(${scaleVal})`
        }
    }
});
lscroll.update();

// Preload images and fonts
Promise.all([preloadImages('.gallery__item-imginner'), preloadFonts('vxy2fer')]).then(() => {
    // Remove loader (loading class)
    document.body.classList.remove('loading');

    // Initialize custom cursor
    const cursor = new Cursor(document.querySelector('.cursor'));

    // Mouse effects on all links and others
    [...document.querySelectorAll('a,.gallery__item-img,.gallery__item-number')].forEach(link => {
        link.addEventListener('mouseenter', () => cursor.enter());
        link.addEventListener('mouseleave', () => cursor.leave());
    });
});


// ----- MY FUNCTIONS -----


async function getData(p_endpoint) {
    const response = await fetch(p_endpoint);
    const data = await response.json(); 
    return data;
}

// Cargar todos los posts al html
async function loadPosts() {
    var posts = await getData("/get_allposts");
    var j = 1;

    for(var i = 0; i < posts.length; i++)
    {
        var imgURL = await getData("/get_im_url/"+posts[i].id);
        imgURL = imgURL[0]["url"]+".png";
        console.log(imgURL);
        
        if(posts[i].status == 2){ //Si el post es destacado
            if(j<10){
                var num = "0"+j.toString();
            }
            else {
                var num = j;
            }
            document.getElementById("output").innerHTML += `
            <figure class="gallery__item" onclick="location.href = 'post/`+posts[i].id+`';">
                <div class="gallery__item-img"><div class="gallery__item-imginner" style="background-image: url('/uploads/`+imgURL+`')" data-scroll data-scroll-speed="-0.8"></div></div>
                <figcaption class="gallery__item-caption">
                    <h2 class="gallery__item-title" data-scroll data-scroll-speed="1">Title</h2>
                    <span class="gallery__item-number" data-scroll data-scroll-speed="1.5" style="font-size: 3em;">`+num+`</span>
                </figcaption>
            </figure>
            `;

            j++; // Output number
        }
    }

    document.getElementById("output").innerHTML += '<div class="gallery__text"><span class="gallery__text-inner" data-scroll data-scroll-speed="1">Maga</span><span data-scroll data-scroll-speed="3" class="gallery__text-inner">sin</span></div>';

    lscroll.update(); //Update locomotive scroll  ?IDK why
}




