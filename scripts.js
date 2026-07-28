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

        // --- SWIPE LOGIC ---
        let startX = 0;
        let endX = 0;
        const swipeThreshold = 50; // Minimum pixel distance to count as a swipe

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            endX = startX; // Reset endX to prevent accidental swipes on single taps
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            let diffX = startX - endX;

            // Check if the swipe distance is greater than the threshold
            if (Math.abs(diffX) > swipeThreshold) {
                if (diffX > 0) {
                    // Swiped left -> Next slide
                    moveSlide(1);
                } else {
                    // Swiped right -> Previous slide
                    moveSlide(-1);
                }
                resetTimer(); // Reset the timer so it doesn't auto-slide immediately after swiping
            }
        });
    }


    /* --- 4. NAVIGATION AND MOBILE MENU --- */

    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-links");
    
    if (hamburger && navMenu) {
        hamburger.onclick = () => { 
            hamburger.classList.toggle("active"); 
            navMenu.classList.toggle("active"); 
            document.body.classList.toggle("no-scroll"); // Toggles the scroll lock on the body
        };

        // Closes the menu and removes the scroll lock when a regular link is clicked
        const navItems = navMenu.querySelectorAll("a:not(.dropbtn)");
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                document.body.classList.remove("no-scroll");
            });
        });
    }

    document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.onclick = (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                btn.parentElement.classList.toggle('open');
            }
        };
    });


    /* --- 5. HIGHLIGHT EFFECT --- */

    function applyHighlightEffect(targetId) {
        const img = document.getElementById(targetId);

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
            img.classList.add('highlight-effect');

            img.addEventListener('animationend', () => {
                img.classList.remove('highlight-effect');
            }, { once: true });

        }, 300);
    }

    /* --- 5. HIGHLIGHT & PATH/HASH ROUTING --- */

/* --- HIGHLIGHT & PATH/HASH ROUTING --- */

function handleUrlNavigation() {
    const path = window.location.pathname; // Pl. "/kvarcit"
    const hash = window.location.hash;     // Pl. "#kvarcit"

    // 1. Ha a Google egy olyan URL-t hozott létre, ami valójában egy ID a természetes oldalon (pl. /kvarcit)
    // Itt felsorolhatod azokat a kulcsszavakat, amik a termeszetes.html-en belül vannek:
    const termeszetesIdsek = ['kvarcit', 'granit', 'marvany', 'meszko']; // Add ide a többi ID-t is, amik ott vannak!

    const cleanPath = path.substring(1); // Levágja az elejéről a per jelet (pl. "kvarcit")

    if (termeszetesIdsek.includes(cleanPath)) {
        // Automatikusan átirányítjuk a helyes aloldalra horgonnyal, vagy betöltjük onnan
        window.location.replace(`/termeszetes#${cleanPath}`);
        return;
    }

    // 2. Normál hash alapú kezelés (ha már a helyes URL-en vagyunk)
    if (hash) {
        const targetId = hash.substring(1);
        setTimeout(() => {
            applyHighlightEffect(targetId);
        }, 300);
    }
}

window.addEventListener('DOMContentLoaded', handleUrlNavigation);

window.onhashchange = () => {
    if (window.location.hash) {
        applyHighlightEffect(window.location.hash.substring(1));
    }
};


/* --- 6. CONTACT FORM & MODAL --- */

const form = document.getElementById("contactForm");
const modal = document.getElementById("formModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalIcon = document.getElementById("modalIcon");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const submitBtn = form.querySelector('button[type="submit"]');

function showModal(title, message, type) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    if (type === "success") {
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--gold))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        `;
    } else {
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--gold))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        `;
    }
    modal.classList.add("active");
    document.body.classList.add("no-scroll");
}

function closeModal() {
    modal.classList.remove("active");
    document.body.classList.remove("no-scroll");
}

modalCloseBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    const originalButtonText = submitBtn.textContent;
    submitBtn.textContent = "Küldés folyamatban...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://us-central1-kingstonedesign.cloudfunctions.net/sendContactForm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showModal(
                "Sikeres küldés", 
                "Köszönjük megkeresését! Az üzenetet sikeresen elküldtuk, hamarosan felvesszük Önnel a kapcsolatot.", 
                "success"
            );
            form.reset();
        } else {
            showModal(
                "Hiba történt", 
                "Nem sikerült elküldeni az üzenetet. Kérjük, próbálja meg később, vagy keressen minket telefonon!", 
                "error"
            );
        }
    } catch (error) {
        console.error("Hiba:", error);
        showModal(
            "Hálózati hiba", 
            "Hiba történt a kapcsolat során. Kérjük, ellenőrizze az internetkapcsolatát.", 
            "error"
        );
    } finally {
        submitBtn.textContent = originalButtonText;
        submitBtn.disabled = false;
    }
});

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