(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/window/ddz_notifyWindow.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '211dccLl9VPKYCag+A6LQ+q', 'ddz_notifyWindow', __filename);
// Script/ComponentScript/window/ddz_notifyWindow.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {

        tableView: {
            default: null,
            type: cc.Node
        },
        backBg: {
            default: null,
            type: cc.Button
        },
        titleLabe: {
            default: null,
            type: cc.Label
        },
        coloseButton: {
            default: null,
            type: cc.Button
        },

        contentSpr: {
            default: null,
            type: cc.Node
        },
        contentLabel: {
            default: null,
            type: cc.Label
        },
        shade: {
            default: null,
            type: cc.Node
        },
        initialLabel: {
            default: null,
            type: cc.Label
        },
        signLabel: {
            default: null,
            type: cc.Label
        },
        infoMap: null,
        type: "",

        rewardBg: {
            default: null,
            type: cc.Node
        },

        diamondNode: {
            default: null,
            type: cc.Node
        },

        diamondLabel: {
            default: null,
            type: cc.Label
        },

        chipNode: {
            default: null,
            type: cc.Node
        },

        chipLabel: {
            default: null,
            type: cc.Label
        },

        jipaiqiNode: {
            default: null,
            type: cc.Node
        },

        jipaiqiLabel: {
            default: null,
            type: cc.Label
        },

        getRewardBtn: {
            default: null,
            type: cc.Button
        }

    },

    onLoad: function onLoad() {
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('windowShowAniWithBg');
        this.isAction = true;
        anim1.play();
        var that = this;
        anim1.on('finished', function () {
            that.isAction = false;
        }, this);
        this.backBg.node.active = true;
        var size = cc.director.getWinSize();
        this.backBg.node.setContentSize(size);
        this.shade.setContentSize(size);

        if (hall.AdManagerTYWX && hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").hideAdNode();
        }

        // if (hall.sxAdManager) {
        //     hall.sxAdManager.hide();
        // }
    },

    setListType: function setListType() {
        this.setOrigData();
        this.updateWind(true);
        this.setTitleLabe("公告");
    },
    setDetailTypeWithInfoMap: function setDetailTypeWithInfoMap(infoMap, type) {
        this.infoMap = infoMap;
        this.type = type;
        this.updateWind(false);
        this.shade.active = type == "auto";
        this.setContent(infoMap.content, infoMap.sign);
        this.setReward(infoMap.attachment);
        this.msgid = infoMap.msgid;
        this.versions = infoMap.versions;
        this.setTitleLabe(infoMap.title);
    },

    setOrigData: function setOrigData() {
        var infoList = ddz.gameModel.notifyInfo.info;
        ddz.LOGD("", "file = [ddz_notifyWindow] fun = [setOrigData] notifyInfo = " + JSON.stringify(ddz.gameModel.notifyInfo));
        var window = this.tableView.getComponent('ddz_tableView');
        var messageInfo = ddz.gameModel.notifyMailMessage;
        var allInfo = infoList.concat(messageInfo);
        // window.setDataArray(ddz.gameModel.notifyInfo.info);

        if (allInfo && allInfo.length > 0) {
            for (var i = 0; i < allInfo.length; i++) {

                if (allInfo[i] && allInfo[i].timer && allInfo[i].timer != "") {
                    var _timer_2 = allInfo[i].timer;
                    if (allInfo[i].timer.indexOf(" ") > 0) {
                        _timer_2 = allInfo[i].timer.slice(0, allInfo[i].timer.indexOf(" "));
                        allInfo[i].timeArr = allInfo[i].timer.slice(allInfo[i].timer.indexOf(" ") + 1).split(":"); //时间
                        // allInfo[i].timeArr = for
                    }
                    allInfo[i].timerArr = _timer_2.split("-"); //日期
                    allInfo[i].dayTime = "";
                    for (var j = 0; j < allInfo[i].timerArr.length; j++) {
                        allInfo[i].dayTime = allInfo[i].dayTime + allInfo[i].timerArr[j] + "";
                    }
                    if (allInfo[i].timeArr && allInfo[i].timeArr.length > 0) {
                        allInfo[i].seqTime = "";
                        for (var j = 0; j < allInfo[i].timeArr.length; j++) {
                            allInfo[i].seqTime = allInfo[i].seqTime + allInfo[i].timeArr[j] + "";
                        }
                    }
                }
            }
        }

        var sortFunc = function sortFunc(n1, n2) {
            var info1 = n1.dayTime;
            var info2 = n2.dayTime;

            if (info1 < info2) {
                return 1;
            } else {
                if (!n1.seqTime) {
                    return 1;
                } else if (!n2.seqTime) {
                    return 1;
                } else {
                    return n2.seqTime - n1.seqTime;
                }
            }
        };

        // var sortFunc = function(n1, n2) {
        //     var info1 = n1.timerArr;
        //     var info2 = n2.timerArr;
        //
        //     if (info1.length != 3){
        //         ddz.LOGD("","  info1.length != 3  ");
        //         return -1
        //     }else if (info2.length != 3){
        //         ddz.LOGD("","  info2.length != 3  ");
        //         return -1
        //     }
        //     else if (info1[0] < info2[0]){
        //         return -1;
        //     }
        //     else if (info1[1] < info2[1]){
        //         return -1
        //     }
        //     else if (info1[2] < info2[2]){
        //         return -1
        //     }
        //     else {
        //         // return 1
        //         if (n1.timeArr && n1.timeArr.length == 3){
        //             if (n1.timeArr[0] < n2.timeArr[0]){
        //                 return -1;
        //             }
        //             else if (n1.timeArr[1] < n2.timeArr[1]){
        //                 return -1
        //             }
        //             else if (n1.timeArr[2] < n2.timeArr[2]){
        //                 return -1
        //             }else {
        //                 return 1
        //             }
        //         }else {
        //             return 1
        //         }
        //     }
        // };
        allInfo.sort(sortFunc);

        window.setDataArray(allInfo);
        if (infoList && infoList.length && infoList.length > 0) {
            this.setShowInitialLabel(false);
        } else {
            this.setShowInitialLabel(true);
        }
    },

    updateWind: function updateWind(isScroll) {
        this.tableView.active = isScroll;
        this.contentSpr.active = !isScroll;
        this.shade.active = isScroll;
    },

    setShowInitialLabel: function setShowInitialLabel(isVal) {
        this.initialLabel.node.active = isVal;
    },

    //设置奖励 显示icon
    setReward: function setReward(attachment) {
        if (attachment && !hall.GlobalFuncs.isEmptyObject(attachment)) {
            if (attachment.assets && attachment.assets.length > 0) {
                this.rewardBg.active = true;
                this.diamondNode.active = false;
                this.chipNode.active = false;
                this.jipaiqiNode.active = false;
                for (var i = 0; i < attachment.assets.length; i++) {
                    if (attachment.assets[i].itemId == "item:1311") {
                        this.diamondNode.active = true;
                        this.diamondLabel.string = attachment.assets[i].count;
                    } else if (attachment.assets[i].itemId == "user:chip") {
                        this.chipNode.active = true;
                        this.chipLabel.string = attachment.assets[i].count;
                    } else if (attachment.assets[i].itemId == "item:1363") {
                        this.jipaiqiNode.active = true;
                        this.jipaiqiLabel.string = attachment.assets[i].count;
                    }
                }
            } else {
                this.rewardBg.active = false;
            }
        } else {
            this.rewardBg.active = false;
        }
    },

    onClickGetReward: function onClickGetReward() {
        if (this.msgid) {
            hall.MsgFactory.getMessageReward(this.msgid);
            ddz.gameModel.messageRewardTitle = this.versions;
            this.getRewardBtn.interactable = false;
        }
    },

    setContent: function setContent(str, singStr) {
        var str = str || "";
        var index = str.indexOf("fuhao");
        if (index == -1) {
            this.contentLabel.string = str;
        } else {
            var _str = str.slice(index + 5);
            hall.LOGW("", "file = [ddz_notifyWindow] fun = [setContent] _str = " + _str);
            var index_2 = _str.indexOf("#");
            if (index_2 >= 0) {
                var info = _str.slice(index_2 + 1);
                hall.LOGW("", "file = [ddz_notifyWindow] fun = [setContent] info = " + info);
                this.contentLabel.string = info;
            } else {
                this.contentLabel.string = _str;
                hall.LOGW("", "file = [ddz_notifyWindow] fun = [setContent] 123 = ");
            }
        }

        // this.contentLabel.string = str || "";
        this.signLabel.string = singStr || "";
    },

    setTitleLabe: function setTitleLabe(str) {
        this.titleLabe.string = str;
    },

    playEndAnimation: function playEndAnimation() {
        // if(this.infoMap && this.type == 'auto'){
        //     var animation = this.getComponent(cc.Animation);
        //     var anim1 = animation.getAnimationState('windowCloseAniTop');
        //     anim1.play();
        //     var that = this;
        //     anim1.on('finished', function(){
        //         that.closeWindow();
        //     },this);
        // }else {
        //     this.closeWindow();
        // }

        this.closeWindow();
    },

    closeWindow: function closeWindow() {
        this.backBg.node.active = false;
        this.isAction = false;
        if (this.infoMap) {
            var indexStr = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify([]));
            var indexList = JSON.parse(indexStr);
            if (indexList.indexOf(this.infoMap.index) == -1) {
                if (this.infoMap.autoShow) {
                    ddz.gameModel.notifyInfo.autoShowCount--;
                    ty.NotificationCenter.trigger(ddz.EventType.UPDATE_GIFTBAG_COUNT);
                }
                this.infoMap.readed = 1;
                ddz.gameModel.notifyInfo.unReadCount--;
                indexList.push(this.infoMap.index);
                hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify(indexList));
                ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COMMON_CONFIG, this.infoMap.index);
            }
        }
        this.node.destroy();
    },

    onClose: function onClose(event) {
        if (this.isAction) {
            return;
        }
        this.isAction = true;
        this.playEndAnimation();
    },
    onDestroy: function onDestroy() {
        if (hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode")) {
            hall.AdManagerTYWX.getAdNodeByTag("myFirstAdNode").showAdNode();
        }
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
        //# sourceMappingURL=ddz_notifyWindow.js.map
        