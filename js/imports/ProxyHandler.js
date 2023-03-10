/**
 * Copied from https://stackoverflow.com/a/50723478/2277399
 */
const ProxyHandler = {
    get(target, key) {
        if (key == 'isProxy')
            return true;

        const prop = target[key];

        // return if property not found
        if (typeof prop == 'undefined')
            return;

        // set value as proxy if object
        if (!prop.isProxy && typeof prop === 'object')
            target[key] = new Proxy(prop, ProxyHandler);

        return target[key];
    },
    set(target, key, value) {

        target[key] = value;
        Metadocx.reporting.viewer.applyReportViewerOptions();
        return true;
    }
};