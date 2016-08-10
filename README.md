# babel-plugin-transform-es2015-classes-ielt10

This is a plugin for the Babel transpiler that polyfills
**Object.setPrototypeOf** and **Object.getPrototypeOf** in IE9
and IE10. Otherwise static member inheritance of classes
and super calls will break.

## Caveats

While this plugin is spec comliant than loose mode the
following will not work as expected in regards to
Object.setPrototypeOf:

*   Properties that are added to the new prototype after
    **Object.setPrototypeOf** was called will not be reflected.

*   Any use of the **delete** keyword on any inherited property
    will also remove the inheritance for that property. So if
    you overwrite and inherited property and delete it again
    there will be no fallback to the prototype.