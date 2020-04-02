var ljson = require('./index')
var utils = require('lisa.utils')

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
// console.log( 'json[aa] : ',ljson(json).get('aa'))
// console.log( 'json[hello] : ',ljson(json).get('hello'))
// console.log( 'json[son] : ',ljson(json).get('son'))
// console.log( 'json[son.name] : ',ljson(json).get('son.name'))
// console.log( 'json[aaa.bbb] : ',ljson(json).get('aaa.bbb'))

console.log('aaaaaaaaaaaaaaaaaaaa.ssssssssssss :' ,ljson(json).get('aaaaaaaaaaaaaaaaaaaa.ssssssssssss') )
// console.log( 'json[array][0].name : ',ljson(json).get('array[00].name'))
// console.log( 'json[array][0][1].name : ',ljson(json).get('array[0][1].name'))
// console.log( 'json[array][1].name : ',ljson(json).get('array[01].name'))
// console.log( 'json[array][0.0].name : ',ljson(json).get('array[0.0].name'))
// console.log( 'json[array][0.0].name1 : ',ljson(json).get('array[0.0].name1'))
// console.log( 'json[array][0.0].name.hello : ',ljson(json).get('array[0.0].name.hello'))
// console.log( 'json[array][0.0].hi : ',ljson(json).get('array[0.0].hi'))
// console.log( 'json[array][0.0].hi[0] : ',ljson(json).get('array[0.0].hi[0]'))
// console.log( 'json[array][0.0].hi[0][4] : ',ljson(json).get('array[0.0].hi[0][4]'))
console.log('=============================================')
// ljson(json).set('ccc',"ddddddddddddddddddddddd")
//     .set('aaa.bbb','testtest')
//     .set('son.name','testname')
//     .set('son.age',16)
//     .set('array[0].hi[0]','cde')

// console.log(json)
// console.log( 'json[array][0.0].hi[0] : ',ljson(json).get('array[0.0].hi[0]'))


console.log('+++++++++++++++++++++++++++++++++++++++++++++++++')

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
// ljson(findJson).find('job').then(data=>{ console.log('find key : ' + JSON.stringify(data))})
// ljson(findJson).find((key,value) =>{ return value &&  value.type && value.type == 'game'}).then(data=>{ console.log('filter: ' + JSON.stringify(data))
//  //console.log(ljson(findJson).get('loves[0]'))
// })

// ljson(findJson).find(null,'dq').then(data=>{ console.log('find value: ' + JSON.stringify(data))})
// ljson(findJson).find(null,33).then(data=>{ console.log('find value: ' + JSON.stringify(data))})
// ljson(findJson).find(/o.*/g, null).then(data=>{ console.log('key regEx: ' + JSON.stringify(data))})
// ljson(findJson).find(null,new RegExp('abc','gm')).then(data=>{ console.log('value regEx: ' + JSON.stringify(data))})

// ljson(findJson).find(1).catch(ex =>{ console.log('errors : find key is number' + ex)})
// ljson(findJson).find({ hello : 1 },null).catch(ex =>{ console.log('errors : find key is object' + ex)})



console.log(ljson(findJson).get("loves[]"))

console.log(ljson(findJson).get("loves[].name"))

console.log(ljson(findJson).get("loves[].desc[]"))

console.log(ljson(findJson).get("loves[].desc[].hello"))
