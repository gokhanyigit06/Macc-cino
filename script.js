document.addEventListener('DOMContentLoaded', () => {

    // Sticky Navbar Logic
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Modal Logic ---
    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close-modal');
    const openModalBtns = document.querySelectorAll('.open-modal');

    // Elements to update
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');

    if (modal) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const title = btn.getAttribute('data-title');
                const img = btn.getAttribute('data-img');
                const desc = btn.getAttribute('data-desc');

                modalTitle.textContent = title;
                modalImg.src = img;
                modalDesc.textContent = desc;

                modal.style.display = 'flex';
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Gönderiliyor...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                // Reset Form
                contactForm.reset();
                btn.textContent = originalText;
                btn.style.opacity = '1';

                // Show Success Modal
                if (successModal) {
                    successModal.style.display = 'flex';
                } else {
                    alert('Başvurunuz ailemize ulaştı!');
                }
            }, 1000);
        });
    }

    // Mobile Menu Toggle (Simple implementation)
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            // In a real app we'd toggle a class to show/hide
            // For this skeleton, let's just alert or log, or add a simple class
            const isFlex = navLinks.style.display === 'flex';

            if (!isFlex && window.innerWidth <= 900) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#2C241B';
                navLinks.style.padding = '20px';
            } else {
                navLinks.style.display = ''; // Reset
            }
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax Effect for Crema Image (Enhancement)
    const cremaContainer = document.querySelector('.crema-container');
    const cremaImage = document.querySelector('.crema-image');

    if (cremaContainer && cremaImage) {
        cremaContainer.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = cremaContainer.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            // Move image slightly opposite to mouse
            cremaImage.style.transform = `scale(1.1) translate(${x * -20}px, ${y * -20}px)`;
        });

        cremaContainer.addEventListener('mouseleave', () => {
            cremaImage.style.transform = 'scale(1.0)'; // Return to normal
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% is visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Back to Top ---
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookies = document.getElementById('acceptCookies');

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000); // Show after 2 seconds
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000); // Minimum load time 1s
        });
    }

    // --- Search Overlay ---
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.querySelector('.close-search');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.classList.add('active');
            searchOverlay.querySelector('input').focus();
        });

        closeSearch.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });

        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
    }
});
