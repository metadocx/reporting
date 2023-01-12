/**
 * Console module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ConsoleModule extends Module {

    constructor(app) {
        super(app);
        this.app = app;
        this.bootPriority = 100;
        this.isConsoleDisabled = false;
        this.tag = null;
        this.color = '#fff';
        this.backColor = 'blue';
    }

    initialize() {
        super.initialize();
    }

    /**
     * Sets tag (text) to prepend to message
     */
    setTag(sTag) {
        this.tag = sTag;
        return this;
    }

    /**
     * Sets tag color
     * @param {*} sColor 
     * @param {*} sBackColor 
     * @returns object
     */
    setColor(sColor, sBackColor) {
        this.color = sColor;
        this.backColor = sBackColor;
        return this;
    }

    /**
    * The console.assert() method writes an error message to the console if the assertion is false. 
    * If the assertion is true, nothing happens.
    */
    assert() {
        if (this.isConsoleDisabled) {
            return false;
        }
        console.assert.apply(null, arguments);
    }

    /**
     * The console.clear() method clears the console if the environment allows it.
     */
    clear() {
        console.clear();
    }

    /**
     * The console.count() method logs the number of times that this particular call to count() has been called.
     */
    count() {
        if (this.isConsoleDisabled) {
            return false;
        }
        console.count.apply(null, arguments);
    }

    /**
     * The console.countReset() method resets counter used with console.count().
     */
    countReset() {
        if (this.isConsoleDisabled) {
            return false;
        }
        console.countReset.apply(null, arguments);
    }

    /**
     * The console.debug() method outputs a message to the web console at the "debug" log level. 
     * The message is only displayed to the user if the console is configured to display debug output. 
     * In most cases, the log level is configured within the console UI. 
     * This log level might correspond to the `Debug` or `Verbose` log level.
     * @param {*} sMessage      
     */
    debug(sMessage) {
        if (this.isConsoleDisabled) {
            return false;
        }
        console.debug.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The method console.dir() displays an interactive list of the properties of the specified JavaScript object. 
     * The output is presented as a hierarchical listing with disclosure triangles that let you see the contents of child objects.
     * In other words, console.dir() is the way to see all the properties of a specified JavaScript object 
     * in console by which the developer can easily get the properties of the object.
     * @param {*}      
     */
    dir() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.dir.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');

    }

    /**
     * The console.error() method outputs an error message to the Web console.
     * @param {*} sMessage      
     */
    error(sMessage) {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.error.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.group() method creates a new inline group in the Web console log,
     * causing any subsequent console messages to be indented by an additional level, 
     * until console.groupEnd() is called.     
     */
    group() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.group.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.groupCollapsed() method creates a new inline group in the Web Console. 
     * Unlike console.group(), however, the new group is created collapsed. 
     * The user will need to use the disclosure button next to it to expand it, revealing the entries created in the group.
     * Call console.groupEnd() to back out to the parent group.     
     */
    groupCollapsed() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.groupCollapsed.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.groupEnd() method exits the current inline group in the Web console. 
     * See Using groups in the console in the console documentation for details and examples.     
     */
    groupEnd() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.groupEnd.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.info() method outputs an informational message to the Web console. 
     * In Firefox, a small "i" icon is displayed next to these items in the Web console's log.
     * @param {*} sMessage      
     */
    info() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.info.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.log() method outputs a message to the web console. 
     * The message may be a single string (with optional substitution values), or it may be any one or more JavaScript objects.     
     */
    log() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.log.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.profile() starts recording a performance profile (for example, the Firefox performance tool).
     * You can optionally supply an argument to name the profile and this then enables you to stop only that profile
     *  if multiple profiles being recorded. See console.profileEnd() to see how this argument is interpreted.
     * @param {*} sName      
     */
    profile() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.profile.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.profileEnd() method stops recording a profile previously started with console.profile().
     * @param {*} sName      
     */
    profileEnd() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.profileEnd.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * This function takes one mandatory argument data, which must be an array or an object, 
     * and one additional optional parameter columns.
     * 
     * It logs data as a table. Each element in the array (or enumerable property if data is an object) 
     * will be a row in the table.
     * 
     * The first column in the table will be labeled (index). If data is an array, 
     * then its values will be the array indices. If data is an object, then its values will be the property names. 
     * 
     * Note that (in Firefox) console.table is limited to displaying 1000 rows (first row is the labeled index).
     * 
     * @param {*} e 
     */
    table() {
        if (this.isConsoleDisabled) {
            return false;
        }
        console.table.apply(console, arguments);
    }

    /**
     * The console.time() method starts a timer you can use to track how long an operation takes. 
     * You give each timer a unique name, and may have up to 10,000 timers running on a given page. 
     * When you call console.timeEnd() with the same name, the browser will output the time, in milliseconds, 
     * that elapsed since the timer was started.     
     */
    time() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.time.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.timeEnd() stops a timer that was previously started by calling console.time().     
     */
    timeEnd() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.timeEnd.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.timeLog() method logs the current value of a timer that was previously started 
     * by calling console.time() to the console.     
     */
    timeLog() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.timeLog.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.trace() method outputs a stack trace to the Web console.     
     */
    trace() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.trace.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.warn() method outputs a warning message to the Web console.
     * @param {*} sMessage      
     */
    warn(sMessage) {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.warn.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * Build arguments for log methods with format options
     * @param {*} args 
     * @returns array
     */
    buildArguments(args) {
        var aArguments = [];
        var sMessage = null;
        var nFirstArg = 0;
        if (args.length > 0) {
            if (typeof args[0] == 'string') {
                sMessage = args[0];
                nFirstArg = 1;
            }
        }

        if (this.tag && sMessage) {
            sMessage = '%c' + this.tag.padEnd(10, ' ') + '%c ' + sMessage;
            aArguments.push(sMessage);
            aArguments.push('color:' + this.color + ';background-color:' + this.backColor + ';border-radius:3px;padding:2px;font-size:8pt;');
            aArguments.push('color:#000;background-color:#fff');
        } else if (sMessage) {
            aArguments.push(sMessage);
        }

        for (var i = nFirstArg; i < args.length; i++) {
            aArguments.push(args[i]);
        }

        return aArguments;
    }

    /**
     * Disable console output
     */
    disable() {
        this.isConsoleDisabled = true;
        return this;
    }

    /**
     * Enable console output
     */
    enable() {
        this.isConsoleDisabled = false;
        return this;
    }

    /**
     * Display help for module
     */
    help() {
        window.open('https://developer.mozilla.org/en-US/docs/Web/API/console', 'ConsoleHelp', 'noopener');
    }

}
window.__Metadocx.ConsoleModule = ConsoleModule;