"use strict";
cc._RF.push(module, '18771E7XfVA47mFZTkV2+1u', 'ddz_gameTasks');
// Script/ComponentScript/window/ddz_gameTasks.js

"use strict";

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
        tasksBg: {
            default: null,
            type: cc.Sprite
        },

        tasksRich: {
            default: null,
            type: cc.RichText
        }
    },

    onLoad: function onLoad() {
        ty.NotificationCenter.listen(ddz.EventType.MSG_TBOX_GETREWARD, this.playSuccessAni, this);
    },
    updateProgress: function updateProgress(curCount, totalCount, roomId) {
        if (curCount < totalCount) {
            var str = "<color=#ffffff>第" + curCount + "/" + totalCount + "局</color>";
            this.playSuccessAni(str);
        } else if (curCount == totalCount && totalCount > 0) {
            ddz.MsgFactory.getTboxReward(roomId);
        } else if (curCount > totalCount) {
            // this.playSuccessAni("任务失效");
            ddz.MsgFactory.getTboxReward(roomId);
        }
    },

    // 完成局数发起请求后等待后端驱动
    playSuccessAni: function playSuccessAni(_info) {
        // this.setSuccessTaskRich(result._info);
        this.setTaskRich(_info);
        var ani = this.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var anim = ani.getAnimationState(clipName);
        var that = this;
        anim.once("finished", function () {
            ty.Timer.setTimer(that, function () {
                var clipName_2 = ani.getClips()[1].name;
                var anim_2 = ani.getAnimationState(clipName_2);
                anim_2.play();
                anim_2.once("finished", function () {
                    that.node.destroy();
                });
            }, 2, 0, 0);
        });
        anim.play();
    },

    setTaskRich: function setTaskRich(str) {
        this.tasksRich.string = str;
        var _size = this.tasksRich.node.getContentSize();
        var tSize = this.tasksBg.node.getContentSize();
        tSize.width = _size.width + 64;
        this.tasksBg.node.setContentSize(tSize);
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
    }
});

cc._RF.pop();