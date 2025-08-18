/*!
 * Fatema Akter SEO Portfolio - Custom JavaScript
 * Professional Local SEO Expert Website
 */

'use strict';

// =============================================================================
// Global Variables
// =============================================================================

const SEOPortfolio = {
    // Configuration
    config: {
        whatsappPopupDelay: 5000, // 5 seconds
        scrollOffset: 100,
        animationDelay: 200,
        formSubmissionEndpoint: '/contact', // This would be your actual endpoint
    },

    // State management
    state: {
        isWhatsAppPopupVisible: false,
        isScrollToTopVisible: false,
        hasAnimatedOnScroll: new Set(),
    },

    // Cache DOM elements
    elements: {},
};

// =============================================================================
// DOM Ready Initialization
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    SEOPortfolio.init();
});

// =============================================================================
// Main Initialization
// =============================================================================

SEOPortfolio.init = function() {
    console.log('✅ SEO Portfolio JavaScript loaded successfully!');

    this.cacheElements();
    this.initEventListeners();
    this.initWhatsAppPopup();
    this.initScrollToTop();
    this.initContactForm();
    this.initNewsletterForm();
    this.initAnimations();
    this.initSmoothScrolling();
    this.initProgressBars();
    this.setupIntersectionObserver(); // Initialize Intersection Observer
    this.initNavigation(); // Initialize navigation enhancements

    // Log performance
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log('Page Load Time:', loadTime, 'ms');
    }

    console.log('SEO Portfolio website initialized successfully!');
};

// =============================================================================
// Cache DOM Elements
// =============================================================================

SEOPortfolio.cacheElements = function() {
    this.elements = {
        // Navigation
        navbar: document.querySelector('.navbar'),
        navLinks: document.querySelectorAll('.nav-link'),
        navbarToggler: document.querySelector('.navbar-toggler'), // Added for mobile menu
        navbarCollapse: document.querySelector('.navbar-collapse'), // Added for mobile menu
        dropdowns: document.querySelectorAll('.dropdown'), // Added for dropdown initialization

        // WhatsApp Popup
        whatsappPopup: document.getElementById('whatsapp-popup'),
        closeWhatsappBtn: document.querySelector('.close-whatsapp'),

        // Scroll to Top
        scrollToTopBtn: document.getElementById('scrollToTop'),

        // Forms
        contactForm: document.getElementById('contactForm'),
        newsletterForms: document.querySelectorAll('.newsletter-form'),

        // Messages
        successMessage: document.getElementById('success-message'),
        errorMessage: document.getElementById('error-message'),

        // Animations
        animatedElements: document.querySelectorAll('.fade-in, .slide-up, .scale-in'), // Added .scale-in
        progressBars: document.querySelectorAll('.progress-bar'),

        // Cards
        hoverCards: document.querySelectorAll('.hover-lift'),
    };
};

// =============================================================================
// Event Listeners
// =============================================================================

SEOPortfolio.initEventListeners = function() {
    // Scroll events
    window.addEventListener('scroll', this.handleScroll.bind(this));

    // Resize events
    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));

    // WhatsApp popup events
    if (this.elements.closeWhatsappBtn) {
        this.elements.closeWhatsappBtn.addEventListener('click', this.closeWhatsAppPopup.bind(this));
    }

    // Scroll to top events
    if (this.elements.scrollToTopBtn) {
        this.elements.scrollToTopBtn.addEventListener('click', this.scrollToTop.bind(this));
    }

    // Navigation events
    this.elements.navLinks.forEach(link => {
        link.addEventListener('click', this.handleNavClick.bind(this));
    });

    // Card hover effects
    this.elements.hoverCards.forEach(card => {
        card.addEventListener('mouseenter', this.handleCardHover.bind(this));
        card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
    });
};

// =============================================================================
// WhatsApp Popup Functionality
// =============================================================================

SEOPortfolio.initWhatsAppPopup = function() {
    if (!this.elements.whatsappPopup) return;

    // Show popup after delay
    setTimeout(() => {
        this.showWhatsAppPopup();
    }, this.config.whatsappPopupDelay);

    // Show popup on scroll if not shown yet
    window.addEventListener('scroll', this.debounce(() => {
        if (!this.state.isWhatsAppPopupVisible && window.scrollY > 500) {
            this.showWhatsAppPopup();
        }
    }, 1000));
};

