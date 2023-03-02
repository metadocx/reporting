# Report Section - Data

The data section contains information on the data the report will display, this can be the actual data as an array of javascript objects or a url to a web page that will return the data under the same format.

- Type : Array of Objects OR Object
- Parent element : [Report Section](sections.md)

```JSON
"data" : 
[
    {"referenceNumber":"000001","timesheetDate":"2022-10-19","employee":"Harrison Hardey","customer":"Apple inc.","project":"Web site design","activityCode":"10 - Analysis","hours":5.33,"isBillable" : true,"billableHours":5.33,"billingRate":106,"total":564.98},
    {"referenceNumber":"000002","timesheetDate":"2022-05-25","employee":"Matilda Fielding","customer":"Space X","project":"Web site design","activityCode":"10 - Analysis","hours":1.69,"isBillable" : true,"billableHours":1.69,"billingRate":102,"total":172.38},
    {"referenceNumber":"000003","timesheetDate":"2022-08-10","employee":"Jessica Pratten","customer":"Apple inc.","project":"Web programming","activityCode":"50 - Programming","hours":5.33,"isBillable" : true,"billableHours":5.33,"billingRate":151,"total":804.83},
    ...
]
```