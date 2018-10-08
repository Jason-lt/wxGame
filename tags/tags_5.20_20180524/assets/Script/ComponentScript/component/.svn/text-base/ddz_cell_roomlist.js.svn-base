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
        roomName : {
            default : null,
            type : cc.Label
        },
        
        leftRichText : {
            default : null,
            type : cc.RichText
        },
        rightRichText : {
            default : null,
            type : cc.RichText
        },
        selectKuang : {
            default : null,
            type : cc.Node
        },
        redBar : {
            default : null,
            type : cc.Node
        },
        awardText : {
            default : null,
            type : cc.RichText
        },
    },

    onLoad:function () {
        this.isSelect(false);
        this.cellIndex = -1;
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_ROOMLIST_KUANG,this.setSelect,this);
        ty.NotificationCenter.listen(ddz.EventType.SAVE_MATCH_SUCCESS, this.onSaveMatch, this);
    },

    addDataWithObject : function (objc) {
        this.setDetailInformation(objc);
    },

    setDetailInformation:function (resultMap) {
        ddz.LOGD("","file = [ddz_cell_roomlist] fun = [setDetailInformation] resultMap = " + JSON.stringify(resultMap));
        this.roomName.string = resultMap.name;
        // this.baseScore.string = resultMap.entry;
        this.setRightRichText(resultMap.condition);
        this.roomID = resultMap.id;
        if (resultMap.mixId){
            this.mixId = resultMap.mixId;
        }
        this.play_mode = resultMap.play_mode;
        
        var onLineNum = hall.gameWorld.getRoomOnlineInfo(this.roomID);
        if (resultMap.userCount) {
            onLineNum = resultMap.userCount;
        }
        // else {
        //     if (resultMap.name == "新手场") {
        //         onLineNum = onLineNum * 8 + Math.ceil(Math.random()*30) + 50;
        //     }else if (resultMap.name == "初级场") {
        //         onLineNum = onLineNum * 6 + Math.ceil(Math.random()*20) + 40;
        //     }
        // }
        if (onLineNum != null) {
            if (onLineNum < 0) {
                this.leftRichText.node.active = false;
            } else {
                this.leftRichText.node.active = true;
                this.setLeftRichText(onLineNum);
            }
        }

        if (resultMap.gameDes && resultMap.gameDes != "") {
            this.setAwardText(true,resultMap.gameDes);
        }else {
            this.setAwardText(false);
        }
    },

    onSaveMatch:function () {
        if (this.cellIndex == this.index) {
            var _gameId = ty.SystemInfo.gameId || ty.SystemInfo.hallId;
            hall.MsgFactory.getQuickStart(ty.UserInfo.userId, _gameId, this.roomID, hall.staticSystemInfo.version, null, null, null,null,this.mixId,this.play_mode);
            this.cellIndex = -1;
        }
    },

    setAwardText:function (_isAward,_des) {
        this.redBar.active = _isAward;
        if (_des) {
            this.awardText.string = "<color=#ffffff> " + _des + "</c>";
        }
    },

    setLeftRichText:function (num) {
        this.leftRichText.string = "<img src='ddz_roomlist_smallPerson' /><color=#1A6951> " + num + "</c>";
    },

    setRightRichText:function(str) {
        this.rightRichText.string = "<img src='ddz_coin_green' height=33.6 width=33.6/><color=#1A6951> " + str + "</c>";
    },

    setSelect:function (_index) {
        this.isSelect(false);
        if (this.index == _index) {
            this.isSelect(true);
        }
    },

    // 选中框
    isSelect:function (_isSelect) {
        this.selectKuang.active = _isSelect;
    },

    onClickCell:function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["roomListClick",this.roomName.string]);
        if (ddz.matchModel.getCurWaitInfo()){
            this.cellIndex = this.index;
            ddz.LOGD(null,"file = [ddz_cell_roomlist] fun = [onclickCell] 保存进度");
            ddz.MsgFactory.saveMatch();
        } else {
            ddz.LOGD(null,"file = [ddz_cell_roomlist] fun = [onclickCell] 快速开始");
            this.cellIndex = -1;
            var _gameId = ty.SystemInfo.gameId || ty.SystemInfo.hallId;
            hall.MsgFactory.getQuickStart(ty.UserInfo.userId, _gameId, this.roomID, hall.staticSystemInfo.version, null, null, null,null,this.mixId,this.play_mode);
        }
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    },

});
