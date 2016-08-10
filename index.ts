/**
 * Adds a runtime polyfill for Object.setPrototypeOf and
 * ensures that this is done before the core.js polyfills
 * for Object.setPrototypeOf and Object.getPrototypeOf are initialized.
 */

export default function({types: t}) {
    var addImport = false;

    return {
        visitor: {
            /**
             * Whenever classes are used we have to import the
             * polyfill because Babel will use Object.getPrototypeOf
             * from core.js and our version has to run first.
             */
            Class(path, state) {
                addImport = true;
            },

            /**
             * Apart from classes we need to import the polyfill
             * whenever Object.getPrototypeOf or Object.setPrototypeOf
             * is called directly. Again to run first.
             */
            CallExpression(path, state) {
                var callee = path.node.callee,
                    property = callee.property;
                
                t.isMemberExpression(callee) &&
                !callee.computed &&
                callee.object.name === 'Object' &&
                /(s|g)etPrototypeOf/.test(property.name) &&
                (addImport = true);
            },

            /**
             * Add the import to the file if necessary.
             */
            Program: {
                exit(path, state) {
                    addImport && state.addImport('babel-plugin-transform-es2015-classes-ielt10/set-prototype-of', '');
                }
            }
        }
    };
}