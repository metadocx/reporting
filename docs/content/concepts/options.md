# Options
Options are accessible via the viewer object. Default options are loaded on application creation and can be modified using the Report Definition File, JavaScript or adding script tag `data-` attributes.

```js

Metadocx.viewer.options

```

## Using script tag data- attributes

```html
<!-- This will set the report definition file -->
<script src="/js/metadocx.js" data-report="data/report1.json"></script>
```

| Name | Description |
| ---- | ----------- |
| data-report | The report definition file to load |
| data-container | The ID of the element where to render the Report viewer |

## Using JavaScript
```js
Metadocx.viewer.options.toolbar.showExportButton = false;
```