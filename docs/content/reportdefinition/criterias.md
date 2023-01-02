# Criterias
The report criteria section contains the list of criterias available for the user. Criterias are used to filter report data. Since report criterias could be used by multiple report sections, the criterias section is located in the root of the report definition file.

- Type : Array of objects
- Parent : Report definition file

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

Criterias are global to the report and can be applied to multiple report sections. This is defined in the `applyTo` section of the criteria definition.

## Types of criterias

### Single and multi select

- Type : `SelectCriteria`

This type of criteria presents a dropdown list that allows you to select one or many values. We use select2 to display the select list. You can pass all additional settings for select2 in the `parameters` section of the criteria definition. Configuration options for select2 are available at https://select2.org/configuration/options-api.

To enable multiple selections add the `"multiple" : false,` parameter in your criteria. This will allow you to select multiple items from the list.

#### Loading data in the select list

There are multiples ways to load options in the select component. 

- Manual list, you can insert the options manually in the report definition file
```JSON
"options" : [
    {"id": 1, "text" : "Red"},
    {"id": 2, "text" : "Blue"},
    {"id": 3, "text" : "Green"},
    {"id": 4, "text" : "Yellow"},
    {"id": 5, "text" : "White"},
    {"id": 6, "text" : "Black"},
    {"id": 7, "text" : "Orange"}
],
```

- Ajax, you can load the options using an ajax request to an external website or service

```JSON
"options" : {
    "source" : "ajax",
    "url": "/activitycodes"
},
```

- From a report section, you can load the options using the data from a report section, you must specify the field you want to use to load the options

```JSON
"options" : {
    "source" : "data",
    "field" : "employee"
},
```

### Date 

- Type : `DatePeriodCriteria`

### Numeric

- Type : `NumericCriteria`

### Boolean

- Type : `BooleanCriteria`

### Checkboxes

- Type : `CheckboxCriteria`