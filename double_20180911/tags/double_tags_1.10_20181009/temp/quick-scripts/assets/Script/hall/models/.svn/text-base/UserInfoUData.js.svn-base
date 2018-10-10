(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/models/UserInfoUData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '81dccKMQVlI173kc2UD1Iai', 'UserInfoUData', __filename);
// Script/hall/models/UserInfoUData.js

"use strict";

//  Create by Eava.wu
//  玩家信息
hall.UserInfoUData = cc.Class({

    ctor: function ctor() {

        this._TAG = "hall.UserInfoUData";
        this.m_name = ""; // 昵称
        this.m_vip = 0; // vip(等级)0-5，0为非vip.
        this.m_sex = 0; // 性别 male=0,female=1
        this.m_state = 0;
        this.m_purl = ""; // 头像链接(服务器定义为途游账号的头像url，所以客户端暂不用)
        this.m_isBeauty = false;
        this.m_chip = 0; // 统一后的金币
        this.infiniteBulletCount = 0; //无限子弹
        this.laserAimingCount = 0; //激光瞄准器
        this.diamondCount = 0; //复活卡
        this.grenadeCount = 0; //手榴弹
        hall.LOGD(this._TAG, "in ctor");
    },

    parse: function parse(json) {
        hall.LOGD(this._TAG, '=======udata begin========' + JSON.stringify(json));

        this.m_name = json['name'];
        this.m_vip = json['vip'];
        this.m_sex = json['sex'];
        this.m_state = json['state'];

        this.m_purl = json['purl'];
        this.m_isBeauty = json['isBeauty'];
        if (this.m_purl == "") {
            this.m_purl = "http://ddz.image.tuyoo.com/avatar/head_360_08.png";
        }
        hall.LOGD(this._TAG, 'UDATA purl is ' + this.m_purl);
        this.m_chip = json['chip']; // 合并后的金币
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=UserInfoUData.js.map
        