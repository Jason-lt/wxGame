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
    clientId: 'IOS_4.55_tuyoo.appStore.0-hall7.appStore.mjtymj',
    loginUrl: 'http://192.168.10.88/',
    webSocketUrl: 'ws://192.168.10.88/',
    deviceId: 'wechatGame',
    wxAppId: 'wx6ac3f5090a6b99c5',
    appId: 9999,
    hallId: 9999,
    gameId: 6,
    tableBgMusicVolume: 0.4,

    mostImgCount : 40,
    imageDicArray : [],
    imageDic : {},

    getImageWithURL : function (urlString,nowSprite) {
        if (ty.SystemInfo.imageDic[urlString]) {
            if (ty.SystemInfo.imageDic[urlString].texture){
                // hall.LOGD(null, "缓存在这里缓存在这里缓存在这里缓存在这里缓存在这里");
                nowSprite.spriteFrame = ty.SystemInfo.imageDic[urlString].texture;
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
            cc.loader.load(urlString, function (err, texture) {
                // hall.LOGD(null, "请求图片请求图片请求图片请求图片请求图片请求图片");
                if (!err) {
                    ty.SystemInfo.imageDic[urlString].texture =  new cc.SpriteFrame(texture);
                    var tempA = ty.SystemInfo.imageDic[urlString].textureArray;
                    for (var  i = 0 ; i < tempA.length ; i ++){
                        var sprit = tempA[i];
                        if (sprit){
                            // hall.LOGD(null, "不是缓存获得图片不是缓存获得图片不是缓存获得图片不是缓存获得图片不是缓存获得图片");
                            sprit.spriteFrame = ty.SystemInfo.imageDic[urlString].texture;
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
    },
};
