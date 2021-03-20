function del(p_id) {

	var data = new FormData();
	data.append('id', p_id);

	$.ajax({
        url :  "/perchaterciopelo/public/functions/ajaxes/remove_post.php",
        type: 'POST',
        data: data,
        contentType: false,
        processData: false,
        success: function(data) {
          alert("naisu!");
        },    
        error: function() {
          alert("not so naisu!");
        }
      });

	return true;
}