# Report Section - Groups
The groupBy section contains a list of groups that will group the report data in sections and sub sections.

- Type : Array of Objects
- Parent element : [Report Section](sections.md)

```JSON
 "groupBy" : [
    {
        "name": "customer",  // Name of column to group by              
        "order" : "asc"      // Group by order asc | desc
    },
    {
        "name": "project",                    
        "order" : "asc"
    }
],
```