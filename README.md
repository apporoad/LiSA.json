# LiSA.json
sad for weak json

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