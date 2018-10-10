/**
 * @author zhaoliang
 * @date 1.28
 * 
 * 全局对象
 * 系统信息
 * 包括clientId，loginUrl等
 */
console.log("SystemInfo loaded");
ty.SystemInfo = {
    DEBUG_SER_KEY:"DEBUG_SER_KEY",
    clientId: 'H5_5.0_weixin.weixin.0-hall115.weixin.shuangqwz',
    clientIdInt: 24587,
    cloudid:24,

    version:1.10,
    isCheckVersion : true,

    // loginUrl: 'https://fz.nalrer.cn/', //仿真地址
    // loginUrl: 'http://140.143.201.170:8000/', //仿真地址

    // webSocketUrl: 'ws://39.107.104.141/',

    // loginUrl: 'http://192.168.20.108:8000/',

    // webSocketUrl: 'ws://192.168.10.88/',
    //
    loginUrl : 'https://openrich.nalrer.cn/',  //正式
    // webSocketUrl: 'wss://richwss.nalrer.cn/',
    // wss.nalrer.cn

    deviceId: 'wechatGame',
    wxAppId: 'wx824d94ce511885ad',
    appId: 9999,
    hallId: 9999,
    gameId: 115,
    tableBgMusicVolume: 0.4,
    // cdnPath:"https://richqn.nalrer.cn/dizhu/",
    // cdnPath:"https://nslyqn.nalrer.cn/nsly",
    cdnPath:"https://richqn.nalrer.cn/nsly/",
    cdnPath_shareMoment : "https://richqn.nalrer.cn/nsly/crazygun/shareMoment/",

    m_server_ip : "https://cbi.touch4.me/api/bilog5/text",

    shareManagerUrlShare : 'https://market.touch4.me/',
    // shareManagerUrl : 'https://market.touch4.me/',
    shareManagerUrl : 'https://analy.ywdier.com/',

    shareImagePath : "",
    shareImageType :"",
    boxId : "",
    mysteryGiftBagBoxId : "",
    mostImgCount : 40,
    imageDicArray : [],
    imageDic : {},

    bsgsCitys : ['北京','上海','广州','深圳','杭州','成都','天津','未知'],

    getImageWithURL : function (urlStringO, nowSprite) {
        if(!urlStringO || !nowSprite){
            return;
        }
        var urlString = hall.hex_md5(urlStringO);
        var setOldSize = function (nowSprite, texture) {
            var oldSize = cc.size(nowSprite.node.width, nowSprite.node.height);
            nowSprite.spriteFrame = texture;
            nowSprite.node.setContentSize(oldSize);
        };

        if (ty.SystemInfo.imageDic[urlString]) {
            if (ty.SystemInfo.imageDic[urlString].texture){
                // hall.LOGD(null, "缓存在这里缓存在这里缓存在这里缓存在这里缓存在这里");
                setOldSize(nowSprite, ty.SystemInfo.imageDic[urlString].texture);
            }else {
                if (ty.SystemInfo.imageDic[urlString].textureArray){
                    ty.SystemInfo.imageDic[urlString].textureArray.push(nowSprite);
                }else {
                    ty.SystemInfo.imageDic[urlString].textureArray = [];
                    ty.SystemInfo.imageDic[urlString].textureArray.push(nowSprite);
                }
            }
        } else {
            ty.SystemInfo.imageDic[urlString] = {};
            ty.SystemInfo.imageDic[urlString].textureArray = [];
            ty.SystemInfo.imageDic[urlString].textureArray.push(nowSprite);
            if (ty.SystemInfo.imageDicArray.length >= ty.SystemInfo.mostImgCount){
                var tempURL = ty.SystemInfo.imageDicArray[0];
                ty.SystemInfo.imageDic[tempURL] = null;
                delete ty.SystemInfo.imageDic[tempURL];
                ty.SystemInfo.imageDicArray.splice(0,1);
            }
            ty.SystemInfo.imageDicArray.push(urlString);
            cc.loader.load({url: urlStringO, type: 'jpg'}, function (err, texture) {
                // hall.LOGD(null, "请求图片请求图片请求图片请求图片请求图片请求图片");
                if (!err) {
                    ty.SystemInfo.imageDic[urlString].texture =  new cc.SpriteFrame(texture);
                    var tempA = ty.SystemInfo.imageDic[urlString].textureArray;
                    for (var  i = 0 ; i < tempA.length ; i ++){
                        var sprit = tempA[i];
                        if (sprit){
                            // hall.LOGD(null, "不是缓存获得图片不是缓存获得图片不是缓存获得图片不是缓存获得图片不是缓存获得图片");
                            setOldSize(sprit, ty.SystemInfo.imageDic[urlString].texture);
                        }
                    }
                }
                else {
                    //加载失败
                    ty.SystemInfo.imageDic[urlString] = null;
                    delete  ty.SystemInfo.imageDic[urlString];
                    //可以删除数组中对应的url地址,可是不删也没有什么影响
                }
            }.bind(this));
        }
    }
};
