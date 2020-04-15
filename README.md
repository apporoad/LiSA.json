# LiSA.json
sad for weak json

## just try here
[JS.do](https://js.do/apporoad/lisa-json)

## how to use
```bash
npm i --save lisa.json

```

```js
var LiSAJson = require('lisa.json')

var json = {
    hello:"world",
    good : 'good day',
    son:{
        name: 'bb',
        grandFather: 'hello' 
    },
    "aaa.bbb" :{
        hello :"world"
    },
    array :[
        {
           name : {
               hello : '!'
           } 
        }
    ]
}

// here to get
console.log( 'json[aa] : ',ljson(json).get('aa'))
console.log( 'json[hello] : ',ljson(json).get('hello'))
console.log( 'json[son] : ',ljson(json).get('son'))
console.log( 'json[son.name] : ',ljson(json).get('son.name'))
console.log( 'json[aaa.bbb] : ',ljson(json).get('aaa.bbb'))
console.log( 'json[array][0].name : ',ljson(json).get('array[00].name'))

// here to set
ljson(json).set('ccc',"ddddddddddddddddddddddd")
    .set('aaa.bbb','testtest')
    .set('son.name','testname')
    .set('son.age',16)
    .set('array[0].hi[0]','cde')
console.log(json)

```
find  from json
```js
va ljson = require('lisa.json')

var findJson = {
    'name' : 'apporoad',
    age :  33,
    'loves' : [
        {
            name : 'final fanstasy',
            type : 'game'
        },
        {
            name : 'dq',
            type :'game'
        },
        {
            name : 'LiSA',
            type : 'singer'
        }
    ],
    'job' : 'coder',
    'reg' : ' here is test ${abc} for regEx'
}
ljson(findJson).find('job').then(data=>{ console.log('find key : ' + JSON.stringify(data))})
ljson(findJson).find((key,value) =>{ return value &&  value.type && value.type == 'game'}).then(data=>{ console.log('filter: ' + JSON.stringify(data))
 //console.log(ljson(findJson).get('loves[0]'))
})

ljson(findJson).find(null,'dq').then(data=>{ console.log('find value: ' + JSON.stringify(data))})
ljson(findJson).find(null,33).then(data=>{ console.log('find value: ' + JSON.stringify(data))})
ljson(findJson).find(/o.*/g, null).then(data=>{ console.log('key regEx: ' + JSON.stringify(data))})
ljson(findJson).find(null,new RegExp('abc','gm')).then(data=>{ console.log('value regEx: ' + JSON.stringify(data))})

/*
[ { jrl: 'name', key: 'name', value: 'apporoad' },
  { jrl: 'loves[0].name', key: 'name', value: 'final fanstasy' },
  { jrl: 'loves[1].name', key: 'name', value: 'dq' },
  { jrl: 'loves[2].name', key: 'name', value: 'LiSA' } ]
  */
```

array operation
```js
var findJson = {
    'name' : 'apporoad',
    age :  33,
    'loves' : [
        {
            name : 'final fanstasy',
            type : 'game',
            desc : [{
                hello : 'world'
            },{
                hello : 'LiSA'
            }]
        },
        {
            name : 'dq',
            type :'game',
            desc : [{
                hello : 'eir'
            },{
                hello : 'andy'
            }]
        },
        {
            name : 'LiSA',
            type : 'singer',
            desc : [{
                hello : 'china'
            },{
                hello : 'apporoad'
            }]
        }
    ],
    'job' : 'coder',
    'reg' : ' here is test ${abc} for regEx'
}


console.log(ljson(findJson).get("loves[]"))
console.log(ljson(findJson).get("loves[].name"))
console.log(ljson(findJson).get("loves[].desc[]"))
console.log(ljson(findJson).get("loves[].desc[].hello"))
```

## how to pack
```
npm i -g browserify

browserify inde.js -o LiSA.json.js

```
```js
ljson({name : 'hello'}).get('name')

```