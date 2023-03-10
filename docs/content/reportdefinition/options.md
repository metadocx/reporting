# Options
The Report Options section allows to set report viewer options directly within the report definition file. This section is optional, options that are included in this section will be used by the report viewer. It is possible to override options using the javascript methods.

- Type : Object
- Parent element : Report definition file

```JSON
{
    "options" : {
        "id": "metadocxReport",
        "locale": "en",
        "template": "Theme2",
        "additionalCSS": "",        
        "toolbar" : {
            "showLocaleButton": true,
            "showOptionsButton" : true,
            "showSettingsButton" : true,
            "showCriteriasButton" : true,
            "showPrintButton" : true,            
            "showExportButton" : true,
            "showCloseButton" : true
        },
        "exportFormats" : {
            "pdf" : true,            
            "excel" : true
        },
        "page" : {
            "orientation" : "portrait",
            "paperSize" : "letter",
            "margins" : {
                "top" : 0.5,
                "bottom" : 0.5,
                "left" : 0.5,
                "right" : 0.5
            },
        },      
        "criterias": {
            "automatic": true
        },  
        "coverPage": {
            "enabled": false
        },
        "viewer": {
            "method": "html"
        },
        "modules" : {
            "Google": {
                "enabled" : false
            }
        }        
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
    "printing": {
        "method": "pdf"
    }
}
```

## Javascript
You can access report viewer options by using the following code in JavaScript. 

```js

Metadocx.reporting.viewer.options

```

Changing the options in JavaScript will trigger updates in the report viewer, if the report is loaded. 

```js

// Changing options values directly in JavaScript 
// will trigger ReportViewer.applyReportViewerOptions 
// and update Report viewer UI if a report is loaded
Metadocx.reporting.viewer.options.toolbar.showExportButton = false;

```

## Options

### General

| Property            | Description                          |
| ------------------- | ------------------------------------ |
| id             | `string` Unique id for report, this will be used to create id's for html elements |
| locale         | `string` Locale to use for the report viewer (en, fr, ...) |
| template  | `string` Name of the template class to use |
| additionalCSS  | `string` Additional CSS to include in report |


### toolbar

Report viewer toolbar options

| Property            | Description                          |
| ------------------- | ------------------------------------ |
| showLocaleButton | `Boolean`, indicates if we must display the locale dropdown button in the main toolbar of the report viewer. Default value is `true`  |
| showOptionsButton | `Boolean`, indicates if we must display the options button in the main toolbar of the report viewer. Default value is `true`  |
| showSettingsButton | `Boolean`, indicates if we must display the report settings button in the main toolbar of the report viewer. Default value is `true` |
| showCriteriasButton | `Boolean`, indicates if we must display the report criterias button in the main toolbar of the report viewer. Default value is `true` |
| showPrintButton | `Boolean`, indicates if we must display the report print button in the main toolbar of the report viewer. Default value is `true` |
| showExportButton | `Boolean`, indicates if we must display the report export button in the main toolbar of the report viewer. Default value is `true` |
| showCloseButton | `Boolean`, indicates if we must display the report close button in the main toolbar of the report viewer. Default value is `true` |

!!! Note "showCloseButton"

    The close button will automaticly be hidden if the window opener is null

!!! Note "showExportButton"

    See the exportFormats section for additional options

### exportFormats

Report viewer export format options

| Property            | Description                          |
| ------------------- | ------------------------------------ |
| pfd | `Boolean`, indicates if we allow users to export the report in PDF format, default value is `true`  |
| word | `Boolean`, indicates if we allow users to export the report in Microsoft Word format, default value is `true`  |
| excel | `Boolean`, indicates if we allow users to export the report in Microsoft Excel format, default value is `true`  |

!!! Note "Export dependencies"

    Exporting reports in other formats requires server side processing.

### criterias
| Property            | Description                          |
| ------------------- | ------------------------------------ |
| automatic | `Boolean`, indicates if we create criterias automaticly based on model information, `false` by default  |

### coverPage
| Property            | Description                          |
| ------------------- | ------------------------------------ |
| enabled | `Boolean`, indicates if we include a cover page for the report  |

### page

Report page options

| Property            | Description                          |
| ------------------- | ------------------------------------ |
| orientation | `enum`, indicates the page orientation of the report, default value is `portrait`  |
| paperSize | `enum`, indicates the type of paper for printing the report, default value is `letter`  |
| margins | `object`, page print margin settings (see margins below)  |

#### margins

Page print margin settings

| Property            | Description                          |
| ------------------- | ------------------------------------ |
| top | `number`, top margin of page in inches, default value is 0.5  |
| bottom | `number`, bottom margin of page in inches, default value is 0.5  |
| left | `number`, left margin of page in inches, default value is 0.5  |
| right | `number`, right margin of page in inches, default value is 0.5  |



### formats

Options on how to format each data type (number, string, dates, ...) within the report. 

#### format.date

| Property            | Description                          |
| ------------------- | ------------------------------------ |
| format | `string`, default date format, default value is `YYYY-MM-DD`  |


#### format.boolean

| Property            | Description                          |
| ------------------- | ------------------------------------ |
| format | `object`, text to use to represent each status of a boolean value (true, false and all) |

#### format.number

| Property            | Description                          |
| ------------------- | ------------------------------------ |
| format | `string`, default number format `0.00` |

### Printing

Options for prining reports

| Property            | Description                          |
| ------------------- | ------------------------------------ |
| method | `string`, method used to print this can be `pdf` or `browser`. PDF will first convert the report in PDF format before printing the PDF gives better results than useing the default browser printing |
