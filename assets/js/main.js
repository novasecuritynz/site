// ==================================================
// * Project Name   :  Nova Security – Agency & Consulting Site Template.
// * File           :  JS Base
// * Version        :  1.0.0
// ==================================================

(function($) {
  "use strict";

  // Back To Top - Start
  // --------------------------------------------------
  $(window).scroll(function() {
    if ($(this).scrollTop() > 200) {
      $('.backtotop:hidden').stop(true, true).fadeIn();
    } else {
      $('.backtotop').stop(true, true).fadeOut();
    }
  });
  $(".scroll").on('click', function() {
    $("html, body").animate({scrollTop: 0}, 0);
    return false; 
  });
  // Back To Top - End
  // --------------------------------------------------

  // Splitting Text Animation - Start
  // --------------------------------------------------
  $(window).on("load", function () {
    Splitting({
      target: "[data-splitting]",
      by: "chars"
    });
  });
  // Splitting Text Animation - End
  // --------------------------------------------------

  // Wow JS - Start
  // --------------------------------------------------
  var wow = new WOW({
    animateClass: 'animated',
    offset: 100,
    mobile: true,
    duration: 1000,
  });
  wow.init();
  // Wow JS - End
  // --------------------------------------------------

  // 00000 - Start
  // --------------------------------------------------
  var cakeCardsSwiper = new Swiper(".cake_card_carousel", {
    // loop: "true",
    effect: "cards",
    grabCursor: true,
    mousewheel: true,
    centeredSlides: true,
  });
  // 00000 - End
  // --------------------------------------------------

})(jQuery);