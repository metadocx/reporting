# Report Section - Model

The model section contains the information on the data of the report section, this will include the label of the data, it's data type and how we wish to format it on the report.

- Type : Array of Objects
- Parent element : [Report Section](sections.md)

```JSON
 "model" : [
    {"name": "referenceNumber", "type":"string", "label" : "Reference Number", "automaticCriteria": false},
    {"name": "timesheetDate", "type":"date", "label" : "Date"},                
    {"name": "employee", "type":"string", "label" : "Employee"},
    {"name": "customer", "type":"string", "label" : "Customer", "visible" : false},
    {"name": "project", "type":"string", "label" : "Project", "visible" : false},
    {"name": "activityCode", "type":"string", "label" : "Activity Code"},
    {"name": "hours", "type":"number", "label" : "Hours", "align" : "right", "format": "0.00", "width": "90", "formula" : "SUM"},
    {"name": "isBillable", "type":"boolean", "label" : "Is Billable", "visible" : true},
    {"name": "billableHours", "type":"number", "label" : "Billable Hours", "align" : "right", "format": "0.00", "width": "90", "formula" : "SUM"},
    {"name": "billingRate", "type":"number", "label" : "Billing Rate", "decimals" : 2, "format": "0.00$", "align" : "right", "width": "90", "formula" : "AVG"},
    {"name": "total", "type":"number", "label" : "Total", "decimals" : 2, "format": "0.00$", "align" : "right", "width": "90", "formula" : "SUM"}
],
```

## Model properties

| Property            | Description                          |
| ------------------- | ------------------------------------ |
| name             | `string` Name of the column in the data table |
| type         | `string` Data type of the column, this can be string, number, boolean or date |
| label  | `string` Label to display in table header for the column |
| visible  | `boolean` If the column is visible of not in the report, `true` be default |
| align  | `string` Text alignment for column, this can be left, right or center |
| format  | `string` Format to apply to number columns, see numerals.js for all possible formats |
| width  | `string` Width of column in pixels |
| formula  | `string` Formula to apply to column, this can be SUM, AVG, COUNT, MIN or MAX |
| decimals  | `number` Number of decimals for numeric columns |
| automaticCriteria  | `boolean` Indicates if we must create criteria automaticly, `true` by default |
| criteriaType | `string` Type of criteria to use, by default the data type will determine the type of criteria to use |