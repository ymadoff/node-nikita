
# Method-call Interception (Aspect)

Interception is a non-invasive technique to add new behaviors and to combine and
modify existing behaviors "from the outside". It is an important functionnality
to write plugable extension to your code.

Currently we only implemented "before" behavior. Additionnal behaviors such as
"after" and "around" will be implemented later.

A behavior is defined by an event and a handler function to execute. To register
a new behavior, call your mecano instance with the behavior name. It takes two
arguments, the event and the handler function.

The event trigger the execution of the handler function. There are multiple way
to express an event:

*   a string: match any type of Mecano actions (eg: `write`, `service_start`, ...)   
*   an object: all properties must match the options of a Mecano action   
*   a function: take the option of an action and match if it returns `true`   

The handler function share the
same signature as any Mecano action. Thus it receives the same options as its
target action handler and can be run synchronously or asynchronously.

