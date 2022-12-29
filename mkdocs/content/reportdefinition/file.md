# Report Definition File

The report viewer will load the report defined in the report definition file. This file is a JSON file that will hold all information required to render the report on screen. 

We have decided to use a JSON file format since this is not attached to any specific programming language. You can generate the JSON file using any desired programming language or event a simple text editor and use metadocx reporting to display your reports.

You can define the report definition file using a `data-report` attribute of the metadocx.js script tag as follow

```html
<script src="/js/metadocx.js" data-report="data/report1.json"></script>         
```

Or you can manually load the report using the following JavaScript command 

```js

Metadocx.viewer.load('data/report1.json');

```
Loading the report definition file will automaticly render the report in the viewer.

Once the report is loaded, you can access the report definition object using the following JavaScript code

```js

Metadocx.viewer.report.getReportDefinition();

```
