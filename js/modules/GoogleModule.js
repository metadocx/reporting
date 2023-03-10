/**
 * Google module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class GoogleModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 500;
        this._isGoogleAPILoaded = false;

        /**
         * Google API settings
         */

        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.     
        //this.SCOPES = 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/spreadsheets.readonly';
        this.SCOPES = [
            //'https://www.googleapis.com/auth/drive',
            //'https://www.googleapis.com/auth/drive.file',
            //'https://www.googleapis.com/auth/drive.readonly',
            //'https://www.googleapis.com/auth/spreadsheets',
            //'https://www.googleapis.com/auth/spreadsheets.readonly',            
            'https://www.googleapis.com/auth/drive.metadata.readonly',
        ];
        // Set to Client ID and API key from the Developer Console
        this.CLIENT_ID = '<YOUR CLIENT ID>';
        this.API_KEY = '<YOUR API KEY>';
        this.DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
        this.APP_ID = '<YOUR APP ID>';

        this.tokenClient = null;
        this.accessToken = null;

        this._googleAPILoaded = false;
        this._googleClientLoaded = false;

    }

    initialize() {
        super.initialize();
    }

    loadGoogleAPI() {

        if (this._isGoogleAPILoaded) {
            this.log('~Google API already loaded');
            return;
        }
        this.log('Injecting google api script tags');
        this._isGoogleAPILoaded = true;

        this.app.modules.Import.injectLibrary('GoogleAPI');
    }

    /**
     * Called when google api script tag is loaded
     */
    gApiLoaded() {
        this.log('Google API script loaded');
        this._googleAPILoaded = true;
        this.checkIfGoogleAPIIsLoaded();
        this.loadPickerAPI();
    }

    /**
     * Called when google client script tag is loaded
     */
    gClientLoaded() {
        this.log('Google Client script loaded');
        this._googleClientLoaded = true;
        this.checkIfGoogleAPIIsLoaded();

    }

    checkIfGoogleAPIIsLoaded() {
        if (this._googleAPILoaded && this._googleClientLoaded) {
            this.log('Google API is loaded');
            this.onGoogleAPILoaded();
            return true;
        }
        this.log('Google API is NOT loaded');
        return false;
    }

    onGoogleAPILoaded() {
        this.log('Google onGoogleAPILoaded');
        if (this.tokenClient === null) {
            this.log('Google initTokenClient');
            this.log(this.CLIENT_ID);
            this.log(this.SCOPES);

            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: this.CLIENT_ID,
                scope: this.SCOPES.join(' '),
                callback: '', // defined later
            });

            this.log('tokenClient value = ');
            this.log(this.tokenClient);

        } else {
            this.log('~tokenClient is NOT null');
        }
    }

    signIn(callback) {

        this.log('Google signin');
        this.tokenClient.callback = async (response) => {
            this.log('tokenClient callback');
            this.log(response);
            if (response.error !== undefined) {
                throw (response);
            }
            this.accessToken = response.access_token;
            //await this.loadPickerAPI();
            if (callback) {
                await callback();
            }
        };

        if (this.accessToken === null) {
            this.log('Prompt user for google account');
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            this.log('Already loged in');
            // Skip display of account chooser and consent dialog for an existing session.
            this.tokenClient.requestAccessToken({ prompt: '' });
        }

    }

    signOut() {
        this.log('Google sign out');
        if (this.accessToken) {
            this.accessToken = null;
            google.accounts.oauth2.revoke(this.accessToken);
        }
    }

    async loadPickerAPI() {
        this.log('Loading Picker API');
        await gapi.load('client:picker', this.initializePicker);
    }

    async initializePicker(thisObject) {
        Metadocx.modules.Google.log('Initializing Google Picker API');
        await gapi.client.init({
            apiKey: Metadocx.modules.Google.API_KEY,
            discoveryDocs: [Metadocx.modules.Google.DISCOVERY_DOC],
        });
        await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
    }

    showGoogleDocPicker() {

        if (this.accessToken === null) {
            this.log('User is not loged in, calling google signin');
            // Use is not logged in
            this.signIn(() => {
                // @todo fix this
                setTimeout(this.showGoogleDocPicker, 1000);
            });
            return;
        }

        Metadocx.modules.Google.log('Creating google picker');
        Metadocx.modules.Google.log(' accessToken = ' + Metadocx.modules.Google.accessToken);
        const picker = new google.picker.PickerBuilder()
            //.enableFeature(google.picker.Feature.NAV_HIDDEN)
            //.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setDeveloperKey(Metadocx.modules.Google.API_KEY)
            .setAppId(Metadocx.modules.Google.APP_ID)
            .setOAuthToken(Metadocx.modules.Google.accessToken)
            .addView(google.picker.ViewId.SPREADSHEETS)
            .setLocale(Metadocx.reporting.viewer.options.locale ?? 'en')
            //.addView(new google.picker.DocsUploadView())
            .setCallback(Metadocx.modules.Google.pickerCallback)
            .build();
        picker.setVisible(true);
    }

    async pickerCallback(data) {
        Metadocx.modules.Google.log('Picker event ' + data.action);
        if (data.action === google.picker.Action.PICKED) {

            const document = data[google.picker.Response.DOCUMENTS][0];
            const fileId = document[google.picker.Document.ID];
            Metadocx.modules.Google.log('Selected file ' + fileId);


            let sheetMetaResponse;
            try {
                Metadocx.modules.Google.log('Getting spreadsheet meta');
                sheetMetaResponse = await gapi.client.sheets.spreadsheets.get({
                    spreadsheetId: fileId,
                    includeGridData: false,
                });

                Metadocx.modules.Google.log(sheetMetaResponse);
                Metadocx.modules.Google.log(sheetMetaResponse.result.sheets[0].properties.title);

            } catch (err) {
                Metadocx.modules.Google.log('Error in gapi.client.sheets.spreadsheets.get ' + err.message);
            }



            let sheetDataResponse;
            try {
                Metadocx.modules.Google.log('Getting spreadsheet meta');
                sheetDataResponse = await gapi.client.sheets.spreadsheets.get({
                    spreadsheetId: fileId,
                    includeGridData: true,
                    ranges: [sheetMetaResponse.result.sheets[0].properties.title + '!A1:' + Metadocx.modules.Google.columnToLetter(sheetMetaResponse.result.sheets[0].properties.gridProperties.columnCount, sheetMetaResponse.result.sheets[0].properties.gridProperties.rowCount)],
                });

                Metadocx.modules.Google.log(sheetDataResponse);
                Metadocx.modules.Google.buildReportFromSheet(sheetDataResponse);

            } catch (err) {
                Metadocx.modules.Google.log('Error in gapi.client.sheets.spreadsheets.get ' + err.message);
            }




        }
    }

    columnToLetter(column, row) {
        var temp, letter = '';
        while (column > 0) {
            temp = (column - 1) % 26;
            letter = String.fromCharCode(temp + 65) + letter;
            column = (column - temp - 1) / 26;
        }
        return letter + row;
    }

    buildReportFromSheet(sheetData) {

        let title = sheetData.result.properties.title;
        let reportDefinition = {
            "id": "googleSheetReport",
            "properties": {
                "name": title,
                "description": "",
                "author": "",
                "version": ""
            },
            "options": {},
            "criterias": [],
            "sections": []
        };

        let index = 1;
        for (let x in sheetData.result.sheets) {

            let sectionID = 'sheet' + index;
            let reportSection = {
                "id": sectionID,
                "type": "DataTable",
                "properties": {
                    "name": sheetData.result.sheets[x].properties.title,
                    "description": ""
                },
                "orderBy": [],
                "groupBy": [],
                "model": [],
                "data": []
            };

            /**
             * Load data
             */
            let data = [];
            let model = [];
            let bFirstRow = true;
            for (let r in sheetData.result.sheets[x].data[0].rowData) {
                let row = sheetData.result.sheets[x].data[0].rowData[r].values;
                let rowData = {};
                for (let c in row) {
                    if (bFirstRow) {
                        let columnData = {};
                        columnData['name'] = 'column' + c;
                        columnData['type'] = 'string';
                        columnData['label'] = row[c].formattedValue ?? '';
                        if (row[c].userEnteredFormat.numberFormat) {
                            // Column has a format
                            if (row[c].userEnteredFormat.numberFormat.type) {
                                columnData['type'] = row[c].userEnteredFormat.numberFormat.type.toLowerCase();
                            }
                            if (row[c].userEnteredFormat.horizontalAlignment) {
                                columnData['align'] = row[c].userEnteredFormat.horizontalAlignment.toLowerCase();
                            }
                        }
                        model.push(columnData);
                    } else {
                        if (row[c].effectiveValue) {
                            if (row[c].effectiveValue.stringValue) {
                                rowData['column' + c] = row[c].effectiveValue.stringValue ?? '';
                            } else if (row[c].effectiveValue.numberValue) {
                                rowData['column' + c] = row[c].effectiveValue.numberValue ?? '';
                            } else {
                                rowData['column' + c] = row[c].formattedValue ?? '';
                            }
                        } else if (row[c].formattedValue) {
                            rowData['column' + c] = row[c].formattedValue ?? '';
                        } else {
                            rowData['column' + c] = '';
                        }

                    }
                }

                if (!bFirstRow) {
                    if (!this.isEmptyRow(rowData)) {
                        data.push(rowData);
                    }
                }

                bFirstRow = false;
            }

            reportSection.model = model;
            reportSection.data = data;

            reportDefinition.sections.push(reportSection);
            index++;
        }

        console.log(reportDefinition);

        this.app.reporting.viewer.load(reportDefinition);

    }

    isEmptyRow(row) {
        for (let c in row) {
            if (row[c]) {
                return false;
            }
        }
        return true;
    }


}
window.__Metadocx.GoogleModule = GoogleModule;