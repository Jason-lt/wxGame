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

        roleSprite : cc.Node,
        spRole : sp.Skeleton,

        toolBackNode : cc.Node,
        toolNode : cc.Node,
        toolNodePrefabList : [cc.Prefab],

        toolList :[],
        speedConfig :null,

        windowHeight : 1136,
        windowWidth : 640,
        nowX : 0,
        topY : 100,
        bottomY : -568,
        normalY : 0,
        nowY : -560,

        state : 0,//0:运动,1、停止
        horizontalVelocityCoefficient : 200,//横向速度系数(与加速计之间的参数)
        // horizontalAcceleratedSpeed : 200,//横向加速度
        verticalAcceleratedSpeed : 20,//纵向加速度
        horizontalSpeed : 0,//横向速度
        verticalSpeed : 200,//纵向速度
        verticalInitialSpeed : 200,//纵向初始速度

        canAddScore : false,
        canGameOver : false,
        overDt : 0,
        nowAnimationName : "stand"
    },
    getVerticalSpeedNow : function () {
        return this.verticalSpeed;
    },
    getNextNodeY : function () {
        var nextSpeed = this.verticalSpeed - this.verticalAcceleratedSpeed/60;
        var nextY = this.nowY + nextSpeed/60;
        return nextY;
    },
    changePositionToY : function (y) {
        this.nowY = y;
        this.node.y = y ;
    },

    getRoleY : function () {
        return this.nowY;
    },
    getCanAddScore : function () {
        return this.canAddScore;
    },
    changeHorizontalSpeed : function (event,type) {
        // if(type == 'left'){
        //     this.horizontalSpeed = -100 * this.horizontalVelocityCoefficient;
        // }else {
        //     this.horizontalSpeed = 100 * this.horizontalVelocityCoefficient;
        // }
    },
    changeHorizontalSpeedForAccelerometerChange : function (accelerometer) {
        this.horizontalSpeed = accelerometer * this.horizontalVelocityCoefficient;
        if(accelerometer < 0){
            this.roleSprite.scaleX = 1;
        }else {
            this.roleSprite.scaleX = -1;
        }
    },

    runSpecialEffectsWithProperty : function () {
        if(this.verticalSpeed >= 0){
            return 0;
        }
        if(this.nowY >= this.normalY){//踏板开始移动
            ty.NotificationCenter.trigger(jump.EventType.CHANGE_PEDAL_SPEED,this.verticalInitialSpeed/2);
        }
        this.canAddScore = true;
        return 1;
    },
    playToolEffect : function (pedalProperty) {
        if(pedalProperty.treadCount != 0){
            this.verticalInitialSpeed = this.speedConfig.verticalInitialSpeed;
            this.verticalSpeed = this.verticalInitialSpeed;
        }
        if(-pedalProperty.sectionWidth > jump.gameModel.pedalGapWidth || jump.gameModel.pedalGapWidth > pedalProperty.sectionWidth){
            if(pedalProperty.pedalType != "disablePedal") {
                jump.AudioHelper.playEffect(jump.EffectPath_mp3.jumpEffect,false);
            }
            return;
        }
        if(pedalProperty.pedalType == "normalPedal" || pedalProperty.pedalType == "oncePedal" || pedalProperty.pedalType == "movePedal") {
            jump.AudioHelper.playEffect(jump.EffectPath_mp3.jumpEffect,false);
        }else if(pedalProperty.pedalType == "disablePedal") {
            jump.AudioHelper.playEffect(jump.EffectPath_mp3.disableEffect,false);
        }else if(pedalProperty.pedalType == "springRing") {
            //增加初始速度的道具
            jump.AudioHelper.playEffect(jump.EffectPath_mp3.springRingEffect,false);
            this.verticalSpeed = pedalProperty.initialSpeed*this.windowHeight/1136;
        }else if(pedalProperty.pedalType == "trampoline"){
            jump.AudioHelper.playEffect(jump.EffectPath_mp3.trampolineEffect,false);
            //增加初始速度的道具
            this.verticalSpeed = pedalProperty.initialSpeed*this.windowHeight/1136;
            this.spRole.setAnimation(0, "upfanguan", true);
            // this.nowAnimationName = "fangun";
            // jump.gameModel.isOnAnimation = true;
            var that = this;
            ty.Timer.setTimer(this,function () {
                // jump.gameModel.isOnAnimation = false;
                that.spRole.setAnimation(0, "up", true);
                // that.nowAnimationName = "up";
            },1,0);
        }else if(pedalProperty.pedalType == "bambooDragonfly" || pedalProperty.pedalType == "rocketTube"){
            var toolNameList = ["bambooDragonfly","rocketTube"];
            var index = toolNameList.indexOf(pedalProperty.pedalType);
            var prefab = this.toolNodePrefabList[index];
            var pedalTool = cc.instantiate(prefab);
            pedalTool.x = pedalProperty.backOnRoleX;
            pedalTool.y = pedalProperty.backOnRoleY;
            pedalTool.tag = 200;
            var toolNode;
            if(pedalProperty.beforeRole == 1){
                this.toolNode.active = true;
                this.toolBackNode.active = false;
                toolNode = this.toolNode;
            }else {
                this.toolNode.active = false;
                this.toolBackNode.active = true;
                toolNode = this.toolBackNode;
            }
            toolNode.addChild(pedalTool);
            var timeOfDuration = pedalProperty.timeOfDuration;
            var effectPath;
            if(pedalProperty.pedalType == "bambooDragonfly"){
                effectPath = "jump/sound/propeller"+timeOfDuration+".mp3";

                var ani = pedalTool.getComponent(cc.Animation);
                var clipName = ani.getClips()[0].name;
                var anim = ani.getAnimationState(clipName);
                anim.play();
            }else {
                effectPath = "jump/sound/jetpack"+timeOfDuration+".mp3";
            }
            jump.AudioHelper.playEffect(effectPath,false);
            //一段时间内飞起来
            jump.gameModel.isOnAnimation = true;
            this.verticalAcceleratedSpeed = 0;
            this.verticalSpeed = pedalProperty.flySpeed*this.windowHeight/1136;
            var that = this;
            ty.Timer.setTimer(this,function () {
                toolNode.active = true;
                jump.gameModel.isOnAnimation = false;
                that.verticalAcceleratedSpeed = that.speedConfig.verticalAcceleratedSpeed;
                var aniIndex = 0;
                if(pedalProperty.pedalType == "bambooDragonfly"){
                    aniIndex = 1;
                }
                var ani = pedalTool.getComponent(cc.Animation);
                var clipName = ani.getClips()[aniIndex].name;
                var anim = ani.getAnimationState(clipName);
                anim.play();
            },timeOfDuration,0);
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        var winSize = cc.director.getWinSize();
        this.windowHeight = winSize.height;
        this.windowWidth = winSize.width;
        this.bottomY = -winSize.height/2;
        this.speedConfig = jump.gameModel.speedConfig || jump.Share.speedConfig;
        this.horizontalVelocityCoefficient = this.speedConfig.horizontalVelocityCoefficient;
        this.verticalAcceleratedSpeed = this.speedConfig.verticalAcceleratedSpeed;
        this.verticalInitialSpeed = this.speedConfig.verticalInitialSpeed;
        this.topY = this.speedConfig.roleTopY;
        this.verticalSpeed = this.verticalInitialSpeed;
        ty.NotificationCenter.listen(jump.EventType.CHANGE_ROLE_SPEED,this.changeVerSpeed,this);
        ty.NotificationCenter.listen(jump.EventType.CHANGE_ROLE_HORIZONTAL_SPEED,this.changeHorizontalSpeedForAccelerometerChange,this);
        ty.NotificationCenter.listen(jump.EventType.TOOL_EFFECT_ROLE,this.playToolEffect,this);
    },

    reStartGame : function () {
        this.horizontalVelocityCoefficient = this.speedConfig.horizontalVelocityCoefficient;
        this.verticalAcceleratedSpeed = this.speedConfig.verticalAcceleratedSpeed;
        this.verticalInitialSpeed = this.speedConfig.verticalInitialSpeed;
        this.verticalSpeed = this.verticalInitialSpeed;
        this.nowY = -jump.gameModel.roleInitatialHight*this.windowHeight/1136;
        this.node.y = this.nowY;
        this.state = 0;
        this.nowX = 0;
        this.node.x = this.nowX;
        this.overDt = 0;
        this.canAddScore = false;
        this.spRole.setAnimation(0, "up", true);
        // this.nowAnimationName = "up";
    },
    changeVerSpeed : function (speed) {
        if(this.state == 0 && speed == 0){
            return;
        }
        this.state = 0;
        if(speed == 0){
            this.verticalSpeed = -this.verticalInitialSpeed*0.1;
            this.node.y = this.nowY -10;
            this.nowY = this.node.y;
            this.verticalAcceleratedSpeed = this.speedConfig.verticalAcceleratedSpeed;
        }else {
            this.verticalSpeed += speed;
        }

        // this.nowHeight = this.normalY;
    },

    update : function(dt) {
        if(jump.gameModel.isGameOver){
            this.overDt ++;
            if(this.overDt <= 60){
                this.node.y = this.nowY - this.windowHeight/60;
                this.nowY = this.node.y;
                if(this.overDt == 60){
                    ty.NotificationCenter.trigger(jump.EventType.SHOW_MYSCORE_AFTER_GAMEOVER);
                }
            }
            return;
        }
        this.node.x = this.nowX + dt* this.horizontalSpeed;
        this.nowX = this.node.x;
        if(this.nowX >= this.windowWidth/2){
            this.nowX = -this.windowWidth/2;
            this.node.x = this.nowX;
        }else if(this.nowX <= -this.windowWidth/2){
            this.nowX = this.windowWidth/2;
            this.node.x = this.nowX;
        }
        if(this.state == 1){//持续上飞状态,role静止不动
            return;
        }
        if(!jump.gameModel.isOnAnimation){
            this.verticalSpeed -= dt*this.verticalAcceleratedSpeed;
        }
        // var aniName ;
        // if(this.verticalSpeed > 0){
        //     aniName = "shang";
        // }else {
        //     aniName = "xia";
        // }
        // if(aniName != this.nowAnimationName){
        //     this.spRole.setAnimation(0, aniName, true);
        //     this.nowAnimationName = aniName;
        // }
        this.node.y = this.nowY + dt*this.verticalSpeed;
        this.nowY = this.node.y;
        //速度为零,飞到最高点,pedal停止运动
        if(this.verticalSpeed == 0){
            // this.canGameOver = true;
            ty.NotificationCenter.trigger(jump.EventType.CHANGE_PEDAL_SPEED,0);
            return;
        }
        //向上飞行过程中,超过最高点,role停止运动,pedal添加响应速度
        if(this.nowY >= this.topY && this.verticalSpeed > 0){
            this.state = 1;
            ty.NotificationCenter.trigger(jump.EventType.CHANGE_PEDAL_SPEED,this.verticalSpeed);
            this.verticalSpeed = 0;
        }
        //运动到最低点,角色死亡
        if(this.nowY < this.bottomY){
            this.node.y = this.windowHeight/2;
            this.nowY = this.node.y;
            this.spRole.setAnimation(0, "stand", true);
            // this.nowAnimationName = "stand";
            // hall.LOGE("==","Game Over");
            ty.NotificationCenter.trigger(jump.EventType.GAME_OVER);
            this.unscheduleAllCallbacks();
            this.toolNode.removeAllChildren();
            this.toolBackNode.removeAllChildren();
            jump.AudioHelper.playEffect(jump.EffectPath_mp3.gameOverEffect,false);
        }
    },
    onDestroy:function(){
        this.unscheduleAllCallbacks();
        ty.NotificationCenter.ignoreScope(this);
    }
});
