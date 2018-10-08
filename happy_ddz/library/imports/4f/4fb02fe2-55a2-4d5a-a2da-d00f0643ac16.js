"use strict";
cc._RF.push(module, '4fb02/iVaJNWqLa0A8GQ6wW', 'ddz_avatar_window');
// Script/ComponentScript/window/ddz_avatar_window.js

"use strict";

/**
 *   战绩头像
 */
cc.Class({
    extends: cc.Component,
    ctor: function ctor() {
        this._TAG = "ddz_avatar_window";
    },

    properties: {
        avatarWidth: 102,
        avatarHeight: 102,
        lblName: cc.Label,
        sumScore: cc.Label,
        avatar: cc.Node,
        firstSpr: cc.Node
    },

    onLoad: function onLoad() {
        // this.setAvatarUrl("http://ddz.image.tuyoo.com/avatar/head_female_2.png");
        // this.setPlayerName("我是一只小小鸟");
        // this.hideNameDisplay();
    },

    /**
     * 设置玩家战绩总分
     * @param val
     */
    setSumScore: function setSumScore(score) {
        this.sumScore.string = score > 0 ? "+" + score : score;
    },

    setFirstSpr: function setFirstSpr(isActive) {
        this.firstSpr.active = isActive;
    },

    /**
     * 设置头像信息 头像,名字
     * @param url
     */

    setPlayerInfo: function setPlayerInfo(url, name, myIndex) {
        if (url) {
            this.node.active = true;
            var com = this.avatar.getComponent('Avatar');
            if (myIndex) {
                if (ddz.gameModel.isLimit) {
                    com.setAvatarUrl(url);
                } else {
                    com.setAvatarUrl();
                }
            } else {
                com.setAvatarUrl(url);
            }

            this.lblName.string = name;
            com.hideNameDisplay();
        } else {
            this.node.active = false;
        }
    }

});

cc._RF.pop();