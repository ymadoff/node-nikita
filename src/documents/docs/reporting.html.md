
# Reporting

Mecano comes with powerfull reporting tools to monitor its activity. Some tools
are available to all the functions like associating a user callback to the `log`
property. Other ones are more specific. Examples of specific tools includes
receiving standart output and error when calling the `execute` function,
receiving a diff of any file being modified and generated a backup file after
modifications.

## Option `log`

The developer may provide a function associated with the `log` property. This
function will be called at different location of the code to report what's its
currently doing. This functionnality is globally available to all the functions.

```js
mecano.execute({
  cmd: 'whoami'
  log: function(message){
    console.log(message);
  }
}, function(err){
  console.log(err ? err.message : 'ok');
})
```

## Standart output and error

The `execute` command can pipe to "stdout" and "stderr" writable streams. The
properties associated with each stream are named just like this, `stdout` and
`stderr`. this functionnality is available to the `execute` function as well as
all the functions using it. 

```js
mecano.execute({
  cmd: 'whoami'
  stdout: fs.createWriteStream('/tmp/mecano.stdout')
  stderr: fs.createWriteStream('/tmp/mecano.stderr')
}, function(err){
  console.log(err ? err.message : 'ok');
})
```

In some circonstantes, commonly when the stream is too verbose, a function may
not provided those properties to `execute`. This is for example the case of the
`service` function when it list all the installed packages.

## Generated diff

The `write` function provide a detailed diff information through its `diff`
propety. Read the documentation relative to this function for additionnal
information. All the functions calling `write` will inherit this functionnality.

```js
mecano.write({
  target: '/tmp/file'
  diff: function(diff){
    console.log(diff);
  }
}, function(err){
  console.log(err ? err.message : 'ok');
})
```

## Backup

The `write` function can generate a copy of the original file before it modify
it. Read the documentation relative to this function for additionnal
information. All the functions calling `write` will inherit this functionnality.

```js
mecano.write({
  target: '/tmp/file'
  backup: true
}, function(err){
  console.log(err ? err.message : 'ok');
})
```

## Debug
 
The "debug" option is an alias to setting the options "log", "stdout" and
"stderr". For exemple, the following two calls are the same:

```javascript
mecano.call
  debug: true
  handler: function(){}
mecano.call
  log: console.log
  stdout: process.stdout
  stderr: process.stderr
  handler: function(){}
```

[ssh2]: https://github.com/mscdex/ssh2
