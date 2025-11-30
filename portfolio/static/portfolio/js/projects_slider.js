// static/js/projects_slider.js
document.addEventListener('DOMContentLoaded', function () {
  // ensure Swiper is loaded
  if (typeof Swiper === 'undefined') {
    console.error('Swiper is not loaded. Make sure the CDN script is included before this file.');
    return;
  }

  new Swiper('.my-projects-swiper', {
    slidesPerView: 1,               // show one card at a time
    spaceBetween: 20,
    centeredSlides: true,          // center slide on larger screens
    loop: true,                    // continuous loop for autoplay
    speed: 700,                    // slide transition speed (ms)

    // Autoplay settings
    autoplay: {
      delay: 3000,                 // time between slides (ms). Change to taste.
      disableOnInteraction: false, // continue autoplay after user interactions
      pauseOnMouseEnter: true      // pause when user hovers the slider
    },

    // Pagination & navigation
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },

    // Responsive: still show one card, but you could change to more if wanted
    breakpoints: {
      768: { slidesPerView: 1, centeredSlides: true },
      1024: { slidesPerView: 1, centeredSlides: true }
    }
  });
});
