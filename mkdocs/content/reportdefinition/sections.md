# Sections
A report can include multiple report sections, for example we could have a list of timesheets in one section and a graph of timesheets per department in another section.

- Type : Array of Report Sections
- Parent element : Report definition file

```JSON
{
    "sections" : [
        {
            "id" : "timesheets",
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
                    "hideColumn" : true,
                    "order" : "asc"
                },
                {
                    "name": "project",
                    "hideColumn" : true,
                    "order" : "asc"
                }
            ],
            "model" : [
                {"name": "referenceNumber", "type":"string", "label" : "Reference Number"},
                {"name": "timesheetDate", "type":"date", "label" : "Date"},                
                {"name": "employee", "type":"string", "label" : "Employee"},
                {"name": "customer", "type":"string", "label" : "Customer"},
                {"name": "project", "type":"string", "label" : "Project"},
                {"name": "activityCode", "type":"string", "label" : "Activity Code"},
                {"name": "hours", "type":"number", "label" : "Hours", "align" : "right", "format": "0.00", "width": "90px;"},
                {"name": "billableHours", "type":"number", "label" : "Billable Hours", "align" : "right", "format": "0.00", "width": "90px;"},
                {"name": "billingRate", "type":"number", "label" : "Billing Rate", "decimals" : 2, "format": "0.00$", "align" : "right", "width": "90px;"},
                {"name": "total", "type":"number", "label" : "Total", "decimals" : 2, "format": "0.00$", "align" : "right", "width": "90px;"}
            ],
            "data" : 
                [
                    {"referenceNumber":"000001","timesheetDate":"2022-10-19","employee":"Harrison Hardey","customer":"Apple inc.","project":"Web site design","activityCode":"10 - Analysis","hours":5.33,"billableHours":5.33,"billingRate":106,"total":564.98},
                    {"referenceNumber":"000002","timesheetDate":"2022-05-25","employee":"Matilda Fielding","customer":"Space X","project":"Web site design","activityCode":"10 - Analysis","hours":1.69,"billableHours":1.69,"billingRate":102,"total":172.38},
            ]
        }
    ]
}
```