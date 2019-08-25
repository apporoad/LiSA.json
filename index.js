var utils = require('lisa.utils')

var getValue =(json,node)=>{
    if(json[node]){
        return json[node]
    }
    node = utils.startTrim(utils.endTrim(node,'.'),'.')
    if(json[node]){
        return json[node]
    }
    var index =node.indexOf('.')
    if(index == -1){
        return json[node]
    }else{
        return getValue(json[node.substring(0,index)],node.substr(index))
    }
}

var setValue=(json,node,value)=>{
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
