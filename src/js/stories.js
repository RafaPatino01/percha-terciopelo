

/*
   mecanismo carousel
*/
$('#carousel-example').on('slide.bs.carousel', function (e) {
    /*
        CC 2.0 License Iatek LLC 2018 - Attribution required
    */
    var $e = $(e.relatedTarget);
    var idx = $e.index();
    var itemsPerSlide = 5;
    var totalItems = $('.carousel-item').length;

    if (idx >= totalItems-(itemsPerSlide-1)) {
        var it = itemsPerSlide - (totalItems - idx);
        for (var i=0; i<it; i++) {
            // append slides to end
            if (e.direction=="left") {
                $('.carousel-item').eq(i).appendTo('.carousel-inner');
            }
            else {
                $('.carousel-item').eq(0).appendTo('.carousel-inner');
            }
        }
    }
});


/*
   mecanismo scroll
*/

function move(direction){

    if (direction == false) {
        $('.carousel-control-next').click();
    } else {
        $('.carousel-control-prev').click();
    }
}


window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {


        function debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }

        var slider = document.getElementById("stories");
        var onScroll = debounce(function(direction) {
            console.log(direction);
            if (direction == false) {
                $('.carousel-control-next').click();
            } else {
                $('.carousel-control-prev').click();
            }
        }, 100, true);

        slider.addEventListener("wheel", function(e) {
            e.preventDefault();
            var delta;
            if (event.wheelDelta) {
                delta = event.wheelDelta;
            } else {
                delta = -1 * event.deltaY;
            }

            onScroll(delta >= 0);
        });


    }
};


