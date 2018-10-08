
cc.Class({
    extends: cc.Component,

    properties: {
        shapeSprite : cc.Sprite,
        shapeSpriteFrameList : [cc.SpriteFrame],
        toolNode : cc.Node,
        toolNodePrefabList : [cc.Prefab],
        toolNameList :[],
        windowHeight : 1136,
        windowWidth : 640,
        pedalX : 0,
        pedalY : 0,
        pedalWidth : 0,
        pedalHeight : 0,

        elasticCoefficient : 1,
        verticalAcceleratedSpeed : 20,//纵向加速度

        verticalSpeed : 200,
        horizontalSpeed : 0,

        // state : 1 ,//0、运动,1、停止
        pedalTag : 0,
        pedalType:"normalPedal",
        pedalProperty:{
            "treadCount": 1000
        },
        treadCount : 1000

        // isOnAnimation : false
    },

    setInformation : function (pedalTag,type,height) {
        this.pedalY = height;
        this.pedalTag = pedalTag;
        this.pedalType = type || "normalPedal";
        var toolList = jump.gameModel.toolList || jump.Share.toolList;
        this.pedalProperty = toolList[type];
        this.pedalProperty.pedalType = this.pedalType;
        this.treadCount = this.pedalProperty.treadCount;
        this.addJumpToolEffect();
    },
    //添加道具特效
    addJumpToolEffect : function () {
        this.toolNameList = ["normalPedal","oncePedal","movePedal","disablePedal","springRing","trampoline","bambooDragonfly","rocketTube"];
        var index = this.toolNameList.indexOf(this.pedalType);
        this.shapeSprite.spriteFrame = this.shapeSpriteFrameList[index];
        if(index >= 3){
            this.toolNode.active = true;
            var prefab = this.toolNodePrefabList[index-3];
            var pedalTool = cc.instantiate(prefab);
            if(pedalTool.x != 0){
                pedalTool.x = -this.pedalProperty.positionX + hall.GlobalFuncs.getRandomNumberBefore(this.pedalProperty.positionX*2);
            }
            pedalTool.y = this.pedalProperty.positionY;
            pedalTool.tag = 200;
            this.toolNode.addChild(pedalTool);
            // var com = pedal.getComponent('jump_pedal');
            // com.setInformation(this.pedalLargeTag,type);
            if(this.pedalType == "rocketTube"){
                var node1 = pedalTool.getChildByName("particlesystem1");
                node1.active = false;
                var node2 = pedalTool.getChildByName("particlesystem2");
                node2.active = false;
            }else if(this.pedalType == "disablePedal"){
                this.shapeSprite.node.active = false;
            }
        }else {
            this.toolNode.active = false;
        }
        if(this.pedalType == "movePedal"){
            this.horizontalSpeed = jump.gameModel.movePedalHorizontalSpeed || this.pedalProperty.horizontalSpeed;
        }
    },
    //被role碰撞到,响应效果(这里是消失)
    runSpecialEffectsWithProperty : function () {
        var tool = this.toolNode.getChildByTag(200);
        if(tool){
            jump.gameModel.pedalGapWidth = jump.gameModel.pedalGapWidth+tool.x;
        }
        this.pedalProperty.treadCount = this.treadCount;
        ty.NotificationCenter.trigger(jump.EventType.TOOL_EFFECT_ROLE,this.pedalProperty);
        if(this.treadCount != 0){
            // this.verticalSpeed = jump.gameModel.speedConfig.verticalInitialSpeed;
            this.treadCount --;
        }
        if(this.pedalType == "normalPedal" || this.pedalType == "movePedal"){
            //你乖乖反弹就好了
        }else if(this.pedalType == "oncePedal"){
            //一次性踏板直接消失
            this.node.y = -this.windowHeight/2-20;
        }else if(this.pedalType == "disablePedal" ){
            //不可踩踏板碎掉
            this.playAnimation();
        }else if(this.pedalType == "springRing" || this.pedalType == "trampoline"
            || this.pedalType == "bambooDragonfly" || this.pedalType == "rocketTube" ){
            this.playAnimation();
        }
    },

    playAnimation : function () {

        if(-this.pedalProperty.sectionWidth > jump.gameModel.pedalGapWidth
            || jump.gameModel.pedalGapWidth > this.pedalProperty.sectionWidth){
            return;
        }
        var tool = this.toolNode.getChildByTag(200);
        if(this.pedalType == "rocketTube" || this.pedalType == "bambooDragonfly"){
            tool.removeFromParent();
            return;
        }
        // jump.gameModel.isOnAnimation = true;
        var ani = tool.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var anim = ani.getAnimationState(clipName);
        var that = this;
        anim.once("finished", function () {
            if(that.pedalType == "disablePedal" ){
                that.toolNode.active = false;
                that.node.y = -this.windowHeight/2-20;
            }
            // jump.gameModel.isOnAnimation = false;
        });
        anim.play();
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        var winSize = cc.director.getWinSize();
        this.windowHeight = winSize.height;
        this.windowWidth = winSize.width;
        this.toolNameList = ["normalPedal","oncePedal","movePedal","disablePedal","springRing","trampoline","bambooDragonfly","rocketTube"];
        var speedConfig = jump.gameModel.speedConfig || jump.Share.speedConfig;
        this.verticalAcceleratedSpeed = speedConfig.pedalVerticalAcceleratedSpeed;
        // ty.NotificationCenter.listen(jump.EventType.CHANGE_PEDAL_SPEED,this.changeNormalSpeed,this);
    },
    // changeNormalSpeed : function (changeSpeed) {
    //     if(changeSpeed == 0){
    //         this.state = 1;
    //         this.verticalSpeed = 0;
    //     }else {
    //         this.state = 0;
    //         this.verticalSpeed += changeSpeed;
    //     }
    // },

    getPedalY : function () {
        return this.pedalY;
    },
    update : function(dt) {
        if(!this.node){
            return;
        }
        if(this.pedalType == "movePedal"){
            this.pedalX = this.node.x + this.horizontalSpeed*dt;
            this.node.x = this.pedalX;
            var heSpeed = jump.gameModel.movePedalHorizontalSpeed ||  this.pedalProperty.horizontalSpeed;
            if(this.pedalX >= this.windowWidth/2-jump.gameModel.pedalWidth/2){
                this.horizontalSpeed = -heSpeed;
            }
            if(this.pedalX <= -this.windowWidth/2+jump.gameModel.pedalWidth/2){
                this.horizontalSpeed = heSpeed;
            }
        }
        //pedal处于静止状态
        // if(this.state == 1){
        //     return;
        // }
        this.verticalSpeed = jump.gameModel.pedalVerSpeed;
        if(this.verticalSpeed <= 0){
            // this.state = 1;
            return;
        }
        // // if(!this.isOnAnimation){
        // this.verticalSpeed -= this.verticalAcceleratedSpeed*dt;
        // if(this.verticalSpeed <= 0){
        //     this.state = 1;
        //     return;
        // }
        // // }

        this.pedalY = this.node.y - this.verticalSpeed* dt;
        this.node.y = this.pedalY;

        if(this.pedalY <= -this.windowHeight/2-100){
            ty.NotificationCenter.trigger(jump.EventType.REMOVE_PEDAL,this.pedalTag);
            // this.node.destroy();
        }

        // hall.LOGD("-====update=====this.pedalY========"+this.pedalY);
    },
    onDestroy:function(){
        ty.NotificationCenter.ignoreScope(this);
    }
});
