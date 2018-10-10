// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


// cc.Class({
//     extends: cc.Component,
//
//     // 只在两个碰撞体开始接触时被调用一次
//     onBeginContact: function (contact, selfCollider, otherCollider) {
//     },
//
//     // 只在两个碰撞体结束接触时被调用一次
//     onEndContact: function (contact, selfCollider, otherCollider) {
//     },
//
//     // 每次将要处理碰撞体接触逻辑时被调用
//     onPreSolve: function (contact, selfCollider, otherCollider) {
//     },
//
//     // 每次处理完碰撞体接触逻辑时被调用
//     onPostSolve: function (contact, selfCollider, otherCollider) {
//     }
// });

cc.Class({
    extends: cc.Component,

    properties: {
        arrowSprite : {
            default : null,
            type : cc.Sprite
        },

        horizontalSpeed : 0,
        verticalSpeed : 0,
        direction : 0,

        fromDirection : 0,

        doAnimation : false,

        parentScene: {
            default: null,
            serializable: false
        }
    },

    onLoad : function() {
        this.polygonColliderApply();
    },

    reSetArrowSprite : function (arrowSpriteFrame) {
        this.arrowSprite.spriteFrame = arrowSpriteFrame;
    },
    beginSendAnimation : function (direction,from) {
        // this.polygonColliderApply();
        this.node.rotation = (1-direction/(Math.PI*2))* 360;
        this.direction = direction;
        this.fromDirection = from;

        this.verticalSpeed = double.GameWorld.arrowSpeed * Math.sin(direction);
        this.horizontalSpeed = double.GameWorld.arrowSpeed * Math.cos(direction);

        this.doAnimation = true;
    },

    hitObject : function () {
        this.doAnimation = false;
        // var manager = cc.director.getCollisionManager();
        // manager.enabled = false;

        this.verticalSpeed = 0;
        this.horizontalSpeed = 0;
        if(double.GameWorld.weaponType == 0){
            this.parentScene.receiveBullet(this.node,this.direction,this.fromDirection);
        }else {
            this.parentScene.receiveArrow(this.node,this.direction,this.fromDirection);
        }
    },

    polygonColliderApply : function () {
        var manager = cc.director.getCollisionManager();
        //默认碰撞检测系统是禁用的，如果需要使用则需要以下方法开启碰撞检测系统
        manager.enabled = true;
        //默认碰撞检测系统的 debug 绘制是禁用的，如果需要使用则需要以下方法开启 debug 绘制：
        // 开启后在运行时可显示 碰撞组件 的 碰撞检测范围
        // manager.enabledDebugDraw = true;
        // 如果还希望显示碰撞组件的包围盒，那么可以通过以下接口来进行设置：
        // manager.enabledDrawBoundingBox = true;
    },
    /**
     * 当碰撞系统检测到有碰撞产生时，将会以回调的方式通知使用者，如果产生碰撞的碰撞组件依附的节点下挂的脚本中有实现以下函数，则会自动调用以下函数，并传入相关的参数。
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        console.log('on collision enter');
        if(!this.doAnimation){
            return;
        }
        this.hitObject();
        // // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        // var world = self.world;
        // // 碰撞组件的 aabb 碰撞框
        // var aabb = world.aabb;
        // // 节点碰撞前上一帧 aabb 碰撞框的位置
        // var preAabb = world.preAabb;
        // // 碰撞框的世界矩阵
        // var t = world.transform;
        // // 以下属性为圆形碰撞组件特有属性
        // var r = world.radius;
        // var p = world.position;
        // // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        // var ps = world.points;
    },
    // /**
    //  * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
    //  * @param  {Collider} other 产生碰撞的另一个碰撞组件
    //  * @param  {Collider} self  产生碰撞的自身的碰撞组件
    //  */
    // onCollisionStay: function (other, self) {
    //     console.log('on collision stay');
    // },
    // /**
    //  * 当碰撞结束后调用
    //  * @param  {Collider} other 产生碰撞的另一个碰撞组件
    //  * @param  {Collider} self  产生碰撞的自身的碰撞组件
    //  */
    // onCollisionExit: function (other, self) {
    //     console.log('on collision exit');
    // },

    update : function(dt) {
        if(!this.doAnimation){
            return;
        }
        this.node.x += this.horizontalSpeed*dt;
        this.node.y += this.verticalSpeed*dt;
    }
});
