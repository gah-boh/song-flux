# SOng Flux
A library to implement the flux architecture with AngularJS.

## Dispatcher
The SOng-Flux dispatcher mirror's facebooks pretty closely. The main differences are the option to have one dispatcher per module and the mechanism for registering with the dispatcher. With the ability to create a dispatcher per module you have the option of either strictly following the more traditional "one dispatcher per application" convention or having multiple dispatchers. To register with the dispatcher SOng-Flux eschews "constants" for an action's constructor.

### getDispatcher
To get the dispatcher your module should depend on the `songFlux` module. Then inject songFactory and call:

    songFactory.getDispatcher(<moduleName>)

The dispatcher will be a singleton per module and will throw if the module is not present in the application.

### register
To register an action with the dispatcher use the `register` function. The `register` function takes two parameters an action constructor function used to identify the action and the callback. The return is an id for deregistering and/or using the `waitFor` function.

### unregister
The `unregister` function has the exact same API as facebook's dispatcher were the only parameter is the id that was returned from the `register` function.

### dispatch
When dispatching you must pass an instance of an action as the parameter. The action's constructor must have been used to register with the dispatcher, this means that as long as an instance object's `.constructor` property matches a registered action it will dispatch correctly.

### waitsFor
`waitsFor` is the same as facebook's dispatcher, used when you need a registered callback to be completed before the callback being registered can be executed. When register a callback, inside the callback call the `waitsFor` function with the dependent `id` to make sure it has been executed before proceeding.

## Requirements
SOng-Flux makes use of basic WeakMap functionality, this means that browser support for IE is 11+.

## Extras

SOng-Flux comes with some extra utilities to aid the implementation of the flux architecture. These are completely optional, and will add functionality to the songFactory when the script is loaded.

### o-action
O-actions supply a convention for actions. It adds a createAction function to the songFactory, which takes an action constructor and a module name for what dispatcher to use. The createAction function will return a factory function for the action that takes the same parameters as the action. The return of the factory function itself will be an instance of the action with a `dispatcher` property to allow changing the dispatcher for that action. It will also have a dispatch method that will dispatch itself.

