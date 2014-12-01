--- yaml
layout: 'default'
title: 'Usages'
---

# Usage

## Arguments

All the functions inside Mecano share the same API. The first argument is an 
option object or an array of option objects. The second argument is a user
callback that will be called once it complete. The signature is:

```js
mecano_function(options, [goptions], callback);
```

## Callback

The first argument of the callback is an error if the function failed. The
second argument is an integer indicating if the run lead to any modification.

## Example passing an object to write one file

```js
mecano.write({
  destination: '/etc/hosts',
  content: "127.0.0.1 localhost"
}], function(err, written){
  if(err){
    console.log(err.message);
  }else if(written){
    console.log('File modified');
  }else{
    console.log('No modification');
  }
});
```

## Example passing an array to write two files

```js
mecano.write([{
  destination: '/etc/hosts',
  content: "127.0.0.1 localhost"
},{
  destination: '/etc/resolv.conf',
  content: "nameserver 192.168.1.1"
}], function(err, written){
  if(err){
    console.log(err.message);
  }else if(written){
    console.log('File(s) modified');
  }else{
    console.log('No modification');
  }
});
```
