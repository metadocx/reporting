# Modules

Modules are javascript classes that provide functionalities to Metadocx, they are loaded automaticly when the MetadocxApplication is initialized (generaly on web page load).

You can access all modules using the Metadocx application variable via the modules property.

```JS
Metadocx.modules
```

## Browser

The browser modules offers functions to determine the current browser we are using (chrome, ie, etc...).

## Console

The console module overrides the default console command used to log information in the developper console.

## DB

The DB module offers functions to access local storage for saving report configurations.

## DataType

The DataType module offers functions to manage data type conversion, for example converting a variable to a boolean value.

## Excel

The Excel module offers function to convert the report to a Microsoft Excel sheet. An external converter is required to convert reports to other formats.

## Format

The Format module offers function to format data in reports, we currently use numeral.js to convert data.

## Google

The Google module offers function to access google drive Sheets and convert the Google Sheet into a Report Definition File. (Under development)

## Import

The import module checks if all required dependencies are loaded in the web page and if not will inject the script or link tags.

## Locale

The Locale module allows the application to be translated in a specific language or locale.

## PDF

The PDF module offers function to convert the report to a PDF File. An external converter is required to convert reports to other formats.

## Printing

The Printing module offers function to manage document formating for printing, for example, list of paper sizes, margin calculations, etc.



