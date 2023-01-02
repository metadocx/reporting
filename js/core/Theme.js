/** 
 * Theme
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier. 
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class Theme {

    constructor(app) {
        this.app = app;
    }

    renderCoverPage() { return ''; }
    renderCoverPageCSS() { return ''; }
    renderThemeCSS() { return ''; }

}

window.__Metadocx.Theme = Theme;