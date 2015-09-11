
## Options

Some options are globally available to every modules. Such options may be
provided per function call or setup globally when constructing the mecano
instance.

*   `log` (function)   
    A function (eg `console.log`) to receive a message string as first argument.   
*   `relax` (boolean)   
    Avoid stop the process execution and jumping to the next "then" or "error"
    endpoint. In case of error, the error instance is available inside the
    action callback.   
*   `ssh` (config object | ssh2 instance)   
    A configuration object or an instance of the [ssh2 package][ssh2].
*   `shy` (boolean)   
    Avoid modified the process status.   

[ssh2]: https://github.com/mscdex/ssh2
