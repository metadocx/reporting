# Get started with Metadocx Reporting

## Quick start

Metadocx Reporting is a powerfull, feature-packed report generation and viewer toolkit. Build professional reports quickly and with ease.

### Required dependencies

Metadocx reporting is built using other [great open source libraries](requirements.md). In order to use Metadocx reporting you must include the following dependencies in your web page.

#### Head

Include these link tags in the head section of your html page

```HTML
<link rel="stylesheet" href="https://unicons.iconscout.com/release/v3.0.0/css/line.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"  integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css" integrity="sha512-ELV+xyi8IhEApPS/pSj66+Jiw+sOT1Mqkzlh8ExXihe4zfqbWkxPRi8wptXIO9g73FSlhmquFlUOuMSoXz5IRw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/theme.min.css" integrity="sha512-hbs/7O+vqWZS49DulqH1n2lVtu63t3c3MTAn0oYMINS5aT8eIAbJGDXgLt6IxDHcWyzVTgf9XyzZ9iWyVQ7mCQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/metadocx/reporting@latest/dist/metadocx.min.css" />
```

#### Bottom (before closing body tag)

Include these script tags before your closing body tag

```HTML
<script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/metadocx/reporting@latest/dist/metadocx.min.js" data-report="data/report1.json"></script>            

```

#### Container element

Metadocx will render the report viewer with the `metadocx-report` html element in your web page. This is the default id of the element where we will insert the generated report html. You can change the name of this element by using the `data-container` attribut eon the metadocx.js script tage element.

!!! Note "Missing element"

    If the element does not exist in the web page, it will be prepended to the body element.

##### Example : Adding data-container attribute 
```HTML
<script src="https://cdn.jsdelivr.net/gh/metadocx/reporting@latest/dist/metadocx.min.js" data-container="metadocx-report" data-report="data/report1.json"></script>
```

##### Example : Adding the element to your web page
```HTML
<body>
    <div id="metadocx-report"></div>
</body>
```

#### Full example of a report viewer page 
```HTML
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">              
        <link rel="stylesheet" href="https://unicons.iconscout.com/release/v3.0.0/css/line.css">        
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
        <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" rel="stylesheet" crossorigin="anonymous">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css" integrity="sha512-ELV+xyi8IhEApPS/pSj66+Jiw+sOT1Mqkzlh8ExXihe4zfqbWkxPRi8wptXIO9g73FSlhmquFlUOuMSoXz5IRw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/theme.min.css" integrity="sha512-hbs/7O+vqWZS49DulqH1n2lVtu63t3c3MTAn0oYMINS5aT8eIAbJGDXgLt6IxDHcWyzVTgf9XyzZ9iWyVQ7mCQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/metadocx/reporting@latest/dist/metadocx.min.css" />
          
    </head>
    <body>        
        <div id="metadocx-report"></div>        
    </body>            
    <script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/6.0.0/bootbox.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js" integrity="sha512-57oZ/vW8ANMjR/KQ6Be9v/+/h6bq9/l3f0Oc7vn6qMqyhvPd1cvKBRWWpzu0QoneImqr2SkmO4MSqU+RpHom3Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdn.jsdelivr.net/gh/metadocx/reporting@latest/dist/metadocx.min.js" data-container="metadocx-report" data-report="report.json"></script>            
</html>
```

### Report definition file

The report definition file contains all the information required to generate the report. Create a report.json file and add the following content.

