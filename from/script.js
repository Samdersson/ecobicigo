document.addEventListener('DOMContentLoaded', function() {
    // Gallery Carousel Logic
    const carousel = document.querySelector('#imagenes .carousel');
    const inner = carousel.querySelector('.carousel-inner');
    const items = carousel.querySelectorAll('.carousel-item');
    const indicators = carousel.querySelectorAll('.indicator');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    
    let currentIndex = 0;
    let intervalTime = 4000; // 4 seconds
    let autoSlideInterval;
    let isPaused = false;
    
    function updateCarousel() {
        // Update items
        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });
        
        // Update indicators
        indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    function pauseSlide() {
        clearInterval(autoSlideInterval);
        carousel.classList.add('paused');
        isPaused = true;
    }
    
    function resumeSlide() {
        autoSlideInterval = setInterval(nextSlide, intervalTime);
        carousel.classList.remove('paused');
        isPaused = false;
    }
    
    // Init
    updateCarousel();
    autoSlideInterval = setInterval(nextSlide, intervalTime);
    
    // Events
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Hover pause
    carousel.addEventListener('mouseenter', pauseSlide);
    carousel.addEventListener('mouseleave', resumeSlide);
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (carousel.matches(':hover') || carousel.contains(document.activeElement)) {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        }
    });
    
    // Touch swipe mobile
    let startX = 0;
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    carousel.addEventListener('touchend', (e) => {
        if (!startX) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        startX = 0;
    });
});
