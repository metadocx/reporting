# Application
The Metadocx application is the main object of the library it is created when the metadocx.js file is included in the webpage and allows you to access the components of the library.

You can access the application using the global Metadocx variable in JavaScript

```js
Metadocx
```

## Properties

| Name | Description |
| -------- | -------- |
| version | The version of the application |
| onInitializeCallbacks | Array of callback functions that will be called once all modules are loaded |
| scriptTag | Reference to the script tag used to load metadocx.js in the web page, we will use this to get options passed as `data-` attributes |
| viewer | ReportViewer instance |


## Methods

| Name | Description |
| -------- | -------- |
| initialize | Called when script is loaded by Bootstrap.js |
| loadScriptTagOptions | Checks script tag used to load metadocx.js if anu `data-` attributes are passed to app |
| registerModule | Loads a module |



## Events

!!! info "Information"

    No events