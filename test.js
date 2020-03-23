var ljson = require('./index')


var json = {
    hello:"world",
    good : 'good day',
    son:{
        name: 'bb',
        grandFather: 'hello'
    },
    aaa : {
        bbb : 'ccccccccc'
    },
    "aaa.bbb" :{
        hello :"world"
    },
    array :[
        {
           name : {
               hello : '!'
           },
           hi : [
               'abc'
           ] 
        }
    ]
}

// console.log(json)
console.log('+++++++++++++++++++++++++++++++++++++')
console.log( 'json[aa] : ',ljson(json).get('aa'))
console.log( 'json[hello] : ',ljson(json).get('hello'))
console.log( 'json[son] : ',ljson(json).get('son'))
console.log( 'json[son.name] : ',ljson(json).get('son.name'))
console.log( 'json[aaa.bbb] : ',ljson(json).get('aaa.bbb'))

console.log('aaaaaaaaaaaaaaaaaaaa.ssssssssssss :' ,ljson(json).get('aaaaaaaaaaaaaaaaaaaa.ssssssssssss') )
console.log( 'json[array][0].name : ',ljson(json).get('array[00].name'))
console.log( 'json[array][0][1].name : ',ljson(json).get('array[0][1].name'))
console.log( 'json[array][1].name : ',ljson(json).get('array[01].name'))
console.log( 'json[array][0.0].name : ',ljson(json).get('array[0.0].name'))
console.log( 'json[array][0.0].name1 : ',ljson(json).get('array[0.0].name1'))
console.log( 'json[array][0.0].name.hello : ',ljson(json).get('array[0.0].name.hello'))
console.log( 'json[array][0.0].hi : ',ljson(json).get('array[0.0].hi'))
console.log( 'json[array][0.0].hi[0] : ',ljson(json).get('array[0.0].hi[0]'))
// console.log( 'json[array][0.0].hi[0][4] : ',ljson(json).get('array[0.0].hi[0][4]'))
console.log('=============================================')
ljson(json).set('ccc',"ddddddddddddddddddddddd")
    .set('aaa.bbb','testtest')
    .set('son.name','testname')
    .set('son.age',16)
    .set('array[0].hi[0]','cde')

console.log(json)
console.log( 'json[array][0.0].hi[0] : ',ljson(json).get('array[0.0].hi[0]'))
