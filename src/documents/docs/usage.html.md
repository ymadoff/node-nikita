--- yaml
layout: 'default'
title: 'Usages'
---

# Usage

Mecano functions can be used indepently or chained using a promise API. Here's
how to use promise:

```js
mecano(options)
.group({
  name: 'mygroup'
})
.run(function(){
  // sync user handler function
})
.user({
 name: 'myself' 
})
.run(function(next){
  // async user handler function
  setTimeout(function(){
    next null, true
  })
})
.then(function(err, changed){
  console.log(err, changed);
});
```

## Arguments

All the functions inside Mecano share the same signature. The first argument is
an option object or an array of option objects. The second argument is a user
callback that will be called once it complete. The signature is:

```js
mecano_function(options, callback);
```

## Callback

The first argument of the callback is an error if the function failed. The
second argument is an integer indicating if the run lead to any modification.

## Example passing an object to write one file

```js
mecano.write({
  destination: '/etc/hosts',
  content: "127.0.0.1 localhost"
}, function(err, written){
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