```JSON
{
    "id" : "timesheetsReport",
    "properties" : {
        "name" : "Timesheets",
        "description" : "Timesheets per customer and project"
    },

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
        }
    },

    "criterias" : [
        {
            "id": "TimesheetDate",
            "name" : "Timesheet date",
            "description" : "Filter timesheets based on the date of the timesheet",
            "type": "DatePeriodCriteria",
            "defaultValue" : null,
            "isRequired" : false,
            "parameters" : {    
                "locale": {
                    "format": "YYYY-MM-DD",                    
                    "separator": " / "                    
                },
                "alwaysShowCalendars": true
            },
            "applyTo" : [
                {"section" : "timesheets", "field" : "timesheetDate"}
            ]
        },
        {
            "id": "Employee",
            "name" : "Employee",
            "description" : "Filter timesheets based on the employee of the timesheet",
            "type": "SelectCriteria",
            "defaultValue" : null,
            "isRequired" : false,
            "parameters" : {
                "multiple" : false,
                "allowClear" : true,
                "placeholder" : "",
                "closeOnSelect" : true
            },
            "options" : {
                "source" : "data",
                "field" : "employee"
            },
            "applyTo" : [
                {"section" : "timesheets", "field" : "employee"}
            ]
        },
        {
            "id": "ActivityCode",
            "name" : "Activity Code",
            "description" : "Filter timesheets based on the activity code of the timesheet",
            "type": "SelectCriteria",
            "defaultValue" : null,
            "isRequired" : false,
            "parameters" : {
                "multiple" : true,
                "allowClear" : true,
                "placeholder" : "",
                "closeOnSelect" : false
            },
            "options" : {
                "source" : "ajax",
                "url": "/activitycodes"
            },
            "applyTo" : [
                {"section" : "timesheets", "field" : "activityCode"}
            ]
        },
        {
            "id": "IsBillable",
            "name" : "Is Billable",
            "description" : "Filter timesheets based on the is billable status the timesheet",
            "type": "BooleanCriteria",
            "defaultValue" : null,
            "isRequired" : false,
            "parameters" : {                
            },            
            "applyTo" : [
                {"section" : "timesheets", "field" : "isBillable"}
            ]
        }
    ], 

    "sections" : [
        {
            "id" : "timesheets",
            "type" : "DataTable",            
            "properties": {
                "name" : "Timesheets",
                "description" : ""
            },
            "orderBy" : [
                {
                    "name" : "hours",
                    "order" : "desc"
                }    
            ],
            "groupBy" : [
                {
                    "name": "customer",                    
                    "order" : "asc"
                },
                {
                    "name": "project",                    
                    "order" : "asc"
                }
            ],
            "model" : [
                {"name": "referenceNumber", "type":"string", "label" : "Reference Number"},
                {"name": "timesheetDate", "type":"date", "label" : "Date"},                
                {"name": "employee", "type":"string", "label" : "Employee"},
                {"name": "customer", "type":"string", "label" : "Customer", "visible" : false},
                {"name": "project", "type":"string", "label" : "Project", "visible" : false},
                {"name": "activityCode", "type":"string", "label" : "Activity Code"},
                {"name": "hours", "type":"number", "label" : "Hours", "align" : "right", "format": "0.00", "width": "90px;", "formula" : "SUM"},
                {"name": "isBillable", "type":"boolean", "label" : "Is Billable", "visible" : true},
                {"name": "billableHours", "type":"number", "label" : "Billable Hours", "align" : "right", "format": "0.00", "width": "90px;", "formula" : "SUM"},
                {"name": "billingRate", "type":"number", "label" : "Billing Rate", "decimals" : 2, "format": "0.00$", "align" : "right", "width": "90px;", "formula" : "AVG"},
                {"name": "total", "type":"number", "label" : "Total", "decimals" : 2, "format": "0.00$", "align" : "right", "width": "90px;", "formula" : "SUM"}
            ],
            "data" : 
                [
                    {"referenceNumber":"000001","timesheetDate":"2022-10-19","employee":"Harrison Hardey","customer":"Apple inc.","project":"Web site design","activityCode":"10 - Analysis","hours":5.33,"isBillable" : true,"billableHours":5.33,"billingRate":106,"total":564.98},
                    {"referenceNumber":"000002","timesheetDate":"2022-05-25","employee":"Matilda Fielding","customer":"Space X","project":"Web site design","activityCode":"10 - Analysis","hours":1.69,"isBillable" : true,"billableHours":1.69,"billingRate":102,"total":172.38},
                    {"referenceNumber":"000003","timesheetDate":"2022-08-10","employee":"Jessica Pratten","customer":"Apple inc.","project":"Web programming","activityCode":"50 - Programming","hours":5.33,"isBillable" : true,"billableHours":5.33,"billingRate":151,"total":804.83},
                    {"referenceNumber":"000004","timesheetDate":"2022-05-13","employee":"Jessica Pratten","customer":"Facebook","project":"Website review","activityCode":"80 - Technical Support","hours":6.33,"isBillable" : true,"billableHours":6.33,"billingRate":153,"total":968.49},
                    {"referenceNumber":"000005","timesheetDate":"2022-10-25","employee":"Piper Bateman","customer":"Tesla","project":"Web programming","activityCode":"70 - Customer Support","hours":1.65,"isBillable" : true,"billableHours":1.65,"billingRate":112,"total":184.8},
                    {"referenceNumber":"000006","timesheetDate":"2022-12-09","employee":"Jessica Pratten","customer":"Facebook","project":"Web programming","activityCode":"10 - Analysis","hours":7.28,"isBillable" : true,"billableHours":7.28,"billingRate":134,"total":975.52},
                    {"referenceNumber":"000007","timesheetDate":"2022-11-23","employee":"Amelie Lockington","customer":"Google","project":"Website review","activityCode":"60 - Tests and QA","hours":2.3,"isBillable" : true,"billableHours":2.3,"billingRate":138,"total":317.4},
                    {"referenceNumber":"000008","timesheetDate":"2022-07-19","employee":"Amelie Lockington","customer":"Google","project":"QA","activityCode":"50 - Programming","hours":2.4,"billableHours":2.4,"isBillable" : true,"billingRate":152,"total":364.8},
                    {"referenceNumber":"000009","timesheetDate":"2022-02-11","employee":"Piper Bateman","customer":"Solar City","project":"QA","activityCode":"70 - Customer Support","hours":2.09,"billableHours":2.09,"isBillable" : true,"billingRate":153,"total":319.77},
                    {"referenceNumber":"000010","timesheetDate":"2022-04-11","employee":"Harrison Hardey","customer":"Google","project":"Marketing campaign","activityCode":"50 - Programming","hours":4.01,"isBillable" : true,"billableHours":4.01,"billingRate":112,"total":449.12},
                    {"referenceNumber":"000011","timesheetDate":"2022-07-29","employee":"Jessica Pratten","customer":"Facebook","project":"Plugin integration","activityCode":"60 - Tests and QA","hours":3.11,"isBillable" : true,"billableHours":3.11,"billingRate":175,"total":544.25},
                    {"referenceNumber":"000012","timesheetDate":"2022-03-17","employee":"Amelie Lockington","customer":"Google","project":"Marketing campaign","activityCode":"80 - Technical Support","hours":3.47,"isBillable" : true,"billableHours":3.47,"billingRate":179,"total":621.13},
                    {"referenceNumber":"000013","timesheetDate":"2022-02-19","employee":"Matilda Fielding","customer":"Tesla","project":"Plugin integration","activityCode":"50 - Programming","hours":1.47,"billableHours":1.47,"isBillable" : true,"billingRate":145,"total":213.15},
                    {"referenceNumber":"000014","timesheetDate":"2022-06-29","employee":"Matilda Fielding","customer":"Apple inc.","project":"Plugin integration","activityCode":"70 - Customer Support","hours":0.58,"isBillable" : true,"billableHours":0.58,"billingRate":157,"total":91.06},
                    {"referenceNumber":"000015","timesheetDate":"2022-08-14","employee":"Piper Bateman","customer":"Solar City","project":"QA","activityCode":"80 - Technical Support","hours":3.9,"isBillable" : true,"billableHours":3.9,"billingRate":187,"total":729.3},
                    {"referenceNumber":"000016","timesheetDate":"2022-08-10","employee":"Piper Bateman","customer":"Solar City","project":"Web site design","activityCode":"10 - Analysis","hours":2.78,"isBillable" : true,"billableHours":2.78,"billingRate":102,"total":283.56},
                    {"referenceNumber":"000017","timesheetDate":"2022-08-01","employee":"Piper Bateman","customer":"Space X","project":"QA","activityCode":"10 - Analysis","hours":1.96,"billableHours":1.96,"isBillable" : true,"billingRate":183,"total":358.68},
                    {"referenceNumber":"000018","timesheetDate":"2022-12-23","employee":"Piper Bateman","customer":"Google","project":"Plugin integration","activityCode":"10 - Analysis","hours":4.72,"isBillable" : true,"billableHours":4.72,"billingRate":171,"total":807.12},
                    {"referenceNumber":"000019","timesheetDate":"2022-07-27","employee":"Matilda Fielding","customer":"Tesla","project":"Plugin integration","activityCode":"10 - Analysis","hours":5.97,"isBillable" : true,"billableHours":5.97,"billingRate":139,"total":829.83},
                    {"referenceNumber":"000020","timesheetDate":"2022-08-21","employee":"Amelie Lockington","customer":"Facebook","project":"Web site design","activityCode":"50 - Programming","hours":3.52,"isBillable" : true,"billableHours":3.52,"billingRate":178,"total":626.56},
                    {"referenceNumber":"000021","timesheetDate":"2022-03-29","employee":"Piper Bateman","customer":"Google","project":"Marketing campaign","activityCode":"10 - Analysis","hours":1.06,"isBillable" : true,"billableHours":1.06,"billingRate":185,"total":196.1},
                    {"referenceNumber":"000022","timesheetDate":"2022-04-13","employee":"Matilda Fielding","customer":"Solar City","project":"Web site design","activityCode":"70 - Customer Support","hours":4.38,"isBillable" : true,"billableHours":4.38,"billingRate":174,"total":762.12},
                    {"referenceNumber":"000023","timesheetDate":"2022-03-31","employee":"Harrison Hardey","customer":"Facebook","project":"Website review","activityCode":"50 - Programming","hours":7.43,"isBillable" : true,"billableHours":7.43,"billingRate":133,"total":988.19},
                    {"referenceNumber":"000024","timesheetDate":"2022-12-10","employee":"Jessica Pratten","customer":"Google","project":"Marketing campaign","activityCode":"70 - Customer Support","hours":6.33,"isBillable" : true,"billableHours":6.33,"billingRate":110,"total":696.3},
                    {"referenceNumber":"000025","timesheetDate":"2022-03-02","employee":"Harrison Hardey","customer":"Google","project":"Marketing campaign","activityCode":"70 - Customer Support","hours":0.93,"isBillable" : true,"billableHours":0.93,"billingRate":157,"total":146.01},
                    {"referenceNumber":"000026","timesheetDate":"2022-07-09","employee":"Jessica Pratten","customer":"Apple inc.","project":"Web programming","activityCode":"50 - Programming","hours":1.42,"isBillable" : true,"billableHours":1.42,"billingRate":180,"total":255.6},
                    {"referenceNumber":"000027","timesheetDate":"2022-02-11","employee":"Piper Bateman","customer":"Apple inc.","project":"Plugin integration","activityCode":"80 - Technical Support","hours":3.64,"isBillable" : true,"billableHours":3.64,"billingRate":183,"total":666.12},
                    {"referenceNumber":"000028","timesheetDate":"2022-06-25","employee":"Matilda Fielding","customer":"Tesla","project":"Marketing campaign","activityCode":"80 - Technical Support","hours":0.57,"isBillable" : false,"billableHours":0.57,"billingRate":143,"total":81.51},
                    {"referenceNumber":"000029","timesheetDate":"2022-10-25","employee":"Matilda Fielding","customer":"Google","project":"Website review","activityCode":"80 - Technical Support","hours":5.37,"isBillable" : false,"billableHours":5.37,"billingRate":190,"total":1},
                    {"referenceNumber":"000030","timesheetDate":"2022-12-08","employee":"Matilda Fielding","customer":"Tesla","project":"Web programming","activityCode":"50 - Programming","hours":7.6,"isBillable" : true,"billableHours":7.6,"billingRate":114,"total":866.4},
                    {"referenceNumber":"000031","timesheetDate":"2022-11-09","employee":"Piper Bateman","customer":"Facebook","project":"Web programming","activityCode":"50 - Programming","hours":7.05,"isBillable" : true,"billableHours":7.05,"billingRate":150,"total":1057.50},
                    {"referenceNumber":"000032","timesheetDate":"2022-04-14","employee":"Jessica Pratten","customer":"Tesla","project":"Plugin integration","activityCode":"60 - Tests and QA","hours":6.33,"isBillable" : true,"billableHours":6.33,"billingRate":117,"total":740.61},
                    {"referenceNumber":"000033","timesheetDate":"2022-08-04","employee":"Amelie Lockington","customer":"Facebook","project":"Web site design","activityCode":"60 - Tests and QA","hours":2.79,"isBillable" : true,"billableHours":2.79,"billingRate":112,"total":312.48},
                    {"referenceNumber":"000034","timesheetDate":"2022-02-08","employee":"Amelie Lockington","customer":"Solar City","project":"QA","activityCode":"80 - Technical Support","hours":5.34,"isBillable" : true,"billableHours":5.34,"billingRate":173,"total":923.82},
                    {"referenceNumber":"000035","timesheetDate":"2022-01-04","employee":"Jessica Pratten","customer":"Facebook","project":"Marketing campaign","activityCode":"80 - Technical Support","hours":1.57,"isBillable" : true,"billableHours":1.57,"billingRate":175,"total":274.75},
                    {"referenceNumber":"000036","timesheetDate":"2022-03-21","employee":"Amelie Lockington","customer":"Google","project":"Marketing campaign","activityCode":"60 - Tests and QA","hours":4.54,"isBillable" : true,"billableHours":4.54,"billingRate":174,"total":789.96},
                    {"referenceNumber":"000037","timesheetDate":"2022-06-07","employee":"Piper Bateman","customer":"Apple inc.","project":"Web site design","activityCode":"80 - Technical Support","hours":0.79,"isBillable" : true,"billableHours":0.79,"billingRate":172,"total":135.88},
                    {"referenceNumber":"000038","timesheetDate":"2022-01-14","employee":"Amelie Lockington","customer":"Apple inc.","project":"Web programming","activityCode":"60 - Tests and QA","hours":3.89,"isBillable" : true,"billableHours":3.89,"billingRate":183,"total":711.87},
                    {"referenceNumber":"000039","timesheetDate":"2022-01-30","employee":"Piper Bateman","customer":"Space X","project":"Web site design","activityCode":"80 - Technical Support","hours":7.2,"isBillable" : true,"billableHours":7.2,"billingRate":101,"total":727.2},
                    {"referenceNumber":"000040","timesheetDate":"2022-03-14","employee":"Amelie Lockington","customer":"Google","project":"Website review","activityCode":"80 - Technical Support","hours":4.68,"isBillable" : true,"billableHours":4.68,"billingRate":104,"total":486.72},
                    {"referenceNumber":"000041","timesheetDate":"2022-12-10","employee":"Jessica Pratten","customer":"Space X","project":"Website review","activityCode":"60 - Tests and QA","hours":7.51,"isBillable" : true,"billableHours":7.51,"billingRate":164,"total":1},
                    {"referenceNumber":"000042","timesheetDate":"2022-06-27","employee":"Matilda Fielding","customer":"Apple inc.","project":"QA","activityCode":"50 - Programming","hours":3.82,"isBillable" : true,"billableHours":3.82,"billingRate":175,"total":668.5},
                    {"referenceNumber":"000043","timesheetDate":"2022-03-07","employee":"Amelie Lockington","customer":"Facebook","project":"Web programming","activityCode":"10 - Analysis","hours":1.06,"isBillable" : false,"billableHours":1.06,"billingRate":103,"total":109.18},
                    {"referenceNumber":"000044","timesheetDate":"2022-07-21","employee":"Matilda Fielding","customer":"Apple inc.","project":"Website review","activityCode":"10 - Analysis","hours":1.63,"isBillable" : true,"billableHours":1.63,"billingRate":200,"total":326},
                    {"referenceNumber":"000045","timesheetDate":"2022-04-05","employee":"Amelie Lockington","customer":"Google","project":"QA","activityCode":"70 - Customer Support","hours":6.32,"isBillable" : true,"billableHours":6.32,"billingRate":146,"total":922.72},
                    {"referenceNumber":"000046","timesheetDate":"2022-02-24","employee":"Amelie Lockington","customer":"Apple inc.","project":"Plugin integration","activityCode":"60 - Tests and QA","hours":6.06,"isBillable" : true,"billableHours":6.06,"billingRate":109,"total":660.54},
                    {"referenceNumber":"000047","timesheetDate":"2022-06-19","employee":"Piper Bateman","customer":"Solar City","project":"QA","activityCode":"80 - Technical Support","hours":7.22,"isBillable" : true,"billableHours":7.22,"billingRate":131,"total":945.82},
                    {"referenceNumber":"000048","timesheetDate":"2022-05-25","employee":"Amelie Lockington","customer":"Apple inc.","project":"Web programming","activityCode":"50 - Programming","hours":2.57,"isBillable" : true,"billableHours":1,"billingRate":1,"total":1},
                    {"referenceNumber":"000049","timesheetDate":"2022-09-09","employee":"Amelie Lockington","customer":"Google","project":"Marketing campaign","activityCode":"10 - Analysis","hours":5.71,"isBillable" : false,"billableHours":5.71,"billingRate":139,"total":793.69},
                    {"referenceNumber":"000050","timesheetDate":"2022-12-01","employee":"Jessica Pratten","customer":"Apple inc.","project":"Plugin integration","activityCode":"50 - Programming","hours":1.51,"isBillable" : true,"billableHours":1.51,"billingRate":125,"total":188.75}            
            ]
        }
    ]
}
```

Open the index.html file created in your web browser and the report should be displayed in the report viewer.