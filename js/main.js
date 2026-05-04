(function() {
  'use strict';

  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = !!(prefersReducedMotion && prefersReducedMotion.matches);
  var animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (reduceMotion) {
    animatedElements.forEach(function(el) {
      el.classList.add('animated');
    });
  } else if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    animatedElements.forEach(function(el) {
      el.classList.add('animated');
    });
  }

  var header = document.querySelector('.header-sticky');

  if (header) {
    window.addEventListener('scroll', function() {
      var currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  var navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  var waitlistForms = document.querySelectorAll('.waitlist-form');
  waitlistForms.forEach(function(waitlistForm) {
    var emailInput = waitlistForm.querySelector('input[type="email"]');
    var errorMessage = waitlistForm.querySelector('.form-error');

    function setEmailError(message) {
      if (!emailInput) return;
      emailInput.setAttribute('aria-invalid', message ? 'true' : 'false');
      emailInput.classList.toggle('has-error', !!message);
      if (errorMessage) {
        errorMessage.textContent = message;
      }
    }

    if (emailInput) {
      emailInput.addEventListener('input', function() {
        setEmailError('');
      });
    }

    waitlistForm.addEventListener('submit', function(e) {
      var currentEmailInput = this.querySelector('input[type="email"]');
      if (!currentEmailInput) return;

      var email = currentEmailInput.value.trim();
      
      if (!email) {
        e.preventDefault();
        setEmailError('Enter your email address.');
        currentEmailInput.focus();
        return;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        e.preventDefault();
        setEmailError('Enter a valid email address.');
        currentEmailInput.focus();
        return;
      }

      setEmailError('');
    });
  });

  var heroSection = document.querySelector('.hero');
  if (heroSection && !reduceMotion) {
    var heroContent = heroSection.querySelector('.hero-content');
    var heroImage = heroSection.querySelector('.hero-image');
    
    window.addEventListener('scroll', function() {
      if (window.innerWidth > 768) {
        var scrolled = window.pageYOffset;
        var rate = scrolled * 0.3;
        
        if (heroContent) {
          heroContent.style.transform = 'translateY(' + rate + 'px)';
        }
        if (heroImage) {
          heroImage.style.transform = 'translateY(' + (rate * 0.5) + 'px)';
        }
      }
    });
  }

  var chatBubbles = document.querySelectorAll('.chat-bubble');
  if (!reduceMotion) {
    chatBubbles.forEach(function(bubble, index) {
      bubble.style.opacity = '0';
      bubble.style.transform = 'translateY(10px)';

      setTimeout(function() {
        bubble.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        bubble.style.opacity = '1';
        bubble.style.transform = 'translateY(0)';
      }, 500 + (index * 800));
    });
  }

  var techInputs = document.querySelectorAll('.tech-input');
  var techOutputs = document.querySelectorAll('.tech-output');
  var engineCore = document.querySelector('.engine-core');

  if (techInputs.length && techOutputs.length && engineCore && !reduceMotion && 'IntersectionObserver' in window) {
    var techObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          techInputs.forEach(function(input, i) {
            setTimeout(function() {
              input.style.transform = 'scale(1.1)';
              input.style.transition = 'transform 0.3s ease';
              setTimeout(function() {
                input.style.transform = 'scale(1)';
              }, 300);
            }, i * 200);
          });

          setTimeout(function() {
            engineCore.style.transform = 'scale(1.05)';
            engineCore.style.transition = 'transform 0.3s ease';
            setTimeout(function() {
              engineCore.style.transform = 'scale(1)';
            }, 300);
          }, techInputs.length * 200);

          setTimeout(function() {
            techOutputs.forEach(function(output, i) {
              setTimeout(function() {
                output.style.transform = 'scale(1.1)';
                output.style.transition = 'transform 0.3s ease';
                setTimeout(function() {
                  output.style.transform = 'scale(1)';
                }, 300);
              }, i * 200);
            });
          }, (techInputs.length + 1) * 200 + 300);

          techObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    var techDiagram = document.querySelector('.tech-diagram');
    if (techDiagram) {
      techObserver.observe(techDiagram);
    }
  }

  if (reduceMotion) {
    var style = document.createElement('style');
    style.textContent = `
      .animate-on-scroll {
        opacity: 1 !important;
        transform: none !important;
      }
      .hero-bg-animation {
        animation: none !important;
      }
      .hero-scroll-indicator {
        animation: none !important;
      }
      .device-pulse-overlay {
        animation: none !important;
      }
      .device-pulse-overlay i {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  }
})();
