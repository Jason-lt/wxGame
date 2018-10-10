(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/hall/models/HallUserInfo.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6d5942BleZHfb2hDGcDAoqB', 'HallUserInfo', __filename);
// Script/hall/models/HallUserInfo.js

'use strict';

//  Create by zhanghaibin
//  玩家信息

require('UserInfoUData');

hall.HallUserInfo = cc.Class({
    ctor: function ctor() {
        this.udataInfo = new hall.UserInfoUData();
    },

    // 解析UserInfo
    parseUserInfo: function parseUserInfo(json) {
        if (json) {
            var result = json['result'];
            this.udataInfo.parse(result['udata']);
        }
    },

    // 解析BagInfo背包信息
    parseBagInfo: function parseBagInfo(json) {
        if (json) {
            var result = json['result'];
            var bagList = result["normal_list"];

            if (!bagList || typeof bagList == "undefined") {
                return;
            }

            this.udataInfo.infiniteBulletCount = 0;
            this.udataInfo.laserAimingCount = 0;
            this.udataInfo.diamondCount = 0;
            this.udataInfo.grenadeCount = 0;

            for (var i = 0; i < bagList.length; i++) {
                var bagInfo = bagList[i];
                var bagID = bagInfo["id"];
                // 无限子弹
                if (bagID == 1371) {
                    this.udataInfo.infiniteBulletInfo = bagInfo;
                    this.udataInfo.infiniteBulletCount = bagInfo["num"];
                } else if (bagID == 1372) {
                    // 激光瞄准器
                    this.udataInfo.laserAimingCount = bagInfo["num"];
                } else if (bagID == 1373) {
                    // 钻石
                    this.udataInfo.diamondCount = bagInfo["num"];
                } else if (bagID == 1390) {
                    // 钻石
                    this.udataInfo.grenadeCount = bagInfo["num"];
                }
            }
            ty.NotificationCenter.trigger(double.EventType.UPDATE_INFINITEBULLET_NUMBER);
            ty.NotificationCenter.trigger(double.EventType.UPDATE_LASERAIMING_NUMBER);
            ty.NotificationCenter.trigger(double.EventType.UPDATE_DIAMOND_NUMBER);
            ty.NotificationCenter.trigger(double.EventType.UPDATE_GRENADE_NUMBER);
            // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_BAG_INFO);
        }
    },

    //按照时间从最近的到最晚的排序
    _sortByTime: function _sortByTime(o1, o2) {
        return o2['medal_getmedaltime'] - o1['medal_getmedaltime'];
    },

    clean: function clean() {
        this.udataInfo.m_vip = 0;
        this.udataInfo.m_sex = 0;
        this.udataInfo.m_name = "";
        this.udataInfo.m_purl = "";
        this.udataInfo.m_isBeauty = false;
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
        //# sourceMappingURL=HallUserInfo.js.map
        