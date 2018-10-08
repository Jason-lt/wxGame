
/*
    通知公告cell
 */


cc.Class({
    extends: cc.Component,

    properties: {
        detailLabel : {
            default : null,
            type : cc.Label
        },

        timerLabel : {
            default : null,
            type : cc.Label
        },
        bgBtn : {
            default : null,
            type : cc.Button
        },

        newNotify:cc.Node,
        readNotify:cc.Node,

        // noticeWindow : {
        //     default : null,
        //     type : cc.Prefab
        // },
        resultMap : {}
        
    },
    addDataWithObject : function (objc) {
        this.setDetailInformation(objc);
    },
    setDetailInformation:function (resultMap) {
        this.detailLabel.string = resultMap.versions;
        this.timerLabel.string = resultMap.timer;
        // this.content = resultMap.content;


        this.resultMap = resultMap;
        // var indexStr = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify([]));
        //
        // var indexList = JSON.parse(indexStr);
        // // 缓存内容超过 60 条后清空通告本地缓存,删除最先30条缓存数据
        // if (indexList.length > 60){
        //     indexList.splice(0,indexList.length - 30);
        //     hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify(indexList));
        // }
        // this.setIsRead(!(indexList.indexOf(this.resultMap.index) == -1));

        this.setIsRead(resultMap.readed);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_COMMON_CONFIG,this.changeState,this);
    },
    changeState : function (readIndex) {
        if(this.resultMap.index == readIndex){
            this.setIsRead(true);
        }
    },
    setIsRead:function(isRead){
        this.newNotify.active = !isRead;
        this.readNotify.active = isRead;
    },

    onClickBgBtn:function(){
        var that = this;
        hall.GlobalFuncs.showPopWinByPreFab('prefabs/notifyWindow', function (preFabNode) {
            var window = preFabNode.getComponent('ddz_notifyWindow');
            window.setDetailTypeWithInfoMap(that.resultMap,"cell");
        });

        if (this.resultMap.msgid) {
            // hall.MsgFactory.getMessageReward(this.resultMap.msgid);
        }

        var indexStr = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify([]));
        var indexList = JSON.parse(indexStr);
        if (indexList.indexOf(this.resultMap.index) == -1) {
            this.resultMap.readed = 1;
            ddz.gameModel.notifyInfo.unReadCount --;
            indexList.push(this.resultMap.index);
            hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify(indexList));
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COMMON_CONFIG);
            this.setIsRead(true);
        }


    },
    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    }
});