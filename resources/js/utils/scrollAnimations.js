// Scroll-triggered animations utility
export const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
                entry.target.classList.remove('scroll-hidden');
            }
        });
    }, observerOptions);

    // Observe all elements with scroll-animate class
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(el => {
        el.classList.add('scroll-hidden');
        observer.observe(el);
    });

    return observer;
};

// Staggered animation utility
export const staggerAnimation = (elements, delay = 100) => {
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate-fade-in-up');
        }, index * delay);
    });
};

// Parallax effect utility
export const initParallax = () => {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    const handleScroll = () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
};

// Typing animation utility
export const typeWriter = (element, text, speed = 50) => {
    let i = 0;
    element.innerHTML = '';
    
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
};

// Counter animation utility
export const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
};

// Ripple effect utility - Disabled to prevent scale changes
export const createRipple = (event) => {
    // Ripple effect disabled to prevent any scale changes
    return;
};

// Page transition utility
export const pageTransition = {
    enter: (element) => {
        element.classList.add('page-transition-enter');
        setTimeout(() => {
            element.classList.add('page-transition-enter-active');
            element.classList.remove('page-transition-enter');
        }, 10);
    },
    
    exit: (element, callback) => {
        element.classList.add('page-transition-exit-active');
        element.classList.remove('page-transition-exit');
        
        setTimeout(() => {
            if (callback) callback();
        }, 300);
    }
};

// Loading animation utility
export const showLoading = (element) => {
    element.innerHTML = `
        <div class="flex items-center justify-center p-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span class="ml-3 text-gray-600">Loading...</span>
        </div>
    `;
};

// Success animation utility
export const showSuccess = (element, message) => {
    element.innerHTML = `
        <div class="animate-success flex items-center justify-center p-8 text-green-600">
            <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span class="font-semibold">${message}</span>
        </div>
    `;
};

// Error animation utility
export const showError = (element, message) => {
    element.innerHTML = `
        <div class="animate-shake flex items-center justify-center p-8 text-red-600">
            <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span class="font-semibold">${message}</span>
        </div>
    `;
};
