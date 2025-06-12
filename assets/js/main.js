// ==================================================
// * Project Name   :  Nova Security – Agency & Consulting Site Template.
// * File           :  JS Base
// * Version        :  1.0.0
// * Description    :  Main JavaScript functionality for site interactions
// ==================================================

(function($) {
  "use strict";

  /**
   * Initialize all site functionality when DOM is ready
   */
  $(document).ready(function() {
    initBackToTop();
    initTextAnimations();
    initWowAnimations();
    initCarousels();
  });

  /**
   * Back to Top Button Functionality
   * Shows/hides the back to top button based on scroll position
   */
  function initBackToTop() {
    // Show/hide back to top button on scroll
    $(window).scroll(function() {
      if ($(this).scrollTop() > 200) {
        $('.backtotop:hidden').stop(true, true).fadeIn();
      } else {
        $('.backtotop').stop(true, true).fadeOut();
      }
    });

    // Smooth scroll to top when clicked
    $(".scroll").on('click', function(e) {
      e.preventDefault();
      $("html, body").animate({scrollTop: 0}, 0);
      return false; 
    });
  }

  /**
   * Text Splitting Animation
   * Initializes character-by-character text animations
   */
  function initTextAnimations() {
    $(window).on("load", function() {
      Splitting({
        target: "[data-splitting]",
        by: "chars"
      });
    });
  }

  /**
   * WOW.js Animation Library
   * Initializes scroll-triggered animations
   */
  function initWowAnimations() {
    var wow = new WOW({
      animateClass: 'animated',
      offset: 100,           // Distance to trigger animation
      mobile: true,          // Enable on mobile devices
      duration: 1000,        // Animation duration
    });
    wow.init();
  }

  /**
   * Swiper Carousel Initialization
   * Sets up the cake cards carousel with specific configuration
   */
  function initCarousels() {
    var cakeCardsSwiper = new Swiper(".cake_card_carousel", {
      effect: "cards",       // Card stack effect
      grabCursor: true,      // Show grab cursor
      mousewheel: true,      // Enable mousewheel navigation
      centeredSlides: true,  // Center the slides
    });
  }

})(jQuery);