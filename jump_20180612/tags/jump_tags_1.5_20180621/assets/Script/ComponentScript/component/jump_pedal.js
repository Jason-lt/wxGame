
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
        // pedalWidth : 0,
        // pedalHeight : 0,

        // elasticCoefficient : 1,

        verticalSpeed : 200,
        horizontalSpeed : 0,


        addVerticalSpeed : 0,
        verticalShortSpeed : 0,//怪物短距离纵向动作

        pedalTag : 0,
        pedalType:"normalPedal",
        pedalProperty:{
            "treadCount": 1000
        },

        moveCount : 0,
        treadCount : 1000,
        mp3Player : null
    },

    removeAni : function () {
        var tool = this.toolNode.getChildByTag(200);
        if(tool){
            tool.removeFromParent();
        }
        if(this.mp3Player){
            jump.AudioHelper.stopEffectWithInnerAudioContext(this.mp3Player);
        }
        this.toolNode.removeAllChildren();
    },
    // setInformationWithAvatar : function (pedalTag,height,avatarUrl) {
    //     this.pedalY = height;
    //     this.pedalTag = pedalTag;
    //     this.pedalType = "avatarPedal";
    //     var toolList = jump.gameModel.toolList || jump.Share.toolList;
    //     this.pedalProperty = toolList["avatarPedal"];
    //     this.pedalProperty.pedalType = this.pedalType;
    //     this.treadCount = this.pedalProperty.treadCount;
    //     ty.SystemInfo.getImageWithURL(avatarUrl,this.shapeSprite);
    //     this.toolNode.active = true;
    //     var prefab = this.toolNodePrefabList[1];
    //     var pedalTool = cc.instantiate(prefab);
    //     pedalTool.x = 0;
    //     pedalTool.y = this.pedalProperty.positionY;
    //     pedalTool.tag = 200;
    //     this.toolNode.addChild(pedalTool);
    //     // this.horizontalSpeed = this.pedalProperty.horizontalSpeed;
    // },
    setInformation : function (pedalTag,type,height) {
        this.addVerticalSpeed = 0;
        this.verticalShortSpeed = 0;
        this.moveCount = 0;
        this.pedalY = height;
        this.pedalTag = pedalTag;
        this.pedalType = type || "normalPedal";
        var toolList = jump.gameModel.toolList || jump.Share.toolList;
        this.pedalProperty = toolList[type];
        this.treadCount = this.pedalProperty.treadCount;
        this.addJumpToolEffect();
    },
    //添加道具特效
    addJumpToolEffect : function () {
        this.shapeSprite.spriteFrame = this.shapeSpriteFrameList[this.pedalProperty.shapeSpriteType];

        var toolPrefabType = this.pedalProperty.toolPrefabType;
        if(toolPrefabType != -1){
            this.toolNode.active = true;
            var prefab = this.toolNodePrefabList[toolPrefabType];
            var pedalTool = cc.instantiate(prefab);
            if(this.pedalProperty.positionX){
                pedalTool.x = -this.pedalProperty.positionX + hall.GlobalFuncs.getRandomNumberBefore(this.pedalProperty.positionX*2);
            }else {
                pedalTool.x = 0;
            }
            pedalTool.y = this.pedalProperty.positionY;
            pedalTool.tag = 200;
            this.toolNode.addChild(pedalTool);
            if(this.pedalType == "rocketTube"){
                var node1 = pedalTool.getChildByName("particlesystem1");
                node1.active = false;
                var node2 = pedalTool.getChildByName("particlesystem2");
                node2.active = false;
            }
        }else {
            this.toolNode.active = false;
        }

        if(this.pedalProperty.hidePedal == 1){
            this.shapeSprite.node.active = false;
        }else {
            this.shapeSprite.node.active = true;
        }

        if(this.pedalProperty.isMonster == 1){
            this.mp3Player = jump.AudioHelper.playEffect(jump.EffectPath_mp3.monsterComeOn,true);
        }
        if(this.pedalProperty.canMove == 1){
            this.horizontalSpeed = jump.gameModel.nowPedalList.movePedalHorizontalSpeed || this.pedalProperty.horizontalSpeed;
            if(this.pedalType.indexOf("monster") > -1){
                this.horizontalSpeed = this.pedalProperty.horizontalSpeed;
            }
        }else if(this.pedalProperty.verticalShortSpeed){
            this.horizontalSpeed = 0;
            this.verticalShortSpeed = this.pedalProperty.verticalShortSpeed
        }else {
            this.horizontalSpeed = 0;
        }
    },
    runUpSpecialEffectsWithProperty : function () {
        if(!jump.gameModel.isOnAnimation && this.pedalProperty.isMonster == 1 && !jump.gameModel.shouldGameOver){
            if(-this.pedalProperty.horizontalDetectionSection <= jump.gameModel.pedalGapWidth
                && jump.gameModel.pedalGapWidth <= this.pedalProperty.horizontalDetectionSection){
                jump.gameModel.shouldGameOver = true;
                ty.NotificationCenter.trigger(jump.EventType.SHOULD_GAME_OVER);
                if(this.mp3Player){
                    jump.AudioHelper.stopEffectWithInnerAudioContext(this.mp3Player);
                }
                jump.AudioHelper.playEffect(jump.EffectPath_mp3.crashMonster,false);
            }
        }
    },
    //被role碰撞到,响应效果
    runSpecialEffectsWithProperty : function () {
        if(this.pedalProperty.horizontalDetectionSection){
            if(-this.pedalProperty.horizontalDetectionSection > jump.gameModel.pedalGapWidth || jump.gameModel.pedalGapWidth > this.pedalProperty.horizontalDetectionSection){
                return;
            }
        }
        var tool = this.toolNode.getChildByTag(200);
        if(tool){
            jump.gameModel.pedalGapWidth = jump.gameModel.pedalGapWidth+tool.x;
        }
        ty.NotificationCenter.trigger(jump.EventType.TOOL_EFFECT_ROLE,this.pedalProperty);

        if(-this.pedalProperty.sectionWidth > jump.gameModel.pedalGapWidth
            || jump.gameModel.pedalGapWidth > this.pedalProperty.sectionWidth){
            return;
        }
        if(this.pedalProperty.aniType == "backPack"){
            tool.removeFromParent();
        }else if(this.pedalProperty.aniType == "addSpeed"){
            this.addVerticalSpeed = this.pedalProperty.addVerticalSpeed;
        }else if(this.pedalProperty.aniType == "pedalAni"){
            this.playAnimation();
        }else if(this.pedalProperty.aniType == "disable"){
            this.node.y = -this.windowHeight/2-20;
        }

        if(this.treadCount != 0){
            this.treadCount --;
        }
    },
    playAnimation : function () {
        var tool = this.toolNode.getChildByTag(200);
        // if(this.pedalType == "rocketTube" || this.pedalType == "bambooDragonfly"){
        // }
        // jump.gameModel.isOnAnimation = true;
        var ani = tool.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var anim = ani.getAnimationState(clipName);
        var that = this;
        anim.once("finished", function () {
            if(that.pedalType == "disablePedal" ){
                that.toolNode.active = false;
                // tool.removeFromParent();
                that.node.y = -that.windowHeight/2-20;
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
        // this.toolNameList = ["normalPedal","oncePedal","movePedal","disablePedal","springRing","trampoline","bambooDragonfly","rocketTube"];
        // ty.NotificationCenter.listen(jump.EventType.CHANGE_PEDAL_SPEED,this.changeNormalSpeed,this);
    },

    getPedalY : function () {
        return this.pedalY;
    },
    getDetectionYWithDirection : function (direction) {
        var resultY = this.pedalY;
        if(direction == 0 && this.pedalProperty.verticalDetection){
            resultY = this.pedalY-this.pedalProperty.verticalDetection;
        }
        return resultY;
    },
    getDetectionYEXWithDirection : function (direction) {
        var resultY = 0;
        if(direction == 0 && this.pedalProperty.verticalDetection){
            resultY = this.pedalProperty.verticalDetection;
        }
        return resultY;
    },
    update : function(dt) {
        if(!this.node){
            return;
        }
        if(jump.gameModel.isPause){
            return;
        }
        if(this.pedalProperty.canMove == 1){
            this.pedalX = this.node.x + this.horizontalSpeed*dt;
            this.node.x = this.pedalX;

            if(this.pedalProperty.moveShort){
                this.moveCount ++ ;
                if(this.moveCount >= this.pedalProperty.moveShort){
                    this.moveCount = 0;
                    this.horizontalSpeed = - this.horizontalSpeed;
                    // if(this.horizontalSpeed > 0){
                    //     this.horizontalSpeed = - this.pedalProperty.horizontalSpeed;
                    // }else {
                    //     this.horizontalSpeed = this.pedalProperty.horizontalSpeed;
                    // }
                }
            }else {
                var heSpeed = jump.gameModel.nowPedalList.movePedalHorizontalSpeed || this.pedalProperty.horizontalSpeed;
                if(this.pedalType.indexOf("monster") > -1){
                    heSpeed = this.pedalProperty.horizontalSpeed;
                }
                if(this.pedalX >= this.windowWidth/2-jump.gameModel.pedalWidth/2){
                    this.horizontalSpeed = -heSpeed;
                }
                if(this.pedalX <= -this.windowWidth/2+jump.gameModel.pedalWidth/2){
                    this.horizontalSpeed = heSpeed;
                }
            }
        }
        //pedal处于静止状态
        // if(this.state == 1){
        //     return;
        // }
        this.verticalSpeed = jump.gameModel.pedalVerSpeed + this.addVerticalSpeed + this.verticalShortSpeed;
        if(this.pedalProperty.moveShort && this.pedalProperty.verticalShortSpeed){
            this.moveCount ++ ;
            if(this.moveCount >= this.pedalProperty.moveShort){
                this.moveCount = 0;
                this.verticalShortSpeed = - this.verticalShortSpeed;
            }
        }

        if(jump.gameModel.pedalVerSpeed < 0){
            // this.state = 1;
            return;
        }

        this.pedalY = this.node.y - this.verticalSpeed* dt;
        this.node.y = this.pedalY;

        if(this.pedalY <= -this.windowHeight/2-100){
            ty.NotificationCenter.trigger(jump.EventType.REMOVE_PEDAL,this.pedalTag);
            // this.node.destroy();
        }

        // hall.LOGD("-====update=====this.pedalY========"+this.pedalY);
    },
    onDestroy:function(){
        if(this.mp3Player){
            jump.AudioHelper.stopEffectWithInnerAudioContext(this.mp3Player);
        }
        ty.NotificationCenter.ignoreScope(this);
    }
});
