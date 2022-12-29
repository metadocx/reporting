/**
 * Copied from https://stackoverflow.com/questions/7395686/how-can-i-serialize-a-function-in-javascript/51123745#51123745
 */
Function.deserialise = function (key, data) {
    return (data instanceof Array && data[0] == 'window.Function') ?
        new (Function.bind.apply(Function, [Function].concat(data[1], [data[2]]))) :
        data
        ;
};
Function.prototype.toJSON = function () {
    var whitespace = /\s/;
    var pair = /\(\)|\[\]|\{\}/;

    var args = new Array();
    var string = this.toString();

    var fat = (new RegExp(
        '^\s*(' +
        ((this.name) ? this.name + '|' : '') +
        'function' +
        ')[^)]*\\('
    )).test(string);

    var state = 'start';
    var depth = new Array();
    var tmp;

    for (var index = 0; index < string.length; ++index) {
        var ch = string[index];

        switch (state) {
            case 'start':
                if (whitespace.test(ch) || (fat && ch != '('))
                    continue;

                if (ch == '(') {
                    state = 'arg';
                    tmp = index + 1;
                }
                else {
                    state = 'singleArg';
                    tmp = index;
                }
                break;

            case 'arg':
            case 'singleArg':
                var escaped = depth.length > 0 && depth[depth.length - 1] == '\\';
                if (escaped) {
                    depth.pop();
                    continue;
                }
                if (whitespace.test(ch))
                    continue;

                switch (ch) {
                    case '\\':
                        depth.push(ch);
                        break;

                    case ']':
                    case '}':
                    case ')':
                        if (depth.length > 0) {
                            if (pair.test(depth[depth.length - 1] + ch))
                                depth.pop();
                            continue;
                        }
                        if (state == 'singleArg')
                            throw '';
                        args.push(string.substring(tmp, index).trim());
                        state = (fat) ? 'body' : 'arrow';
                        break;

                    case ',':
                        if (depth.length > 0)
                            continue;
                        if (state == 'singleArg')
                            throw '';
                        args.push(string.substring(tmp, index).trim());
                        tmp = index + 1;
                        break;

                    case '>':
                        if (depth.length > 0)
                            continue;
                        if (string[index - 1] != '=')
                            continue;
                        if (state == 'arg')
                            throw '';
                        args.push(string.substring(tmp, index - 1).trim());
                        state = 'body';
                        break;

                    case '{':
                    case '[':
                    case '(':
                        if (
                            depth.length < 1 ||
                            !(depth[depth.length - 1] == '"' || depth[depth.length - 1] == '\'')
                        )
                            depth.push(ch);
                        break;

                    case '"':
                        if (depth.length < 1)
                            depth.push(ch);
                        else if (depth[depth.length - 1] == '"')
                            depth.pop();
                        break;
                    case '\'':
                        if (depth.length < 1)
                            depth.push(ch);
                        else if (depth[depth.length - 1] == '\'')
                            depth.pop();
                        break;
                }
                break;

            case 'arrow':
                if (whitespace.test(ch))
                    continue;
                if (ch != '=')
                    throw '';
                if (string[++index] != '>')
                    throw '';
                state = 'body';
                break;

            case 'body':
                if (whitespace.test(ch))
                    continue;
                string = string.substring(index);

                if (ch == '{')
                    string = string.replace(/^{\s*(.*)\s*}\s*$/, '$1');
                else
                    string = 'return ' + string.trim();

                index = string.length;
                break;

            default:
                throw '';
        }
    }

    return ['window.Function', args, string];
};