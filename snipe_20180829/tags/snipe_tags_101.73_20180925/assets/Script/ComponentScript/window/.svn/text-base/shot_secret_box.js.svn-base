// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        textRich : {
            default : null,
            type : cc.RichText
        },
        boxSprite : {
            default : null,
            type : cc.Sprite
        },
        boxSpriteFrameList : [cc.SpriteFrame],
        checkBoxButton : {
            default : null,
            type : cc.Button
        },
        checkBoxSprite : {
            default : null,
            type : cc.Sprite
        },
        // checkBoxSpriteFrameList : [cc.SpriteFrame],

        boxType : "",
        openType : "",
        parentScene: {
            default: null,
            serializable: false
        }
    },
    onLoad : function() {
        var openConfig ;
        if(snipe.gameModel.getAllCheckConfig()){
            openConfig = snipe.GameWorld.treasureConfig.showAtWindow.tishen;
        }else {
            if(ty.UserInfo.isInBSGS ){
                openConfig = snipe.GameWorld.treasureConfig.showAtWindow.bsgs;
            }else {
                openConfig = snipe.GameWorld.treasureConfig.showAtWindow.nBsgs;
            }
        }
        var openTypeList = openConfig.openType;

        var shareProbability = openConfig.shareProbability;
        this.checkBoxButton.node.active = false;
        this.chooseOpenTypeWithTypeListAndIndex(openTypeList,0,shareProbability);

        ty.NotificationCenter.listen(snipe.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(snipe.EventType.REWARD_VIDEO_COMPLETE,this.rewardVideoComplete, this);
        ty.NotificationCenter.listen(snipe.EventType.REWARD_VIDEO_COMPLETE_ERROR,this.rewardVideoCompleteError, this);
    },

    chooseOpenTypeWithTypeListAndIndex : function (openTypeList,index,shareProbability) {
        if(index > 3){
            return;
        }
        this.checkBoxButton.node.active = false;
        var type = openTypeList[index];
        switch (type){
            case "ad":{
                if(hall.adManager.canPlay){
                    this.openType = "openAd";
                    this.textRich.string = "<color=#2B2B2B><b>看视频开启</b></color>";
                }else {
                   this.chooseOpenTypeWithTypeListAndIndex(openTypeList,index+1,shareProbability);
                }
                break
            }
            case "share":{
                var number = hall.GlobalFuncs.getRandomNumberBefore(100);
                if(number < shareProbability){
                    if(hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_STATE,0)){
                        this.chooseOpenTypeWithTypeListAndIndex(openTypeList,index+1,shareProbability);
                    }else {
                        if(ty.UserInfo.isInBSGS){
                            this.textRich.string = "<color=#2B2B2B><b>免费开启</b></color>";
                        }else {
                            this.textRich.string = "<color=#2B2B2B><b>炫耀一下并开启</b></color>";
                        }
                        this.openType = "openShare";
                    }
                }else {
                    if(hall.adManager.canPlay){
                        this.openType = "openAd";
                        this.textRich.string = "<color=#2B2B2B><b>看视频开启</b></color>";
                    }else {
                        this.chooseOpenTypeWithTypeListAndIndex(openTypeList,index+1,shareProbability);
                    }
                }
                break
            }
            case "checkbox":{
                if(hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_STATE_CHECK,0)){
                    this.chooseOpenTypeWithTypeListAndIndex(openTypeList,index+1,shareProbability);
                }else {
                    this.textRich.string = "<color=#2B2B2B><b>开启</b></color>";
                    this.openType = "openShare";
                    this.checkBoxButton.node.active = true;
                }
                break
            }
            case "direct":{
                this.textRich.string = "<color=#2B2B2B><b>开启</b></color>";
                this.openType = "open";
                break
            }
            default:break;
        }
    },
    setBoxTypeWithType : function (boxType,delegate) {

        snipe.GlobalFuncs.hideAdBtnWithTag(5002,true);

        this.boxType = boxType;
        this.parentScene = delegate;

        if(this.boxType == "treasureBox1"){
            this.checkBoxButton.node.active = false;
            this.textRich.string = "<color=#2B2B2B><b>开启</b></color>";
            this.openType = "open";
        }

        var spriteIndex = snipe.GameWorld.bottleNameList.indexOf(this.boxType);
        this.boxSprite.spriteFrame = this.boxSpriteFrameList[spriteIndex-4];
    },
    onCheckBoxChange : function () {
        if(this.openType == "openShare"){
            this.textRich.string = "<color=#2B2B2B><b>开启</b></color>";
            this.openType = "open";
        }else {
            this.textRich.string = "<color=#2B2B2B><b>开启</b></color>";
            this.openType = "openShare";
        }
        this.checkBoxSprite.node.active = this.openType == "openShare";
    },
    onClose : function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["closeBox",this.openType,this.boxType]);

        if(this.boxType == "treasureBox" && this.openType == "openShare"){
            var dayCount = hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_TIME,0);
            hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_TIME,dayCount+1);
            if(dayCount+1 >= snipe.GameWorld.toolUserTimeConfig.closeBoxTime){
                hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_STATE,1);
            }
        }

        if(snipe.GameWorld.gameOver){
            this.afterGameOver();
            return;
        }
        snipe.GameWorld.gamePause = false;
        snipe.GameWorld.gameGetBox = false;
        if(snipe.GameWorld.bottleCount <= 0) { //一局的瓶子打完了
            this.parentScene.levelUp();
        }
        this.node.destroy();
        snipe.GlobalFuncs.showAdBtnWithTag(5002,"normalLevel");
    },

    onOpenBox : function () {
        //TODO:TEST
        // if(debugMode){
        //     this.changeStateToGet();
        //     return;
        // }
        if(this.boxType == "treasureBox" && this.openType == "openShare"){
            hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_TIME,0);
        }

        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,["openBox",this.openType,this.boxType]);
        if(snipe.GameWorld.gameOver){
           this.afterGameOver();
            return;
        }
        switch (this.openType){
            case "open":{
                if(this.checkBoxButton.node.active){
                    var dayCount = hall.GlobalFuncs.ReadNumFromLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_TIME_CHECK,0);
                    hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_TIME_CHECK,dayCount+1);
                    if(dayCount+1 >= snipe.GameWorld.toolUserTimeConfig.closeBoxTime){
                        hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_STATE_CHECK,1);
                    }
                }
                this.changeStateToGet();
            }
            break;
            case "openShare":{
                if(this.checkBoxButton.node.active){
                    hall.GlobalFuncs.setInLocalStorage(snipe.gameModel.OPEN_BOX_CLOSE_TIME_CHECK,0);
                }
                if(ty.UserInfo.isInBSGS ){
                    snipe.Share.shareWithType(snipe.Share.onShareType.clickStatShareTypeOpenSecretBoxB);
                }else {
                    snipe.Share.shareWithType(snipe.Share.onShareType.clickStatShareTypeOpenSecretBoxN);
                }
            }
                break;
            case "openAd":{
                hall.adManager.showRewardedVideo("openBox");
            }
                break;
            default : break;
        }
    },

    rewardVideoComplete : function(isEnd){
        if(hall.adManager.rewardedVideoType != "openBox"){
            return;
        }
        if(isEnd){
            this.changeStateToGet();
        }else {
            hall.MsgBoxManager.showToast({"title":"视频播放未完成"});
        }
    },

    rewardVideoCompleteError : function (errorMsg) {
        if(hall.adManager.rewardedVideoType != "openBox"){
            return;
        }
        hall.MsgBoxManager.showToast({"title":errorMsg});
        this.changeStateToGet();
    },

    afterGameOver : function () {
        snipe.GameWorld.gameGetBox = false;
        hall.MsgBoxManager.showToast({"title":"游戏已结束"});
        var isCheck = snipe.gameModel.getAllCheckConfig();
        if(snipe.GameWorld.resurgenceTime >= snipe.GameWorld.toolUserTimeConfig.resurgenceTime || isCheck){
            snipe.GlobalFuncs.showGameOverWithMyScore();
        }else {
            snipe.GlobalFuncs.showResurgence();
        }
        this.node.destroy();
        snipe.GlobalFuncs.showAdBtnWithTag(5002,"normalLevel");
    },

    playAnimationAfterShareWithType : function (shareType) {

        if (shareType && (shareType == snipe.Share.onShareType.clickStatShareTypeOpenSecretBoxB ||
            shareType == snipe.Share.onShareType.clickStatShareTypeOpenSecretBoxN)) {
            var resultType = snipe.Share.resultType;
            switch (resultType) {
                case 1:
                    hall.MsgBoxManager.showToast({title : '分享到群才有效哦~'});
                    break;
                case 2:
                    hall.MsgBoxManager.showToast({title : '这个群今天已经打扰过了哦~'});
                    break;
                case 3:
                    this.changeStateToGet();
                    break;
                case 6:
                    hall.MsgBoxManager.showToast({title : '分享失败'});
                    break;
                default:
                    hall.MsgBoxManager.showToast({title : '分享失败了'});
                    break;
            }
        }
        snipe.Share.resultType = 0;
    },

    changeStateToGet : function () {
        var rewardConfig = snipe.GameWorld.treasureConfig.rewardConfig[this.boxType];
        var rand = Math.random();
        var rewardType;
        var rewardIndex;
        var nowPercent = 0;
        var haveReward = false;
        for (var i = 0 ; i < snipe.GameWorld.treasureBoxTypeList.length ; i ++){
            rewardIndex = i;
            rewardType = snipe.GameWorld.treasureBoxTypeList[i];
            nowPercent += rewardConfig[rewardType];
            if(rand <= nowPercent){
                haveReward = true;
                break;
            }
        }
        if(!haveReward){
            rewardIndex = hall.GlobalFuncs.getRandomNumberBefore(snipe.GameWorld.treasureBoxTypeList.length);
            rewardType = snipe.GameWorld.treasureBoxTypeList[rewardIndex];
        }

        if(rewardType == "laserGun"){
            snipe.gameModel.shareToGetreward(11000002);//获得激光瞄准器
        }else if(rewardType == "infiniteBullet"){
            snipe.gameModel.shareToGetreward(11000001);//获得无限子弹
        }else if(rewardType == "grenade"){
            snipe.gameModel.shareToGetreward(11000005);//获得手榴弹
        }else{
            // snipe.GlobalFuncs.playGetPropBoxAni(rewardIndex,snipe.GameWorld.propertyConfig[rewardType].bulletType);
            snipe.GlobalFuncs.playGetPropBoxAni(rewardIndex);
            snipe.GlobalFuncs.setBulletType(snipe.GameWorld.propertyConfig[rewardType].bulletType);
        }
        this.node.destroy();
        snipe.GlobalFuncs.showAdBtnWithTag(5002,"normalLevel");
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // LIFE-CYCLE CALLBACKS:

    // start () {
    //
    // },

    // update (dt) {},
});
