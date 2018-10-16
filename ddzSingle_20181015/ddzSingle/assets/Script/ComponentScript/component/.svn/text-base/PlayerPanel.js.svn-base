/**
 * 玩家面板
 */
cc.Class({
    extends: cc.Component,

    ctor:function () {
        this._TAG = "h5.playPlayerNode";
    },

    initWithPar:function (bLeft, bTop, playContrl, index) {
        this._bLeft = bLeft;
        this._bTop = bTop;
        this._playController = playContrl;
        this._userInfo = null;
        this._playedCards = [];
        this._leftTime = -1;
        this._index = index;
        this.reset();
    },

    properties: {
        avatar : cc.Node,
        lblMsg : cc.Label,
        lblNum : cc.Label,
        lblNumBg : cc.Sprite,
        aniJingDeng : cc.Node,
        lblTimer : cc.Label,
        cardNode : cc.Node,
        waitTimer : cc.Node,
        chatButton : {      // 互动表情按钮
            default : null,
            type : cc.Button
        }

    },

    onLoad: function() {
        ty.NotificationCenter.listen(ddz.EventType.SHOW_GAME_WIN_ANI, this.onShoGameWinAni, this);
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_TABLE_ANI, this.onRemoveAni, this);
        ty.NotificationCenter.listen(ddz.EventType.GAME_HIDE, this.onGameHide, this);

        this.chatButton.node.on("click" , this.onChatButton, this);
        this._cardBaseScale = 0.52;
        // this.hideAll();
    },

    onRemoveAni:function () {
        this.aniJingDeng.removeFromParent();
    },

    onGameHide:function () {
        // this.setClockVisible(false);
        // this.stopJingDengAni();
        // this.clearCards();
    },
    onChatButton: function() {
        ddz.LOGD(null, "onChatButton index = " + this._index);
        if (this._userInfo) {
            this._playController.clickChatButton(this._index);
        }
    },
    getAvatarCom : function () {
        return this.avatar.getComponent('Avatar');
    },

    getIsFriend:function () {
        return this._playController.tableInfo().getSceneType() == ddz.Enums.SceneType.FRIEND;
    },
    getIsGold:function () {
        return this._playcontroller.tableInfo().getSceneType() == ddz.Enums.SceneType.NORMAL;
    },

    onShoGameWinAni:function (dizhuWin) {
        var dizhuIndex = this._playController._tableState.normalInfo.m_dizhu;
        var myIndex = this.getMyIndex();

        var widx = 0;

        var aniName;
        if (dizhuWin){
            if (myIndex == dizhuIndex){
                aniName = "shengli";
            }
            else{
                aniName = "shibai";
                widx = 1;
            }
        }
        else{
            if (myIndex == dizhuIndex){
                aniName = "shibai";
                widx = 1;
            }
            else{
                aniName = "shengli";
            }
        }

    },

    hideAll: function () {
        this.avatar.active = false;
        this.setChatButtonActive(false);
        this.waitTimer.active = false;

        this.setLblMsg(" ");
        this.stopJingDengAni();

    },

    setChatButtonActive: function(isAvtive) {
        this.chatButton.node.active = isAvtive;
    },

    start: function() {

    },

    // update (dt) {},

    //恢复到没有玩家的状态
    reset: function(force) {

        this.hideAll();

        if (force || !this.getIsFriend()){
            this._userInfo = null;  //好友场,不清此数据
        }

        this._leftTime = -1;
        this.setLblNum("");
        this.lblNumBg.setVisible(false);
        this.stopJingDengAni();
        this.clearCards();
        if (force){
            if (this.getIsFriend()){
                //好友桌,需要把原来头像显示回来
                this.avatar.active = true;
                // var myAvatarM = this.avatar.getComponent("Avatar");
                // myAvatarM.hideDizhuHat();
                // this.setChatButtonActive(true);
            }
            this.getAvatarCom().resetAvatar();
            this.getAvatarCom().setPlayerName("");
        }
        else{
            if (this.getIsFriend()){
                //好友桌,需要把原来头像显示回来
                this.avatar.active = true;
                // var myAvatarM = this.avatar.getComponent("Avatar");
                // myAvatarM.hideDizhuHat();
                // this.setChatButtonActive(true);
            }
            else{
                this.getAvatarCom().resetAvatar();
                this.getAvatarCom().setPlayerName("");
            }
        }
    },

    //设置“准备”是否显示，和图片
    setPrepareVisible: function(bVisible) {
        this.setLblMsg(bVisible ? "已准备" : " ");
    },

    /**
     * 清空所有手牌
     */
    clearCards: function() {
        this.cardNode.scale = 0.52;
        //手牌回池
        var cardCom;
        while (this._playedCards.length > 0){
            cardCom = this._playedCards.pop();
            this._playController.returnCard(cardCom.node);
        }
    },

    getMyIndex:function () {
        var myIndex;
        if (this._bTop) {
            myIndex = ddz.GlobalFuncs.getTopIndex(this._playController._mySeatIndex);
        } else {
            if (this._bLeft){
                myIndex = ddz.GlobalFuncs.getPreIndex(this._playController._mySeatIndex);
            }
            else{
                myIndex = ddz.GlobalFuncs.GetNextIndex(this._playController._mySeatIndex);
            }
        }
        return myIndex;
    },
    
    /**
     * 转换动画形像
     * @param origin 好友桌
     */
    refreshAvatarForeFriend : function (origin) {
        this.initData();

        this.avatar.active = true;

        var dizhuIndex = this._playController._tableState.normalInfo.m_dizhu;
        var myIndex = this.getMyIndex();

        var that = this;
        var nextCallBack = function () {
            var isDiZhu = myIndex == dizhuIndex;
            if(isDiZhu){
                var to_pos =  that._playController.getEmoPos(myIndex);
                if(origin){
                    that._playController.showDizhuHatOrigin(to_pos);
                }else {
                    that._playController.showDizhuHat(to_pos);
                }
            }
        };
        requestAnimationFrame(nextCallBack);
        this.refreshCardsNum();

        // var isMale = this.getIsMale();
        // var myAvatarM = this.avatar.getComponent("Avatar");

        // else {
        //     myAvatarM.hideDizhuHat();
        // }

        //确定角色后,牌的数量也就确定了,这个时候,要刷新手牌数量

    },
    /**
     * 转换动画形像
     */
    refreshAvatarForeFriendOrigin : function () {
        this.avatar.active = true;
        var dizhuIndex = this._playController._tableState.normalInfo.m_dizhu;
        var that = this;
        var nextCallBack = function () {
            var myIndex = that.getMyIndex();
            var isDiZhu = myIndex == dizhuIndex;
            if(isDiZhu){
                var to_pos =  that._playController.getEmoPos(myIndex);
                that._playController.showDizhuHatOrigin(to_pos);
            }
        };
        requestAnimationFrame(nextCallBack);
    },

    initData:function () {
        if (this._userInfo){
            return;
        }
        if (this._bTop) {
            this._userInfo = this._playController._topSeatinfo.model.user_info;
        } else {
            this._userInfo = this._bLeft ? this._playController._leftSeatinfo.model.user_info : this._playController._rightSeatinfo.model.user_info;
        }
    },

    refreshWithUserInfo: function() {
        //调用此方法时可能刷新了user_info，需要去取出最新的

        this.hideAll();
        this.initData();

        if (!this._userInfo){
            //没有用户信息,就不再执行,因为有可能还没开桌,玩家就走了
            return;
        }

        this.avatar.active = true; //显示头像

        if (this.getIsFriend()){
            //好友桌,进来后,互动表情就可以点击
            // this.setChatButtonActive(true);
        }
        var slice_name = hall.GlobalFuncs.SliceStringToLength(this._userInfo.udataInfo.m_name, 10); //最多显示10个字符
        this.getAvatarCom().setPlayerName(slice_name);

        var url = this._userInfo.udataInfo.m_purl;
        if (url.length > 0) {
            this.getAvatarCom().setAvatarUrl(url);
        }
    },
    
    getUserInfo:function(){
        var data = {};
        data.url = this._userInfo.udataInfo.m_purl;
        
    },

    showJiaodz: function(call) {
        var name;
        var audioName = this.getIsMale() ? "man_" : "female_";
        var grab = this._playController._tableInfo.config.m_grab;
        if (grab == 1) {
            if (this._playController._mDizhuCalled) { //抢地主
                name = call > 0 ? "抢地主" : "不抢";
                audioName += call > 0 ? "rob_dizhu" : "not_rob";
            } else { //叫地主
                name = call > 0 ? "叫地主" : "不叫";
                audioName += call > 0 ? "call_dizhu" : "not_call";
            }
        } else {
            name = call > 0 ? call + "分" : "不叫";
            audioName += call > 0 ? call + "_point" : "not_call";
        }
        this.setLblMsg(name);
        ddz.LOGD(this._TAG, 'audioName=' + audioName);

        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3[audioName], false);
    },
    showJiaodzOnlyNumber: function(call) {
        var name;
        var grab = this._playController._tableInfo.config.m_grab;
        if (grab == 1) {
            //抢地主~~~
            // if (this._playController._mDizhuCalled) { //抢地主
            //     name = call > 0 ? "抢地主" : "不抢";
            // } else { //叫地主
            //     name = call > 0 ? "叫地主" : "不叫";
            // }
        } else {
            if(call == -1){
                return;
            }
            name = call > 0 ? call + "分" : "不叫";
        }
        this.setLblMsg(name);
    },

    showCards: function(cardNums, bDizhu) {
        if (cardNums.length > 0){
            //当手里还有牌时,明牌
            this._addCardsIntoContainer(cardNums, true, bDizhu);
        }
    },

    /**
     * 刷新剩余牌数
     * @param widthOutAudioEffect 是否在刷新剩余牌数的时候,不播放音效
     */
    refreshCardsNum: function(widthOutAudioEffect) {
        var seat_info;
        if (this._bTop) {
            seat_info = this._playController._topSeatinfo;
        } else {
            seat_info = this._bLeft ? this._playController._leftSeatinfo : this._playController._rightSeatinfo;
        }
        var leftNum = seat_info.model.m_card.length;
        this.changeShowLeftNum(leftNum);

        if (leftNum < 3 && !this.aniJingDeng.active){
            //显示警灯动画
            this.playJingDengAni();
        }

        if (!widthOutAudioEffect){
            var path;
            var sexStr = this.getIsMale() ? "man_" : "female_";
            if (leftNum == 2) {
                path = sexStr + "I_got_left_two_cards";
            } else if (leftNum == 1) {
                path = sexStr + "I_got_left_one_cards";
            }

            if (path){
                ddz.LOGD(null, 'playEffect=' + path);
                ddz.AudioHelper.playEffect(ddz.EffectPath_mp3[path], false);
            }
        }
    },

    changeShowLeftNum:function (leftNum) {
        this.setLblNum("" + leftNum);
        this.lblNumBg.setVisible(true);
    },

    playJingDengAni:function () {
        //显示警灯动画
        this.aniJingDeng.active = true;
        var animationCom = this.aniJingDeng.getComponent(cc.Animation);
        var ani = animationCom.getAnimationState('jingdeng_anim');
        ani.play();
    },

    stopJingDengAni:function () {
        this.aniJingDeng.active = false;
    },

    _addCardsIntoContainer: function(cardNums, bSort, bDizhu, withAni) { //bSort表明牌是否需要排序，出牌时不需要，展示牌时需要

        this.clearCards();

        var len = cardNums.length;
        var breakline = ddz.PLAYED_CARDS_MAXINLINE;
        // var cards = [];
        var card, cardCom;
        for (var i = 0; i < len; i++) {
            card = this._playController.createNewCard(cardNums[i]);
            cardCom = card.getComponent('Card');
            cardCom.showMask(false);
            this._playedCards.push(cardCom);
        }

        if (bSort) {
            this._playedCards.sort(ddz.GlobalFuncs.SortCardFunc);
        }

        var container = this.cardNode;


        var cardSize = ddz.CARD_BIG_SIZE;
        var splitWidth = 60;

        var px, py;
        //这两个变量是为了计算右边玩家的手牌坐标用的
        var startPosX = 0;
        if (!this._bLeft){
            //右侧玩家,上家,这个值是负值,需要计算
            startPosX = ((len < breakline ? len : breakline) - 1) * splitWidth + cardSize.width;
            startPosX += 20;
        }

        var canShowTag;
        for (var index = 0; index < len; index++) {
            cardCom = this._playedCards[index];
            card = cardCom.node;

            px = (index % breakline) * splitWidth - startPosX;
            py = -Math.floor(index/breakline) * 56;

            card.setPosition(px, py);
            card.parent = container;
            card.zIndex = index;

            canShowTag = ddz.GlobalFuncs.canShowTag(breakline, len, index);

            cardCom.showTag(canShowTag);
            cardCom.setDiZhuTag(bDizhu && canShowTag);
        }

        if (withAni){
            ddz.GlobalFuncs.showDropEffect(this._cardBaseScale, container);
        }
    },

    setLblMsg:function (val) {
        if (!cc.isValid(this.lblMsg)) return;
        if (val){
            this.lblMsg.node.active = true;
            this.lblMsg.string = val;
        }
        else{
            this.lblMsg.node.active = false;
        }
    },


    setLblNum:function (val) {
        if (!cc.isValid(this.lblNum)) return;
        if (val){
            this.lblNum.node.active = true;
            try{
                this.lblNum.string = val;
            }
            catch (e){
                hall.LOGE("setLblNum error:", val);
            }
        }
        else{
            this.lblNum.node.active = false;
        }
    },

    //设置clock的显示状态和时间
    setClockVisible: function(bVisible, time) {

        this.clearCards();
        this.setLblMsg(" ");
        if (bVisible){
            this.showTimer(time);
        }
        else{
            this.hideTimer();
        }
    },

    /**
     * 显示时钟
     * @param valTime 秒
     */
    showTimer:function (valTime) {
        if (!cc.isValid(this.lblTimer)) return;
        this._leftTime = valTime;

        this.waitTimer.active = true;
        this.lblTimer.string = this._leftTime ? this._leftTime +"" : " ";
        this.unscheduleAllCallbacks();

        this.schedule(function () {
            this._leftTime--;
            if (this._leftTime < 0){
                this.hideTimer();
                return;
            }else if (this._leftTime == 0){
                //好友桌倒计时到0,不隐藏
                if (this.getIsFriend()){
                    this.lblTimer.string = "0";
                    this.unscheduleAllCallbacks();
                    return;
                }
            }
            this.lblTimer.string = this._leftTime ? this._leftTime +"" : " ";
        }, 1, this);
    },

    /**
     * 隐藏时钟
     */
    hideTimer:function () {
        this.unscheduleAllCallbacks();
        this.waitTimer.active = false;
    },

    getIsMale:function () {
        //有问题,容错
        if(this._userInfo && this._userInfo.udataInfo ){
            return this._userInfo.udataInfo.m_sex == ddz.Enums.PlayerSexEnum.SEX_MALE;
        }
        return true;
    },

    /**
     * 出牌
     * @param cardNums 牌数组
     * @param bDizhu 是否为地主
     */
    playCards: function(cardNums, bDizhu) {
        ddz.LOGD(this._TAG, "playCards");
        var len = cardNums.length;
        if (len <= 0) {
            this.setLblMsg(ddz.MSG_TEXT_BUCHU);
            var filename = this.getIsMale() ? "man_no" : "female_no";
            ddz.LOGD(this._TAG, 'playEffect=' + filename);
            ddz.AudioHelper.playEffect(ddz.EffectPath_mp3[filename], false);
            return;
        }

        var card_types = ddz.RobotGlobal.judgeType(cardNums, false);

        this._playController.playAnimationSoundByCardType(card_types[0], this.getIsMale());
        this.setLblMsg(" ");

        this._addCardsIntoContainer(cardNums, false, bDizhu, true);

        this.refreshCardsNum();
    },

    /**
     * 恢复上手牌,用于断线重连的情况
     * @param cardNums 要发的上手牌
     * @param bDizhu 是否为地主
     */
    playTopCards:function (cardNums, bDizhu) {
        ddz.LOGD(this._TAG, "playTopCards");
        this.setLblMsg(" ");
        this._addCardsIntoContainer(cardNums, false, bDizhu);
        this.refreshCardsNum(true);
    },

    onDestroy:function () {
        this._playController = null;
        this._userInfo = null;
        this._playedCards = null;
        ty.NotificationCenter.ignoreScope(this);

        this.hideTimer();
    }
});