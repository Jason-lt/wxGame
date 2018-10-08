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

        tableView : {
            default : null,
            type : cc.Node
        },
        backBg : {
            default : null,
            type  : cc.Button
        },
        titleLabe : {
            default : null,
            type  : cc.Label
        },
        coloseButton : {
            default : null,
            type : cc.Button
        },

        contentSpr : {
            default : null,
            type : cc.Node
        },
        contentLabel : {
            default : null,
            type  : cc.Label
        },
        shade : {
            default : null,
            type : cc.Node
        },
        initialLabel : {
            default : null,
            type  : cc.Label
        },
        signLabel : {
            default : null,
            type  : cc.Label
        },
        infoMap : null,
        type : ""
    },

    onLoad : function () {
        var animation = this.getComponent(cc.Animation);
        var anim1 = animation.getAnimationState('windowShowAniWithBg');
        this.isAction = true;
        anim1.play();
        var that = this;
        anim1.on('finished', function(){
            that.isAction = false;
        },this);
        this.backBg.node.active = true;
        var size = cc.director.getWinSize();
        this.backBg.node.setContentSize(size);
        this.shade.setContentSize(size);
    },

    setListType : function () {
        this.setOrigData();
        this.updateWind(true);
        this.setTitleLabe("公告");
    },
    setDetailTypeWithInfoMap : function (infoMap,type) {
        this.infoMap = infoMap;
        this.type = type;
        this.updateWind(false);
        this.shade.active = type == "auto";
        this.setContent(infoMap.content,infoMap.sign);
        this.setTitleLabe(infoMap.title);
    },

    setOrigData : function () {
        var infoList = ddz.gameModel.notifyInfo.info;
        ddz.LOGD("","file = [ddz_notifyWindow] fun = [setOrigData] notifyInfo = " + JSON.stringify(ddz.gameModel.notifyInfo));
        var window = this.tableView.getComponent('ddz_tableView');
        var messageInfo = ddz.gameModel.notifyMailMessage;
        var allInfo = infoList.concat(messageInfo);
        // window.setDataArray(ddz.gameModel.notifyInfo.info);
        window.setDataArray(allInfo);
        if(infoList && infoList.length && infoList.length > 0){
            this.setShowInitialLabel(false);
        }else {
            this.setShowInitialLabel(true);
        }
    },

    updateWind:function(isScroll){
        this.tableView.active = isScroll;
        this.contentSpr.active = !isScroll;
        this.shade.active = isScroll;
    },

    setShowInitialLabel:function(isVal){
        this.initialLabel.node.active = isVal
    },

    setContent:function(str,singStr){
        var str = str  || "";
        var index = str.indexOf("fuhao");
        if (index == -1) {
            this.contentLabel.string = str;
        }else {
            var _str = str.slice(index + 5,-1);
            var index_2 = _str.indexOf("#");
            if (index_2 > 0) {
                var info = str.slice(index_2 + 1,-1);
                this.contentLabel.string = info;
            }else {
                this.contentLabel.string = _str;
            }
        }

        // this.contentLabel.string = str || "";
        this.signLabel.string = singStr || "";
    },

    setTitleLabe:function(str){
        this.titleLabe.string = str;
    },

    playEndAnimation : function () {
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

    closeWindow : function () {
        this.backBg.node.active = false;
        this.isAction = false;
        if(this.infoMap){
            var indexStr = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify([]));
            var indexList = JSON.parse(indexStr);
            if (indexList.indexOf(this.infoMap.index) == -1) {
                if(this.infoMap.autoShow){
                    ddz.gameModel.notifyInfo.autoShowCount --;
                    ty.NotificationCenter.trigger(ddz.EventType.UPDATE_GIFTBAG_COUNT);
                }
                this.infoMap.readed = 1;
                ddz.gameModel.notifyInfo.unReadCount --;
                indexList.push(this.infoMap.index);
                hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.UPDATE_NOTIFY_INFO, JSON.stringify(indexList));
                ty.NotificationCenter.trigger(ddz.EventType.UPDATE_COMMON_CONFIG,this.infoMap.index);
            }
        }
        this.node.destroy();
    },

    onClose:function (event) {
        if (this.isAction){
            return
        }
        this.isAction = true;
        this.playEndAnimation();
    },
    onDestroy : function () {
    }
});
