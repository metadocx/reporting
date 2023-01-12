/**
 * DB module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class DBModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 100;
        this.connection = null;
    }

    /**
     * Initialize module
     */
    initialize() {
        super.initialize();

        this.log('Openning local database');
        const request = window.indexedDB.open('Metadocx', 1);

        request.onerror = (event) => {
            this.error('Error in opening Metadocx database');
        };

        request.onsuccess = (event) => {
            this.log('Local database open success');
            this.connection = event.target.result;
        };

        request.onupgradeneeded = (event) => {
            // Save the IDBDatabase interface
            this.log('Local database upgrade required');
            this.connection = event.target.result;

            // Create an objectStore for this database
            const savedReports = this.connection.createObjectStore('SavedReports', { keyPath: 'reportUID' });
            savedReports.createIndex('reportId', 'reportId', { unique: false });

        };

    }

    /**
     * Save report in local db
     * @param {*} savedReport 
     * @param {*} callback 
     */
    saveReport(savedReport, callback) {

        this.log('Saving report');
        const transaction = this.connection.transaction(['SavedReports'], 'readwrite');
        const savedReports = transaction.objectStore('SavedReports');
        const request = savedReports.add(savedReport);

        request.onsuccess = (event) => {
            // event.target.result
            this.log('Transaction success, report saved');
            if (callback) {
                callback();
            }
        };

    }

    /**
     * Updates an existing report
     * @param {*} savedReport 
     * @param {*} callback 
     */
    updateReport(savedReport, callback) {

        this.log('Updating report');
        const transaction = this.connection.transaction(['SavedReports'], 'readwrite');
        const savedReports = transaction.objectStore('SavedReports');
        const request = savedReports.put(savedReport);

        request.onsuccess = (event) => {
            // event.target.result === customer.ssn;
            this.log('Transaction success, report updated');
            if (callback) {
                callback(savedReport);
            }
        };

    }

    /**
     * Returns a specific report using report UID
     * @param {*} reportUID 
     * @param {*} callback 
     */
    getReport(reportUID, callback) {

        this.log('Loading report');
        const transaction = this.connection.transaction(['SavedReports'], 'readwrite');
        const savedReports = transaction.objectStore('SavedReports');
        const request = savedReports.get(reportUID);

        request.onsuccess = (event) => {
            // event.target.result === customer.ssn;
            this.log('Transaction success, report loaded');
            if (callback) {
                callback(event.target.result);
            }
        };

    }

    /**
     * List saved reports filtered by reportId
     * @param {*} reportId 
     * @param {*} callback 
     */
    querySavedReports(reportId, callback) {

        const transaction = this.connection.transaction(['SavedReports'], 'readwrite');
        const savedReports = transaction.objectStore('SavedReports');
        const index = savedReports.index('reportId');
        const singleKeyRange = IDBKeyRange.only(reportId);

        this.log('Loading saved reports for ' + reportId);

        let data = [];
        index.openCursor(singleKeyRange).onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                data.push(cursor.value);
                cursor.continue();
            } else {
                // Done loading data
                if (callback) {
                    callback(data);
                }
            }
        };

    }


    /**
     * Updates an existing report
     * @param {*} savedReport 
     * @param {*} callback 
     */
    deleteReport(reportUID, callback) {

        this.log('Deleting report');
        const transaction = this.connection.transaction(['SavedReports'], 'readwrite');
        const savedReports = transaction.objectStore('SavedReports');
        const request = savedReports.delete(reportUID);

        request.onsuccess = (event) => {
            // event.target.result === customer.ssn;
            this.log('Transaction success, report deleted');
            if (callback) {
                callback(reportUID);
            }
        };

    }

}
window.__Metadocx.DBModule = DBModule;