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
| modules | List of all loaded modules |


## Methods

| Name | Description |
| -------- | -------- |
| initialize | Called when script is loaded by Bootstrap.js, the Bootstrap.js file is the entry point of the library. |
| loadScriptTagOptions | Checks html script tag used to load metadocx.js file. All `data-` attributes are copied to the `Metadocx.viewer.options` options array. This function is called by initialized on page load. |
| registerModule | Loads and initialize a module |



## Events

!!! info "Information"

    No events


# Metadocx namesapces

In order to access all modules, classes and objects created by the Metadocx library we created a global variable called `__Metadocx` accessible from the `window` object. This variable is created in the [`MetadocxApplication.js`](https://github.com/metadocx/reporting/blob/main/js/core/MetadocxApplication.js) file

```JS
    window.__Metadocx = {
        Locales: {},
        Themes: {}
    }
```