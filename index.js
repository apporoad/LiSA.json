var utils = require('lisa.utils')

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
        if((ArrayIndex ==0 && ArrayEndIndex > 1)){
            //"[0].asd"  "[0]"
            var i = node.substring(1, ArrayEndIndex)
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

var setValueOld=(json,node,value)=>{
    if(json[node]){
        json[node] = value
        return
    }
    node = utils.startTrim(utils.endTrim(node,'.'),'.')
    if(json[node]){
        json[node] = value
        return
    }
    var index =node.indexOf('.')
    if(index==-1){
        json[node] = value
    }else{
        setValue(json[node.substring(0,index)],node.substr(index),value)
    }
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
}


module.exports = json=>{
    return new LiSAJSON(json)
}
