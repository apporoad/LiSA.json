(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var utils = require('lisa.utils')
var LJ = require('lustjson.js')
var sxg = require('./sxg')

var getValue =(jsonOrArray,node)=>{
    if(utils.Type.isObject(jsonOrArray)){
        var json = jsonOrArray
        if(json[node]){
            return json[node]
        }
        node = utils.startTrim(utils.endTrim(node,'.'),'.')
        if(json[node]){
            return json[node]
        }

        var ArrayIndex = node.indexOf('[')
        var index =node.indexOf('.')
        if(ArrayIndex == -1 && index ==-1){
            return json[node]
        }
        else if(ArrayIndex == -1 && index > -1 || (index > -1 && ArrayIndex > index)){
            if(json[node.substring(0,index)]){
                return getValue(json[node.substring(0,index)],node.substr(index))
            }else{
                return null
            }
        }
        else if((ArrayIndex > -1 && index==-1) || (ArrayIndex > -1 && ArrayIndex < index)){
            //"[0].asd"  "[0]"
            if(ArrayIndex==0){
                return null
            }else{
                //"zsdf[0]"
                if(json[node.substring(0,ArrayIndex)]){
                    return getValue(json[node.substring(0,ArrayIndex)],node.substr(ArrayIndex))
                }else{
                    return null
                }
            }
        }
    }else{
        // array
        node = utils.startTrim(utils.endTrim(node,'.'),'.')
        var ArrayIndex = node.indexOf('[')
        var ArrayEndIndex= node.indexOf(']')
        var index =node.indexOf('.')
        if((ArrayIndex ==0 && ArrayEndIndex > 0)){
            //"[0].asd"  "[0]"
            var i = node.substring(1, ArrayEndIndex)
            if(!i){
                // []
                if(ArrayEndIndex + 1== node.length){
                    return jsonOrArray
                }
                //[].abc
                var arrayResult = []
                for(var index = 0 ;index< jsonOrArray.length;index++){
                    var subResult = getValue(jsonOrArray[index],node.substr(ArrayEndIndex +1))
                    if(utils.Type.isArray(subResult)){
                        arrayResult = arrayResult.concat(subResult)
                    }else{
                        arrayResult.push(subResult)
                    } 
                }
                return arrayResult
            }else{
                if(isNaN(i)){
                    return null
                }
                if(parseInt(i)<jsonOrArray.length){
                    if(ArrayEndIndex + 1== node.length){
                        return jsonOrArray[parseInt(i)]
                    }else
                    {
                        return getValue(jsonOrArray[parseInt(i)],node.substr(ArrayEndIndex +1) )
                    }
                }
                else{
                    return null
                }
            }
        }
        else{
            return null
        }
    }
}

var setValue =(jsonOrArray,node,value)=>{
    if(utils.Type.isObject(jsonOrArray)){
        var json = jsonOrArray
        if(json[node]){
            json[node] = value
        }
        node = utils.startTrim(utils.endTrim(node,'.'),'.')
        if(json[node]){
            json[node] = value
        }

        var ArrayIndex = node.indexOf('[')
        var index =node.indexOf('.')
        if(ArrayIndex == -1 && index ==-1){
            json[node] = value
        }
        else if(ArrayIndex == -1 && index > -1 || (index > -1 && ArrayIndex > index)){
            if(json[node.substring(0,index)]){
                setValue(json[node.substring(0,index)],node.substr(index),value)
            }
        }
        else if((ArrayIndex > -1 && index==-1) || (ArrayIndex > -1 && ArrayIndex < index)){
            //"[0].asd"  "[0]"
            if(ArrayIndex==0){
            }else{
                //"zsdf[0]"
                if(json[node.substring(0,ArrayIndex)]){
                    setValue(json[node.substring(0,ArrayIndex)],node.substr(ArrayIndex),value)
                }
            }
        }
    }else{
        // array
        node = utils.startTrim(utils.endTrim(node,'.'),'.')
        var ArrayIndex = node.indexOf('[')
        var ArrayEndIndex= node.indexOf(']')
        var index =node.indexOf('.')
        if((ArrayIndex ==0 && ArrayEndIndex > 1)){
            //"[0].asd"  "[0]"
            var i = node.substring(1, ArrayEndIndex)
            if(isNaN(i)){
            }
            if(parseInt(i)<jsonOrArray.length){
                if(ArrayEndIndex + 1== node.length){
                    jsonOrArray[parseInt(i)] =value
                }else
                {
                    setValue(jsonOrArray[parseInt(i)],node.substr(ArrayEndIndex +1),value)
                }
            }
        }
    }
}

var find = async (json,keyOrFilter,value)=>{
    var options= { result : []}
    if(json && utils.Type.isObject(json)){
        var param = {}
        var needSearch = false
        if(keyOrFilter){
            if(utils.Type.isRegExp(keyOrFilter)){
                needSearch = true
                param.key = keyOrFilter
            }else if(utils.Type.isString(keyOrFilter)){
                needSearch = true
                param.key = keyOrFilter
            }else if(utils.Type.isFunction(keyOrFilter) || utils.Type.isAsyncFunction(keyOrFilter)){
                needSearch = true
                param.fn = keyOrFilter
            }
        }
        param.value = value
        if(value || needSearch){
            options.param = param
            await LJ.get(json,sxg,options)
            return  utils.ArrayDistinct(options.result,(a,b)=>{
                return a.jrl == b.jrl
            })
        }
        return null
    }
    return null
}

function LiSAJSON(json){
    var json = json
    var _this = this
    
    this.get = (node)=>{
        if(json){
            if(node){
                return getValue(json,node)
            }
            else{
                return json
            }
        }
        else{
            return null
        }
    }
    this.set = (node,value) => {
        if(json){
            setValue(json,node,value)
        }
        return _this
    }
    this.find = async (keyOrFilter,value) =>{
        return await find(json,keyOrFilter,value)
    }
}


module.exports = json=>{
    return new LiSAJSON(json)
}

},{"./sxg":5,"lisa.utils":2,"lustjson.js":3}],2:[function(require,module,exports){
var Type = (function() {
    var type = {};
    var typeArr = ['String', 'Object', 'Number', 'Array','Undefined', 'Function', 'Null', 'Symbol','Boolean','RegExp','AsyncFunction'];
    for (var i = 0; i < typeArr.length; i++) {
        (function(name) {
            type['is' + name] = function(obj) {
                return Object.prototype.toString.call(obj) == '[object ' + name + ']';
            }
        })(typeArr[i]);
    }
    return type;
})();

var endWith=function(str,s){
    if(s==null||s==""||str.length==0||s.length>str.length)
       return false;
    if(str.substring(str.length-s.length)==s)
       return true;
    else
       return false;
   }

exports.endTrim=(str,end) =>{
    var array = []
    if(Type.isArray(end)){
        array = end
    }
    else
    {
        array.push(end)
    }

    for(var i =0 ;i < array.length;i++){
        var s = array[i]
        if(endWith(str,s) && s){
            //console.log(str, start)
            return str.substring(0,str.length - s.length)
        }
    }
    return str
}
var startWith=function(str,s){
    if(s==null||s==""|| str==null || str==""||str.length==0||s.length>str.length)
       return false;
    if(str.substr(0,s.length)==s)
       return true;
    else
       return false;
   }

exports.startTrim=(str,start) =>{
    var array = []
    if(Type.isArray(start)){
        array = start
    }
    else
    {
        array.push(start)
    }

    for(var i =0 ;i < array.length;i++){
        var s = array[i]
        if(startWith(str,s) && s){
            //console.log(str, start)
            return str.substring(s.length)
        }
    }
    return str
 }

exports.Type = Type
exports.endWith =endWith
exports.startWith = startWith


exports.indexOfString = (str,searchStr) =>{
    if(!str || !searchStr){
        return -1
    }
    if(searchStr.length > 2 && endWith(searchStr,'/') && startWith(searchStr,'/')){
        //正则匹配
        var re =  new RegExp(searchStr.substring(1,searchStr.length-1),"mg")
        var arr;
        while ((arr = re.exec(str)) != null)
            return arr.index  //print(arr.index + "-" + arr.lastIndex + "\t" + arr);
        return -1
    }
    else{
        return str.indexOf(searchStr)
    }
}
var indexOfString = exports.indexOfString

exports.indexOf= (str, search) =>{
    if(!str || !search){
        return -1
    }
    if(Type.isString(search)){
        return indexOfString(str,search)
    }
    else if(Type.isNumber(search)){
        re = new RegExp(/\n/,"mg")
        var nArr = new Array()
        var temp=null
        while ((temp = re.exec(str)) != null)
            nArr.push(temp.index)
        if(search >=0){
            if(search ==0)
                return 0
            if(search-1 < nArr.length){
                return nArr[search-1]
            }
            else{
                //? maybe should know
                return -1
            }
        }else
        {
            var activeIndex = nArr.length + search
            if(activeIndex > -1){
                return nArr[activeIndex]
            }else{
                //?  maybe should know
                return -1
            }
        }
    }
    else{
        throw Error('pplugins:util: unsupport search type')
    }
}


exports.ArrayContains = (array,one, compareFn) =>{
    return exports.ArrayIndexOf(array,one,compareFn) > -1
}

exports.ArrayEquals =( array1,array2,compareFn)=>{
    if(array1.length !=array2.length){
        return false
    }
    array1.sort(compareFn)
    array2.sort(compareFn)
    for(var i = 0;i<array1.length;i++){
        if(compareFn){
            if(!compareFn(array1[i],array2[i])){
                return false
            }
        }else{
            if(array1[i]!=array2[i]){
                return false
            }
        }
    }
    return true
}

exports.ArrayIndexOf = (array,one, compareFn) =>{
    for(var i =0 ;i< array.length;i++){
        element= array[i]
        if(compareFn){
            if(compareFn(one,element)){
                return i
            }
        }
        else{
            if(one == element){
                return i
            }
        }
    }
    return -1 
}


exports.ArraySort = (array, compareFn) =>{
    return  array.sort(compareFn)
}

exports.ArrayDistinct = (array,compareFn) =>{
    return array.filter(function(item, index, arr) {
        return exports.ArrayIndexOf(arr,item,compareFn) === index
    });
}

exports.ArrayRemove= (array,arrayOrOneRemoving,compareFn) =>{
    var newArr= []
     if(!exports.Type.isArray(arrayOrOneRemoving)){
          arrayOrOneRemoving = [arrayOrOneRemoving]
     }
     array.forEach(element => {
        if(!exports.ArrayContains(arrayOrOneRemoving,element,compareFn)){
            newArr.push(element)
        }
     })
     return newArr
}
},{}],3:[function(require,module,exports){
const util = require('./util')

/*
lust.LJ.isArray: 是否是数组对象一员
lust.LJ.object: lustJson
lust.LJ.index:  数组对象中的位置 0 开始，非数据对象没有该属性
lust.LJ.dotTree lustJson所有在的树位置 如： key1.key2[3]
lust.LJ.fJson  父json对象
lust.LJ.fKey  object所在父json的键值
lust.LJ.key   objcet所属的key 值 ，只有 出现在 lust在kv中的v时  及    xxx : "???" 这种情况时  ？？？ 代表lust
lust.LJ.isKey ： lust是否是 kv 中的 k
*/

/**
 *  找到所有的lust
 * @param {*} json 
 * @param {*} dotTree 
 * @param {*} fJson 
 * @param {*} fKey 
 * @param {*} sxg 
 * @param {*} options  { findOne : false}  需要找1个时采用findOne： true
 * */
var getLusts = async (json, dotTree, fJson, fKey, sxg, options) => {
    if (!json) return []
    if (!sxg) return []
    var lustArray = new Array()
    //json must be arry or json
    if (util.Type.isArray(json)) {
        for (var i = 0; i < json.length; i++) {
            var arrayOne = json[i]

            if (util.Type.isString(arrayOne)) {
                var r = {}
                r.LJ = r.LJ || {}
                r.LJ.isKey = false
                r.LJ.isArray = true
                r.LJ.object = json
                r.LJ.index = i
                r.LJ.dotTree = dotTree ? (dotTree + "[" + i + "]") : ('[' + i + ']'),
                r.LJ.fJson = fJson
                r.LJ.fKey = fKey
                r.LJ.key = null
                if (sxg.isLustForString && sxg.getLustForString && await Promise.resolve(sxg.isLustForString(arrayOne, options,r))) {
                    r.value= await Promise.resolve(sxg.getLustForString(arrayOne, options,r))
                    lustArray.push(r)
                }
            } else if (util.Type.isObject(arrayOne)) {
                var r = {}
                r.value = arrayOne
                r.LJ = r.LJ || {}
                r.LJ.isArray = true
                r.LJ.isKey = false
                r.LJ.object = json
                r.LJ.index = i
                r.LJ.dotTree = dotTree ? (dotTree + "[" + i + "]") : ('[' + i + ']'),
                r.LJ.fJson = fJson
                r.LJ.fKey = fKey
                r.LJ.key = null
                //if is lust， return lust
                if (sxg.isLustForObject && await Promise.resolve(sxg.isLustForObject(arrayOne, options,r))) {
                    if (sxg.getLustForObject) {
                        r.value = await Promise.resolve(sxg.getLustForObject(arrayOne, options,r)) || arrayOne
                    }
                    lustArray.push(r)
                }
                else {
                    var r = await getLusts(arrayOne, (dotTree ? (dotTree + "[" + i + "]") : ('[' + i + ']')), json, i, sxg, options)
                    if (r != null)
                        lustArray = lustArray.concat(r)
                }
            } else if (util.Type.isArray(arrayOne)) {
                var r = await getLusts(arrayOne, (dotTree ? (dotTree + "[" + i + "]") : ('[' + i + ']')), json, i, sxg, options)
                if (r != null)
                    lustArray = lustArray.concat(r)
            }
            else {
                var r = {}
                r.LJ = r.LJ || {}
                r.LJ.isKey = false
                r.LJ.isArray = true
                r.LJ.object = json
                r.LJ.index = i
                r.LJ.dotTree = dotTree ? (dotTree + "[" + i + "]") : ('[' + i + ']'),
                r.LJ.fJson = fJson
                r.LJ.fKey = fKey
                r.LJ.key = null
                //others
                if (sxg.isLustForOthers && sxg.getLustForOthers && await Promise.resolve(sxg.isLustForOthers(arrayOne, options,r))) {
                    r .value= await Promise.resolve(sxg.getLustForOthers(arrayOne, options,r))
                    lustArray.push(r)
                }
            }
            //find one
            if (options && options.findOne && lustArray.length > 0) {
                return lustArray
            }
        }
    }
    else if (util.Type.isObject(json)) {
        //util.type.isArray(json)
        for (var key in json) {
            // name: '???(string)[rue]这里填写你的名字'
            var value = json[key]
            // '???': null
            var r ={}
            r.LJ = r.LJ || {}
            r.LJ.isKey = true
            r.LJ.key = key
            r.LJ.object = json
            r.LJ.dotTree = (dotTree ? (dotTree + ".???") : "???")
            if (sxg.isLustForKV && await Promise.resolve(sxg.isLustForKV(key, value, options,r))) {
                r.value = await Promise.resolve(sxg.getLustForKV(key, value, options,r))
                lustArray.push(r)
            }
            // is String
            else if (util.Type.isString(value)) {
                var r = {}
                r.LJ = r.LJ || {}
                r.LJ.isKey = false
                r.LJ.isArray = false
                r.LJ.object = json
                r.LJ.index = i
                r.LJ.dotTree = dotTree ? (dotTree + "." + key) : key
                r.LJ.fJson = fJson
                r.LJ.fKey = fKey
                r.LJ.key = key
                if (sxg.isLustForString && sxg.getLustForString && await Promise.resolve(sxg.isLustForString(value, options,r))) {
                    r.value = await Promise.resolve(sxg.getLustForString(value, options,r))
                    lustArray.push(r)
                }
            }
            // is Array
            else if (util.Type.isArray(value)) {
                var r = await getLusts(value, (dotTree ? (dotTree + "." + key) : key), json, key, sxg, options)
                if (r != null)
                    lustArray = lustArray.concat(r)
            }
            else if (util.Type.isObject(value)) {
                //if is lust， return lust
                var r = {}
                r.value= value
                r.LJ = r.LJ || {}
                r.LJ.isArray = false
                r.LJ.isKey = false
                r.LJ.object = json
                r.LJ.index = 0
                r.LJ.dotTree = dotTree ? (dotTree + "." + key) : key
                r.LJ.fJson = fJson
                r.LJ.fKey = fKey
                r.LJ.key = key
                if (sxg.isLustForObject && await Promise.resolve(sxg.isLustForObject(value, options,r))) {
                    if (sxg.getLustForObject) {
                        r .value= await Promise.resolve(sxg.getLustForObject(value, options,r)) || value
                    }
                    lustArray.push(r)
                }
                else {
                    var r = await getLusts(value, (dotTree ? (dotTree + "." + key) : key), json, key, sxg, options)
                    if (r != null)
                        lustArray = lustArray.concat(r)
                }
            } else {
                //others
                var r = {}
                r.LJ = r.LJ || {}
                r.LJ.isKey = false
                r.LJ.isArray = false
                r.LJ.object = json
                r.LJ.index = i
                r.LJ.dotTree = dotTree ? (dotTree + "." + key) : key
                r.LJ.fJson = fJson
                r.LJ.fKey = fKey
                r.LJ.key = key
                if (sxg.isLustForOthers && sxg.getLustForOthers && await Promise.resolve(sxg.isLustForOthers(value, options,r))) {

                    r.value = await Promise.resolve(sxg.getLustForOthers(value, options,r))
                    lustArray.push(r)
                }
            }
            if (options && options.findOne && lustArray.length > 0)
                return lustArray
        }
    }
    return lustArray
}

/**
 * 填充lustInfo
 * @param {*} cr 
 */
var fillOneLustInfo = function (cr, lustInfo) {
    if (lustInfo.LJ.isKey) {
        lustInfo.LJ.object[cr.key] = cr.value
    }
    else {
        if (lustInfo.LJ.isArray) {
            lustInfo.LJ.object.splice(lustInfo.LJ.index, 0, cr.value)
        }
        else {
            lustInfo.LJ.object[lustInfo.LJ.key] = cr.value
        }
    }

    if (!cr.isKeepLust) {
        //console.log(lustInfo)
        if (lustInfo.LJ.isArray) {
            //lustInfo.fJson[lustInfo.fkey] = 
            lustInfo.LJ.object.splice(lustInfo.LJ.index + 1, 1)
        }
        else if (lustInfo.LJ.isKey) {
            delete lustInfo.LJ.object[lustInfo.LJ.key]
        }
    }
}

/**
 * satify one lust
 * @param {*} lustInfo 
 */
var satifyOneLust = function (lustInfo, sxg, options) {
    return new Promise(function (r, j) {
        const cycle = function (lastData) {
            if (!sxg.getInputOneLustValue) {
                throw new Error("lustJson: your sxg must implement the exports methods: getInputOneLustValue")
            }
            if (!sxg.validateOneLustInfo) {
                throw new Error("lustJson: your sxg must implement the exports methods: validateOneLustInfo")
            }
            var dataOrPromise = sxg.getInputOneLustValue(lustInfo, lastData, options)
            //inputHandler
            const inputHandler = data => {
                const validateHandler = cr => {
                    //cr like:
                    /* 
                        isPass
                        isKeepLust
                        value
                        key
                    */
                    if (cr.isPass) {
                        fillOneLustInfo(cr, lustInfo)
                        r()
                    }
                    else {
                        //stdin.writeLine(cr.message + "\r\n")
                        cycle(data)
                    }

                    // if(cr.isPass)
                    // {
                    //     if(!cr.isUpdate){
                    //         stdin.writeLine("add success:" + lustInfo.dotTree + " continue to add?\r\nyes/no:(no) ")         
                    //         stdin.readLine().then(data1=>{ 
                    //             if(data1 == "true" || data1 == "yes" || data1 == "y" || data1=="Y"
                    //                 || data1 == "t"){
                    //                 // if continue ,will keep ???
                    //                 r()
                    //             }
                    //             else{
                    //                 //console.log(lustInfo)
                    //                 if(lustInfo.isArray){
                    //                     //lustInfo.fJson[lustInfo.fkey] = 
                    //                     lustInfo.object.splice(lustInfo.index+1,1) 
                    //                 }
                    //                 else if(lustInfo.isKey){
                    //                     delete lustInfo.object[lustInfo.key]
                    //                 }
                    //                 r()
                    //             }
                    //         })

                    //     }
                    //     else
                    //     {
                    //         r()
                    //     }
                    // }
                }
                var vResultOrPromise = sxg.validateOneLustInfo(data, lustInfo, lastData, options)
                if (vResultOrPromise.then) {
                    vResultOrPromise.then(vResult => {
                        validateHandler(vResult)
                    })
                }
                else {
                    validateHandler(vResultOrPromise)
                }

                //var cr =lust.checkAndUpdateValueByLustInfo(data,lustInfo,lastData)

            }
            if (dataOrPromise.then) {
                dataOrPromise.then(data => {
                    inputHandler(data)
                })
            }
            else {
                inputHandler(dataOrPromise)
            }
        }
        //start main logic
        cycle()
    })
}


/**
 * 获取lustJson值
 * @param {*} lustJson 欲望json
 * @param {*} sxg 性感女孩 解决器
 * @param {*} options 选择项
 */
var get = function (lustJson, sxg, options) {
    if (sxg.prelude) {
        sxg.prelude(options)
    }
    //deep copy json
    var iJson = Object.assign({}, lustJson)
    return new Promise(function (r, j) {

        //serial
        var cylceAllLustSerial = async (options) => {
            var firstLustInfo = await getLusts(iJson, null, null, null, sxg, options)
            if (firstLustInfo.length > 0) {
                firstLustInfo = firstLustInfo[0]
                if (sxg.beforeSatifyOneLust) {
                    var pOrNot = sxg.beforeSatifyOneLust(firstLustInfo, options)
                    //判断是否是promise
                    if (pOrNot && pOrNot.then) {
                        pOrNot.then(data => {
                            satifyOneLust(firstLustInfo, sxg, options).then(() => {
                                if (sxg.afterSatifyOneLust) {
                                    sxg.afterSatifyOneLust(firstLustInfo, options)
                                }
                                cylceAllLustSerial(options)
                            }, j)
                        }, j)
                    }
                    else {
                        satifyOneLust(firstLustInfo, sxg, options).then(() => {
                            if (sxg.afterSatifyOneLust) {
                                sxg.afterSatifyOneLust(firstLustInfo, options)
                            }
                            cylceAllLustSerial(options)
                        })
                    }
                }
                else {
                    satifyOneLust(firstLustInfo, sxg, options).then(() => {
                        if (sxg.afterSatifyOneLust) {
                            sxg.afterSatifyOneLust(firstLustInfo, options)
                        }
                        cylceAllLustSerial(options)
                    }, j)
                }

            }
            else {
                if (sxg.afterSatifyAllLust) {
                    var pOrNot = sxg.afterSatifyAllLust(iJson, options)
                    //这边是是否重新make的逻辑，可扩展其他方式
                    if (pOrNot) {
                        if (pOrNot.then) {
                            pOrNot.then(result => {
                                if (result.isRemakeLustJson) {
                                    iJson = Object.assign({}, lustJson)
                                    cylceAllLustSerial(options)
                                }
                                else {
                                    r(iJson)
                                }
                            }, j)
                        }
                        else {
                            if (pOrNot.isRemakeLustJson) {
                                iJson = Object.assign({}, lustJson)
                                cylceAllLustSerial(options)
                            }
                            else {
                                r(iJson)
                            }
                        }
                    }
                    else
                        r(iJson)
                }
                else {
                    r(iJson)
                }
            }
            return
        }
        //parallel
        var cylceAllLustParallel = async (options) => {
            var lustInfos = await getLusts(iJson, null, null, null, sxg, options)
            if (lustInfos.length > 0) {
                util.promiseAllArray(lustInfos, ele => {
                    return new Promise((rr, jj) => {
                        if (sxg.beforeSatifyOneLust) {
                            var pOrNot = sxg.beforeSatifyOneLust(ele, options)
                            //判断是否是promise
                            if (pOrNot && pOrNot.then) {
                                pOrNot.then(data => {
                                    satifyOneLust(ele, sxg, options).then(() => {
                                        if (sxg.afterSatifyOneLust) {
                                            sxg.afterSatifyOneLust(ele, options)
                                        }
                                        rr()
                                    }, jj)
                                }, jj)
                            } else {
                                satifyOneLust(ele, sxg, options).then(() => {
                                    if (sxg.afterSatifyOneLust) {
                                        sxg.afterSatifyOneLust(ele, options)
                                    }
                                    rr()
                                }, jj)
                            }
                        } else {
                            satifyOneLust(ele, sxg, options).then(() => {
                                if (sxg.afterSatifyOneLust) {
                                    sxg.afterSatifyOneLust(ele, options)
                                }
                                rr()
                            }, jj)
                        }
                    })
                }, () => {
                    cylceAllLustParallel(options)
                }, j)
            }
            else {
                //here no lust now , redo logic
                if (sxg.afterSatifyAllLust) {
                    var pOrNot = sxg.afterSatifyAllLust(iJson, options)
                    //这边是是否重新make的逻辑，可扩展其他方式
                    if (pOrNot) {
                        if (pOrNot.then) {
                            pOrNot.then(result => {
                                if (result.isRemakeLustJson) {
                                    iJson = Object.assign({}, lustJson)
                                    cylceAllLustParallel(options)
                                }
                                else {
                                    r(iJson)
                                }
                            }, j)
                        }
                        else {
                            if (pOrNot.isRemakeLustJson) {
                                iJson = Object.assign({}, lustJson)
                                cylceAllLustParallel(options)
                            }
                            else {
                                r(iJson)
                            }
                        }
                    }
                    else
                        r(iJson)
                }
                else {
                    r(iJson)
                }
            }
            return
        }

        //是否串行 is Serial 默认并行
        if (options.serial) {
            options = Object.assign({}, options)
            options.findOne = true
            cylceAllLustSerial(options)
        }
        else {
            //并行lust
            options = Object.assign({}, options)
            options.findOne = false
            cylceAllLustParallel(options)
        }
    });
}


// exports.checkSxg = (sxg,isCheckAll) =>{
//     if(!sxg.prelude && isCheckAll){
//         throw new Error("sxg should implement prelude")
//     }
//     if(!sxg.prelude && isCheckAll){
//         throw new Error("sxg should implement prelude")
//     }
// }

exports.get = get //function(lustJson,resolver,resolverConf){console.log("get")}


},{"./util":4}],4:[function(require,module,exports){
var Type = (function() {
    var type = {};
    var typeArr = ['String', 'Object', 'Number', 'Array','Undefined', 'Function', 'Null', 'Symbol','Boolean','RegExp'];
    for (var i = 0; i < typeArr.length; i++) {
        (function(name) {
            type['is' + name] = function(obj) {
                return Object.prototype.toString.call(obj) == '[object ' + name + ']';
            }
        })(typeArr[i]);
    }
    return type;
})();

var endWith=function(str,s){
    if(s==null||s==""||str.length==0||s.length>str.length)
       return false;
    if(str.substring(str.length-s.length)==s)
       return true;
    else
       return false;
   }
var startWith=function(str,s){
    if(s==null||s==""|| str==null || str==""||str.length==0||s.length>str.length)
       return false;
    if(str.substr(0,s.length)==s)
       return true;
    else
       return false;
   }



exports.Type = Type
exports.endWith =endWith
exports.startWith = startWith


exports.promiseAllArray =  (arr,fn,completeFn,onReject)=>{
   if(!Type.isArray(arr)){
       arr = [arr]
   }
   var pArray = new Array()
   arr.forEach(element => {
       pArray.push(fn(element))
   });
   Promise.all(pArray).then(values=>{
       completeFn(values)
   },onReject)
}
},{}],5:[function(require,module,exports){
const utils = require('lisa.utils')

/**
 * here is the start
 * 故事开始的地方
 */
exports.prelude = options => { }

/**
 * is the string in Array a lust, example :   [ 'abc','???' ]
 * 判断数据中的字符串是否是Lust
 */
exports.isLustForString =  async (str, options, LJ) => {
    var param = options.param
    options.result = options.result || []
    if (str && param.value) {
        if (str == param.value) {
            options.result.push({
                jrl: LJ.LJ.dotTree,
                value: str
            })
        } else if (utils.Type.isRegExp(param.value) && param.value.test(str)) {
            options.result.push({
                jrl: LJ.LJ.dotTree,
                value: str
            })
        }
    }
     if (param.fn) {
            if (await Promise.resolve(param.fn(null, str))) {
                options.result.push({
                    jrl: LJ.LJ.dotTree,
                    value: str
                })
            }
        }
    return false
}

/**
 * get lustInfo from String when isLustForString is true
 * 获取lust from String
 */
exports.getLustForString = function (str, options, innerLJ) { return {} }

/**
 * is the Object in Arry a lust  ,example : [{ isLust: true, hello: ' world'}]
 * 判断数组中对象是否是Lust
 */
exports.isLustForObject = async (obj, options, LJ) => {
    var param = options.param
    options.result = options.result || []
    if (obj && param.value) {
        if (obj == param.value) {
            return {
                jrl: LJ.LJ.dotTree,
                value: obj
            }
        }
    }
    if (param.fn) {
        if (await Promise.resolve(param.fn(null, obj))) {
            options.result.push({
                jrl: LJ.LJ.dotTree,
                value: obj
            })
        }
    }
    return false
}

/**
 * get lustInfo from Object when isLustForObject is true
 * 获取lust from Object
 */
exports.getLustForObject = (obj, options, innerLJ) => { return {} }

/**
 * is the node of json  a lust , example : { '???':{ 'hello': 'world'}}
 * 判断json中的节点是否是lust
 */
exports.isLustForKV = async (k, v, options, LJ) => {
    var param = options.param
    options.result = options.result || []
    if (param.key) {
        if (utils.Type.isString(param.key) && param.key == k) {
            options.result.push({
                jrl: LJ.LJ.dotTree.replace('???', k),
                key: k,
                value: v
            })
        } else if (utils.Type.isRegExp(param.key) && param.key.test(k)) {
            options.result.push({
                jrl: LJ.LJ.dotTree.replace('???', k),
                key: k,
                value: v
            })
        }
    }
    if (param.value && v) {
        if (utils.Type.isString(v) && utils.Type.isRegExp(param.value) && param.value.test(v)) {
            options.result.push({
                jrl: LJ.LJ.dotTree.replace('???', k),
                key: k,
                value: v
            })
        } else if (v ==  param.value) {
            options.result.push({
                jrl: LJ.LJ.dotTree.replace('???', k),
                key: k,
                value: v
            })
        }
    }

    if (param.fn) {
        if (await Promise.resolve(param.fn(k, v))) {
            options.result.push({
                jrl: LJ.LJ.dotTree.replace('???', k),
                key: k,
                value: v
            })
        }
    }

    return false
}

/**
 * get lustInfo from node of json when isLustForKV is true
 * 获取lust 
 */
exports.getLustForKV = (k, v, options, innerLJ) => { return {} }

/**
 * is the node of other  a lust , example :  ()=>{}
 * 判断json中的节点是否是lust
 */
exports.isLustForOthers = async (obj, options,LJ) => { 
    var param = options.param
    options.result = options.result || []
    if (obj && param.value) {
        if (obj == param.value) {
            return {
                jrl: LJ.LJ.dotTree,
                value: obj
            }
        }
    }
    if (param.fn) {
        if (await Promise.resolve(param.fn(null, obj))) {
            options.result.push({
                jrl: LJ.LJ.dotTree,
                value: obj
            })
        }
    }
    return false 
}

/**
 * get lustInfo from node of json when isLustForOthers is true
 * 获取lust 
 */
exports.getLustForOthers = (obj, options, innerLJ) => { return {} }


/**
 * 满足一个lust节点前触发行为 
 */
exports.beforeSatifyOneLust = (lustInfo, options) => { }

/**
 * 满足一个lust节点后触发行为
 */
exports.afterSatifyOneLust = (lustInfo, options) => { }

/**
 * 满足所有lust之后触发行为
 */
exports.afterSatifyAllLust = (lustJson, options) => {
    return new Promise((r, j) => {
        r({
            isRemakeLustJson: false
        })
    })
}

/**
 * sexgirl核心逻辑， 为 一个lust填充值
 * core logic @ sex girl, get real value for a lust
 */
exports.getInputOneLustValue = (lustInfo, lastData, options) => {
    return new Promise((r, j) => {
        r({
            hello: 'good good day'
        })
    })
}

/**
 * getInputOneLustValue后面的方法，校验输入值
 * method after getInputOneLustValue
 */
exports.validateOneLustInfo = (value, lustInfo, lastData, options) => {
    return new Promise((r, j) => {
        r({
            isPass: true,   // important result ,  will reRun when false
            isKeepLust: false, // nullable, when true , the lust won't be deleted
            key: 'your new json node name', // nullable， only you need change your key in json
            value: "???"  // important result , your real value against lust
        })
    })
}
},{"lisa.utils":2}]},{},[1]);
