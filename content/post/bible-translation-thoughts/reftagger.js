// Custom reftagger initialization that scopes versions per translation card
(function() {
    // Initialize refTagger settings BEFORE loading the library
    window.refTagger = {
        settings: {
            bibleVersion: 'CSB'
        }
    };

    // Find nonce for CSP if present
    var n = document.querySelector('[nonce]');
    window.refTagger.settings.nonce = n && (n.nonce || n.getAttribute('nonce'));

    // Load the reftagger library
    var script = document.createElement('script');
    script.src = 'https://api.reftagger.com/v2/RefTagger.js';
    if (window.refTagger.settings.nonce) {
        script.nonce = window.refTagger.settings.nonce;
    }

    document.head.appendChild(script);

    // After the page fully loads and reftagger has processed everything,
    // go through and fix up the links based on which section they're in
    window.addEventListener('load', function() {
        setTimeout(function() {
            var sections = document.querySelectorAll('.translation-section');

            sections.forEach(function(section) {
                // Extract the translation version from the section ID (e.g., "section-lsb" -> "lsb")
                var sectionId = section.getAttribute('id');
                var version = sectionId.replace('section-', '').toLowerCase();

                // Find all reftagger-generated links in card bodies within this section
                var links = section.querySelectorAll('.card-body a.rtBibleRef');

                links.forEach(function(link) {
                    // Update the data-version attribute
                    link.setAttribute('data-version', version);

                    // Update the href to use the correct version
                    var href = link.getAttribute('href');
                    if (href) {
                        // Replace the version in the URL (format: ;VERSION?t=biblia)
                        var newHref = href.replace(/;[^?]+\?/, ';' + version + '?');
                        link.setAttribute('href', newHref);
                    }
                });
            });
        }, 500);  // Give reftagger time to fully process
    });
})();
