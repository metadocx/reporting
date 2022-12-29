/** 
 * Application Module
 * 
 * Modules classes can be loaded using boot priority and 
 * will be made available in Metadocx.module property
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class Module extends Consolable {

    constructor(app) {

        super(app);

        /**
         * Set name of module, remove the Module suffix to the class name
         * Modules will be added in Metadocx.modules 
         */
        this.name = this.constructor.name.replace(/Module$/, '');
        this.tag = this.constructor.name.replace(/Module$/, '');
        /**
         * Indicates if the module has been initialized or not
         */
        this.isInitialized = false;

        /**
         * Modules will be loaded using bootPriority from lowest to highest
         * This allows us to load modules in a specific order if needed
         */
        this.bootPriority = 1000;

        /**
         * Reference to Metadocx application
         */
        this.app = app;

    }

    /**
     * Initialize module     
     */
    initialize() {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;

        this.log('Initializing module ' + this.name);
    }

}