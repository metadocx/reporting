/** 
 * ReportValidator
 * 
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ReportValidator {

    constructor(app) {
        this.app = app;
        this.reportDefinition = null;
        this.validationWarnings = [];
        this.validationErrors = [];
        this.hasWarnings = false;
        this.hasErrors = false;

        this.reportDefinitionAllowedKeys = ['id', 'properties', 'options', 'criterias', 'sections'];
        this.reportDefinitionRequiredKeys = ['id', 'properties', 'sections'];

        this.reportPropertiesAllowedKeys = ['name', 'description', 'author'];
        this.reportPropertiesRequiredKeys = ['name', 'description'];

        this.jsonXls = {
            id: {
                __type: 'string',
                __required: true
            },
            properties: {
                __type: 'object',
                __required: true,
                name: {
                    __type: 'string',
                    __required: true
                },
                description: {
                    __type: 'string',
                    __required: true
                },
                author: {
                    __type: 'string',
                    __required: false
                }
            },
            options: {
                __type: 'object',
                __required: true,
                locale: {
                    __type: 'string',
                    __required: false,
                    __defaultValue: 'en',
                    __allowedValues: this.app.modules.Locale.getLocales()
                },
                coverPage: {
                    __type: 'object',
                    __required: false,
                    enabled: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: false,
                    }
                },
                template: {
                    __type: 'string',
                    __required: false,
                    __defaultValue: 'Theme2',
                    __allowedValues: this.app.viewer.getThemes()
                },
                toolbar: {
                    __type: 'object',
                    __required: false,
                    showOptionsButton: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    showSettingsButton: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    showCriteriasButton: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    showPrintButton: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    showExportButton: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    showCloseButton: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    }
                },
                exportFormats: {
                    __type: 'object',
                    __required: false,
                    pdf: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    word: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    excel: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    }
                },

                page: {
                    __type: 'object',
                    __required: false,
                    orientation: {
                        __type: 'string',
                        __required: false,
                        __defaultValue: 'portrait',
                        __allowedValues: ['portrait', 'landscape'],
                    },
                    paperSize: {
                        __type: 'string',
                        __required: false,
                        __defaultValue: 'Letter',
                        __allowedValues: this.app.modules.Printing.getPaperSizes()
                    },
                    margins: {
                        __type: 'object',
                        __required: false,
                        top: {
                            __type: 'number',
                            __required: false,
                            __defaultValue: 0.5,
                            __minValue: 0,
                            __maxValue: 5,
                        },
                        bottom: {
                            __type: 'number',
                            __required: false,
                            __defaultValue: 0.5,
                            __minValue: 0,
                            __maxValue: 5,
                        },
                        left: {
                            __type: 'number',
                            __required: false,
                            __defaultValue: 0.5,
                            __minValue: 0,
                            __maxValue: 5,
                        },
                        right: {
                            __type: 'number',
                            __required: false,
                            __defaultValue: 0.5,
                            __minValue: 0,
                            __maxValue: 5,
                        }
                    }
                },
                settings: {
                    __type: 'object',
                    __required: false,
                    fields: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    fieldsReorder: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    fieldsSelection: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    fieldsFormula: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },

                    orderBy: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    orderByReorder: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    orderBySelection: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    orderByOrder: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },

                    groupBy: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    groupByReorder: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    groupBySelection: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    groupByOrder: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    }
                },
                formats: {
                    __type: 'object',
                    __required: false,
                    date: {
                        __type: 'object',
                        __required: false,
                        format: {
                            __type: 'string',
                            __required: false,
                            __defaultValue: 'YYYY-MM-DD',
                        }
                    },
                    boolean: {
                        __type: 'object',
                        __required: false,
                        format: {
                            __type: 'object',
                            __required: false,
                            trueValue: {
                                __type: 'string',
                                __required: false,
                                __defaultValue: 'Yes',
                            },
                            falseValue: {
                                __type: 'string',
                                __required: false,
                                __defaultValue: 'No',
                            },
                            ALL: {
                                __type: 'string',
                                __required: false,
                                __defaultValue: 'All',
                            }
                        }
                    },
                    number: {
                        __type: 'object',
                        __required: false,
                        format: {
                            __type: 'string',
                            __required: false,
                            __defaultValue: '0.00',
                        }
                    },
                },
            },
            criterias: {
                __type: 'array',
                __required: false,
                __model: {

                    id: {
                        __type: 'string',
                        __required: true
                    },
                    name: {
                        __type: 'string',
                        __required: true
                    },
                    description: {
                        __type: 'string',
                        __required: true
                    },
                    type: {
                        __type: 'string',
                        __required: true,
                        __allowedValues: this.app.viewer.getCriteriaTypes()
                    },
                    parent: {
                        __type: 'string',
                        __required: false,
                    },
                    defaultValue: {
                        __type: 'mixed',
                        __required: false
                    },
                    isRequired: {
                        __type: 'boolean',
                        __required: true,
                        __defaultValue: false
                    },
                    options: {
                        __type: 'mixed',
                        __required: false,
                        source: {
                            __type: 'string',
                            __required: false,
                        },
                        field: {
                            __type: 'string',
                            __required: false,
                        },
                        url: {
                            __type: 'string',
                            __required: false,
                        }
                    },
                    parameters: {
                        __type: 'object',
                        __required: false,
                        locale: {
                            __type: 'object',
                            __required: false,
                            format: {
                                __type: 'string',
                                __required: false
                            },
                            separator: {
                                __type: 'string',
                                __required: false
                            }
                        },
                        alwaysShowCalendars: {
                            __type: 'boolean',
                            __required: false,
                            __defaultValue: true
                        },
                        multiple: {
                            __type: 'boolean',
                            __required: false,
                        },
                        allowClear: {
                            __type: 'boolean',
                            __required: false,
                            __defaultValue: true
                        },
                        placeholder: {
                            __type: 'string',
                            __required: false,
                        },
                        closeOnSelect: {
                            __type: 'boolean',
                            __required: false,
                        }
                    },
                    applyTo:
                    {
                        __type: 'array',
                        __required: true,
                        __model: {
                            section: {
                                __type: 'string',
                                __required: true
                            },
                            field: {
                                __type: 'string',
                                __required: true
                            }
                        }
                    }


                }
            },
            sections: {
                __type: 'array',
                __required: true,
            }
        };

    }

    /**
     * Validate report definition file
     * @param {*} reportDefinition 
     * @returns 
     */
    validate(reportDefinition) {
        this.reportDefinition = reportDefinition;

        this.validateJsonFormat(this.jsonXls);
        this.checkForAdditionalKeys(this.reportDefinition);

        return this.hasErrors;

    }

    /**
     * Validates json structure and required fields
     * @param {*} jsonXls 
     * @param {*} path 
     */
    validateJsonFormat(jsonXls, path) {

        if (path == undefined) {
            path = '';
        }

        for (var x in jsonXls) {
            if (x.startsWith('__')) {
                // Meta property
                continue;
            }
            //console.log(x);

            /**
             * Is required
             */
            if (jsonXls[x].__required) {
                if (!this.keyExists(this.buildPath(path, x))) {
                    this.logError('Required key is missing ' + this.buildPath(path, x));
                }
            }
            /**
             * Check key type
             */
            if (jsonXls[x].__type) {
                if (this.keyExists(this.buildPath(path, x))) {
                    if (jsonXls[x].__type != 'mixed') {
                        if (this.getType(this.getValue(this.buildPath(path, x))) !== jsonXls[x].__type) {
                            this.logError('Key type is invalid ' + this.buildPath(path, x) + ' expecting ' + jsonXls[x].__type + ' got ' + this.getType(this.getValue(this.buildPath(path, x))));
                        }
                    }
                }
            }

            if (jsonXls[x].__minValue != undefined) {
                if (this.keyExists(this.buildPath(path, x))) {
                    if (parseFloat(this.getValue(this.buildPath(path, x))) < parseFloat(jsonXls[x].__minValue)) {
                        this.logError('Key value is invalid ' + this.buildPath(path, x) + ' minimum value is  ' + parseFloat(jsonXls[x].__minValue) + ' got ' + parseFloat(this.getValue(this.buildPath(path, x))));
                    }
                }
            }

            if (jsonXls[x].__maxValue != undefined) {
                if (this.keyExists(this.buildPath(path, x))) {
                    if (parseFloat(this.getValue(this.buildPath(path, x))) > parseFloat(jsonXls[x].__maxValue)) {
                        this.logError('Key value is invalid ' + this.buildPath(path, x) + ' maximum value is  ' + parseFloat(jsonXls[x].__maxValue) + ' got ' + parseFloat(this.getValue(this.buildPath(path, x))));
                    }
                }
            }

            /**
             * Check allowed values
             */
            if (jsonXls[x].__allowedValues) {
                // Compare value with allowed values
                if (this.keyExists(this.buildPath(path, x))) {
                    if (this.getValueIndex(this.getValue(this.buildPath(path, x)), jsonXls[x].__allowedValues) === -1) {

                        if (jsonXls[x].__defaultValue != undefined) {
                            // Try to fix with default value                            
                            this.logWarning('Invalid value for key ' + this.buildPath(path, x) + ' ' + this.getValue(this.buildPath(path, x)) + ', using default value ' + jsonXls[x].__defaultValue);
                            this.setValue(this.buildPath(path, x), jsonXls[x].__defaultValue);
                        } else {
                            this.logError('Invalid value for key ' + this.buildPath(path, x) + ' ' + this.getValue(this.buildPath(path, x)));
                        }

                    }
                }
            }

            if (jsonXls[x].__type === 'array') {
                if (jsonXls[x].__model) {
                    // Check model for each item of array
                    var aItems = this.getValue(this.buildPath(path, x));
                    for (var i in aItems) {
                        this.validateJsonFormat(jsonXls[x].__model, this.buildPath(this.buildPath(path, x), i));
                    }
                }
            }


            if (this.getType(jsonXls[x]) === 'object') {
                this.validateJsonFormat(jsonXls[x], this.buildPath(path, x));
            }
        }

    }

    /**
     * Returns value index case insensitve
     * @param {*} v 
     * @param {*} a 
     * @returns 
     */
    getValueIndex(v, a) {
        return a.findIndex(item => v.toLowerCase() === item.toLowerCase());
    }

    /**
     * Checks report definition file and lists undocumented properties
     * @param {*} section 
     * @param {*} path 
     * @param {*} definition 
     * @param {*} parentPath 
     */
    checkForAdditionalKeys(section, path, definition, parentPath) {

        if (path == undefined) {
            path = '';
        }

        if (parentPath == undefined) {
            parentPath = '';
        }

        if (definition == undefined || definition == null) {
            definition = this.jsonXls;
        }

        //console.log('p=' + path + ', pp=' + parentPath);

        for (var x in section) {

            if (!this.keyExists(this.buildPath(path, x), definition)) {
                this.logWarning('Found Key ' + this.buildPath(parentPath, this.buildPath(path, x)) + ' that is not defined in report definition specification');
            }

            if (this.getType(section[x]) === 'array') {

                if (this.getValue(this.buildPath(path, x), definition) !== null && this.getValue(this.buildPath(path, x), definition).__model !== undefined) {
                    // Check model for each item of array
                    var aItems = this.getValue(this.buildPath(path, x));
                    var model = this.getValue(this.buildPath(path, x), definition).__model;
                    for (var i in aItems) {
                        this.checkForAdditionalKeys(aItems[i], '', model, this.buildPath(parentPath, this.buildPath(this.buildPath(path, x), i)));
                    }
                }
            }


            if (this.getType(section[x]) === 'object') {
                this.checkForAdditionalKeys(section[x], this.buildPath(path, x), definition, parentPath);
            }
        }
    }

    /**
     * Return type of object
     * @param {*} v 
     * @returns 
     */
    getType(v) {
        if (Array.isArray(v)) {
            return 'array';
        }
        return typeof v;
    }

    /**
     * Build dot path for array access
     * @param {*} path 
     * @param {*} key 
     * @returns 
     */
    buildPath(path, key) {
        if (path != '') {
            return path + '.' + key;
        }
        return key;
    }

    /**
     * Gets value using dot notation
     * @param {*} key 
     * @returns 
     */
    getValue(key, object) {

        if (object === undefined) {
            object = this.reportDefinition;
        }

        var root = object;
        var path = key.split('.');
        for (var x in path) {
            if (root[path[x]] !== undefined) {
                root = root[path[x]];
            } else {
                return null;
            }
        }
        return root;
    }

    /**
     * Sets value using dot notation
     * @param {*} key 
     * @param {*} value 
     */
    setValue(key, value, object) {

        if (object === undefined) {
            object = this.reportDefinition;
        }

        var way = key.split('.');
        var last = way.pop();

        way.reduce(function (o, k, i, kk) {
            return o[k] = o[k] || (isFinite(i + 1 in kk ? kk[i + 1] : last) ? [] : {});
        }, object)[last] = value;

    }



    /**
     * Checks if a key exists in object
     * @param {*} key 
     * @param {*} object 
     * @returns 
     */
    keyExists(key, object) {
        if (object === undefined) {
            object = this.reportDefinition;
        }

        var root = object;
        var path = key.split('.');
        for (var x in path) {
            if (root[path[x]] !== undefined) {
                root = root[path[x]];
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if value is empty
     * @param {*} value 
     * @returns 
     */
    isEmpty(value) {
        if (value === undefined) {
            return true;
        }
        if (value === null) {
            return true;
        }
        if (value == '') {
            return true;
        }

        return false;
    }

    /**
     * Checks f value is in options
     * @param {*} value 
     * @param {*} options 
     * @returns 
     */
    mustBeOneOf(value, options) {
        if (options.indexOf(value) === -1) {
            return false;
        }
        return true;
    }

    /**
     * Log warnings
     * @param {*} message 
     */
    logWarning(message) {
        this.hasWarning = true;
        console.warn(message);
        this.validationWarnings.push({
            message: message
        });
    }

    /**
     * Log errors
     * @param {*} message 
     */
    logError(message) {
        this.hasError = true;
        console.error(message);
        this.validationErrors.push({
            message: message
        });
    }

}