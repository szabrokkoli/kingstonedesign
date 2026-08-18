document.addEventListener("DOMContentLoaded", function() {

// Intersection Observer for animations

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
            else entry.target.classList.remove('is-visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animation').forEach(el => observer.observe(el));



// Accordion

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


// Hero slider

const track = document.querySelector('.slider-track');
if (track) {
    const sliderViewport = track.parentElement;
    const slides = document.querySelectorAll('.slide-wrapper');
    const dots = document.querySelectorAll('.dot');
    let slideIndex = 0;
    let slideInterval;
    let containerWidth = sliderViewport.getBoundingClientRect().width;

    const setTransform = (px, animate) => {
        track.style.transition = animate ? 'transform 0.35s ease' : 'none';
        track.style.transform = `translateX(${px}px)`;
    };

    const updateSlider = (animate = true) => {
        setTransform(-slideIndex * containerWidth, animate);
        slides.forEach((s, i) => s.classList.toggle('active-slide', i === slideIndex));
        dots.forEach((d, i) => d.classList.toggle('active', i === slideIndex));
    };

    const moveSlide = (n) => {
        slideIndex = (slideIndex + n + slides.length) % slides.length;
        updateSlider();
    };

    window.jumpToSlide = (n) => { slideIndex = n; updateSlider(); resetTimer(); };
    const resetTimer = () => { clearInterval(slideInterval); slideInterval = setInterval(() => moveSlide(1), 7000); };

    updateSlider(false);
    resetTimer();

    const getCurrentTranslateX = () => {
        const style = window.getComputedStyle(track);
        const t = style.transform;
        if (t === 'none') return 0;
        const values = t.match(/matrix.*\((.+)\)/)[1].split(',').map(parseFloat);
        return t.includes('3d') ? values[12] : values[4];
    };

    let isDragging = false;
    let didDrag = false;
    let startX = 0;
    let currentX = 0;
    let baseX = 0;
    let activePointerId = null;
    let startTime = 0;
    let captureTarget = null;
    const dragThresholdRatio = 0.15;

    const onPointerDown = (e) => {
        if (isDragging) return;
        isDragging = true;
        didDrag = false;
        startX = e.clientX;
        currentX = startX;
        baseX = getCurrentTranslateX();
        activePointerId = e.pointerId;
        startTime = Date.now();
        captureTarget = e.target;
        clearInterval(slideInterval);
        track.style.transition = 'none';
    };

    const onPointerMove = (e) => {
        if (!isDragging || e.pointerId !== activePointerId) return;
        if (e.cancelable) e.preventDefault();

        currentX = e.clientX;
        let delta = currentX - startX;

        if (!didDrag && Math.abs(delta) > 5) {
            didDrag = true;
            try {
                if (captureTarget && captureTarget.setPointerCapture) {
                    captureTarget.setPointerCapture(activePointerId);
                }
            } catch (err) {
                try { track.setPointerCapture(activePointerId); } catch(e){}
            }
        }
        if (!didDrag) return;

        const atStart = slideIndex === 0 && delta > 0;
        const atEnd = slideIndex === slides.length - 1 && delta < 0;
        if (atStart || atEnd) delta *= 0.35;

        track.style.transform = `translateX(${baseX + delta}px)`;
    };

    const endDrag = (e) => {
        if (!isDragging || (e && e.pointerId !== activePointerId)) return;
        isDragging = false;

        if (didDrag) {
            const delta = currentX - startX;
            const elapsedTime = Date.now() - startTime;
            
            const isFastFlick = elapsedTime < 350 && Math.abs(delta) > 30;

            if (Math.abs(delta) > containerWidth * dragThresholdRatio || isFastFlick) {
                delta < 0 ? moveSlide(1) : moveSlide(-1);
            } else {
                updateSlider();
            }
            
            try {
                if (captureTarget && captureTarget.hasPointerCapture?.(activePointerId)) {
                    captureTarget.releasePointerCapture(activePointerId);
                } else if (track.hasPointerCapture?.(activePointerId)) {
                    track.releasePointerCapture(activePointerId);
                }
            } catch(err) {}
        }
        
        activePointerId = null;
        captureTarget = null;
        resetTimer();
    };

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    track.addEventListener('click', (e) => {
        if (didDrag) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    window.addEventListener('resize', () => {
        containerWidth = sliderViewport.getBoundingClientRect().width;
        updateSlider(false);
    });
}

// Navigation and mobile menu

    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-links");
    
    if (hamburger && navMenu) {
        hamburger.onclick = () => { 
            hamburger.classList.toggle("active"); 
            navMenu.classList.toggle("active"); 
            document.body.classList.toggle("no-scroll");
        };

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


// Highlight effect

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



// Highlight effect and routing

function handleUrlNavigation() {
    const path = window.location.pathname;
    const hash = window.location.hash;

    const termeszetesIdsek = ['kvarcit', 'granit', 'marvany', 'meszko'];

    const cleanPath = path.substring(1);

    if (termeszetesIdsek.includes(cleanPath)) {
        window.location.replace(`/termeszetes#${cleanPath}`);
        return;
    }

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


// Contact Form

const form = document.getElementById("contactForm");

if (form) {
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
                headers: { "Content-Type": "application/json" },
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
}


// Carousel

const carouselTrack = document.querySelector('.carousel-track');

if (carouselTrack) {
    const speed = 40;

    let stepSize = 0;
    let currentOffset = 0;
    let rafId = null;
    let lastTimestamp = null;
    let isPaused = false;

    let isDragging = false;
    let didDrag = false;
    let startX = 0;
    let lastPointerX = 0;
    let activePointerId = null;

    function getAccurateStep() {
        const firstCard = carouselTrack.firstElementChild;
        if (!firstCard) return 0;
        const cardWidth = firstCard.getBoundingClientRect().width;
        const trackStyle = window.getComputedStyle(carouselTrack);
        const gap = parseFloat(trackStyle.gap) || 0;
        return cardWidth + gap;
    }

    function moveFirstToEnd() {
        const firstCard = carouselTrack.firstElementChild;
        if (firstCard) carouselTrack.appendChild(firstCard);
    }

    function moveLastToFront() {
        const lastCard = carouselTrack.lastElementChild;
        if (lastCard) carouselTrack.insertBefore(lastCard, carouselTrack.firstElementChild);
    }

    function wrapOffset() {
        if (stepSize <= 0 || carouselTrack.children.length < 2) return;
        while (currentOffset <= -stepSize) {
            moveFirstToEnd();
            currentOffset += stepSize;
        }
        while (currentOffset >= stepSize) {
            moveLastToFront();
            currentOffset -= stepSize;
        }
    }

    function applyOffset() {
        carouselTrack.style.transform = `translateX(${currentOffset}px)`;
    }

    function tick(timestamp) {
        if (lastTimestamp === null) lastTimestamp = timestamp;
        const dt = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        if (!isPaused && !isDragging) {
            currentOffset -= speed * dt;
            wrapOffset();
            applyOffset();
        }

        rafId = requestAnimationFrame(tick);
    }

    stepSize = getAccurateStep();
    carouselTrack.style.transition = 'none';

    setTimeout(() => {
        rafId = requestAnimationFrame(tick);
    }, 400);

    window.addEventListener('resize', () => {
        stepSize = getAccurateStep();
    });

    carouselTrack.addEventListener('mouseenter', () => { isPaused = true; });
    carouselTrack.addEventListener('mouseleave', () => { isPaused = false; });

    const onPointerDown = (e) => {
        isDragging = true;
        didDrag = false;
        startX = e.clientX;
        lastPointerX = e.clientX;
        activePointerId = e.pointerId;
        stepSize = getAccurateStep();

        carouselTrack.classList.add('dragging');
    };

    const onPointerMove = (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - lastPointerX;
        lastPointerX = e.clientX;

        if (!didDrag && Math.abs(e.clientX - startX) > 5) {
            didDrag = true;
            carouselTrack.setPointerCapture(activePointerId);
        }

        if (!didDrag) return;

        currentOffset += deltaX;
        wrapOffset();
        applyOffset();
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        carouselTrack.classList.remove('dragging');
        lastTimestamp = null;

        if (didDrag && carouselTrack.hasPointerCapture?.(activePointerId)) {
            carouselTrack.releasePointerCapture(activePointerId);
        }
        activePointerId = null;
    };

    carouselTrack.addEventListener('pointerdown', onPointerDown);
    carouselTrack.addEventListener('pointermove', onPointerMove);
    carouselTrack.addEventListener('pointerup', endDrag);
    carouselTrack.addEventListener('pointercancel', endDrag);

    carouselTrack.addEventListener('click', (e) => {
        if (didDrag) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}
});