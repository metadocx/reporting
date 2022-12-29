# Criterias
The report criteria section contains the list of criterias available for the user. Criterias are used to filter report data. Since report criterias could be used by multiple report sections, the criterias section is located in the root of the report definition file.

Type : Array of objects
Parent : Report definition file

```JSON
{
    "criterias" : [
        {
            "id": "UniqueNameOfCriteria",
            "name" : "Name of criterias used for display",
            "description" : "Description of criteria, explain what the criteria will do",
            "type": "Type of Criteria",
            "defaultValue" : null,
            "isRequired" : false,
            "parameters" : {                    
            },
            "applyTo" : [
                {"section" : "nameOfTheSection", "field" : "nameOfFieldThisCriteriaIsAppliedTo"}
            ]
        },
    }
}
```