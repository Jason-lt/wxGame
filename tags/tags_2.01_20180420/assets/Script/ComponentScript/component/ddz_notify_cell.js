
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

        noticeWindow : {
            default : null,
            type : cc.Prefab
        },
        resultMap : {},
        
    },
    addDataWithObject : function (objc) {
        this.setDetailInformation(objc);
    },
    setDetailInformation:function (resultMap) {
        this.detailLabel.string = resultMap.versions;
        this.timerLabel.string = resultMap.timer;
        // this.content = resultMap.content;

        this.resultMap = resultMap;
        var indexStr = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify([]));

        var indexList = JSON.parse(indexStr);
        // 缓存内容超过 60 条后清空通告本地缓存,删除最先30条缓存数据
        if (indexList.length > 60){
            indexList.splice(0,indexList.length - 30);
            hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify(indexList));
        }
        if (indexList.indexOf(this.resultMap.index) == -1) {
            this.setIsRead(false);
        }else {
            this.setIsRead(true);
        }
    },

    setIsRead:function(isRead){
        this.newNotify.active = !isRead;
        this.readNotify.active = isRead;
    },

    onClickBgBtn:function(){
        var nofityW = cc.instantiate(this.noticeWindow);
        ddz.GlobalFuncs.setToCenter(nofityW);
        cc.director.getScene().addChild(nofityW);
        var window = nofityW.getComponent('ddz_notifyWindow');
        // window.parentScene = this;
        window.updateWind(false);
        window.setContent(this.resultMap.content,this.resultMap.sign);
        window.setTitleLabe(this.resultMap.title);
        var indexStr = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify([]));
        var indexList = JSON.parse(indexStr);
        if (indexList.indexOf(this.resultMap.index) == -1) {
            indexList.push(this.resultMap.index);
            hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify(indexList));

            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_NOTIFY_COUNT);

            this.setIsRead(true);
        }

    },
});