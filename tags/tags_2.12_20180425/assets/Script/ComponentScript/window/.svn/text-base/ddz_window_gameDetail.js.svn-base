/**
 * 战绩
 */
cc.Class({
    extends: cc.Component,
    ctor : function () {
        this._TAG = "ddz_window_gameDetail";

    },

    properties: {

        bgBtn: {
            default : null,
            type : cc.Button
        },

        closeBtn : {
            default : null,
            type : cc.Button
        },

        whileBottom:cc.Node,

        player_1 : cc.Node,
        player_2 : cc.Node,
        player_3 : cc.Node,

        scrollView : {
            default : null,
            type : cc.ScrollView
        },

        infoItem:cc.Prefab,

        contentWidth:600,
        itemHeight : 80,

        noRecordTips:cc.Label,

        btnList:cc.Node,

        loadingSpr:cc.Node,

        initContentY:180,
    },

    onLoad :function() {
        ddz.LOGD("", "file = [ddz_window_gameDetail] fun = [onLoad] ");
        this.bgBtn.node.active = true;
        this.closeBtn.node.active = true;
        this.content = this.scrollView.content;
        this.bgBtn.node.on("click",this.closeGameDetail,this);
        this.closeBtn.node.on("click",this.closeGameDetail,this);
    },


    setParentScene:function(parentScene){
        this.tableScene = parentScene;
        this.isActionState = true;
    },

    createDetail:function(parentScene){
        this.isActionState = false;
        this.loadingSpr.active = false;
        this.updateAcatar();

        this.updateInfo();

        var isOver = ddz.detailsModel.getIsOver();
        this.isDuijuOver(isOver);
    },
    
    // 对局流水 分享战绩
    topBtnCallFunc:function(){
        ddz.LOGD("", "file = [ddz_window_gameDetail] fun = [topBtnCallFunc] ");
        ddz.Share.shareResults();
    },
    // 对局流水 返回首页
    bottomBtnCallFunc:function(){
        ddz.LOGD("", "file = [ddz_window_gameDetail] fun = [bottomBtnCallFunc] ");
        ty.NotificationCenter.trigger(ddz.EventType.REMOVE_TABLE_ANI);
        hall.GlobalFuncs.gotoDdz();
    },

    updatePos: function(index) {  // 1,不存在分享按钮  2, 存在分享按钮
        if (index == 1) {
            this.whileBottom.y = 0;
            this.btnList.active = false;
        }else if (index == 2)
        {
            this.whileBottom.y = 118;
            this.btnList.active = true;
            this.closeBtn.node.active = false;

        }
    },
    //
    updateAcatar:function(){
        var myIndex = this.tableScene._mySeatIndex;
        var leftindex = ddz.GlobalFuncs.getPreIndex(myIndex);
        var rightindex = ddz.GlobalFuncs.GetNextIndex(myIndex);

        var com = this['player_1'].getComponent('ddz_avatar_window');
        this.setInfo(com,myIndex - 1);

        com = this['player_2'].getComponent('ddz_avatar_window');
        this.setInfo(com,rightindex - 1);

        com = this['player_3'].getComponent('ddz_avatar_window');
        this.setInfo(com,leftindex - 1);
    },

    setInfo:function(com,_seatId){
        var isWhoWin = ddz.detailsModel.getWhoWin();
        var nickNames = ddz.detailsModel.getNickNames();
        var avatars = ddz.detailsModel.getAvatars();
        var sumScore = ddz.detailsModel.getSumScore();

        if (avatars[_seatId] && nickNames[_seatId]) {
            var slice_name = hall.GlobalFuncs.SliceStringToLength(nickNames[_seatId], 8);
            com.setPlayerInfo(avatars[_seatId],slice_name);

        }else {
            var userInfo = new hall.HallUserInfo();
            if (this.tableScene && this.tableScene._mySeatinfo){
                var myIndex = this.tableScene._mySeatIndex;
                var leftindex = ddz.GlobalFuncs.getPreIndex(myIndex);
                var rightindex = ddz.GlobalFuncs.GetNextIndex(myIndex);
                switch (_seatId){
                    case myIndex-1:
                        userInfo = this.tableScene._mySeatinfo.model.user_info;
                        break;
                    case rightindex-1:
                        userInfo = this.tableScene._rightSeatinfo.model.user_info;
                        break;
                    case leftindex - 1:
                        userInfo = this.tableScene._leftSeatinfo.model.user_info;
                        break;
                }
                var slice_name = hall.GlobalFuncs.SliceStringToLength(userInfo.udataInfo.m_name, 8); //最多显示 8 个字符
                var url = userInfo.udataInfo.m_purl;
                com.setPlayerInfo(url,slice_name);
            }
        }

        com.setSumScore(sumScore[_seatId]);

        if (isWhoWin == _seatId){
            com.setFirstSpr(true);
        }
    },

    updateInfo: function(){
        var resultList = ddz.detailsModel.resuslts;
        if (resultList.length <= 0) {
            this.noRecordTips.node.active = true;
            return;
        }
        var myIndex = this.tableScene._mySeatIndex;
        var totalRound = ddz.detailsModel.getTotalRound();

        this.noRecordTips.node.active = false;
        this.scrollView.content.width = this.contentWidth;
        this.scrollView.content.height = totalRound * this.itemHeight;
        if (resultList.length > 0) {
            for(var i = 0; i < totalRound; i++ ){
                var item = cc.instantiate(this.infoItem);
                var com = item.getComponent('ddz_gameDetail_cell');
                com.updateinfo(i + 1,myIndex,resultList[i]);
                this.content.addChild(item);
                item.y = - i * this.itemHeight - (this.itemHeight / 2);
            }
        }
        if(resultList.length >= 6){
            this.content.y = (resultList.length - 6) * this.itemHeight + this.initContentY;
        }
    },
    
    isDuijuOver:function(isGameOver){
        if (isGameOver){
            this.updatePos(2);
        }else {
            this.updatePos(1);
        }
    },
    //
    closeGameDetail:function(){
        ddz.LOGD("", "file = [ddz_window_gameDetail] fun = [closeGameDetail] ");
        // this.bgBtn.node.active = false;
        // this.btnList.active = false;
        if (this.isActionState) {
            return
        }

        var isOver = ddz.detailsModel.getIsOver();
        if (!isOver) {
            this.isActionState = true;
            var animation = this.getComponent(cc.Animation);
            var anim1 = animation.getAnimationState(animation.getClips()[1].name);
            anim1.once('finished', function(){
                this.isActionState = false;
                this.node.destroy();
            },this);
            anim1.play();
        }
    },


});