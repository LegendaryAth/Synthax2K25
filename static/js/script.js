document.addEventListener('DOMContentLoaded', function() {
    // Leaf particles script (remains the same)
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when a link is clicked (for single-page navigation)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // You might want to remove the original CurricuLens login/profile JS from here
    // as it's not relevant for GreenShield or handle it separately if needed.
    // For now, I'll keep only the mobile menu toggle logic.
});
