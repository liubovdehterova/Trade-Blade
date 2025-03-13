const btnOpen = document.querySelector('.open-mob-menu');
const btnCloce = document.querySelector('.close-mob-menu');
const menu = document.querySelector('.mobile-menu');
const futures = document.querySelectorAll('.btn');
const cards = document.querySelectorAll('.tariff-card');
const faqItems = document.querySelectorAll('.faq-item');

function show() {
    menu.classList.add('active');
}
function hide() {
    menu.classList.remove('active');
}
btnOpen.addEventListener('click', show);
btnCloce.addEventListener('click', hide);
futures.forEach(e => {
    e.addEventListener('click', () => {
        futures.forEach(btn => btn.classList.remove('active'));
        e.classList.add('active');
    });
});

// option months
cards.forEach(card => {
    const selectedOption = card.querySelector('.selected-option');
    const optionsList = card.querySelector('.options-list');
    const priceDisplay = card.querySelector('.price-new');
    const options = card.querySelectorAll('.option');
    if (selectedOption && optionsList && priceDisplay && options.length > 0) {
        selectedOption.addEventListener('click', () => {
            optionsList.style.display = optionsList.style.display === 'block' ? 'none' : 'block';
        });
        options.forEach(option => {
            option.addEventListener('click', () => {
                selectedOption.textContent = option.textContent;
                const newPrice = option.getAttribute('data-price');
                priceDisplay.textContent = `$${newPrice}`;
                optionsList.style.display = 'none';
            });
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tariff-card')) {
                optionsList.style.display = 'none';
            }
        });
    } else {
        console.error('One or more required elements are missing in this card.');
    }
});

// FAQ
faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const arrow = item.querySelector('.arrow');
  
    header.addEventListener('click', () => {
      const isOpen = content.style.display === 'block';
      
      // Закриваємо всі інші секції
      document.querySelectorAll('.faq-content').forEach(content => content.style.display = 'none');
      document.querySelectorAll('.faq-header').forEach(header => header.classList.remove('open'));
      document.querySelectorAll('.arrow').forEach(arrow => arrow.classList.remove('open'));
  
      if (!isOpen) {
        content.style.display = 'block';
        header.classList.add('open');  // Змінюємо фон заголовка
        arrow.classList.add('open');  // Повертаємо стрілку
      }
    });
  });

// carousel
$(document).ready(function () {
    var $carousel = $(".carousel");
    var $slider = $(".slider");
    var $sliderContainer = $(".slider-container");
    var totalSlides = $(".carousel-card").length;
    var slidesToShow = getSlidesToShow();
    var sliderContainerWidth = $sliderContainer.width();
    var sliderWidth;

    function getSlidesToShow() {
        var width = $(window).width();
        if (width <= 375) return 1;
        if (width <= 480) return 1.2;
        if (width <= 767) return 1.5;
        if (width <= 992) return 2.5;
        if (width <= 1280) return 3;
        return 4;
    }

    function updateSliderWidth() {
        slidesToShow = getSlidesToShow();
        sliderWidth = (slidesToShow / totalSlides) * sliderContainerWidth;
        $slider.css("width", sliderWidth + "px");
    }

    updateSliderWidth();

    $carousel.slick({
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        infinite: false,
        arrows: false,
        dots: false,
        draggable: true,
        swipe: true,
        touchThreshold: 10,
        responsive: [
            { breakpoint: 1281, settings: { slidesToShow: 3 } },
            { breakpoint: 993, settings: { slidesToShow: 2.5 } },
            { breakpoint: 768, settings: { slidesToShow: 1.5 } },
            { breakpoint: 481, settings: { slidesToShow: 1.2 } },
            { breakpoint: 376, settings: { slidesToShow: 1 } }
        ]
    });

    function updateSliderPosition(currentSlide) {
        var maxSlideIndex = totalSlides - slidesToShow;
        if (maxSlideIndex <= 0) {
            $slider.css("left", "0px");
            return;
        }

        var progress = currentSlide / maxSlideIndex;
        var newLeft = progress * (sliderContainerWidth - sliderWidth);
        $slider.css("left", newLeft + "px");
    }

    $carousel.on("afterChange", function (event, slick, currentSlide) {
        updateSliderPosition(currentSlide);
    });

    $carousel.on("wheel", function (event) {
        event.preventDefault();
        if (event.originalEvent.deltaY > 0) {
            $carousel.slick("slickNext");
        } else {
            $carousel.slick("slickPrev");
        }
    });

    var isDragging = false;
    var startX, startLeft;

    $slider.on("mousedown touchstart", function (e) {
        isDragging = true;
        startX = e.pageX || e.originalEvent.touches[0].pageX;
        startLeft = parseFloat($slider.css("left"));
    });

    $(document).on("mousemove touchmove", function (e) {
        if (!isDragging) return;

        var moveX = e.pageX || e.originalEvent.touches[0].pageX;
        var delta = moveX - startX;
        var newLeft = Math.max(0, Math.min(sliderContainerWidth - sliderWidth, startLeft + delta));
        var progress = newLeft / (sliderContainerWidth - sliderWidth);
        var newSlide = Math.round(progress * (totalSlides - slidesToShow));

        $slider.css("left", newLeft + "px");
        $carousel.slick("slickGoTo", newSlide);
    });

    $(document).on("mouseup touchend", function () {
        isDragging = false;
    });

    var isDraggingCarousel = false;
    var startXCarousel, scrollLeftCarousel;

    $carousel.on("mousedown", function (e) {
        isDraggingCarousel = true;
        startXCarousel = e.pageX;
        scrollLeftCarousel = $carousel.slick("slickCurrentSlide");
        $carousel.addClass("grabbing");
    });

    $(document).on("mousemove", function (e) {
        if (!isDraggingCarousel) return;

        var moveX = e.pageX - startXCarousel;
        if (Math.abs(moveX) > 5) {
            e.preventDefault();
            var newSlide = Math.round(scrollLeftCarousel - moveX / 100);
            $carousel.slick("slickGoTo", newSlide);
        }
    });

    $(document).on("mouseup", function () {
        isDraggingCarousel = false;
        $carousel.removeClass("grabbing");
    });

    $(window).on("resize", function () {
        updateSliderWidth();
        updateSliderPosition($carousel.slick("slickCurrentSlide"));
    });
});
