# Configuration Options

Configuration options can be defined in the report definition file. This allows you to override any default configuration options directly within your report definition file.

## Default configuration options

Here are the default configuration options used if no options are supplied in the report definition file.

```JSON
    "options" : {
        "toolbar" : {
            "showOptionsButton" : true,
            "showSettingsButton" : true,
            "showCriteriasButton" : true,
            "showPrintButton" : true,            
            "showExportButton" : true,
            "showCloseButton" : true
        },
        "exportFormats" : {
            "pdf" : true,
            "word" : true,
            "excel" : true
        },
        "page" : {
            "orientation" : "portrait",
            "paperSize" : "Letter",
            "margins" : {
                "top" : 0.5,
                "bottom" : 0.5,
                "left" : 0.5,
                "right" : 0.5
            }
        },
        "settings" : {
            
            "fields" : true,
            "fieldsReorder" : true,
            "fieldsSelection" : true,
            "fieldsFormula" : true,            
            
            "orderBy" : true,
            "orderByReorder" : true,
            "orderBySelection" : true,
            "orderByOrder" : true,

            "groupBy" : true,
            "groupByReorder" : true,
            "groupBySelection" : true,
            "groupByOrder" : true
        },
        "formats" : {
            "date" : {
                "format" : "YYYY-MM-DD"
            },
            "boolean" : {
                "format" : {
                    "trueValue" : "Yeah",
                    "falseValue" : "No way",
                    "ALL" : "All"
                }
            },
            "number" : {
                "format" : "0.00"
            }
        },
        "printing": {
            "method": "pdf"
        }
    },
```