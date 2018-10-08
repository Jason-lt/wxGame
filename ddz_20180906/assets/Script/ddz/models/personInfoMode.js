// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

hall.PersonInfo = cc.Class({
    //数据格式
    // "userInfo":{
    //     "micro_signal": ",
    //     "isVisible": 0,
    //     "signature":",
    //     "constellation": ",
    //     "province": ",
    //     "district": ",
    //     "sex": 0
    // }
    micro_signal: "",   //微信号
    s_isVisible: false,
    signature: "",
    constellation: "未设置", //星座
    province: "未设置",     //省份
    district: "未设置",   //区
    sex: "未设置",   //性别

    getMicroSignal: function () {
        return this.micro_signal;
    },

    getSignalIsVisible:function () {
        return this.s_isVisible;
    },

    getSignature: function () {
        return this.signature;
    },

    getConstellation: function () {
        if (this.constellation == ""){
            this.constellation = "未设置"
        }
        return this.constellation;
    },

    getDistrict: function(){
        if (this.district == "") {
            this.district = "未设置";
        }
        return this.district;
    },

    getProvince: function(){
        if (this.province == "") {
            this.province = "未设置";
        }
        return this.province;
    },

    getSex: function(){
        return this.sex;
    },

    getConsttellationConfig:function(){
        return this.constellationConfig;
    },

    getCityConfig:function(){
        return this.cityConfig;
    },

    parseUserInfo: function (userInfo) {
        hall.LOGW(null, 'file = [personInfoMode] fun = [parseTableInfo]  userInfo =  ' + JSON.stringify(userInfo));
        this.micro_signal = userInfo.micro_signal;
        this.s_isVisible = userInfo.isVisible;
        this.signature = userInfo.signature;
        this.constellation = userInfo.constellation;;
        this.district = userInfo.district;
        this.province = userInfo.province;
        this.sex = userInfo.sex;
    },

    cleanup: function () {
        this.micro_signal = "";
        this.s_isVisible = false;
        this.signature = "";
        this.constellation = "未设置";
        this.district = "未设置";
        this.province = "未设置";
        this.sex = "未设置";
    },
});