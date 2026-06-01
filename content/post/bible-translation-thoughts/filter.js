document.addEventListener('DOMContentLoaded', () => {
    const h2s = document.querySelectorAll('main h2'); // Adjust 'main' to your content selector
    
    h2s.forEach((h2, index) => {
        // Create a wrapper div for the content under this H2
        const wrapper = document.createElement('div');
        wrapper.className = 'translation-section';
        // Assign an ID based on the H2 text (e.g., "lsb", "esv")
        wrapper.id = 'section-' + h2.textContent.split(' ')[0].toLowerCase();
        
        // Move all siblings after this H2 into the wrapper
        let sibling = h2.nextElementSibling;
        while (sibling && sibling.tagName !== 'H2') {
            const next = sibling.nextElementSibling;
            wrapper.appendChild(sibling);
            sibling = next;
        }
        // Insert the wrapper right after the H2
        h2.parentNode.insertBefore(wrapper, h2.nextSibling);
    });
});

const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        
        // Toggle active class on buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle sections
        const sections = document.querySelectorAll('.translation-section');
        sections.forEach(sec => {
            if (target === 'all' || sec.id === 'section-' + target) {
                sec.style.display = ''; // Show
                sec.previousElementSibling.style.display = ''; // Show the H2
            } else {
                sec.style.display = 'none'; // Hide content
                sec.previousElementSibling.style.display = 'none'; // Hide the H2
            }
        });
    });
});