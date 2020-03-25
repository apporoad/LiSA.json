/**
 * here is the start
 * 故事开始的地方
 */
exports.prelude = options=>{}

/**
 * is the string in Array a lust, example :   [ 'abc','???' ]
 * 判断数据中的字符串是否是Lust
 */
exports.isLustForString = (str,options) =>{ return false }

/**
 * get lustInfo from String when isLustForString is true
 * 获取lust from String
 */
exports.getLustForString = function(str,options, innerLJ){ return {} }

/**
 * is the Object in Arry a lust  ,example : [{ isLust: true, hello: ' world'}]
 * 判断数组中对象是否是Lust
 */
exports.isLustForObject = (obj,options) =>{ return false }

/**
 * get lustInfo from Object when isLustForObject is true
 * 获取lust from Object
 */
exports.getLustForObject =(obj,options,innerLJ)=>{ return {} } 

/**
 * is the node of json  a lust , example : { '???':{ 'hello': 'world'}}
 * 判断json中的节点是否是lust
 */
exports.isLustForKV = (k,v,options,LJ)=>{ 
    var param = options.param
    if(param.key){
        //todo
    }

    return false
 }

/**
 * get lustInfo from node of json when isLustForKV is true
 * 获取lust 
 */
exports.getLustForKV = (k,v,options,innerLJ) => { return {}}

/**
 * is the node of other  a lust , example :  ()=>{}
 * 判断json中的节点是否是lust
 */
exports.isLustForOthers= (obj,options)=>{ return k === "???" }

/**
 * get lustInfo from node of json when isLustForOthers is true
 * 获取lust 
 */
exports.getLustForOthers= (obj,options,innerLJ) => { return {}}


/**
 * 满足一个lust节点前触发行为 
 */
exports.beforeSatifyOneLust = (lustInfo,options)=>{}

/**
 * 满足一个lust节点后触发行为
 */
exports.afterSatifyOneLust = (lustInfo,options) =>{}

/**
 * 满足所有lust之后触发行为
 */
exports.afterSatifyAllLust = (lustJson,options) =>{
    return new Promise((r,j)=>{r({
        isRemakeLustJson : false
    })})
}

/**
 * sexgirl核心逻辑， 为 一个lust填充值
 * core logic @ sex girl, get real value for a lust
 */
exports.getInputOneLustValue = (lustInfo,lastData,options) =>{
    return new Promise((r,j)=>{
        r({
            hello:'good good day'
        })
    })
}

/**
 * getInputOneLustValue后面的方法，校验输入值
 * method after getInputOneLustValue
 */
exports.validateOneLustInfo = (value,lustInfo,lastData,options) =>{
    return new Promise((r,j)=>{
        r({
            isPass:true,   // important result ,  will reRun when false
            isKeepLust: false, // nullable, when true , the lust won't be deleted
            key: 'your new json node name', // nullable， only you need change your key in json
            value :"???"  // important result , your real value against lust
        })
    })
}