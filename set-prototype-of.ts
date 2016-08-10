/**
 * This module just installs a polyfill for Object.setPrototypeOf
 * if it is not available natively. It also wraps Object.getPrototypeOf
 * to work in conjunction with it. If this is not done Babel
 * transpiled code will not work in IE<10.
 */

/***/

'setPrototypeOf' in Object || '__proto__' in {} || install();


//////////


/**
 * Installs the polyfill.
 */
function install() {
    var getPrototypeOf = Object['getPrototypeOf'];
    
    Object.defineProperty(Object, 'getPrototypeOf', {
        enumerable: false,
        value(obj) {
            return '__proto__' in obj ? obj.__proto__ : getPrototypeOf(obj);
        }
    });

    Object.defineProperty(Object, 'setPrototypeOf', {
        enumerable: false,
        value: setPrototypeOf
    });
    
    
    //////////
    
    
    /**
     * Sets the prototype of an object.
     */
    function setPrototypeOf(obj, proto) {
        if (proto === Function) {
            return obj;
        }

        var keys = Object.getOwnPropertyNames(proto),
            key = keys[0],
            i = 0,
            descriptor;
        
        while (key) {
            if (!Object.getOwnPropertyDescriptor(obj, key)) {
                descriptor = Object.getOwnPropertyDescriptor(proto, key);
                
                if (typeof descriptor.get === 'function') {
                    bindKey(obj, key, descriptor);
                } else if (typeof proto[key] === 'function') {
                    obj[key] = bindMethod(proto[key]);
                } else {
                    bindKey(obj, key, null);
                }
            }
            
            key = keys[++i];
        }
        
        proto.hasOwnProperty('__proto__') && setPrototypeOf(obj, proto.__proto__);

        Object.defineProperty(obj, '__proto__', {enumerable: false, configurable: true, value: proto});

        return obj;
    }
    
    /**
     * Creates a wrapper method that invokes the super method.
     */
    function bindMethod(method) {
        return () => {           
            return method.apply(this, arguments);
        }
    }
    
    /**
     * Creates a getter and setter for proxying to the super property.
     * @todo: Test this
     */
    function bindKey(obj, key, descriptor) {
        descriptor = descriptor || {
            get: function() {
                return obj.__proto__[key];
            },
            set: function(value) {
                Object.defineProperty(obj, key, {
                    configurable: true,
                    writable: true,
                    value: value
                });
            }
        };
        
        Object.defineProperty(obj, key, {
            configurable: true,
            get: descriptor.get.bind(obj),
            set: descriptor.set ? descriptor.set.bind(obj) : void 0
        });
    }
}