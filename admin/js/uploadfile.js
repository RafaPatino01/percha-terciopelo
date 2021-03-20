(function ($) {
  $(document).ready(function () {
    
    generateID()
    choose()
    generateOption()
    selectionOption()
    removeClass()
    uploadImage()
    submit()
    resetButton()
    removeNotification()
    autoRemoveNotification()
    autoDequeue()
    
    var ID
    var way = 0
    var queue = []
    var fullStock = 10
    var speedCloseNoti = 1000
    
    function generateID() {
      var text = $('header span')
      var newID = ''
    
      for(var i = 0; i < 3; i++) {
        newID += Math.floor(Math.random() * 3)
      }
      
      ID = 'ID: 5988' + newID
      text.html(ID)
    }
    
    function choose() {
      var li = $('.ways li')
      var section = $('.sections section')
      var index = 0
      li.on('click', function () {
        index = $(this).index()
        $(this).addClass('active')
        $(this).siblings().removeClass('active')
        
        section.siblings().removeClass('active')
        section.eq(index).addClass('active')
        if(!way) {
          way = 1
        }  else {
          way = 0
        }
      })
    }
    
    function generateOption() {
      var select = $('select option')
      var selectAdd = $('.select-option .option')
      $.each(select, function (i, val) {
          $('.select-option .option').append('<div rel="'+ $(val).val() +'">'+ $(val).html() +'</div>')
      })
    }
    
    function selectionOption() {
      var select = $('.select-option .head')
      var option = $('.select-option .option div')
    
      select.on('click', function (event) {
        event.stopPropagation()
        $('.select-option').addClass('active')
      })
      
      option.on('click', function () {
        var value = $(this).attr('rel')
        $('.select-option').removeClass('active')  
        select.html(value)
    
        $('select#category').val(value)
      })
    }
    
    function removeClass() {
      $('body').on('click', function () { 
        $('.select-option').removeClass('active')   
      })                  
    }
    
    function uploadImage() {
      var button = $('.images .pic')
      var uploader = $('<input type="file" accept="image/*" />')
      var images = $('.images')
      
      button.on('click', function () {
        uploader.click()
      })
      
      uploader.on('change', function () {
          var reader = new FileReader()
          reader.onload = function(event) {
            images.prepend('<div class="img" style="background-image: url(\'' + event.target.result + '\');" rel="'+ event.target.result  +'"><span>remove</span></div>')
          }
          reader.readAsDataURL(uploader[0].files[0])
  
       })
      
      images.on('click', '.img', function () {
        $(this).remove()
      })
    
    }
    
    function submit() {  
      var button = $('#send')
      
      button.on('click', function () {
        if(!way) {
          var title = $('#title')
          var descr  = $('#descr')
          var images = $('.images .img')
          var imageArr = []

          
          for(var i = 0; i < images.length; i++) {
            imageArr.push({url: $(images[i]).attr('rel')})
          }
          
          var newStock = {
            title: title.val(),
            descr: descr.val(),
            images: imageArr,
            type: 1
          }
          
          saveToQueue(newStock)
        } else {
          // discussion
          var topic = $('#topic')
          var message = $('#msg')
          
          var newStock = {
            title: topic.val(),
            message: message.val(),
            type: 2
          }
          
          saveToQueue(newStock)
        }
      })
    }
    
    function removeNotification() {
      var close = $('.notification')
      close.on('click', 'span', function () {
        var parent = $(this).parent()
        parent.fadeOut(300)
        setTimeout(function() {
          parent.remove()
        }, 300)
      })
    }
    
    function autoRemoveNotification() {
      setInterval(function() {
        var notification = $('.notification')
        var notiPage = $(notification).children('.btn')
        var noti = $(notiPage[0])
        
        setTimeout(function () {
          setTimeout(function () {
           noti.remove()
          }, speedCloseNoti)
          noti.fadeOut(speedCloseNoti)
        }, speedCloseNoti)
      }, speedCloseNoti)
    }
    
    function autoDequeue() {
      var notification = $('.notification')
      var text
      
      setInterval(function () {

          if(queue.length > 0) {
            if(queue[0].type == 2) {
              text = ' Your discusstion is sent'
            } else {
              text = ' Your order is allowed.'
            }
            
            notification.append('<div class="success btn"><p><strong>Success:</strong>'+ text +'</p><span><i class=\"fa fa-times\" aria-hidden=\"true\"></i></span></div>')
            queue.splice(0, 1)
            
          }  
      }, 10000)
    }
    
    function resetButton() {
      var resetbtn = $('#reset')
      resetbtn.on('click', function () {
        reset()
      })
    }
    
    // helpers
    function saveToQueue(stock) {

      var check = 0
      
      if(queue.length <= fullStock) {
        if(stock.type == 2) {
            if(!stock.title || !stock.message) {
              check = 1
            }
        } else {
          if(!stock.title || !stock.descr || stock.images == 0) {
            check = 1
          }
        }
        
        if(check) {
          alert("missing fields")
        } else {
          queue.push(stock)
          send_data(queue[0])
          alert("data json")
          reset()
        }
      } else {
        alert("unexpected error")
        } 
    }
    function reset() {
      
      $('#title').val('')
      $('#descr').val('')
      $('.select-option .head').html('Category')
      $('select#category').val('')
      
      var images = $('.images .img')
      for(var i = 0; i < images.length; i++) {
        $(images)[i].remove()
      }
      
      var topic = $('#topic').val('')
      var message = $('#msg').val('')
    }








    function send_data2(p_data) { 
      let n_images = p_data["images"].length;

      let img_data = ""

      for (var i = 0; i < n_images; i++) {
        img_data = img_data + "&imgData" + i + "=" + p_data["images"][i]["url"]
      }

      

      img_data = "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"
      
      let aux = base64ToBlob(img_data, 'image/png')

      var data = new FormData();
      data.append('file', aux);

      console.log(aux)

      $.ajax('/perchaterciopelo/public/functions/ajaxes/addpost.php', {
      type: 'POST',  // http method
      data: "title="+p_data["title"]+"&descr="+p_data["descr"]+"&im="+img_data+"&n="+n_images,  // data to submit
      success: function (data, status, xhr) {
        if(data.success){
          window.location.href = '/perchaterciopelo/public/pages/admin.php';
        }
        else if(data.error == "missing_fields"){
          alert("missing fields");
        }
        else {
          alert(data.error);
        }
      },
      error: function (jqXhr, textStatus, errorMessage) {
            console.log("flag");
            alert(errorMessage);
      }
  });

    }

function send_data(p_data) { 
      let n_images = p_data["images"].length;

      var data = new FormData();
      let aux = "";

      data.append('title', p_data["title"]);
      data.append('descr', p_data["descr"]);
      data.append('n', n_images);

      for (var i = 0; i < n_images; i++) { // Convert images to base64 and send them through ajax
        aux = aux + p_data["images"][i]["url"].split(',')[1] + "|"; // pipe delimita cada imagen
      }

      data.append('im', aux);

      $.ajax({
        url :  "/add_post",
        type: 'POST',
        data: data,
        contentType: false,
        processData: false,
        success: function(data) {
          alert("boa!");
        },    
        error: function() {
          alert("not so boa!");
        }
      });

    }

  })
})(jQuery)