SEOPortfolio.showWhatsAppPopup = function() {
    if (this.state.isWhatsAppPopupVisible || !this.elements.whatsappPopup) return;

    this.elements.whatsappPopup.style.display = 'block';
    this.state.isWhatsAppPopupVisible = true;

    // Auto-hide after 10 seconds
    setTimeout(() => {
        this.closeWhatsAppPopup();
    }, 10000);
};

SEOPortfolio.closeWhatsAppPopup = function() {
    if (!this.elements.whatsappPopup) return;

    this.elements.whatsappPopup.style.display = 'none';
    this.state.isWhatsAppPopupVisible = false;
};

// =============================================================================
// Scroll to Top Functionality
// =============================================================================

SEOPortfolio.initScrollToTop = function() {
    if (!this.elements.scrollToTopBtn) return;

    // Initial state
    this.toggleScrollToTopVisibility();
};

SEOPortfolio.toggleScrollToTopVisibility = function() {
    if (!this.elements.scrollToTopBtn) return;

    const shouldShow = window.scrollY > this.config.scrollOffset;

    if (shouldShow && !this.state.isScrollToTopVisible) {
        this.elements.scrollToTopBtn.style.opacity = '1';
        this.elements.scrollToTopBtn.style.visibility = 'visible';
        this.state.isScrollToTopVisible = true;
    } else if (!shouldShow && this.state.isScrollToTopVisible) {
        this.elements.scrollToTopBtn.style.opacity = '0';
        this.elements.scrollToTopBtn.style.visibility = 'hidden';
        this.state.isScrollToTopVisible = false;
    }
};

SEOPortfolio.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// =============================================================================
// Contact Form Functionality
// =============================================================================

SEOPortfolio.initContactForm = function() {
    if (!this.elements.contactForm) return;

    this.elements.contactForm.addEventListener('submit', this.handleContactFormSubmit.bind(this));

    // Real-time validation
    const inputs = this.elements.contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', this.validateField.bind(this));
        input.addEventListener('input', this.clearFieldError.bind(this));
    });
};

SEOPortfolio.handleContactFormSubmit = function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Validate form
    if (!this.validateForm(form)) {
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    this.submitContactForm(formData)
        .then(response => {
            this.showSuccessMessage();
            form.reset();
        })
        .catch(error => {
            this.showErrorMessage();
            console.error('Form submission error:', error);
        })
        .finally(() => {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
};

SEOPortfolio.submitContactForm = function(formData) {
    // This is a mock implementation
    // Replace with actual API call to your backend
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful submission
            resolve({ success: true });

            // Uncomment below to simulate error
            // reject(new Error('Submission failed'));
        }, 2000);
    });

    /* Real implementation example:
    return fetch(this.config.formSubmissionEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
    */
};

SEOPortfolio.validateForm = function(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!this.validateField({ target: field })) {
            isValid = false;
        }
    });

    return isValid;
};

SEOPortfolio.validateField = function(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }

    // URL validation
    if (field.type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            isValid = false;
            errorMessage = 'Please enter a valid URL.';
        }
    }

    // Phone validation (basic)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }

    // Update field appearance
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');

        // Update error message
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = errorMessage;
        }
    }

    return isValid;
};

SEOPortfolio.clearFieldError = function(e) {
    const field = e.target;
    field.classList.remove('is-invalid');

    if (field.value.trim()) {
        this.validateField(e);
    }
};

SEOPortfolio.showSuccessMessage = function() {
    if (this.elements.successMessage) {
        this.elements.successMessage.style.display = 'block';
        this.elements.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Hide after 5 seconds
        setTimeout(() => {
            this.elements.successMessage.style.display = 'none';
        }, 5000);
    }
};

SEOPortfolio.showErrorMessage = function() {
    if (this.elements.errorMessage) {
        this.elements.errorMessage.style.display = 'block';
        this.elements.errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Hide after 5 seconds
        setTimeout(() => {
            this.elements.errorMessage.style.display = 'none';
        }, 5000);
    }
};

// =============================================================================
// Newsletter Form Functionality
// =============================================================================

SEOPortfolio.initNewsletterForm = function() {
    this.elements.newsletterForms.forEach(form => {
        form.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
    });
};

SEOPortfolio.handleNewsletterSubmit = function(e) {
    e.preventDefault();

    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!emailInput.value.trim()) {
        emailInput.classList.add('is-invalid');
        return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        return;
    }

    emailInput.classList.remove('is-invalid');
    emailInput.classList.add('is-valid');

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;

    // Simulate submission
    setTimeout(() => {
        submitBtn.textContent = 'Subscribed!';
        submitBtn.classList.remove('btn-primary');
        submitBtn.classList.add('btn-success');

        // Reset after 3 seconds
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('btn-success');
            submitBtn.classList.add('btn-primary');
            submitBtn.disabled = false;
            emailInput.classList.remove('is-valid');
            form.reset();
        }, 3000);
    }, 1500);
};

