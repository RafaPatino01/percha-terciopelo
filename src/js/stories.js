


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


        var scrolling = false;
        var oldTime = 0;
        var newTime = 0;
        var isTouchPad;
        var eventCount = 0;
        var eventCountStart;

        var mouseHandle = function (evt) {
            var isTouchPadDefined = isTouchPad || typeof isTouchPad !== "undefined";
            console.log(isTouchPadDefined);
            if (!isTouchPadDefined) {
                if (eventCount === 0) {
                    eventCountStart = new Date().getTime();
                }

                eventCount++;

                if (new Date().getTime() - eventCountStart > 100) {
                    if (eventCount > 10) {
                        isTouchPad = true;
                    } else {
                        isTouchPad = false;
                    }
                    isTouchPadDefined = true;
                }
            }

            if (isTouchPadDefined) {
                // here you can do what you want
                // i just wanted the direction, for swiping, so i have to prevent
                // the multiple event calls to trigger multiple unwanted actions (trackpad)
                if (!evt) evt = event;
                var direction = (evt.detail<0 || evt.wheelDelta>0) ? 1 : -1;

                if (isTouchPad) {
                    newTime = new Date().getTime();

                    if (!scrolling && newTime-oldTime > 550 ) {
                        scrolling = true;
                        if (direction < 0) {
                            move(true)
                        } else {
                            move(false)
                        }
                        setTimeout(function() {oldTime = new Date().getTime();scrolling = false}, 500);
                    }
                }
            }
        }


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


