var DdzTableAniPlayer = require('DdzTableAniPlayer');

/**
 * 牌桌组件
 */
cc.Class({
    extends: cc.Component,

    ctor : function () {
        ddz.GlobalFuncs.drawGameCanvas();

        this._TAG = "DdzTableScene";

        this._topPlayerController = null;

        this._leftPlayerController = null;
        this._rightPlayerController = null;
        this._operateController = null;

        this._cardsBreakline = 10;


        this._cards = [];
        this._selectedCards = [];
        this._touchedCards = [];
        this._playedCards = [];
        this._extraCards = [];
        this._isUserInteractive = false; //玩家是否可以操作手牌
        this._isInTrust = false; //是否处于托管状态
        this._status = ddz.Enums.PlayStatus.PLAY_STATUS_PREPARE;
        this._touchCardIndexBegin = -1;
        this._touchCardIndexEnd = -1;
        this._dragedCardsNode = null;

        //座位相关
        this._leftSeatinfo = new ddz.SeatInfo();
        this._rightSeatinfo = new ddz.SeatInfo();
        this._topSeatinfo = new ddz.SeatInfo();
        this._mySeatinfo = new ddz.SeatInfo();
        this._mySeatIndex = 0;
        this._showCardIndex = 0;

        //table数据
        this._tableInfo = new ddz._TableInfo();
        this._tableState = new ddz._TableState();

        //打牌逻辑存储
        this._topCardType = null; //需要管的牌型，只能是一个牌型.不需要在每次table_info里面topcard有变动的时候都去转换，只在需要用到的时候转换
        this._playTips = null; //轮到玩家操作时会自动寻找所有能管得上的手牌，如果没有，则进行提示，如果有，点提示按钮的时候用
        this._tipNum = 0; //每次点提示按钮都会切换下一个提示牌，当收到下次该我出牌时重置回0

        this._netMsgHandler = null;

        this._mode = ddz.Enums.PlayMode.PLAY_MODE_NET;
        this._type = ddz.Enums.PlayType.PLAY_TYPE_JINGDIAN; //经典，欢乐，比赛，癞子   联网版由服务器消息决定

        this._roomId = null;

        this.cardPool = null;

        this._cardAniPlayer = new DdzTableAniPlayer(this);
    },

    properties: {
        // waitingNode : cc.Node,
        stageTag : cc.Node,
        cardPrefab : {
            default : null,
            type : cc.Prefab
        },
        cardSmallPrefab : cc.Prefab,
        cardsContainer : cc.Node,   //手牌区
        playedCardArea : cc.Node,   //出牌区
        cardsTip : cc.Label,
        controlPanel : cc.Node,
        myAvatar : cc.Node,
        myRole : sp.Skeleton,
        roleNode : cc.Node,
        leftPlayerPanel : cc.Node,
        rightPlayerPanel : cc.Node,
        bottomPlayerPanel : cc.Node,
        extraCardsNode : cc.Node,
        btnCancelInStruct : cc.Button,
        lblStage : cc.Label,
        ColorBg: cc.Node,
        faPai: cc.Node,
        aniNode: cc.Node
    },

    changeBg:function (stageIndex) {
        var curIndex = Math.max(0,stageIndex-1);
        this.ColorBg.getComponent("ColorBg").changeBgColor(Math.floor(curIndex/2)); //修改背影颜色
    },

    showStage:function (value) {
        this.changeBg(value);
        var curIndex = Math.max(0,value-1);
        this.stageTag.active = true;
        var numStr = "一二三四五六七"[curIndex];
        this.lblStage.string = "第" + numStr + "关";

        this.myAvatar.active = true;

        ddz.LOGD(this._TAG, "设置当前是第几关:" + numStr);
    },

    hideStage:function () {
        this.stageTag.active = false;
    },

    onLoad : function() {

        ddz.GlobalFuncs.drawGameCanvas();

        var winSize = cc.view.getFrameSize();
        if (winSize.width / winSize.height >= 10/16){
            //宽屏分辨率适配
            var scale = 0.7;
            this.leftPlayerPanel.scale = scale;
            this.rightPlayerPanel.scale = scale;
            this.bottomPlayerPanel.scale = scale;
            this.stageTag.scale = scale;
            this.extraCardsNode.scale = scale;
            this.faPai.scale = scale;
        }

        this.faPai.active = false;
        this.roleNode.active = false;
        this.myAvatar.active = false;
        // var size = cc.director.getWinSize();
        // ddz.LOGD(null, "当前的分辨率：w: " + size.width + ", h：" + size.height);
        //
        this._leftPlayerController = this.leftPlayerPanel.getComponent("PlayerPanel");
        this._leftPlayerController.initWithPar(true, false, this);

        this._rightPlayerController = this.rightPlayerPanel.getComponent("PlayerPanel");
        this._rightPlayerController.initWithPar(false, false, this);

        this._operateController = this.controlPanel.getComponent("ControlPanel");
        this._operateController.init(this);

        ddz.AudioHelper.playMusic(ddz.MusicPath_mp3.table_background_music, true, ty.SystemInfo.tableBgMusicVolume);

        this.btnCancelInStruct.node.active = false;
        this.btnCancelInStruct.node.on("click" , this._cancelDeposite, this);

        ty.NotificationCenter.listen(ddz.EventType.SHOW_GAME_WIN_ANI, this._onShoGameWinAni, this);
        ty.NotificationCenter.listen(ddz.EventType.RESET_TABLE, this._reset, this);
        ty.NotificationCenter.listen(ddz.EventType.REMOVE_TABLE_ANI, this.onRemoveAni, this);
        ty.NotificationCenter.listen(ddz.EventType.CHANGE_TO_SHOW_FROM_HODE, this.changeToShowFromHide, this);

        //初始化对象池,添加27张手牌
        this.cardPool = new cc.NodePool();

        var i;
        for (i = 0; i < 27; i++){
            this.cardPool.put(cc.instantiate(this.cardPrefab));
        }

        //初始化三张小牌
        var smallCard, smallCardCom;

        for (i = 0; i < 3; i++){
            smallCard = cc.instantiate(this.cardSmallPrefab);
            smallCardCom = smallCard.getComponent('Card');
            this._extraCards.push(smallCardCom);

            smallCard.setPosition(60 * (i-1), 0);
            smallCard.active = false;

            this.extraCardsNode.addChild(smallCard);
        }

        this.FIRSTLINECARDY = this.cardsContainer.height - ddz.CARD_BIG_SIZE.height;

        this._netMsgHandler = new ddz.PlayingNetMsg(this);

        if (ddz.quickStartModel.cache){
            //牌桌创建之前,有可能quick_start
            this._netMsgHandler.onQuickStart(ddz.quickStartModel.cache);
            ddz.quickStartModel.cache = null;
        }

        if (ddz.tableInfoModel.cache){
            //牌桌创建之前,有可能table_info已经存在了(断线重连的情况)
            this._netMsgHandler.onTableInfo(ddz.tableInfoModel.cache);
            ddz.tableInfoModel.cache = null;
        }

        this._initUI();
    },

    onRemoveAni:function () {
        this.aniNode.removeAllChildren();
    },

    _onShoGameWinAni:function (dizhuWin) {
        var dizhuIndex = this._tableState.normalInfo.m_dizhu;
        var myIndex = this._mySeatIndex;

        var widx = 0;
        var table_result_music = ddz.EffectPath_mp3.table_victory;
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

        if (widx == 1){
            table_result_music = ddz.EffectPath_mp3.table_lose;
            this._cardAniPlayer.playLose();
        }
        else{
            this._cardAniPlayer.playWin();
        }
        ddz.AudioHelper.playMusic(table_result_music, false);

        this.myRole.setAnimation(0, aniName, true);
    },

    _flipExtraCards: function (bAnimation, bUpside) {
        ddz.LOGD(this._TAG, "flip extra cards....");
        for (var index = 0; index < 3; index++) {
            var tmp = this._extraCards[index];
            tmp.node.active = bUpside;
        }
    },

    /**
     * 创建一张新手牌(也有可能是从池中取出来的)
     * @param num 数值
     */
    createNewCard : function (num) {
        var cardNode;
        if (this.cardPool.size() > 0){
            cardNode = this.cardPool.get();
        }
        else{
            cardNode = cc.instantiate(this.cardPrefab);
        }
        cardNode.getComponent('Card').resetWithNum(num);
        return cardNode;
    },

    /**
     * 手牌不用了,归还牌池
     * @param card
     */
    returnCard:function (card) {
        this.cardPool.put(card);
    },

    start : function () {

    },

    // update (dt) {},

    onDestroy:function () {
        ty.NotificationCenter.ignoreScope(this);
        this._netMsgHandler.destroy();
        this._cardAniPlayer.shut();
        this._cardAniPlayer = null;
        this.node.off(cc.Node.EventType.TOUCH_END, this._bgGroundTouch, this);
        ddz.AudioHelper.stopMusic();
        ddz.matchResultPanel = null;
    },


    /*===========*/


    _initUI: function() { //先创建自身的UI，再创建子容器的UI，因为原来代码土，子容器用到了父容器内容，不先创建自身的，会出错

        this._createPlayerNode();
        //测试代码
        this._isUserInteractive = true;

        var that = this;
        var containerRect = cc.rect(0, 0, this.cardsContainer.width, this.cardsContainer.height);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                if (!that._isUserInteractive || that._isInTrust) {
                    return false;
                }
                var pos = that.cardsContainer.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(containerRect, pos) && that.isTouchOnCards(pos)) {
                    return that._onTouchBegan(pos);
                }
                return false;
            },
            onTouchEnded: function(touch, event) {
                if (!that._isUserInteractive || that._isInTrust) {
                    return;
                }
                that.touchCardsEnd();
            },
            onTouchMoved: function(touch, event) {
                if (!that._isUserInteractive || that._isInTrust) {
                    return;
                }
                var pos = that.cardsContainer.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(containerRect, pos)) {
                    if (that.isTouchOnCards(pos)) {
                        that.touchCardsMoved(pos);
                    }
                }
            }
        }, this.cardsContainer);

        this.node.on(cc.Node.EventType.TOUCH_END, this._bgGroundTouch, this);

    },

    _bgGroundTouch:function (eventTouch) {
        if (eventTouch.touch._point.y > 100){
            this._clearSelectedCards();
        }
    },

    _reset: function() {

        this.onRemoveAni();

        this.faPai.active = false;
        this._showCardIndex = 0;
        this._tableState.Reset();
        this._multiNum = 1;
        this._mDizhuCalled = false;
        this.setStatus(ddz.Enums.PlayStatus.PLAY_STATUS_PREPARE);

        this._topCardType = null;
        this._playTips = null;
        this._tipNum = 0;
        this._setCardsTipVisible(false);

        this._tmpJiaodzData = null;

        //触摸相关
        this._cardsOriginX = 0;
        this._cardsIntervalX = 0;
        this._cardsBreakline = 10;
        this._touchCardIndexBegin = -1;
        this._touchCardIndexEnd = -1;

        //手牌
        var cardCom;
        while (this._cards.length > 0){
            cardCom = this._cards.pop();
            this.returnCard(cardCom.node);
        }

        //////////////////////////////////////////////////////////底牌,显示背面
        for (i = 0; i < this._extraCards.length; i++) {
            var card = this._extraCards[i];
            //初始是翻面状态
            card.node.active = false;
        }

        this._selectedCards = [];
        this._touchedCards = [];
        this._clearPlayedCards();

        //座位信息
        if (this.isErdou()) {
            this._topSeatinfo.clean();
        } else {
            this._leftSeatinfo.clean();
            this._rightSeatinfo.clean();
        }

        if (this._topPlayerController) {
            this._topPlayerController.reset();
        }
        if (this._leftPlayerController) {
            this._leftPlayerController.reset();
        }
        if (this._rightPlayerController) {
            this._rightPlayerController.reset();
        }

        this.roleNode.active = false;
        this.myAvatar.active = false;

        this._operateController.showPrepare(false); //联网玩法默认已经准备

        this._isUserInteractive = false; //玩家是否可以操作手牌
        this._isInTrust = false; //是否处于托管状态

    },

    /**
     * 变身
     */
    changePlayerAvatar : function () {

        if (this.isErdou()) {
            this._topPlayerController.refreshAvatarFore();
        } else {
            this._leftPlayerController.refreshAvatarFore();
            this._rightPlayerController.refreshAvatarFore();
        }

        this.roleNode.active = true;
        this.myAvatar.active = false;

        var isDiZhu = this._mySeatIndex == this._tableState.normalInfo.m_dizhu;
        var isMale = this._mySeatinfo.model.user_info.udataInfo.m_sex == ddz.Enums.PlayerSexEnum.SEX_MALE;

        var spDataPath = hall.GlobalFuncs.getSpDataPath(isDiZhu, isMale);
        //显示为地主或农民的动画形像

        /**
         * 动态加载sp动画
         */
        cc.loader.loadRes(spDataPath, sp.SkeletonData, function (err, skeletonData) {
            this.myRole.skeletonData = skeletonData;
            this.myRole.setAnimation(0, ddz.ROLE_ACTION.CHANGTAI, true);
            var sc = 0.7;
            if (spDataPath == "spine/ddz_newoneself_nongmin"){
                sc = -0.7;
            }
            this.myRole.node.scaleX = sc;
        }.bind(this));
    },


    _createPlayerNode: function() {

        var nameStr = hall.GlobalFuncs.SliceStringToLength(hall.ME.getName(), 10);
        var avatarCom = this.myAvatar.getComponent("Avatar");

        avatarCom.setPlayerName(nameStr);
        avatarCom.setAvatarUrl(hall.ME.udataInfo.m_purl);
    },


    _getPosFromIndex: function(index, pars) {

        var _cardsOriginX = this._cardsOriginX;
        var _cardsIntervalX = this._cardsIntervalX;
        var _cardsBreakline = this._cardsBreakline;

        if (pars){
            _cardsOriginX = pars.origin;
            _cardsIntervalX = pars.interval;
            _cardsBreakline = pars.breakline;
        }

        var posx = _cardsOriginX + _cardsIntervalX * (index % _cardsBreakline);
        var posy = index < _cardsBreakline ? this.FIRSTLINECARDY : 0;
        return cc.p(posx, posy);
    },


    // 有癞子时从新对手牌进行排序
    _rankCardsWithLaizi: function() {
        var lz_point = this._tableState.normalInfo.m_cardLaizi;
        var lz_number = this._tableState.m_laiziNumber;
        var len = this._cards.length;
        for (var i = 0; i < len; i++) {
            if (this._cards[i]._info._point - 1 == lz_point) {
                this._cards[i].resetWithNum(lz_number);
            }
        }
        this._cards.sort(ddz.GlobalFuncs.SortCardFunc);
    },

    isErdou: function() {
        return this.isType(ddz.Enums.PlayType.PLAY_TYPE_ERREN);
    },
    isLaizi: function() {
        return this.isType(ddz.Enums.PlayType.PLAY_TYPE_LAIZI);
    },
    isHuanle: function() {
        return this.isType(ddz.Enums.PlayType.PLAY_TYPE_HUANLE);
    },

    isReplay: function() {
        return this._mode == ddz.Enums.PlayMode.PLAY_MODE_REPLAY;
    },

    //为状态提供两个接口
    isStatus: function(val) {
        return this._status == val;
    },
    setStatus: function(val) {
        this._status = val;
    },
    isType: function(val) {
        return this._type == val;
    },
    //我是不是地主
    _isDizhu: function(index) {
        return this._tableState.normalInfo.m_dizhu == index;
    },

    isMode: function(val) {
        return this._mode == val;
    },

    tableInfo: function() {
        return this._tableInfo;
    },
    mySeatinfo: function() {
        return this._mySeatinfo;
    },
    setType: function(val) {
        this._type = val;
    },

    updateTableState: function(info) {
        ddz.LOGD(this._TAG, "table state is : " + JSON.stringify(info["stat"]));
        this._tableState.parseTableState(info["stat"]);
    },

    //刷新倍数的label字符串
    //bUseServerData表示用服务器数据，而不使用客户端统计数据
    _refreshMultipleLabel: function(bWithAnimation, bUseServerData) {
        // 单机的基数固定为100
        // var base = ddz.SINGLE_SCORE_BASE;
        // var multiChange = false;
        // var table_config;
        // if (this._mode == ddz.Enums.PlayMode.PLAY_MODE_NET) { //联网根据table_info获取，match和闯关待定
        //     table_config = this._tableInfo.config;
        //     base = table_config.m_roommulti * table_config.m_basemulti * table_config.m_base;
        // } else if (this._mode == ddz.Enums.PlayMode.PLAY_MODE_MATCH) {
        //     table_config = this._tableInfo.config;
        //     base = parseInt(this._tableInfo.matchNote.m_matchInfo.m_basescore) * table_config.m_basemulti * table_config.m_base;
        // }
        // var bmax = false; //已经到达最高倍数
        // if (bUseServerData) {
        //     var normal = this._tableState.normalInfo;
        //     var multiNum = 1;
        //     //炸弹
        //     var bc = normal.m_bomb;
        //     if (bc > 0) {
        //         multiNum *= Math.pow(2, bc);
        //     }
        //     //抢地主加倍
        //     var mcc = normal.m_call;
        //     if (mcc > 0) {
        //         multiNum *= mcc;
        //     }
        //     //春天
        //     var mct = normal.m_chuntian;
        //     if (mct > 0) {
        //         multiNum *= mct;
        //     }
        //     if (normal.m_state == ddz.Enums.TableState.TABLEDSTAT_PLAYING) {
        //         //底牌
        //         var mbc = normal.m_bcmulti;
        //         if (mbc > 0) {
        //             multiNum *= mbc;
        //         }
        //         this._tableState.m_bUpdatebcMulti = false;
        //     }
        //
        //     //明牌加倍
        //     var mshow = normal.m_show;
        //     if (mshow > 0) {
        //         multiNum *= mshow;
        //     }
        //     var maxmulti = table_config.m_maxMulti;
        //     if (maxmulti > 0 && multiNum >= maxmulti) {
        //         multiNum = maxmulti;
        //         bmax = true;
        //     }
        //     if (this._multiNum != multiNum) {
        //         ddz.AudioHelper.playEffect(ddz.EffectPath_mp3["multiple"], false);
        //         multiChange = true;
        //     }
        //     this._multiNum = multiNum;
        // }
        //
        // if (bWithAnimation && multiChange) {
        //     this._showMultiple();
        //     var scaleIn = cc.ScaleTo.create(0.2, 1.1);
        //     var scaleOut = cc.ScaleTo.create(0.2, 1);
        //     this._node_mul.runAction(cc.Sequence.create(cc.EaseSineIn.create(scaleIn), cc.EaseSineOut.create(scaleOut)));
        // }
    },

    /**
     * 设置是否显示，或者显示的是出牌不符合规则，还是没有牌大的过上家
     * @param bVisible
     * @param tipType
     * @private
     */
    _setCardsTipVisible: function(bVisible, tipType) {
        if (arguments.length > 1) {
            this.cardsTip.node.active = true;
            var str = "";
            if (tipType == ddz.Enums.PlayCardsTip.PLAYCARDSTIP_ILLEGAL){
                str = "出牌不符合规则";
            }
            else if (tipType == ddz.Enums.PlayCardsTip.PLAYCARDSTIP_NOCARD){
                str = "没有牌能大过上家";
            }
            else if (tipType == ddz.Enums.PlayCardsTip.PLAYCARDSTIP_PLAY){
                str = "请选择要出的牌";
            }
            this.cardsTip.string = str;
        }
        else{
            this.cardsTip.node.active = bVisible;
        }
    },

    parseMySeatInfo: function(info) {
        this._mySeatinfo.parseSeatInfo(info);
    },

    _startPlay: function() {
        // ddz.LOGD(this._TAG, "start play now");
        this._isUserInteractive = true;
        this.removeAllPrepare();
        //在刚开始一定不用播剩2、1张的音效；在短线重连后播放意义不大；在取消托管后也会进到这，主要是
        //不要再取消托管时重复播放剩余张数的音效

        this.setStatus(ddz.Enums.PlayStatus.PLAY_STATUS_PLAYING);
    },

    //开始叫地主
    _startJiaodz: function() {
        ddz.LOGD(this._TAG, "start jiaodz now");
        this.removeAllPrepare();

        this._operateController.hideAll();
        this.setStatus(ddz.Enums.PlayStatus.PLAY_STATUS_JIAODZ);
    },

    removeAllPrepare:function () {
        if (this.isErdou()) {
            this._topPlayerController.setPrepareVisible(false);
        } else {
            this._leftPlayerController.setPrepareVisible(false);
            this._rightPlayerController.setPrepareVisible(false);
        }
        this._operateController.lblMsg.string = "";
    },


    _finishJiaodz: function() {
        ddz.LOGD(this._TAG, "finish jiaodz in play controller");
        this.removeAllPrepare();
        this._startInsertExtra();
    },

    getIsMale:function () {
        return hall.ME.udataInfo.m_sex == ddz.Enums.PlayerSexEnum.SEX_MALE;
    },

    //经典玩法叫地主后回调
    _classicJiaodz: function(call) {
        var audioName = '';
        audioName = this.getIsMale() ? "man_" : "female_";
        audioName += call > 0 ? call + "_point" : "not_call";
        ddz.LOGD(this._TAG, 'playEffect=' + audioName);
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3[audioName], false);
        var callFen  = call > 0 ? call + "分" : "不叫";


        this._operateController.callNode.active = false;

        //根据叫的分设置
        this._operateController.lblMsg.string = callFen;

        this._mySeatinfo.model.m_call = call;
        this._operateController.setClockVisible(false);
        if (this.isReplay() == false) {
            //发送叫分给服务器
            var params = {
                'seatId': this._mySeatIndex,
                'call': call,
                "roomId": this._tableInfo.roomId(),
                "tableId": this._tableInfo.tableId()
            };
            ddz.MsgFactory.getTableCall("call", params);
        }
    },

    /**
     * 归还所有手牌到牌池
     * @private
     */
    _returnAllCards : function () {
        var cardCom;
        while (this._cards.length > 0){
            cardCom = this._cards.pop();
            this.returnCard(cardCom.node);
        }
    },


    //初始化自己的牌
    _initMyCards: function() {
        //在收到脱管信息后，会收到tableinfo的消息，在tableinfo中会重新生成牌的信息，在以下情况会有bug：
        //在不该我出牌时我选中了牌，然后点击脱管，在重新生成牌的信息后，已选中的牌的信息还存在，所以在此清空一下选中牌的信息
        this._clearSelectedCards();
        this._returnAllCards();

        var cards = this._mySeatinfo.model.m_card;
        var card, cardCom;

        for (var i = 0; i < cards.length; i++) {
            card = this.createNewCard(cards[i]);
            cardCom = card.getComponent('Card');
            cardCom.showMask(false);
            this._cards.push(cardCom);

            this.cardsContainer.addChild(card);
        }
        this._cards.sort(ddz.GlobalFuncs.SortCardFunc);

        this._refreshCardsLayer();
    },

    _resetExtraCards: function() {
        var extra = this._tableState.objectInfo.m_baseCard;
        for (var i = 0; i < extra.length; i++) {
            this._extraCards[i].resetWithNum(extra[i]);
        }

        this._extraCards.sort(ddz.GlobalFuncs.SortCardFunc);

        var smallCard;
        for (i = 0; i < 3; i++){
            smallCard = this._extraCards[i].node;
            smallCard.setPosition(60 * (i-1), 0);
        }
    },

    /**
     * 刷新手牌布局数据
     * @private
     */
    _refreshLayoutData:function () {
        var len = this._cards.length;
        var data = ddz.GlobalFuncs.GetCardsOriginInterval(this.cardsContainer, ddz.CARD_BIG_SIZE.width, len);
        this._cardsOriginX = data["origin"];
        this._cardsIntervalX = data["interval"];
        this._cardsBreakline = data["breakline"];
    },

    _refreshCardsLayer: function() {
        ddz.LOGD(this._TAG, "111111 _refreshCardsLayer");
        this._clearSelectedCards();
        var len = this._cards.length;
        //清空已触摸选择的牌了，因为其中的对象会被移除掉
        this._touchedCards = [];
        if (len <= 0) {
            return;
        }

        this._refreshLayoutData();

        var cardCom;
        var canShowTag;
        for (var index = 0; index < len; index++) {
            canShowTag = ddz.GlobalFuncs.canShowTag(this._cardsBreakline, len, index);
            cardCom = this._cards[index];
            cardCom.showTag(canShowTag);
            cardCom.setDiZhuTag(this._isDizhu(this._mySeatIndex) && canShowTag);
            cardCom.showMask(this._isInTrust);
            cardCom.setPosition(this._getPosFromIndex(index));
            cardCom.setZIndex(index);
        }
    },

    //只有两种情况需要reset: 1.轮到我操作， 2.收到table_info(可能是断线重连)
    //被动出牌管不上时候要进行特殊处理
    //bNoshowCardstip : 只在短线重连后使用，当为true时不显示“没有牌大过上家的提示”
    _resetTopCardType: function(bNoshowCardstip) {
        this._tipNum = 0;
        //轮到我主动出牌，清空topcard信息 我主动出牌时，top_card字段不为空，所以必须用top_seat判断
        if (this._tableState.normalInfo.m_topseat == this._mySeatIndex) {
            this._topCardType = null;
        } else {
            //上家出的牌的数组
            ddz.LOGD(this._TAG, 'verify topCard.....');
            var top = this._tableState.objectInfo.m_topCard;
            //有需要管的牌，判断手牌是否能管得上，进行提示，同时给提示按钮使用
            if (top.length > 0) {
                var types = ddz.RobotGlobal.judgeType(top, false);
                //这里不进行types的判断了，如果topcard不是有效牌型，会是严重错误
                this._topCardType = types[0];

                // 计算被动提示牌
                this._playTips = ddz.RobotGlobal.findWinCardsFromArray(types[0], this._mySeatinfo.model.m_card);
                //管不上
                if (this._playTips.length == 0) {
                    ddz.LOGD(this._TAG, "no cards larger than top card");

                    if (!bNoshowCardstip) {
                        ddz.LOGD(this._TAG, "!bNoshowCardstip is true ~~~~~~~ ");
                        this._setCardsTipVisible(true, ddz.Enums.PlayCardsTip.PLAYCARDSTIP_NOCARD);
                    }
                    return true;
                }
            }
            //上家毛牌没出
            else {
                ddz.LOGD(this._TAG, "这不对吧");
                this._topCardType = null;
            }
        }
        return false;
    },


    showTopCards: function() {
        var sid = this._tableState.normalInfo.m_topseat;
        var mySeatId = this._mySeatIndex;
        if (sid == mySeatId) { //轮到别人出牌时，不显示我出的牌
            return;
        }
        var cards = this._tableState.objectInfo.m_topCard;
        var controller = this._topPlayerController;
        var bdizhu = !this._isDizhu(mySeatId);
        if (!this.isErdou()) {
            var leftid = ddz.GlobalFuncs.getPreIndex(mySeatId);
            var rightid = ddz.GlobalFuncs.GetNextIndex(mySeatId);
            controller = sid == rightid ? this._rightPlayerController : this._leftPlayerController;
            bdizhu = sid == rightid ? this._isDizhu(rightid) : this._isDizhu(leftid);
        }
        controller.playCards(cards, bdizhu);
    },

    _startInsertExtra: function() {
        ddz.LOGD(this._TAG, "start insert extra in play controller....");

        //判断是否是地主，地主的话需要把extra_cards插入手牌....
        if (this._tableState.normalInfo.m_dizhu == this._mySeatIndex) {
            this._insertExtraCards();
            if (this.isErdou()) {
            }

        } else {
            var seatInfo = null;

            if (this.isErdou()) {
                //二人斗地主，确定地主的seatinfo
                seatInfo = this._topSeatinfo;

            } else {
                seatInfo = this._tableState.normalInfo.m_dizhu == ddz.GlobalFuncs.getPreIndex(this._mySeatIndex) ? this._leftSeatinfo : this._rightSeatinfo;
            }

            for (var i = 0; i < this._extraCards.length; i++) {
                seatInfo.model.m_card.push(this._extraCards[i]._info._number);
            }
            this._startPlay();
        }
        //对家的明牌翻过去
    },

    _insertExtraCards: function() {
        // ddz.LOGD(this._TAG, "insert extra in play controller");
        var newcards = [];
        var i,card,cardCom;
        for (i = 0; i < 3; i++) {
            card = this._extraCards[i];
            var nc = this.createNewCard(card._info._number);
            this._cards.push(nc.getComponent('Card'));
            newcards.push(nc);
            this._mySeatinfo.model.m_card.push(card._info._number); //seat_info里面也需要同步更新
            nc.parent = this.cardsContainer;
        }
        this._cards.sort(ddz.GlobalFuncs.SortCardFunc);
        this._refreshCardsLayer();

        //插入手牌后显示地主标识
        var length = this._cards.length;
        this._cards[length - 1].setDiZhuTag(true);

        for (i = 0; i < 3; i++) {
            var poker = newcards[i];
            var old_pos = poker.getPosition();
            poker.setPosition(cc.p(old_pos.x, old_pos.y * 1.2));
            var delay = cc.delayTime(0.1);
            var move = cc.moveTo(0.2, poker.getComponent('Card')._oldP);
            if (i == 2) {
                poker.runAction(cc.sequence(delay, move, cc.callFunc(this._startPlay, this)));
            } else {
                poker.runAction(cc.sequence(delay, move));
            }
        }
    },

    //设置脱管状态
    setIsInTrust: function(isin) {
        if (this._isInTrust == isin) {
            return;
        }
        this._isInTrust = isin;

        this._reorderCardsLayer();

        this.btnCancelInStruct.node.active = this._isInTrust;
        //设置牌上的阴影层是否显示
        for (var i = 0; i < this._cards.length; ++i) {
            var card = this._cards[i];
            card.showMask(this._isInTrust);
        }
    },


    _resetPlayerCardsWithLaizi: function() { //把3个玩家手牌中癞子对应点数的牌转成癞子
        var lz_point = this._tableState.normalInfo.m_cardLaizi;
        var lz_number = this._tableState.m_laiziNumber;
        this._mySeatinfo.resetCardsWithLaizi(lz_point, lz_number);
        this._leftSeatinfo.resetCardsWithLaizi(lz_point, lz_number);
        this._rightSeatinfo.resetCardsWithLaizi(lz_point, lz_number);

        var extra = this._tableState.objectInfo.m_baseCard;
        for (var i = 0; i < extra.length; i++) {
            var point = ddz.GlobalFuncs.GetCardPointByNum(extra[i]);
            if (point - 1 == lz_point) {
                extra[i] = lz_number;
            }
        }
    },


    _findCards: function(cards) {
        var return_arr = [];
        var lz_pos = -1; //如果有多个癞子的话，则每用掉一个癞子，就设一次lz_pos，因为每次都是从0开始搜索，这样不会重复找到同一张癞子
        for (var i = 0; i < cards.length; i++) {
            var tip_number = cards[i];
            var index = -1;
            for (var j = 0; j < this._cards.length; j++) {
                var card = this._cards[j];
                var card_number = card._info._number;
                if (card_number == tip_number && card_number <= 53) {
                    index = j;
                    break;
                } else if (card_number > 53 && tip_number > 53 && j > lz_pos) {
                    lz_pos = j;
                    index = j;
                    break;
                }
            }
            if (index >= 0) {
                return_arr.push(card);
            }
        }
        return return_arr;
    },

    playTip: function() {
        var len = this._playTips.length;
        ddz.LOGD(null, "-----------------------playTip-----------------------------"+len);
        if (len == 0) {
            this._operateController._playBuchu();
            this._setCardsTipVisible(false);
            return;
        }
        //清除已提示的牌
        this._clearSelectedCards();
        //重新显示提示牌
        this._selectedCards = this._findCards(this._playTips[this._tipNum]);
        for (var i = 0; i < this._selectedCards.length; i++) {
            this._selectedCards[i].up();
        }
        this._operateController.btnPlay.active = true;
        this._operateController.btnPlay.interactable = true;
        this._tipNum = (this._tipNum + 1) % len;
    },

    playAnimationSoundByCardType: function(type, bMale, userPosition) { // 由于产品要求，在播放连对和顺子动画时需要根据出牌人的位置来播放动画
        var sound;
        var special_effect;
        switch (type.getType()) { //播放动画和声音
            case ddz.Enums.PaixingType.ROCKET:
                sound = bMale ? "man_rocket" : "female_rocket";
                special_effect = "rocket";

                this._cardAniPlayer.playRocket();
                break;
            case ddz.Enums.PaixingType.BOMB_CARD:
                sound = bMale ? "man_bomb" : "female_bomb";
                special_effect = "bomb";

                this._cardAniPlayer.playBomb();
                break;
            case ddz.Enums.PaixingType.AIRCRAFT_CARD:
                sound = bMale ? "man_airplane" : "female_airplane";
                special_effect = this._topCardType == null ? "airplane_the_first_time" : "airplane_beiguan";
                this._cardAniPlayer.playPlane();
                break;
            case ddz.Enums.PaixingType.AIRCRAFT_SINGLE_CARD:
            case ddz.Enums.PaixingType.AIRCRAFT_DOUBLE_CARD:
                this._cardAniPlayer.playPlane();
                sound = bMale ? "man_aircraft_with_wings" : "female_airplane_with_wing";
                special_effect = this._topCardType == null ? "airplane_the_first_time" : "airplane_beiguan";
                break;
            case ddz.Enums.PaixingType.SHUNZI_CARD:
                this._cardAniPlayer.playShunZi();
                sound = bMale ? "man_shunzi" : "female_shunzi";
                special_effect = "shunzi";
                break;
            case ddz.Enums.PaixingType.LIANDUI_CARD:
                // this.playAnim();
                // this._cardDuiziAnimation.playCardAction(userPosition);
                this._cardAniPlayer.playLianDui();
                sound = bMale ? "man_continuous_pair" : "female_continuous_pair";
                special_effect = "continuous_pair";
                break;
            case ddz.Enums.PaixingType.THREE_ONE_CARD:
                sound = bMale ? "man_three_with_one" : "female_three_with_one";
                break;
            case ddz.Enums.PaixingType.THREE_CARD:
                sound = bMale ? "man_three_one" : "female_three_one";
                break;
            case ddz.Enums.PaixingType.THREE_TWO_CARD:
                sound = bMale ? "man_three_with_one_pair" : "female_three_with_one_pair";
                break;
            case ddz.Enums.PaixingType.BOMB_TWO_CARD:
                sound = bMale ? "man_four_with_two" : "female_four_with_two";
                break;
            case ddz.Enums.PaixingType.BOMB_TWO_TWO_CARD:
                sound = bMale ? "man_four_with_one_pair" : "female_four_with_two_pair";
                break;
            // case ddz.Enums.PaixingType.SINGLE_CARD:
            //     sound = bMale ? "man_" + type.getPoint() : "female_" + type.getPoint();
            //     break;
            // case ddz.Enums.PaixingType.DOUBLE_CARD:
            //     sound = bMale ? "man_pair" + type.getPoint() : "female_pair" + type.getPoint();
            //     break;
            default:
                break;
        }

        if (sound) {
            ddz.LOGD(this._TAG, 'playEffect=' + sound);
            ddz.AudioHelper.playEffect(ddz.EffectPath_mp3[sound], false);
        }

        if (special_effect) {
            ddz.LOGD(this._TAG, 'playEffect=' + special_effect);
            ddz.AudioHelper.playEffect(ddz.EffectPath_mp3[special_effect], false);
        }

        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.Playing_cards, false);
    },


    _sendPlayCardInfo: function(cards) {
        var params = {
            'seatId': this._mySeatIndex,
            'ccrc': this._tableState.normalInfo.m_ccrc,
            "roomId": this._tableInfo.roomId(),
            "tableId": this._tableInfo.tableId(),
            "cards": cards
        };
        ddz.MsgFactory.getTableCall("card", params);
    },

    _playCards: function() {
        ddz.LOGD(this._TAG, "play cards in play controller");

        this._setCardsTipVisible(false);

        var cards = [];
        var len = this._selectedCards.length;

        if (len > 0) { //判断牌型

            for (var i = 0; i < len; i++) {
                cards.push(this._selectedCards[i]._info._number);
            }

            var types = ddz.RobotGlobal.judgeType(cards);
            if (types.length <= 0) {
                ddz.LOGD(this._TAG, "in play cards, illegal cards, return"+JSON.stringify(cards));
                this._setCardsTipVisible(true, ddz.Enums.PlayCardsTip.PLAYCARDSTIP_ILLEGAL);
                return;
            } else {
                var type = types[0];
                ddz.LOGD(null, "play cards type : .......");
                type.dump();
                if (null != this._topCardType) {
                    ddz.LOGD(null, 'topCard : ......');
                    this._topCardType.dump();
                }

                //管不上,上家的牌
                if (this._topCardType && !type.isLargerThan(this._topCardType)) {
                    ddz.LOGD(this._TAG, "in play cards, not larger than top card, return"+JSON.stringify(this._topCardType));
                    this._setCardsTipVisible(true, ddz.Enums.PlayCardsTip.PLAYCARDSTIP_ILLEGAL);
                    return;
                }

                if (!this.isMode(ddz.Enums.PlayMode.PLAY_MODE_SINGLE)) {
                    //在此处单机的不设置不能出牌，联网游戏在收到card action时又设置为true了
                    this._isUserInteractive = false;
                }

                cards = type.getCards(); // cards里面有癞子的话，变成了实际牌的值
            }
        }

        if (!this.isMode(ddz.Enums.PlayMode.PLAY_MODE_SINGLE)) {
            this._sendPlayCardInfo(cards); //发送出牌消息
        }
    },


    _playCardsFromServer: function(cards) { //
        this._clearPlayedCards(); //最后一张牌服务器替出，不会收到next消息，也就不会清除掉已出的牌。 在这里清除作保障
        var isMale = this.getIsMale();

        if (cards.length == 0) {
            this._operateController.showBuchuSprite();
            var filename = isMale ? "man_no" : "female_no";
            ddz.LOGD(this._TAG, 'playEffect=' + filename);
            ddz.AudioHelper.playEffect(ddz.EffectPath_mp3[filename], false);
            return;
        }

        var types = ddz.RobotGlobal.judgeType(cards);
        if (types.length == 0) {
            ddz.LOGD(null, "error in _playCardsFromServer!!! type error..");
        }
        this._mySeatinfo.playCards(cards);

        this._clearSelectedCards(true);
        this._selectedCards = this._findCards(cards);
        this._playCardsInternal();

        this.playAnimationSoundByCardType(types[0], isMale);
        this._runPlayCardsAction();
    },

    /**
     * 重新排序手牌(跟refresh的区别是：有动画，不会有增加牌的情况。 如果增加牌，必须用refreshCardsLayer，因为增加必须删除原来的)
     * @private
     */
    _reorderCardsLayer: function() {
        ddz.LOGD(this._TAG, "1111111 _reorderCardsLayer");
        var len = this._cards.length;
        if (len <= 0) {
            return;
        }

        this._refreshLayoutData();

        var cardCom, des, poker;
        var canShowTag;
        for (var index = 0; index < len; index++) {
            canShowTag = ddz.GlobalFuncs.canShowTag(this._cardsBreakline, len, index);
            cardCom = this._cards[index];
            poker = cardCom.node;
            des = this._getPosFromIndex(index);
            cardCom.setOldPosition(des);
            cardCom.setZIndex(index);
            cardCom.showTag(canShowTag);
            cardCom.setDiZhuTag(this._isDizhu(this._mySeatIndex) && canShowTag);

            poker.runAction(cc.moveTo(0.1, des));
        }
    },


    /**
     * 从手牌中移除打出牌数据
     * @private
     */
    _playCardsInternal: function() {
        //把cards中selected cards移除，以便重新排列
        var scard, index;
        for (var i = 0; i < this._selectedCards.length; i++) {
            scard = this._selectedCards[i];
            index = hall.GlobalFuncs.FindInArray(this._cards, scard);
            if (index >= 0) {
                this._cards.splice(index, 1);
            } else {
                ddz.LOGD(this._TAG, "error, not found selected card in cards!!!!!!!!" + scard._info._number);
            }
        }
        if (this._selectedCards.length <= 0) {
            //出的牌数为0，就不再说剩几张牌了
            return;
        }

        //在此处增加牌型的判断
        this._reorderCardsLayer();

        var audio, path;
        var isMale = this.getIsMale();
        var leftCardsNum = this._cards.length;
        if (leftCardsNum == 2) {
            audio = isMale ? "man_" : "female_";
            if (this.isErdou()) {
                audio += "I_got_left_two_cards_erdou";
            } else {
                audio += "I_got_left_two_cards";
            }
            ddz.LOGD(this._TAG, 'playEffect=' + audio);
            ddz.AudioHelper.playEffect(ddz.EffectPath_mp3[audio], false);
        } else if (leftCardsNum == 1) {
            path = isMale ? "man_" : "female_";
            audio = path;
            if (this.isErdou()) {
                audio += "I_got_left_one_cards_erdou";
            } else {
                audio += "I_got_left_one_cards";
            }
            ddz.LOGD(this._TAG, 'playEffect=' + audio);
            ddz.AudioHelper.playEffect(ddz.EffectPath_mp3[audio], false);
        }
    },

    _runPlayCardsAction: function() {
        var length = this._selectedCards.length;
        if (length <= 0) {
            return;
        }

        var startY = 0;
        var startX = 0;
        var breakline = 10;
        var splitWidth = 55;
        if (length > 10){
            startY = this.FIRSTLINECARDY;
            startX = 0;
        }
        else{
            startY = 0;
            startX = (this.playedCardArea.width - ((length - 1) * splitWidth + ddz.CARD_BIG_SIZE.width)) / 2;
        }

        var tox,toy;

        var canShowTag,card;
        for (var i = 0; i < length; i++) {

            canShowTag = ddz.GlobalFuncs.canShowTag(this._cardsBreakline, length, i);

            card = this._selectedCards.shift();
            // card.resetWithNum(cards[i]);
            card.showTag(canShowTag);
            card.setDiZhuTag(this._isDizhu(this._mySeatIndex) && canShowTag);
            card.setZIndex(i);
            card.showMask(false);
            this._playedCards.push(card);
            card.node.parent = this.playedCardArea;

            tox = (i % breakline) * splitWidth + startX;
            toy = startY - Math.floor(i/breakline) * 56;

            card.node.setPosition(tox, toy);
        }
    },

    _clearSelectedCards: function(withOutAni) {
        this.cardsTip.string = "";
        ddz.LOGD(this._TAG, "clear selected cards len = ***" + this._selectedCards.length);
        var card;
        while (this._selectedCards.length > 0){
            card = this._selectedCards.pop();
            card.down(withOutAni);
        }
        this._operateController.btnPlay.active = false;
    },

    //开始托管
    startDeposite: function() {
        if (this._isInTrust || this.isStatus(ddz.Enums.PlayStatus.PLAY_STATUS_PREPARE)) {
            //alert("not allowed to deposite");
            return;
        }
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        ddz.LOGD(this._TAG, '托管状态 startDeposite');
        // this.setIsInTrust(true);
        this._isTrustEnable = false;
        var params = {
            'seatId': this._mySeatIndex,
            "roomId": this._tableInfo.roomId(),
            "tableId": this._tableInfo.tableId()
        };
        ddz.MsgFactory.getTableCall("robot", params);
    },

    /**
     * 取消托管
     * @private
     */
    _cancelDeposite: function() {
        this.setIsInTrust(false);
        this._isTrustEnable = true;
        var params = {
            'seatId': this._mySeatIndex,
            "roomId": this._tableInfo.normal.m_roomId,
            "tableId": this._tableInfo.normal.m_tableId
        };
        ddz.MsgFactory.getTableCall("robot", params);
    },

    /************************************* table call 相关开始 ***************************************/

    onActionWildCard: function(result) {
        var p = result["wildcard"];
        this._tableState.setLaizi(p);
    },
    //响应onTableCall中的各个action，这部分的函数需要提取到子类中
    //当某玩家准备后，服务器广播该玩家的 准备 消息。所有玩家收到此消息后，在牌桌上更新准备玩家的状态
    onActionReady: function(sid) {
        if (sid == this._mySeatIndex) {
            this._mySeatinfo.model.m_state = ddz.Enums.SeatState.SEATDZSTAT_READY;
        } else if (this.isErdou() && sid == ddz.GlobalFuncs.GetNextIndex(this._mySeatIndex, 2)) {
            this._topPlayerController.setPrepareVisible(true);
            this._topSeatinfo.model.m_state = ddz.Enums.SeatState.SEATDZSTAT_READY;
        } else if (sid == ddz.GlobalFuncs.GetNextIndex(this._mySeatIndex)) {
            ddz.LOGD(this._TAG, "action == right game_ready");
            this._rightPlayerController.setPrepareVisible(true);
            this._rightSeatinfo.model.m_state = ddz.Enums.SeatState.SEATDZSTAT_READY;
        } else {
            ddz.LOGD(this._TAG, "action == left game_ready");
            this._leftPlayerController.setPrepareVisible(true);
            this._leftSeatinfo.model.m_state = ddz.Enums.SeatState.SEATDZSTAT_READY;
        }
    },

    onActionGameReady: function(result) {
        ddz.LOGD(this._TAG, "action == game_ready");
        this.hideStage();
        this._isOnReady = true;
        var mycards = result["cards" + (this._mySeatIndex - 1)];
        var rcards,lcards;
        this._mySeatinfo.model.m_card = mycards;
        if (this.isErdou()) {
            //二人斗地主
            // this._grabCard = result["grabCard"]; //明牌标志
            // rcards = result["cards" + (ddz.GlobalFuncs.GetNextIndex(this._mySeatIndex, 2) - 1)];
            // this._topSeatinfo.model.m_card = rcards;
            // this._topPlayerController.setLeftCardsContainerVisible(true);
        } else {
            rcards = result["cards" + (ddz.GlobalFuncs.GetNextIndex(this._mySeatIndex) - 1)];
            this._rightSeatinfo.model.m_card = rcards;

            lcards = result["cards" + (ddz.GlobalFuncs.getPreIndex(this._mySeatIndex) - 1)];
            this._leftSeatinfo.model.m_card = lcards;

            this._leftPlayerController.changeShowLeftNum(0);
            this._rightPlayerController.changeShowLeftNum(0);
        }

        //初始化自己的牌，根据count值，对上图片等等
        // this._initMyCards();

        this.faPai.active = true;
        var animationCom = this.faPai.getComponent(cc.Animation);
        var ani = animationCom.getAnimationState('fapai_anim');
        ani.play();

        var card, cardCom;
        for (var i = 0; i < mycards.length; i++) {
            card = this.createNewCard(mycards[i]);
            cardCom = card.getComponent('Card');
            cardCom.showMask(false);
            this._cards.push(cardCom);

            card.active = false;
            this.cardsContainer.addChild(card);
        }
        this._cards.sort(ddz.GlobalFuncs.SortCardFunc);
        this._refreshLayoutData();

        var rc = 17;
        var allTime = 1;
        ty.Timer.setTimer(this, this.addCardToPlayer, allTime/rc, rc, 17/30);

        //refresh extra cards info
        this._tableState.objectInfo.m_baseCard = result["basecard"];
        this._resetExtraCards();

        //游戏设置为叫地主状态，等待服务器返回轮到谁叫地主
        this._startJiaodz();
        // this._createCards();

        // ddz.LOGD(this._TAG, "当前时间:" + new Date().getTime());
    },

    changeToShowFromHide : function (timeGap) {
        // var isAddCard = ty.Timer.isScheduledTimer(this, this.addCardToPlayer);
        // ddz.LOGD(this._TAG, "======================ty.Timer.isScheduledTimer=============="+isAddCard);
        // if(isAddCard){
            ty.Timer.cancelTimer(this, this.addCardToPlayer);
            for (var i = 0; i < this._cards.length; i ++){
                var cardCom = this._cards[i];
                cardCom.node.active = true;
            }
            this._reorderCardsLayer();
        //     ddz.LOGD(this._TAG, "=======================changeToShowFromHide==============");
        // }
    },

    addCardToPlayer:function () {

        var index = this._showCardIndex;

        var cardCom = this._cards[index];

        cardCom.node.active = true;
        cardCom.showTag(true);
        cardCom.setDiZhuTag(false);
        cardCom.setPosition(this._getPosFromIndex(index));
        cardCom.setZIndex(index);

        if (index > 0 && index - 1 != 9){
            this._cards[index - 1].showTag(false);
        }

        this._showCardIndex++;
        if (this._showCardIndex == 17){
            ty.Timer.cancelTimer(this, this.addCardToPlayer);
        }

        this._leftPlayerController.changeShowLeftNum(this._showCardIndex);
        this._rightPlayerController.changeShowLeftNum(this._showCardIndex);

        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.click_cards, false);
    },

    onActionNext: function(result) {
        //（3）轮到谁叫地主
        //（6）轮到谁出牌
        ddz.LOGD(this._TAG, "action == next");
        // ddz.LOGD(this._TAG, "当前时间:" + new Date().getTime());
        //第一次收到出牌的next消息时候，切换状态
        if (this._tableState.normalInfo.m_state == ddz.Enums.TableState.TABLEDSTAT_PLAYING && this._status == ddz.Enums.PlayStatus.PLAY_STATUS_JIAODZ) {
            if (!this._isDizhu(this._mySeatIndex)) {
                this._startPlay();
            }
        }

        //轮到谁了
        var index = result["next"];

        //更新时间
        var time = result["opTime"];

        //轮到我操作，根据状态，确定是选择叫地主还是选择出牌
        if (index == this._mySeatIndex) {
            //托管状态不做任何操作
            ddz.LOGD(this._TAG, "index == this._mySeatIndex");
            if (this._isInTrust) {
                // this._unvisibleErdouRangPaiHint();
                return;
            }
            this._clearPlayedCards();
            this._operateController.hideAll();

            //叫地主，显示叫地主操作面板（1分 2分，不叫等）
            if (this._tableState.normalInfo.m_state == ddz.Enums.TableState.TABLEDSTAT_CALLING && !this.isReplay()) {
                if (this.isErdou() && this._tmpJiaodzData == null) {
                    result["opTime"] -= 2;
                    this._tmpJiaodzData = result;
                    // return;
                }

                this._operateController.showJiaodz(this._tableState.normalInfo.m_call);
            }
            //被动出牌时候是不是管不上？
            var bNoCard = false;

            //出牌，显示出牌操作面板
            if (this._tableState.normalInfo.m_state == ddz.Enums.TableState.TABLEDSTAT_PLAYING) {

                if (this._resetTopCardType()) {
                    bNoCard = true;
                }

                if (!this.isReplay()) {
                    this._operateController.showPlay(bNoCard);
                }
            }
            // if (bNoCard) {
            //     time = this._tableInfo.config.m_passtime + Math.floor(Math.random() * 3 + 1);
            // }
            ddz.LOGD(this._TAG, "show my Time :" + time);
            //显示时间
            this._operateController.setClockVisible(true, time);
        }
        //若轮到别人，则只显示别人操作的时钟计时
        else {
            // if (this.isErdou()) {
            //     //二人斗地主
            //     if (this._tableState.normalInfo.m_state == ddz.Enums.TableState.TABLEDSTAT_CALLING && this._tmpJiaodzData == null) {
            //         result["opTime"] -= 2;
            //         this._tmpJiaodzData = result;
            //         // return;
            //     }
            //     this._topPlayerController.setClockVisible(true, time);
            //     return;
            // }
            //右边显示闹钟
            if (index == ddz.GlobalFuncs.GetNextIndex(this._mySeatIndex)) {
                this._rightPlayerController.setClockVisible(true, time);
            }
            else {//左边显示闹钟
                this._leftPlayerController.setClockVisible(true, time);
            }
        }
    },

    onActionCall: function(result) {
        var index = result["seatId"];
        var call = result["call"];
        //刚才是我的下家叫的地主

        if (this.isErdou()) {
            //二人斗地主
            if (index == ddz.GlobalFuncs.GetNextIndex(this._mySeatIndex, 2)) {
                this._topSeatinfo.model.m_call = call;
                this._topPlayerController.setClockVisible(false);
                this._topPlayerController.showJiaodz(call);
            }
        } else {
            if (index == ddz.GlobalFuncs.GetNextIndex(this._mySeatIndex)) {
                this._rightSeatinfo.model.m_call = call;
                this._rightPlayerController.setClockVisible(false);
                this._rightPlayerController.showJiaodz(call);
            }
            //刚才是我的上家叫的地主
            else if (index == ddz.GlobalFuncs.getPreIndex(this._mySeatIndex)) {
                this._leftSeatinfo.model.m_call = call;
                this._leftPlayerController.setClockVisible(false);
                this._leftPlayerController.showJiaodz(call);
            } else if (this.isReplay()) {
                this.isType(ddz.Enums.PlayType.PLAY_TYPE_HUANLE) ? this.happyJiaodz(call) : this._classicJiaodz(call);
            }
        }

        if (this._tableInfo.config.m_grab == 1 && this._mDizhuCalled == false && call == 1) { //如果是抢地主模式，第一个叫1分，则地主被叫，接下来就是抢地主或者不抢
            this._mDizhuCalled = true;
        }
    },

    onActionGameStart: function(result) {
        ddz.LOGD(this._TAG, "action == game_start");
        //看返回的nowop字段，如果是该我操作，那就是我为地主，否则不是
        this._finishJiaodz();
        this.changePlayerAvatar();
        this._flipExtraCards(false, true);
    },

    /**
     * 哪个座位打的什么牌
     * @param result
     */
    onActionCard: function(result) {
        //解析刚才是谁打了什么牌，以便在牌桌上显示
        ddz.LOGD(this._TAG, "action == card");
        //哪个座位打的什么牌
        var index = result["seatId"];
        var cards = result["cards"];

        var cardTypd ,sortedCards;

        if (cards.length > 3){
            var card_types = ddz.RobotGlobal.judgeType(cards);

            if (card_types.length > 0){
                cardTypd = card_types[0];
                sortedCards = cardTypd.getCards();
            }
            else{
                sortedCards = ddz.AI.sordPlayCards(cards);
            }
        }
        else{
            sortedCards = cards;
        }

        if (this.isErdou() && index == ddz.GlobalFuncs.GetNextIndex(this._mySeatIndex, 2)) {
            this._topPlayerController.setClockVisible(false);
            this._topSeatinfo.playCards(cards);
            this._topPlayerController.playCards(sortedCards, this._isDizhu(index));

            return;
        } else if (index == ddz.GlobalFuncs.GetNextIndex(this._mySeatIndex)) {
            //是我的下家打得牌
            this._rightPlayerController.setClockVisible(false);
            this._rightSeatinfo.playCards(cards);
            this._rightPlayerController.playCards(sortedCards, this._isDizhu(index));
            return;
        } else if (index == ddz.GlobalFuncs.getPreIndex(this._mySeatIndex)) {
            //是我的上家打得牌
            this._leftPlayerController.setClockVisible(false);
            this._leftSeatinfo.playCards(cards);
            this._leftPlayerController.playCards(sortedCards, this._isDizhu(index));
            return;
        } else if (this.isReplay()) {
            //回放
            this._operateController.hideAll();
            this._playCardsFromServer(sortedCards);
            return;
        }

        //===================是我刚才打出去的牌=====================//
        this._isUserInteractive = true;

        this._setCardsTipVisible(false);
        this._operateController.hideAll();
        this._playCardsFromServer(sortedCards);
    },

    /**
     * 托管
     * @param result
     */
    onActionRb: function(result) {
        var robots = result["robots"]; //[1, 0, 0]
        var tips = result["tips"];
        if (tips) {
            hall.MsgBoxManager.showToast({title : tips});
            return;
        }

        //我被托管
        if (robots[this._mySeatIndex - 1]) {
            ddz.LOGD(this._TAG, "托管状态 ： 我被托管了");
            // this._isInTrust = true;
            this.setIsInTrust(true);

        } else {
            ddz.LOGD(this._TAG, '托管状态 ： 别人被托管了');
            // this._isInTrust = false;
            // this.setIsInTrust(false);
        }
    },

    onActionGameWin: function(result) {
        // 首先判断是否是流局
        if (result && result.hasOwnProperty('nowin') && result['nowin'] === nowin) { //流局重新发牌
            this._reset();
            ddz.matchModel.isGameFlow = true;
            var stageNumber = ddz.matchModel.getStageIndex();
            if (stageNumber == 1){
                ddz.matchModel.matchSignin();
            }else {
                ddz.matchModel.matchChallenge();
            }
            return;
        }

        //游戏结束后重新设置倍数
        var base = ddz.SINGLE_SCORE_BASE;

        if (this._mode == ddz.Enums.PlayMode.PLAY_MODE_NET) { //联网根据table_info获取，match和闯关待定
            var table_config = this._tableInfo.config;
            base = table_config.m_roommulti * table_config.m_basemulti * table_config.m_base;
        } else if (this._mode == ddz.Enums.PlayMode.PLAY_MODE_MATCH) {
            var table_config2 = this._tableInfo.config;
            base = parseInt(this._tableInfo.matchNote.m_matchInfo.m_basescore) * table_config2.m_basemulti * table_config2.m_base;
        }

        var mul = "";
        if (this._mode != ddz.Enums.PlayMode.PLAY_MODE_MATCH) { // 比赛场game_win不返回windoubles字段
            mul = result["windoubles"];
        } else {
            mul = this._multiNum;
        }

        //
        this._operateController.hideAll();
        this.cardsTip.string = "";
        //游戏结束
        this.setStatus(ddz.Enums.PlayStatus.PLAY_STATUS_GAMEOVER);
        this._tableInfo.parseComplain(result);
        this._tableState.parseTableState(result["stat"]);

        if (this._tableState.normalInfo.m_chuntian > 1) {
            //播放春天动画
            this._cardAniPlayer.playChunTian();
        }

        //比赛场没有结束统计界面
        if (this._tableInfo.isMatch) {
            return;
        }
        //刷新金币
        // this._depositeItem.setEnabled(false);
        this._isTrustEnable = false;
        this._isUserInteractive = false;
        // this._startGameOverAnimation(result);
        if (this.isErdou()) {
            var that = this;
            ty.Timer.setTimer(this, function () {
                that._startGameOverAnimation(result);
            }, 1, 0);
        } else {
            this._startGameOverAnimation(result);
        }
    },

    _startGameOverAnimation: function(result) {
        ////////////////////////////////////////////////////////////////////
        //判断游戏结果
        if (this.isErdou()) {
            this._topPlayerController.setPrepareVisible(false);
        } else {
            this._leftPlayerController.setPrepareVisible(false);
            this._rightPlayerController.setPrepareVisible(false);
        }

        this._gameResult = this._getGameResult(result);

        //预加载结算controller
        this._preLoadResultController(this._gameResult, result);
        //游戏结束后的明牌相关
        this._showCardsWhenGameOver();
        // 取消托管状态
        this.setIsInTrust(false);
    },

    //初始化结算controller
    _preLoadResultController: function(result, preResult) {
        //比赛场不显示结果页面
        //根据不同的游戏结果初始化不同的结算界面
        if (this._gameResult == 'invalid') {
            // 结果非法，不初始化结算页面
            ddz.LOGD(this._TAG, "初始化结算界面失败");
            return;
        }
        if (this._gameResult == 'nowin') { //暂不处理
            // 流局时，直接显示底部的两个按钮
            return;
        }


        var that = this;
        // 春天
        if (this._tableState.normalInfo.m_chuntian > 1) {
            // var dzWin = preResult["dizhuwin"];
            // var layer = this._chuntianLayer = new ddz.ChuntianLayer(dzWin);
            // this.addChild(layer, 99);
            // var call = function() {
            //     layer.removeFromParent();
            //     that._showResultController(result);
            // };
            // var act = cc.sequence(cc.delayTime(2), cc.callFunc(call, layer));
            // layer.runAction(act);
            //有春天先显示春天动画,再显示结算面板
            //延时3秒
            ty.Timer.setTimer(this, function () {
                that._showResultController(result);
            }, 2, 0);
        } else {
            // var act = cc.sequence(cc.delayTime(3), cc.callFunc(function() {
            //     that._showResultController(result);
            // }));
            // this.runAction(act);
            //延时3秒
            ty.Timer.setTimer(this, function () {
                that._showResultController(result);
            }, 3, 0);
        }
    },

    _showResultController: function(result) {

        // hall.MsgBoxManager.showToast({title : '显示结算'});
        this._isInTrust = null;
    },

    //游戏结束后显示剩下的牌
    _showCardsWhenGameOver: function() {
        //明牌标示图片
        if (this._mySeatinfo) {
            this._mySeatinfo.setNotShowCards();
        }
        var bdizhu = false;
        if (this.isErdou()) {
            var top_cards = this._topSeatinfo.model.m_card;
            if (top_cards.length > 0) {
                this._topPlayerController.clearCards();
            }
            bdizhu = !this._isDizhu(this._mySeatIndex);
            this._topPlayerController.showCards(top_cards, bdizhu);

        } else {
            //显示上家和下家的牌
            var leftindex = ddz.GlobalFuncs.getPreIndex(this._mySeatIndex);
            var left_cards = this._leftSeatinfo.model.m_card;
            var isDiZhu = this._isDizhu(leftindex);
            this._leftPlayerController.showCards(left_cards, isDiZhu);

            var rightindex = ddz.GlobalFuncs.GetNextIndex(this._mySeatIndex);
            var right_cards = this._rightSeatinfo.model.m_card;
            isDiZhu = this._isDizhu(rightindex);
            this._rightPlayerController.showCards(right_cards, isDiZhu);
        }

        if (this._cards.length > 0) {
            //展示自己手牌
            this._clearPlayedCards();
        }
    },

    /***
     * 判断游戏结果，共有5种情况
     * 实际游戏结果有6种，还有一种情况，是流局，nowin
     * nowin ： 0/没有 - 非流局； 1 - 流局
     */
    _getGameResult: function(result) {
        if (!result) {
            return 'invalid';
        }

        // 首先判断是否是流局
        var nowin = result['nowin'];
        if (typeof(nowin) != 'undefined' && null != result && 1 == nowin) { //暂时不处理流局
            // 流局
            return 'nowin';
        }

        //地主是否胜利？
        var dzwin = result["dizhuwin"];

        ty.NotificationCenter.trigger(ddz.EventType.SHOW_GAME_WIN_ANI, dzwin);

        //判断我是不是地主？
        var bIamDizhu = false;
        var dzIndex = this._tableState.normalInfo.m_dizhu;
        var mySeatIndex = this._mySeatIndex;
        if (dzIndex == mySeatIndex) {
            bIamDizhu = true;
        }

        //先判断胜负
        var win = (bIamDizhu && dzwin) || (!bIamDizhu && !dzwin);

        //失败
        var myindex = this._mySeatIndex;
        var mycoin = result["seat" + myindex][0];
        var coins;
        var seatInfos;
        var dzpos = this._tableState.normalInfo.m_dizhu;
        var dzindex = 0; //结算页面的三个排行中，地主所在的位置
        if (this.isErdou()) {
            var topIndex = ddz.GlobalFuncs.GetNextIndex(myindex, 2);
            var topcoin = result["seat" + topIndex][0];
            coins = [mycoin, topcoin];
            seatInfos = [this._mySeatinfo, this._topSeatinfo];
            if (dzpos !== myindex) {
                dzindex = 1;
            }
        } else {
            var leftIndex = ddz.GlobalFuncs.getPreIndex(myindex);
            var rightIndex = ddz.GlobalFuncs.GetNextIndex(myindex);
            var leftcoin = result["seat" + leftIndex][0];
            var rightcoin = result["seat" + rightIndex][0];
            coins = leftcoin > rightcoin ? [mycoin, leftcoin, rightcoin] : [mycoin, rightcoin, leftcoin];
            seatInfos = leftcoin > rightcoin ? [this._mySeatinfo, this._leftSeatinfo, this._rightSeatinfo] : [this._mySeatinfo, this._rightSeatinfo, this._leftSeatinfo];
            if (dzpos === leftIndex) {
                dzindex = leftcoin > rightcoin ? 1 : 2;
            } else if (dzpos === rightIndex) {
                dzindex = leftcoin > rightcoin ? 2 : 1;
            }
        }

        var mySkillInfo = null;
        var skill = result["skillScoreInfos"];
        if (skill) {
            mySkillInfo = skill[this._mySeatIndex - 1];
        }
        return {
            "win": win,
            "coins": coins,
            "customTableId": this._tableInfo.m_customTableId,
            "seatInfos": seatInfos,
            "skillInfo": mySkillInfo,
            "dzindex": dzindex
        };
    },

    /************************************** 自己相关操作开始 ******************************************/


    //继续
    _normalContinue: function() {
        ddz.LOGD(this._TAG, "_normalContinue");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.button_click_sound, false);
        this.reStart();
    },

    //重新开始
    reStart: function(bLeave) { //bLeave表示是否离开牌桌，如果不离开，则是原牌桌人继续游戏
        if (!this.isMode(ddz.Enums.PlayMode.PLAY_MODE_SINGLE)) {
            //send leave room
            var time = 0;
            if (bLeave) {
                ddz.MsgFactory.getRoomLeave(hall.ME.normalInfo.userId, ddz.GameId, this._roomId, ty.SystemInfo.clientId);
                time = 2;
            }
            //延迟2秒发送，确保顺序
            var that = this;
            var ctid = this._tableInfo.m_customTableId;
            ty.Timer.setTimer(this, function () {
                that._sendQuickStart(that, ctid);
            },time , 0);
        }
        this._reset();
    },
    //快速开始
    _sendQuickStart: function(target, ctid) {
        if (ctid) {
            hall.MsgFactory.roomAction("quick_start", ctid);
        } else {
            ddz.MsgFactory.getQuickStart(hall.ME.normalInfo.userId, ddz.GameId, this._tableInfo.roomId(), hall.staticSystemInfo.version, null);
        }
    },

    _getIndexFromPos: function(pos) {
        var clen = this._cards.length;
        var index = Math.floor((pos.x - this._cardsOriginX) / this._cardsIntervalX);
        if (index > this._cardsBreakline - 1) {
            index = this._cardsBreakline - 1;
        }
        if (pos.y < ddz.CARD_BIG_SIZE.height) {
            if (clen > this._cardsBreakline){
                var lastPointForTwo = (clen-this._cardsBreakline-1)*this._cardsIntervalX+ddz.CARD_BIG_SIZE.width;
                if (pos.x <= lastPointForTwo){
                    index += this._cardsBreakline;
                }
            }
        }
        if (index >= clen - 1) {
            index = clen - 1;
        }
        return index;
    },
    _onTouchBegan: function(pos) {
        var index = this._getIndexFromPos(pos);
        this._touchCardIndexBegin = index;
        this._touchCardIndexEnd = index;

        var tc = this._cards[this._touchCardIndexBegin];
        tc.showMask(true);
        this._touchedCards.push(tc);
        return true;
    },

    _clearTouchedCards: function() {
        var cards = this._touchedCards;
        var len = cards.length;
        for (var tmpi = 0; tmpi < len; tmpi++) {
            var tc = cards.pop();
            tc.showMask(false);
        }
    },

    touchCardsMoved: function(pos) {
        var index = this._getIndexFromPos(pos);
        var begin = this._touchCardIndexBegin;
        var end = this._touchCardIndexEnd;

        var startpos;
        var endpos;
        var i;
        var tc;

        if (index < end) {
            if (index >= begin) {
                for (i = end; i > index; i--) {
                    tc = this._touchedCards.pop();
                    tc.showMask(false);
                }
            } else {
                if (end <= begin) {
                    startpos = index;
                    endpos = end - 1;
                } else {
                    this._clearTouchedCards();
                    startpos = index;
                    endpos = begin;
                }
                for (i = endpos; i >= startpos; i--) {
                    tc = this._cards[i];
                    tc.showMask(true);
                    this._touchedCards.push(tc);
                }
            }
        } else if (index > end) {
            if (index <= begin) {
                for (i = end; i < index; i++) {
                    tc = this._touchedCards.pop();
                    tc.showMask(false);
                }
            } else {
                if (end >= begin) {
                    startpos = end;
                    endpos = index;
                } else {
                    this._clearTouchedCards();
                    startpos = begin - 1;
                    endpos = index;
                }
                for (i = startpos + 1; i <= index; i++) {
                    tc = this._cards[i];
                    tc.showMask(true);
                    this._touchedCards.push(tc);
                }
            }
        }
        this._touchCardIndexEnd = index;
    },

    //触摸是否在手牌区域，如果在的话，一定会吞掉触摸事件，修复隔牌点击头像的bug(因为虽然点着牌，但是不处理，导致没吞掉)
    isTouchOnCards: function(pos) {
        var len = this._cards.length;
        if (len <= 0) {
            return false;
        }
        if (len > this._cardsBreakline) { //有2行
            if (pos.y > this.cardsContainer.height - ddz.CARD_BIG_SIZE.height) { //第一行肯定在
                return true;
            } else {
                return pos.x <= (len - this._cardsBreakline - 1) * this._cardsIntervalX + ddz.CARD_BIG_SIZE.width;
            }
        } else { //1行
            var hitX = pos.x > this._cardsOriginX && pos.x < (this._cardsOriginX + (len - 1) * this._cardsIntervalX + ddz.CARD_BIG_SIZE.width);
            var hitY = pos.y > this.cardsContainer.height - ddz.CARD_BIG_SIZE.height;
            return hitX && hitY;
        }
    },

    /* 初次选牌，挑最长的一组牌出牌，第一步只挑顺子和顺对
     * 顺子和顺对，没有副牌，优化的效果最好
     * 三顺有副牌，而副牌是不确定的，暂时先放放
     */
    _selectLegalTouchCards: function() {
        var len = this._touchedCards.length;
        if (len <= 0) {
            return;
        }
        //得到count值数组
        var touchCardsCount = [];
        for (var nIndex = 0; nIndex < len; nIndex++) {
            touchCardsCount[nIndex] = this._touchedCards[nIndex]._info._number;
        }
        ddz.LOGD(this._TAG, "选中的牌的count值数组是：");

        var oneLongest = ddz.AI._findLongestFromSelectedCards(touchCardsCount);
        if (oneLongest.length <= 0) {
            ddz.LOGD(this._TAG, "出错了，没有找出最长的牌");
            return;
        }
        //处理癞子
        //
        var searchOneLongest = oneLongest.slice(0);

        for (var i = 0; i < len; i++) {
            var card = this._touchedCards[i];
            var index = hall.GlobalFuncs.FindInArray(searchOneLongest, card._info._number);
            if (index >= 0) {
                searchOneLongest[index] = -1;
                ddz.LOGD(this._TAG, "拖动选择出最长牌，弹起来");
                this._selectedCards.push(card);
                card.up();
            }
        }
    },

    touchCardsEnd: function() {
        // 处理拖动的牌

        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.click_cards, false);
        //是否已经选择了牌
        var hasSelect = false;
        if (this._selectedCards.length > 0) {
            hasSelect = true;
        }
        //是否是主动出牌
        var active = false;
        if (this._topCardType == null) {
            active = true;
        } else {
            ddz.LOGD(this._TAG, 'top Card Type is : ' + this._topCardType._type);
        }
        ddz.LOGD(this._TAG, "touch cards num is : " + this._touchedCards.length);

        var cardOne, i, index, h;
        /*
         * 点选牌优化之双王致胜
         * 点选了一张牌（大王或者小王），而且是双王致胜的情况下，自动选中双王
         */
        if (!hasSelect && 1 == this._touchedCards.length && ddz.RobotGlobal.rocketWin(this._mySeatinfo.model.m_card)) {
            cardOne = this._touchedCards[0];
            if (cardOne._info._number == 52 || cardOne._info._number == 53) {
                // 选中了一张大王或者小王，将另外一张王也提起
                for (i = this._cards.length - 1; i >= 0; i--) {
                    if ((this._cards[i]._info._number == 52 || this._cards[i]._info._number == 53) && (this._cards[i]._info._number != cardOne._info._number)) {
                        this._touchedCards.push(this._cards[i]);
                        break; // 跳出循环
                    }
                }
            }
        }

        /*
         * 没有选中的牌，点起了一张牌，
         * 如果topType是没有或者对子，
         * 选中的牌刚好是一个对子尝试做选中的优化
         */
        if (!hasSelect && 1 == this._touchedCards.length && (active || this._topCardType._type == ddz.Enums.PaixingType.DOUBLE_CARD)) {
            // 如果手牌中该牌是一个对子，则同时把另一张弹起
            var pc = ddz.RobotGlobal.getPCArrayByPoint(this._mySeatinfo.model.m_card); // 计算PC
            cardOne = this._touchedCards[0];
            var nPoint = cardOne._info._point;
            var nCount = cardOne._info._number;
            var pos = ddz.GlobalFuncs.getCardValueByNum(cardOne._info._number);
            // 取选中的牌在PC中的POS
            for (var m = pc.length - 1; m >= 0; m--) {
                if (pc[m].point == pos) {
                    // ddz.LOGD(this._TAG, 'Pos : ' + m);
                    if (2 == pc[m].count) {
                        // 是个对子，把另外一张牌也弹起
                        for (i = this._cards.length - 1; i >= 0; i--) {
                            if (this._cards[i]._info._point == nPoint && this._cards[i]._info._number != nCount) {
                                if (active && this._isInShunzi(i)) {

                                } else {
                                    this._touchedCards.push(this._cards[i]);
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }

        //
        //如果当前没有任何一张选中的牌，那么要在滑中的牌中弹出能出的最长牌
        // if (hasSelect == false && active == true)
        //按照策划需求在拖动选择牌时总时提起最长得牌
        if (hasSelect == false) {
            this._selectLegalTouchCards();
            for (index = 0; index < this._touchedCards.length; index++) {
                this._touchedCards[index].showMask(false);
            }
            this._touchedCards = [];
        } else {
            var len = this._touchedCards.length;
            var card;
            for (i = 0; i < len; i++) {
                card = this._touchedCards.pop();
                card.showMask(false);
                index = hall.GlobalFuncs.FindInArray(this._selectedCards, card);
                //放回去
                if (index >= 0) {
                    this._selectedCards.splice(index, 1);
                    card.down();
                }
                //弹起来
                else {
                    this._selectedCards.push(card);
                    card.up();
                }
            }
        }

        this._operateController.btnPlay.interactable = this._selectedCards.length > 0;

        return true;
    },

    //判断一张牌是否在顺子里
    _isInShunzi: function(mypos) {
        var card = this._cards[mypos];
        var myVal = card._info._value;
        if (myVal > 11) {
            //11的权重为A
            return false;
        }

        //小于我的牌数的连续个数
        var minCnt = 0;
        var index;
        var judgeCardVal;

        for (index = mypos + 1; index < this._cards.length; ++index) {
            judgeCardVal = this._cards[index]._info._value;
            if (judgeCardVal == myVal || myVal - judgeCardVal == minCnt) {
                continue;
            }
            if (myVal - judgeCardVal != minCnt + 1) {
                break;
            }
            ++minCnt;
        }

        //大于我的牌数的连续个数
        var largerCnt = 0;
        for (index = mypos - 1; index >= 0; --index) {
            judgeCardVal = this._cards[index]._info._value;
            if (judgeCardVal > 11) {
                break;
            }
            if (judgeCardVal == myVal || myVal - judgeCardVal == -largerCnt) {
                continue;
            }
            if (myVal - judgeCardVal != -largerCnt - 1) {
                break;
            }
            ++largerCnt;
        }

        ddz.LOGD(this._TAG, "is in shunzi : = " + (minCnt + largerCnt));
        ddz.LOGD(this._TAG, "is in shunzi minCnt = " + minCnt);
        ddz.LOGD(this._TAG, "is in shunzi largerCnt = " + largerCnt);
        return (minCnt + largerCnt) >= 4;
    },

    _clearPlayedCards: function() {
        while (this._playedCards.length > 0){
            var card = this._playedCards.pop();
            this.returnCard(card.node);
        }
    },

});