// =============================================================================
// Animation Functionality
// =============================================================================

SEOPortfolio.initAnimations = function() {
    // Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        this.elements.animatedElements.forEach(el => {
            this.animateElement(el);
        });
    }
};

SEOPortfolio.animateElement = function(element) {
    // Add animation delay based on element's order
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .scale-in');
    const index = Array.from(animatedElements).indexOf(element);
    if (index !== -1) {
        element.style.animationDelay = `${this.config.animationDelay * (index + 1)}ms`;
    }
    element.classList.add('animated');
};

// =============================================================================
// Progress Bar Animation
// =============================================================================

SEOPortfolio.initProgressBars = function() {
    if (!this.elements.progressBars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateProgressBar(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    this.elements.progressBars.forEach(bar => {
        observer.observe(bar);
    });
};

SEOPortfolio.animateProgressBar = function(progressBar) {
    const targetWidth = progressBar.style.width || progressBar.getAttribute('style')?.match(/width:\s*(\d+%)/)?.[1] || '0%';

    // Reset width before animating for repeated views
    progressBar.style.width = '0%';

    // Trigger animation after a short delay to ensure reset is applied
    setTimeout(() => {
        progressBar.style.width = targetWidth;
    }, 100); // Small delay
};

// =============================================================================
// Smooth Scrolling
// =============================================================================

SEOPortfolio.initSmoothScrolling = function() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active state in navigation
                const navLink = document.querySelector(`a[href="${targetId}"]`);
                if (navLink) {
                    SEOPortfolio.elements.navLinks.forEach(nl => nl.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });
};

// =============================================================================
// Card Hover Effects
// =============================================================================

SEOPortfolio.handleCardHover = function(e) {
    const card = e.currentTarget;
    card.style.transform = 'translateY(-8px)';
    card.style.transition = 'transform 0.3s ease-in-out';
};

SEOPortfolio.handleCardLeave = function(e) {
    const card = e.currentTarget;
    card.style.transform = 'translateY(0)';
    card.style.transition = 'transform 0.3s ease-in-out';
};

// =============================================================================
// Navigation Handling
// =============================================================================

SEOPortfolio.handleNavClick = function(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');

    // For regular page links, just allow normal navigation
    if (!href.startsWith('#')) {
        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const navbarToggler = document.querySelector('.navbar-toggler');
            if (navbarToggler) {
                navbarToggler.click();
            }
        }
        return; // Allow normal navigation
    }

    // Only prevent default for anchor links
    e.preventDefault();

    // Update active state
    this.elements.navLinks.forEach(navLink => {
        navLink.classList.remove('active');
    });
    link.classList.add('active');

    // Close mobile menu if open
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.click();
        }
    }

    // Handle anchor link scrolling
    const target = document.querySelector(href);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// =============================================================================
// Scroll Handler
// =============================================================================

SEOPortfolio.handleScroll = function() {
    this.toggleScrollToTopVisibility();
    this.updateNavbarState();
    // Call the general scroll animation handler
    this.handleScrollAnimations();
};

SEOPortfolio.updateNavbarState = function() {
    if (!this.elements.navbar) return;

    if (window.scrollY > 50) {
        this.elements.navbar.classList.add('scrolled');
    } else {
        this.elements.navbar.classList.remove('scrolled');
    }
};

// =============================================================================
// Resize Handler
// =============================================================================

SEOPortfolio.handleResize = function() {
    // Handle responsive adjustments
    this.adjustLayoutForScreenSize();
    // Re-check animations on resize in case elements come into view
    this.handleScrollAnimations();
};

SEOPortfolio.adjustLayoutForScreenSize = function() {
    const isMobile = window.innerWidth < 768;

    // Adjust WhatsApp popup position on mobile
    if (this.elements.whatsappPopup) {
        if (isMobile) {
            this.elements.whatsappPopup.style.right = '10px';
            this.elements.whatsappPopup.style.bottom = '10px';
        } else {
            this.elements.whatsappPopup.style.right = '20px';
            this.elements.whatsappPopup.style.bottom = '20px';
        }
    }
};

// =============================================================================
// Utility Functions
// =============================================================================

