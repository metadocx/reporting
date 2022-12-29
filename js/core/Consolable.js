/** 
 * Consolable
 * 
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class Consolable {

    constructor(app) {

        /**
         * Main app reference
         */
        this.app = app;
        /**
         * If console is enabled or not
         */
        this.debugEnabled = true;
        /**
         * Name to display in tag, class name by default
         */
        this.tag = this.constructor.name;
        /**
        * Console text color and backcolor for title
        */
        this.consoleColor = '#fff';
        this.consoleBackColor = 'blue';
    }

    /**
    * Console log with module tag and color
    */
    log() {
        if (!this.debugEnabled) {
            return;
        }
        if (this.app && this.app.modules.Console) {
            this.app.modules.Console.setTag(this.tag);
            this.app.modules.Console.setColor(this.consoleColor, this.consoleBackColor);
            this.app.modules.Console.log.apply(this.app.modules.Console, arguments);
        } else {
            console.log.apply(null, arguments);
        }
    }


    /**
     * Console debug with module tag and color
     */
    debug() {
        if (!this.debugEnabled) {
            return;
        }
        if (this.app && this.app.modules.Console) {
            this.app.modules.Console.setTag(this.tag);
            this.app.modules.Console.setColor(this.consoleColor, this.consoleBackColor);
            this.app.modules.Console.debug.apply(this.app.modules.Console, arguments);
        } else {
            console.debug.apply(null, arguments);
        }
    }

    /**
     * Console debug with module tag and color
     */
    error() {
        if (!this.debugEnabled) {
            return;
        }
        if (this.app && this.app.modules.Console) {
            this.app.modules.Console.setTag(this.tag);
            this.app.modules.Console.setColor(this.consoleColor, this.consoleBackColor);
            this.app.modules.Console.error.apply(this.app.modules.Console, arguments);
        } else {
            console.error.apply(null, arguments);
        }
    }

    /**
     * Console debug with module tag and color
     */
    warn() {
        if (!this.debugEnabled) {
            return;
        }
        if (this.app && this.app.modules.Console) {
            this.app.modules.Console.setTag(this.tag);
            this.app.modules.Console.setColor(this.consoleColor, this.consoleBackColor);
            this.app.modules.Console.warn.apply(this.app.modules.Console, arguments);
        } else {
            console.warn.apply(null, arguments);
        }
    }

}
