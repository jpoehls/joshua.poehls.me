document.addEventListener('DOMContentLoaded', () => {
    // Wrap content between H2s (including paragraphs and shortcode output)
    const main = document.querySelector('main');
    const h2s = main.querySelectorAll('h2');

    h2s.forEach((h2) => {
        // Skip if this H2 is before the emoji legend (don't wrap filter/legend UI)
        const legend = document.querySelector('.emoji-legend');
        if (legend && h2.compareDocumentPosition(legend) & Node.DOCUMENT_POSITION_FOLLOWING) {
            return;
        }

        // Create wrapper for all content after this H2 until the next H2
        const wrapper = document.createElement('div');
        wrapper.className = 'translation-content-wrapper';
        // Extract translation key from H2 text (e.g., "LSB (Legacy..." -> "lsb")
        const translationKey = h2.textContent.split(' ')[0].toLowerCase();
        wrapper.setAttribute('data-translation', translationKey);

        // Move all siblings after this H2 into wrapper until hitting another H2
        let sibling = h2.nextElementSibling;
        while (sibling && sibling.tagName !== 'H2') {
            const next = sibling.nextElementSibling;
            wrapper.appendChild(sibling);
            sibling = next;
        }

        // Insert wrapper right after the H2
        h2.parentNode.insertBefore(wrapper, h2.nextSibling);
    });

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');

    const filterSections = (target) => {
        const wrappers = document.querySelectorAll('.translation-content-wrapper');

        h2s.forEach(h2 => {
            const nextWrapper = h2.nextElementSibling;
            if (nextWrapper && nextWrapper.classList.contains('translation-content-wrapper')) {
                const translationKey = nextWrapper.getAttribute('data-translation');
                const show = target === 'all' || target === translationKey;

                // Hide/show both H2 and its content wrapper
                h2.style.display = show ? '' : 'none';
                nextWrapper.style.display = show ? '' : 'none';
            }
        });
    };

    filterButtons.forEach(btn => {
        // Click handler
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');

            // Update active state
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            filterSections(target);
        });

        // Keyboard navigation
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });

        // Initialize aria-pressed
        btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
    });
});