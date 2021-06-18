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
});