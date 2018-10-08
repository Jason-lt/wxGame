(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/ddz_cell_matchlist.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'eb51f4UnLZMTpaRNc8tkEqq', 'ddz_cell_matchlist', __filename);
// Script/ComponentScript/component/ddz_cell_matchlist.js

"use strict";

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
        matchName: {
            default: null,
            type: cc.RichText
        },
        beSavedSprite: {
            default: null,
            type: cc.Sprite
        },
        leftRichText: {
            default: null,
            type: cc.RichText
        },
        rightRichText: {
            default: null,
            type: cc.RichText
        },
        selectKuang: {
            default: null,
            type: cc.Node
        },
        clicked: false
    },

    onLoad: function onLoad() {
        ty.NotificationCenter.listen(ddz.EventType.RESET_MATCH_CLICK_STATE, this.onResetClickState, this);
    },

    onResetClickState: function onResetClickState() {
        this.clicked = false;
    },

    addDataWithObject: function addDataWithObject(objc) {
        this.matchData = objc;
        this.setDetailInformation(this.matchData);
    },

    setDetailInformation: function setDetailInformation(resultMap) {
        /*
         this.fees = null;
         this.playMode = '0';
         this.matchId = '0';
         this.roomId = '0';
         this.matchName = '0';
         this.taskDesc = '0';
         this.onlineCount = 0;
         this.matchType = '0';
         this.record = null;
         */
        //this.matchName.string = resultMap.matchName;
        this.setMatchName(resultMap.matchName);

        this.setRightRichText("前45名获奖");
        var parsArr = resultMap.taskDesc.split("||");
        if (parsArr[1]) {
            this.setRightRichText(parsArr[1]);
        }
        this.roomID = resultMap.roomId;
        this.beSavedSprite.node.active = resultMap.isRecordExist();
        var onLineNum = resultMap.onlineCount;
        hall.LOGW("", "file = [ddz_cell_roomlist] fun = [setDetailInformation] onLineNum = " + onLineNum);
        if (onLineNum != null) {
            if (onLineNum < 0) {
                this.leftRichText.node.active = false;
            } else {
                this.leftRichText.node.active = true;
                this.setLeftRichText(onLineNum);
            }
        }
    },

    setMatchName: function setMatchName(name) {
        this.matchName.string = "<color=#1A6951>" + name + "</c>";
    },

    setLeftRichText: function setLeftRichText(num) {
        this.leftRichText.string = "<img src='ddz_roomlist_smallPerson' /><color=#1A6951> " + num + "</c>";
    },

    setRightRichText: function setRightRichText(str) {
        this.rightRichText.string = "<color=#1A6951> " + str + "</c>";
    },

    onClickCell: function onClickCell() {
        ddz.LOGD(null, "file = [ddz_cell_roomlist] fun = [onclickCell]");
        if (this.clicked) return;
        this.clicked = true;
        ty.NotificationCenter.trigger(ddz.EventType.CLICK_MATCHING_ITEM, this.matchData.matchId);
        hall.ME.matchInfo.setCurrentMatchId(this.matchData.matchId);
        ddz.matchModel.getMatchDes(this.roomID, this.matchData.matchId);
        //var preFabPath = "prefabs/ddz_window_match_rewards";
        //var  comName = "ddz_window_match_rewards";
        //hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
        //    //var window = preFabNode.getComponent(comName);
        //    //window.parentScene = that;
        //    //var tips = desc;
        //    //window.setTitleContentAndButtons("提示",tips, testArray);
        //});
    },
    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
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
        //# sourceMappingURL=ddz_cell_matchlist.js.map
        