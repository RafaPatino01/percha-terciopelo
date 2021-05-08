import Cursor from '../cursor';
import {preloader} from './preloader';
import LocomotiveScroll from 'locomotive-scroll';
import Menu from './menu';
import 'regenerator-runtime/runtime';


async function getData(p_endpoint) {
    const response = await fetch(p_endpoint);
    const data = await response.json(); 
    return data;
}
async function wrapperFunc() {
    try {
        var cols = await getData("/get_allcols");
        return cols;
    } catch(e) {
        console.log(e);
        throw e;      // let caller know the promise was rejected with this reason
    }
}

wrapperFunc().then(cols => {
    var no_result = '{"error":"no_result"}';
    if (JSON.stringify(cols) != no_result){
        for(var i = 0; i < cols.length; i++){
            var ejemplo=`<a class="menu__item">
                            <span class="menu__item-text"><span class="menu__item-textinner">`+cols[i].title+ `</span></span>
                            <span class="menu__item-sub">`+cols[i].date+`</span>
                        </a>`;
            document.getElementById("output_ejemplo").innerHTML+=ejemplo;
        }
        document.getElementById("output_ejemplo").innerHTML+="<br><br><br><br><br><br><br><br><br><br>";
    }
    // got final result
    // menu (<nav> element)
    const menuEl = document.querySelector('.menu');

    // preload the images set as data attrs in the menu items
    preloader('.menu__item').then(() => {
        // initialize the smooth scroll
        const scroll = new LocomotiveScroll({el: menuEl, smooth: true});

        // initialize custom cursor
        const cursor = new Cursor(document.querySelector('.cursor'));

        // initialize menu
        new Menu(menuEl);
        scroll.update(); //fix locomotive issue
    });
}).catch(err => {
    // got error
    console.log("Houston, tenemos un problema");
});