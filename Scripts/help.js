﻿var isIpad = navigator.userAgent.match(/iPad/i);
var isIphone = navigator.userAgent.match(/iPhone/i);
var isIOS = isIpad || isIphone;
var isAndroid = navigator.userAgent.match(/Android/i);
var isWindowsPhone = navigator.userAgent.match(/Windows Phone/i);
var isMobile = isIphone || isAndroid || isWindowsPhone;

$(document).ready(function () {
    if (isIOS) {
        $('#backandroid').hide();
    } else {
        $('#back').hide();
    }
});

$(document).on('click', '#back', function () {
    if (isIOS) {
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'js-call:close');
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    }
});

$(document).on('click', '#backandroid', function () {
    if (isAndroid && typeof AndroidTabs !== 'undefined') {
        AndroidTabs.dismissDialog();
    }
});

$(document).ready(function () {
      $("#myCarousel").swiperight(function() {  
          $(this).carousel('prev');  
      });  
      $("#myCarousel").swipeleft(function() {  
          $(this).carousel('next');  
      });
      $(".fa-caret-right").click(function () {
          $("#myCarousel").carousel('next');
      });
      $(".fa-caret-left").click(function () {
          $("#myCarousel").carousel('prev');
      });
  }); 