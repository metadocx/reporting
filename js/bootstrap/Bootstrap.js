/**
 * Metadocx reporting application bootstrap
 * This will create the global Metadocx object and check for jQuery
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
if (!window.Metadocx) {
    window.Metadocx = new MetadocxApplication();
}

/**
 * Check for jQuery library if not available inject script tag
 */
if (!window.jQuery) {
    /**
     * jQuery object does not exist, inject script tag
     */
    console.log('jQuery is not loaded, adding script tag');

    (function (d, s, id) {
        let js, lsjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            console.log('Package is already loaded, skipping');
            return;
        }
        js = d.createElement(s); js.id = id;
        js.onload = function () {
            // jQuery is loaded, call initialize on document load
            $(function () {
                Metadocx.initialize();
            });
        };
        js.src = 'https://code.jquery.com/jquery-3.6.1.min.js';
        js.crossOrigin = 'anonymous';
        lsjs.parentNode.insertBefore(js, lsjs);
    }(document, 'script', 'jquery'));

} else {

    // jQuery is loaded, call initialize on document load
    $(function () {
        Metadocx.initialize();
    });
}