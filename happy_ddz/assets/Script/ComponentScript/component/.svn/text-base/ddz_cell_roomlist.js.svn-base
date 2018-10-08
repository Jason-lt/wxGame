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

        leftLabel:cc.Label,

        rightLabel:cc.Label,
        
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

        bgSprite:cc.Sprite,
        bgSpriteFrame:[cc.SpriteFrame],

        leftSprite:cc.Sprite,
        rightSprite:cc.Sprite,

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
        if (resultMap.name.indexOf("癞子") >= 0){
            this.isLaizi = true;
            this.bgSprite.spriteFrame = this.bgSpriteFrame[1];
            this.leftSprite.spriteFrame = this.bgSpriteFrame[5];
            this.rightSprite.spriteFrame = this.bgSpriteFrame[4];
        }else {
            this.isLaizi = false;
            this.bgSprite.spriteFrame = this.bgSpriteFrame[0];
            this.leftSprite.spriteFrame = this.bgSpriteFrame[3];
            this.rightSprite.spriteFrame = this.bgSpriteFrame[2];
        }
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
        if (onLineNum != null) {
            if (onLineNum < 0) {
                this.leftLabel.node.active = false;
            } else {
                this.leftLabel.node.active = true;
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
        // this.leftRichText.string = "<img src='ddz_roomlist_smallPerson' /><color=#1A6951> " + num + "</c>";
        this.leftLabel.string = num;
        if (this.isLaizi) {
            this.leftLabel.node.setColor(cc.color(255 ,229 ,162));
        }else {
            this.leftLabel.node.setColor(cc.color(167 ,227 ,255));
        }

    },

    setRightRichText:function(str) {
        // this.rightRichText.string = "<img src='ddz_coin_green' height=33.6 width=33.6/><color=#1A6951> " + str + "</c>";
        this.rightLabel.string = str;
        if (this.isLaizi) {
            this.rightLabel.node.setColor(cc.color(255 ,229 ,162));
        }else {
            this.rightLabel.node.setColor(cc.color(167 ,227 ,255));
        }
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
