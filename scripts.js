document.addEventListener("DOMContentLoaded", function() {

    /* --- 1. INTERSECTION OBSERVER (Animation on scroll) --- */

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
            else entry.target.classList.remove('is-visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animation').forEach(el => observer.observe(el));


    /* --- 2. ACCORDION --- */

    document.addEventListener("click", function(e) {
        const btn = e.target.closest(".accordion");
        if (!btn) return;

        btn.classList.toggle("active");

        const icon = btn.querySelector("span");

        let panel = btn.nextElementSibling;
        while (panel && !panel.classList.contains('panel')) {
            panel = panel.nextElementSibling;
        }

        if (panel) {
            if (panel.style.display === "block") {
                panel.style.display = "none";
                if (icon) icon.textContent = "+";
            } else {
                panel.style.display = "block";
                if (icon) icon.textContent = "-";

                const parent = btn.closest('.dark-background');
                if (parent) parent.style.height = "auto";
            }
        }
    });


    /* --- 3. HERO SLIDER --- */

    const track = document.querySelector('.slider-track');
    if (track) {
        const slides = document.querySelectorAll('.slide-wrapper');
        const dots = document.querySelectorAll('.dot');
        let slideIndex = 0;
        let slideInterval;

        const updateSlider = () => {
            track.style.transform = `translateX(-${slideIndex * 100}%)`;
            slides.forEach((s, i) => s.classList.toggle('active-slide', i === slideIndex));
            dots.forEach((d, i) => d.classList.toggle('active', i === slideIndex));
        };

        const moveSlide = (n) => {
            slideIndex = (slideIndex + n + slides.length) % slides.length;
            updateSlider();
        };

        window.jumpToSlide = (n) => { slideIndex = n; updateSlider(); resetTimer(); };
        const resetTimer = () => { clearInterval(slideInterval); slideInterval = setInterval(() => moveSlide(1), 7000); };

        updateSlider();
        resetTimer();
    }


    /* --- 4. NAVIGATION AND MOBILE MENU --- */

    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-links");
    if (hamburger && navMenu) {
        hamburger.onclick = () => { hamburger.classList.toggle("active"); navMenu.classList.toggle("active"); };
    }

    document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.onclick = (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                btn.parentElement.classList.toggle('open');
            }
        };
    });


    /* --- 5. HIGHLIGHT EFFECT --- */

    function applyHighlightEffect(targetId) {
        const img = document.getElementById(targetId);
        if (!img) {
            console.warn(`A professzor nem találja a(z) ${targetId} elemet. Bukás.`);
            return;
        }

        const panel = img.closest('.panel');
        if (panel) {
            const accordionBtn = panel.previousElementSibling;
            if (accordionBtn && !accordionBtn.classList.contains('active')) {
                accordionBtn.click();
            }
        }
        setTimeout(() => {
            const card = img.closest('.stone-card') || img;
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            img.classList.add('highlight-active');

            img.addEventListener('animationend', () => {
                img.classList.remove('highlight-active');
            }, { once: true });

        }, 300);
    }

    if (window.location.hash) applyHighlightEffect(window.location.hash.substring(1));
    window.onhashchange = () => applyHighlightEffect(window.location.hash.substring(1));


    /* --- 6. CAROUSEL --- */
    const carouselTrack = document.querySelector('.carousel-track');

    if (carouselTrack) {
        let isAnimating = false;

        // --- BEÁLLÍTÁSOK ---
        const cardsToScroll = 1;     // Hányat ugorjon?
        const animationDuration = 1000; // 1 másodperc az átúszás
        const intervalTime = 2000;   // 2 másodpercenként indul
        // --------------------

        let carouselInterval;

        function getAccurateStep() {
            const firstCard = carouselTrack.firstElementChild;
            if (!firstCard) return 0;

            const cardWidth = firstCard.getBoundingClientRect().width;
            const trackStyle = window.getComputedStyle(carouselTrack);
            const gap = parseFloat(trackStyle.gap) || 0;

            return cardWidth + gap;
        }

        function moveCarousel() {
            if (isAnimating) return;
            if (carouselTrack.children.length < cardsToScroll + 1) return;

            isAnimating = true;

            const stepSize = getAccurateStep();
            const totalMove = stepSize * cardsToScroll;

            carouselTrack.style.transition = `transform ${animationDuration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            carouselTrack.style.transform = `translateX(-${totalMove}px)`;

            setTimeout(() => {
                carouselTrack.style.transition = "none";
                carouselTrack.style.transform = "translateX(0)";

                for (let i = 0; i < cardsToScroll; i++) {
                    const firstCard = carouselTrack.firstElementChild;
                    if (firstCard) {
                        carouselTrack.appendChild(firstCard);
                    }
                }

                isAnimating = false;
            }, animationDuration);
        }

        function startCarousel() {
            stopCarousel();
            carouselInterval = setInterval(moveCarousel, intervalTime);
        }

        function stopCarousel() {
            clearInterval(carouselInterval);
        }

        setTimeout(() => {
            startCarousel();
        }, 400);         // Indítás késleltetése

        window.addEventListener('resize', () => {
            stopCarousel();
            carouselTrack.style.transition = 'none';
            carouselTrack.style.transform = 'translateX(0)';
            startCarousel();
        });

        carouselTrack.addEventListener('mouseenter', stopCarousel);
        carouselTrack.addEventListener('mouseleave', startCarousel);

        carouselTrack.addEventListener('touchstart', stopCarousel);
        carouselTrack.addEventListener('touchend', () => setTimeout(startCarousel, 2000));
    }
});