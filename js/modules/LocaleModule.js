/**
 * Locale module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class LocaleModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 100;
        this.isConsoleDisabled = false;
        this.currentLocale = 'en';
        this.locales = window.__Metadocx.Locales;
    }

    initialize() {
        super.initialize();
    }

    addLocale(locale, keys) {

        if (this.locales[locale] == undefined) {
            this.locales[locale] = {};
        }

        for (let k in keys) {
            this.locales[locale][k] = keys[k];
        }

    }

    setLocale(locale) {
        if (this.currentLocale != locale) {
            this.currentLocale = locale;
            moment.locale(this.currentLocale);
            this.translate();
        }
    }

    getKey(key) {
        let text = this.locales[this.currentLocale][key];
        if (text == undefined || text == null) {
            console.warn('Missing translation key ' + key);
            text = key;
        }
        return text;
    }

    getCurrentLocale() {
        return this.currentLocale;
    }

    getLocales() {
        let locales = [];
        for (let x in this.locales) {
            locales.push(x);
        }
        return locales;
    }

    translate() {

        let thisObject = this;
        $('[data-locale]').each(function () {
            if ($(this).is('input') || $(this).is('textarea')) {
                $(this).attr('placeholder', thisObject.getKey($(this).data('locale')));
            } else {
                $(this).html(thisObject.getKey($(this).data('locale')));
            }
        });

    }

    getLocaleMenuOptions() {
        let locales = this.getLocales();
        let s = '';
        for (let x in locales) {
            s += `<a id="${this.app.reporting.viewer.options.id}_locale_${locales[x]}" class="dropdown-item" href="#" onClick="Metadocx.modules.Locale.setLocale('${locales[x]}');" data-locale="${locales[x]}">${locales[x]}</a>`;
        }
        return s;
    }


}
window.__Metadocx.LocaleModule = LocaleModule;