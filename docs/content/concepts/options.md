# Options

Options are accessible via the viewer object. Default options are loaded on application creation and can be modified using the Report Definition File, JavaScript or adding script tag `data-` attributes.

Options will determine the functionalities of the report viewer and hwo the report will be displayed to the user.

## Default options

Defaults options will be loaded automaticly, all options defined in the Report Definition File will override theses default options. Default options are loaded in the `loadDefaultOptions` function of the ReportView.js file.

```JS
this.options = {
    "id": "metadocxReport",
    "locale": "en",
    "additionalCSS": "",
    "template": "Theme2",
    "toolbar": {
        "showSaveButton": true,
        "showLocaleButton": false,
        "showOptionsButton": true,
        "showSettingsButton": true,
        "showCriteriasButton": true,
        "showPrintButton": true,
        "showExportButton": true,
        "showCloseButton": true
    },
    "exportFormats": {
        "pdf": true,
        "word": true,
        "excel": true
    },
    "page": {
        "orientation": "portrait",
        "paperSize": "Letter",
        "margins": {
            "top": 0.5,
            "bottom": 0.5,
            "left": 0.5,
            "right": 0.5
        }
    },
    "criterias": {
        "automatic": false
    },
    "coverPage": {
        "enabled": false
    },
    "settings": {
        "fields": true,
        "fieldsReorder": true,
        "fieldsSelection": true,
        "fieldsFormula": true,

        "orderBy": true,
        "orderByReorder": true,
        "orderBySelection": true,
        "orderByOrder": true,

        "groupBy": true,
        "groupByReorder": true,
        "groupBySelection": true,
        "groupByOrder": true
    },
    "formats": {
        "date": {
            "format": "YYYY-MM-DD"
        },
        "boolean": {
            "format": {
                "trueValue": "Yes",
                "falseValue": "No",
                "ALL": "All"
            }
        },
        "number": {
            "format": "0.00"
        }
    },
    "viewer": {
        "method": "html"
    },
    "printing": {
        "method": "pdf"
    },
    "modules": {
        "Google": {
            "enabled": false
        }
    }
};
```

