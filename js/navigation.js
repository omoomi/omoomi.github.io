/**
 * Mobile Navigation Module
 * Provides responsive mobile navigation with dropdown overlay
 * Automatically handles path resolution for root and posts/ directories
 */

class MobileNavigation {
  constructor() {
    this.isOpen = false;
    this.pathPrefix = this.detectPathLevel();
    this.navigationItems = [
      { text: 'Home', href: 'index.html' },
      { text: 'Features', href: 'features.html' },
      { text: 'Privacy', href: 'privacy.html' },
      { text: 'About', href: 'about.html' },
      { text: 'Blog', href: 'blog.html' }
    ];
    this.socialLinks = [
      {
        href: 'https://www.linkedin.com/company/omoomi',
        label: 'LinkedIn',
        icon: 'fa-linkedin-in'
      },
      {
        href: 'https://www.instagram.com/omoomi.ai',
        label: 'Instagram',
        icon: 'fa-instagram'
      },
      {
        href: 'https://x.com/omoomiAI',
        label: 'X (Twitter)',
        icon: 'fa-x-twitter'
      }
    ];
  }

  /**
   * Detect if we're in root directory or posts/ subdirectory
   * @returns {string} Path prefix ('' for root, '../' for posts/)
   */
  detectPathLevel() {
    return window.location.pathname.includes('/posts/') ? '../' : '';
  }

  /**
   * Generate hamburger menu toggle button HTML
   * @returns {string} HTML string for hamburger menu
   */
  generateMobileToggle() {
    return `
      <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
    `;
  }

  /**
   * Detect current page to determine active navigation item
   * @returns {string} Current page filename
   */
  getCurrentPage() {
    const pathname = window.location.pathname;

    // Remove trailing slash and get filename
    const cleanPath = pathname.replace(/\/$/, '');

    // Extract filename from path
    if (cleanPath.includes('/posts/')) {
      const filename = cleanPath.split('/').pop();
      return filename || 'index.html';
    } else {
      const filename = cleanPath.split('/').pop();
      return filename || 'index.html';
    }
  }

  /**
   * Check if navigation item is the current page
   * @param {Object} item - Navigation item object
   * @param {string} currentPage - Current page filename
   * @returns {boolean} Whether this is the current page
   */
  isCurrentPage(item, currentPage) {
    // Handle index.html specially (both '/' and '/index.html' should match)
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
      return item.href === 'index.html';
    }

    // Direct match for other pages
    if (item.href === currentPage) {
      return true;
    }

    // Handle case where URL might have .html extension but nav item doesn't
    if (currentPage.endsWith('.html') && item.href === currentPage.replace('.html', '')) {
      return true;
    }

    // Handle case where nav item might have .html but current page doesn't
    if (item.href.endsWith('.html') && currentPage === item.href) {
      return true;
    }

    return false;
  }

  /**
   * Generate mobile navigation overlay HTML
   * @returns {string} HTML string for mobile navigation overlay
   */
  generateMobileMenu() {
    const currentPage = this.getCurrentPage();

    const navItems = this.navigationItems.map(item => {
      const isActiveClass = this.isCurrentPage(item, currentPage) ? ' active' : '';
      return `<li><a href="${this.pathPrefix}${item.href}" class="mobile-nav-link${isActiveClass}">${item.text}</a></li>`;
    }).join('');

    const socialItems = this.socialLinks.map(link =>
      `<a href="${link.href}" class="mobile-social-link" aria-label="${link.label}" target="_blank" rel="noopener noreferrer">
        <i class="fa-brands ${link.icon}"></i>
      </a>`
    ).join('');

    return `
      <div class="mobile-nav-overlay" hidden>
        <nav class="mobile-nav-menu" aria-label="Mobile navigation">
          <ul class="mobile-nav-list">
            ${navItems}
          </ul>
          <div class="mobile-social-links">
            ${socialItems}
          </div>
        </nav>
      </div>
    `;
  }

  /**
   * Toggle mobile menu open/closed state
   */
  toggleMobileMenu() {
    const overlay = document.querySelector('.mobile-nav-overlay');
    const toggle = document.querySelector('.mobile-menu-toggle');

    if (!overlay || !toggle) return;

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      overlay.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      // Focus first navigation link
      const firstLink = overlay.querySelector('.mobile-nav-link');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    } else {
      overlay.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Restore scrolling
      toggle.focus(); // Return focus to toggle button
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    if (this.isOpen) {
      this.toggleMobileMenu();
    }
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeyboard(event) {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'Escape':
        this.closeMobileMenu();
        break;
      case 'Tab':
        // Trap focus within mobile menu
        const focusableElements = document.querySelectorAll(
          '.mobile-nav-link, .mobile-social-link, .mobile-menu-toggle'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
        break;
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Close mobile menu if resizing to desktop
    if (window.innerWidth > 768 && this.isOpen) {
      this.closeMobileMenu();
    }
  }

  /**
   * Initialize mobile navigation
   */
  init() {
    // Only proceed if we're on a mobile-capable device
    if (window.innerWidth <= 768) {
      this.injectMobileNavigation();
      this.attachEventListeners();
    }

    // Also handle resize events
    window.addEventListener('resize', () => this.handleResize());
  }

  /**
   * Inject mobile navigation HTML into the page
   */
  injectMobileNavigation() {
    // Find the navigation element
    const nav = document.querySelector('nav');
    if (!nav) {
      console.warn('Navigation element not found');
      return;
    }

    // Add hamburger menu toggle
    nav.insertAdjacentHTML('beforeend', this.generateMobileToggle());

    // Add mobile navigation overlay after header
    const header = document.querySelector('header');
    if (header) {
      header.insertAdjacentHTML('afterend', this.generateMobileMenu());
    } else {
      // Fallback: add after body start
      document.body.insertAdjacentHTML('afterbegin', this.generateMobileMenu());
    }

    // Mark desktop navigation for mobile hiding
    const desktopNav = document.querySelector('nav ul');
    if (desktopNav) {
      desktopNav.classList.add('desktop-nav');
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Hamburger menu toggle
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close menu when clicking overlay background
    const overlay = document.querySelector('.mobile-nav-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeMobileMenu();
        }
      });
    }

    // Close menu when clicking navigation links
    const navLinks = document.querySelectorAll('.mobile-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Handle resize events
    window.addEventListener('resize', () => this.handleResize());
  }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on mobile devices or when window is mobile-sized
  if (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    new MobileNavigation().init();
  }
});

// Also handle potential late-loading or dynamic content
window.addEventListener('load', () => {
  if (!document.querySelector('.mobile-menu-toggle') && window.innerWidth <= 768) {
    new MobileNavigation().init();
  }
});