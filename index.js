var utils = require('lisa.utils')
var uType = utils.Type
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

var  stringify = ( json ,options) =>{
    
}

var parse = (jsonString, options)=>{

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