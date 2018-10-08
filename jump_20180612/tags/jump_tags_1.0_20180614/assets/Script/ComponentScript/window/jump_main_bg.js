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
        bgSprite : cc.Sprite,
        topBgSprite : cc.Sprite,
        bottomBgSprite : cc.Sprite,

        roleNode : cc.Node,

        windowHeight : 1136,
        initalHeight : 0,

        moveSpeed : 200,
        verticalAcceleratedSpeed :20,

        state : 0, //0、滑动,1、停止
        bgY:0,

        surpassPrefab : {
            default : null,
            type : cc.Prefab
        },

        surpassList : [],

        type : "",

        overDt : 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        var winSize = cc.director.getWinSize();
        this.windowHeight = winSize.height;
        var speedConfig = jump.gameModel.speedConfig || jump.Share.speedConfig;
        this.verticalAcceleratedSpeed = speedConfig.pedalVerticalAcceleratedSpeed;
        ty.NotificationCenter.listen(jump.EventType.CHANGE_PEDAL_SPEED,this.changeNormalSpeed,this);
        ty.NotificationCenter.listen(jump.EventType.GAME_RESTART,this.gameReStart,this);
        if(this.type == "middle"){
            this.getSurpassScore();
        }
        if(debugMode){
            this.initalHeight = jump.gameModel.initScore;
        }
    },

    getSurpassScore : function () {
        this.topBgSprite.node.removeAllChildren();
        var baseScore = parseInt(this.initalHeight/5);
        var topScore = parseInt((this.initalHeight+1136)/5);
        var userDataList = JSON.parse(jump.gameModel.game_friendData);
        if(userDataList && userDataList.length){
            for (var i = userDataList.length-1 ; i >= 0 ; i --) {
                var user = userDataList[i];
                var score = user.sumScore;
                if (score > baseScore && score <= topScore && user.userId != ty.UserInfo.userId) {
                    var surpass = cc.instantiate(this.surpassPrefab);
                    surpass.y = ((score*5-this.initalHeight)*this.windowHeight/1136);
                    surpass.x = 0;
                    var com = surpass.getComponent('surpassNode');
                    com.changeName(user);
                    this.bgSprite.node.addChild(surpass);
                }
            }
        }
    },

    gameReStart : function (type) {
        this.overDt = 0;
        if(type == "start"){
            if(debugMode){
                this.initalHeight = jump.gameModel.initScore;
            }else {
                this.initalHeight = 0;
            }
            if(this.type == "middle"){
                this.getSurpassScore();
            }
        }
    },
    changeNormalSpeed : function (changeSpeed) {
        jump.gameModel.pedalVerSpeed = changeSpeed;
        if(changeSpeed == 0){
            this.state = 1;
            this.moveSpeed = 0;
        }else {
            this.state = 0;
            this.moveSpeed = changeSpeed;
        }
    },

    update : function(dt) {
        if(jump.gameModel.isGameOver){
            this.overDt ++;
            if(this.overDt <= 60){
                this.bgY = this.bgSprite.node.y + this.windowHeight/60;
                if(this.type == "middle"){
                    this.bgY = this.bgSprite.node.y + this.windowHeight/30;
                }
                this.bgSprite.node.y = this.bgY;
                this.topBgSprite.node.y = this.bgY + this.windowHeight;
                this.bottomBgSprite.node.y = this.bgY - this.windowHeight;
                if(this.bgY >= this.windowHeight/2){
                    var temp = this.bottomBgSprite;
                    this.bottomBgSprite = this.topBgSprite;
                    this.topBgSprite = this.bgSprite;
                    this.bgSprite = temp;
                }
                if(this.overDt == 28 && this.type == "back"){
                    ty.NotificationCenter.trigger(jump.EventType.SHOW_CAOPING_AFTER_GAMEOVER);
                }
            }
            return;
        }
        if(this.type == "middle"){
            var com = this.roleNode.getComponent('jump_role');
            var roleH = com.getRoleY();
            var canAddScore = com.getCanAddScore();
            if(canAddScore){
                var score = parseInt((((roleH-this.bgSprite.node.y)*1136/this.windowHeight)+this.initalHeight)/5);
                var topScore = parseInt((((this.windowHeight/2-this.bgSprite.node.y)*1136/this.windowHeight)+this.initalHeight)/5);
                var bottomScore = parseInt((((-this.windowHeight/2-this.bgSprite.node.y)*1136/this.windowHeight)+this.initalHeight)/5);
                if(score > jump.gameModel.totalScore){
                    jump.gameModel.totalScore = score;
                    ty.NotificationCenter.trigger(jump.EventType.CHANGE_TOTAL_SCORE);
                    var userDataList = JSON.parse(jump.gameModel.game_friendData);
                    if (userDataList && userDataList.length){
                        for (var i = userDataList.length - 1 ; i >= 0 ; i --){
                            var user = userDataList[i];
                            var userScore = user.sumScore;
                            if(userScore >= bottomScore && userScore <= topScore && userScore < score){
                                ty.NotificationCenter.trigger(jump.EventType.SURPASS_OTHERS,user);
                                break;
                            }
                        }
                    }
                }
            }
        }

        if(this.state == 1){
            return;
        }

        if(!jump.gameModel.isOnAnimation){
            this.moveSpeed -= this.verticalAcceleratedSpeed*dt;
        }
        jump.gameModel.pedalVerSpeed = this.moveSpeed;
        if(this.moveSpeed <= 0){
            this.state = 1;
            this.moveSpeed = 0;
            jump.gameModel.pedalVerSpeed = this.moveSpeed;
            ty.NotificationCenter.trigger(jump.EventType.CHANGE_ROLE_SPEED,0);
            return;
        }
        this.bgY = this.bgSprite.node.y - this.moveSpeed* dt/4;
        if(this.type == "middle"){
            this.bgY = this.bgSprite.node.y - this.moveSpeed* dt/2;
        }
        this.bgSprite.node.y = this.bgY;
        this.topBgSprite.node.y = this.bgY + this.windowHeight;
        this.bottomBgSprite.node.y = this.bgY - this.windowHeight;

        if(this.bgY <= -this.windowHeight/2){
            var temp = this.topBgSprite;
            this.topBgSprite = this.bottomBgSprite;
            this.bottomBgSprite = this.bgSprite;
            this.bgSprite = temp;
            if(this.type == "middle"){
                this.initalHeight += 1136;
                this.getSurpassScore();
            }
        }
    },
    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
    }
});