SEOPortfolio.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const context = this; // Capture `this`
        const later = () => {
            timeout = null;
            func.apply(context, args); // Use apply to pass arguments and context
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

SEOPortfolio.throttle = function(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// =============================================================================
// Error Handling
// =============================================================================

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You could send this to an error tracking service
});

// =============================================================================
// Performance Monitoring
// =============================================================================

window.addEventListener('load', function() {
    // Log performance metrics
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            const loadTime = perfData.loadEventEnd - perfData.fetchStart;
            console.log('Page Load Time:', loadTime, 'ms');
        }
    }
});

// =============================================================================
// Accessibility Enhancements
// =============================================================================

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key closes WhatsApp popup
    if (e.key === 'Escape' && SEOPortfolio.state.isWhatsAppPopupVisible) {
        SEOPortfolio.closeWhatsAppPopup();
    }

    // Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('btn')) {
        e.target.click();
    }
});

// Focus management for modals and popups
SEOPortfolio.manageFocus = function(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length) {
        // Ensure focus is moved to the first focusable element
        const firstFocusable = Array.from(focusableElements).find(el => !el.disabled);
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
};

// =============================================================================
// Export for testing (if needed)
// =============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOPortfolio;
}

// =============================================================================
// New Section: Intersection Observer Setup
// =============================================================================

SEOPortfolio.setupIntersectionObserver = function() {
    // Select all elements that should be animated on scroll
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .scale-in');

    if (!animatedElements.length) return;

    // Configure the Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Check if the element is intersecting the viewport
            if (entry.isIntersecting) {
                const element = entry.target;
                // Add a delay based on the element's position in the list for staggered animation
                const index = Array.from(animatedElements).indexOf(element);
                element.style.animationDelay = `${SEOPortfolio.config.animationDelay * (index + 1)}ms`;
                element.classList.add('animated');
                // Stop observing the element once it has been animated
                observer.unobserve(element);
            }
        });
    }, {
        root: null, // relative to the viewport
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust the trigger point
    });

    // Observe each animated element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
};

// =============================================================================
// Existing Animation Functionality (Refactored slightly for clarity)
// =============================================================================

SEOPortfolio.initAnimations = function() {
    // The primary animation logic is now handled by setupIntersectionObserver
    // This function can be kept for legacy or specific non-observer based animations if needed
    // For now, we'll ensure setupIntersectionObserver is called in init()
};


// =============================================================================
// Scroll Animation Handler (Used by handleScroll)
// =============================================================================
SEOPortfolio.handleScrollAnimations = function() {
    // This function is now redundant as the IntersectionObserver handles the animations
    // We'll keep it here in case specific scroll-based logic is needed outside the observer
    // but the primary animation trigger is the observer.
};

// =============================================================================
// Navigation Enhancements
// =============================================================================

SEOPortfolio.initNavigation = function() {
    // Initialize mobile menu toggle
    if (this.elements.navbarToggler && this.elements.navbarCollapse) {
        this.elements.navbarToggler.addEventListener('click', () => {
            const isExpanded = this.elements.navbarToggler.getAttribute('aria-expanded') === 'true';
            this.elements.navbarToggler.setAttribute('aria-expanded', !isExpanded);
            this.elements.navbarCollapse.classList.toggle('show');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.elements.navbar.contains(e.target) && this.elements.navbarCollapse.classList.contains('show')) {
                this.elements.navbarCollapse.classList.remove('show');
                this.elements.navbarToggler.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Initialize Bootstrap dropdown menus
    this.elements.dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        if (dropdownToggle) {
            // Enable Bootstrap dropdown
            dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
            dropdownToggle.setAttribute('aria-expanded', 'false');
            
            // Initialize Bootstrap dropdown
            if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
                new bootstrap.Dropdown(dropdownToggle);
            }
        }
    });

    // Close mobile menu when nav link is clicked
    this.elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (this.elements.navbarCollapse.classList.contains('show')) {
                this.elements.navbarCollapse.classList.remove('show');
                this.elements.navbarToggler.setAttribute('aria-expanded', 'false');
            }
        });

        // Smooth scrolling for anchor links
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', this.smoothScroll.bind(this));
        }
    });

    // Add scroll effect to navbar
    let lastScrollTop = 0;
    window.addEventListener('scroll', this.debounce(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            this.elements.navbar.classList.add('scrolled');
        } else {
            this.elements.navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll (only on mobile)
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                this.elements.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.elements.navbar.style.transform = 'translateY(0)';
            }
        }
        lastScrollTop = scrollTop;
    }, this.config.debounceDelay));
};