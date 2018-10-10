// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        txtServer : cc.EditBox,
        btnChange : cc.Button,
        btnReset : cc.Button,
        txtFTID : {
            default : null,
            type : cc.EditBox
        },

        userIdlabel:cc.Label,
        onLaunchParamsLabel : cc.Label,
        onShowParamsLabel : cc.Label,
        qrSprite: cc.Sprite
    },

    onLoad:function () {
        var that = this;
        var serPath = hall.GlobalFuncs.ReadStringFromLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "");
        this.btnChange.node.on('click', function (evet) {
            hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, that.txtServer.string);
            // hall.MsgBoxManager.showToast({title:'服务器地址已更新,请退出重新登录!'});
            ty.TuyooSDK.wechatLogin();
        });

        this.btnReset.node.on('click', function (evet) {
            that.txtServer.string = "";
            hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "");

            hall.MsgBoxManager.showToast({title:'服务器地址已重置'});
        });

        double.LOGD(null, "当前的SDK地址:" + serPath);

        this.txtServer.string = serPath;
    },

    testWithString : function () {
        // this.mainScene
        this.userIdlabel.string = "userId  :   "+ ty.UserInfo.userId;

        var sceneInfo = wx.getLaunchOptionsSync();
        this.onLaunchParamsLabel.string = "Launch：  "+JSON.stringify(sceneInfo);

        var onShowString = hall.GlobalFuncs.ReadStringFromLocalStorage(double.gameModel.ONSHOW_PARAMS,"");
        this.onShowParamsLabel.string = "onShow :  " + onShowString;
    },
    onBtnQRCode:function () {

        // hall.recorder.startRecord(8);

        // var fs = wx.getFileSystemManager();
        // var filePath = wx.env.USER_DATA_PATH + '/au.aac';
        // var filePath =  'res/raw-assets/2.aac';
        // fs.writeFileSync(filePath ,fss , 'base64');
        // // double.AudioHelper.playEffect(filePath);
        // var musicPlayManager = wx.createInnerAudioContext();
        // musicPlayManager.autoplay = true;
        // musicPlayManager.loop = false;
        // musicPlayManager.volume = 1;
        // musicPlayManager.src = filePath;

        // var fileStr = fs.readFileSync("res/2.aac", 'base64');
        // hall.LOGD(null, "fs:" + fileStr);

        // return;

        var sdkPath = ty.SystemInfo.loginUrl;
        if (debugMode){
            sdkPath = hall.GlobalFuncs.ReadStringFromLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, ty.SystemInfo.loginUrl);
        }
        var local_uuid = hall.GlobalFuncs.getLocalUuid();

        // var pars = {
        //     appId: ty.SystemInfo.appId,
        //     wxAppId: ty.SystemInfo.wxAppId,
        //     clientId: ty.SystemInfo.clientId,
        //     imei: 'null',
        //     uuid : local_uuid,
        //     width : 280,
        //     b64 : true,
        //     scene : '1,' + ty.UserInfo.userId
        // };

        var val = this.txtFTID.string;
        var parsArr = val.split("|");

        var pars = {
            appId: ty.SystemInfo.appId,
            wxAppId: ty.SystemInfo.wxAppId,
            clientId: ty.SystemInfo.clientId,
            imei: 'null',
            uuid : local_uuid,
            width : parseInt(parsArr[0]),
            b64 : 'true',
            path : parsArr[1]
        };

        var serPath = sdkPath + 'open/v6/user/Getwxacode';

        hall.LOGD(null, 'qrcode,params:' + JSON.stringify(pars));
        hall.LOGD(null, 'qrcode,serverPath:' + serPath);


        var that = this;
        wx.request({
            // url: sdkPath + 'open/v6/user/Getwxacodeunlimit',
            url: serPath,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: pars,
            method:'POST',
            success: function(params) {
                hall.LOGD(null, 'qrcode success, params:' + JSON.stringify(params));
                // var imgPath = params.data.result.path;
                var b64Str =  params.data.result.img;
                var fs = wx.getFileSystemManager();
                var filePath = wx.env.USER_DATA_PATH + '/qr.png';
                // var filePath =  'res/raw-assets/2.aac';
                fs.writeFileSync(filePath ,b64Str , 'base64');

                cc.loader.load({url: filePath, type: 'png'}, function (err, texture) {
                    // hall.LOGD(null, "请求图片请求图片请求图片请求图片请求图片请求图片");
                    if (!err) {
                        that.qrSprite.spriteFrame =  new cc.SpriteFrame(texture);
                    }
                    else {
                        //加载失败
                    }
                });
            },
            fail: function(params) {

            },
            complete: function(params) {

            }
        });
    }
});