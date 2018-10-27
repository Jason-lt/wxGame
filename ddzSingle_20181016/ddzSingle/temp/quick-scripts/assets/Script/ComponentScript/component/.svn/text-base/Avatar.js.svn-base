(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ComponentScript/component/Avatar.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a5ae9ilN2FBlLY6YEVvxoEn', 'Avatar', __filename);
// Script/ComponentScript/component/Avatar.js

"use strict";

/**
 * 公共头像类
 */
cc.Class({
    extends: cc.Component,
    ctor: function ctor() {
        this._TAG = "Avatar";
    },

    properties: {
        avatarWidth: 102,
        avatarHeight: 102,
        avatar: cc.Sprite,
        avatarShadow: cc.Sprite,
        defaultSpriteFramte: cc.SpriteFrame,
        lblName: cc.Label
    },

    onLoad: function onLoad() {
        // this.setAvatarUrl("http://ddz.image.tuyoo.com/avatar/head_female_2.png");
        // this.setPlayerName("我是一只小小鸟");
        // this.hideNameDisplay();
    },

    /**
     * 设置玩家名称
     * @param val
     */
    setPlayerName: function setPlayerName(val) {
        if (cc.isValid(this.lblName)) {
            this.lblName.string = val ? val : " ";
        }
    },

    /**
     * 设置头像url
     * @param url
     */
    setAvatarUrl: function setAvatarUrl(url) {
        if (!url) {
            this.avatar.spriteFrame = this.defaultSpriteFramte;
            this.hideNameDisplay();
        } else {
            ty.SystemInfo.getImageWithURL(url, this.avatar);
            this.showNameDisplay();
        }
        this.avatar.node.setContentSize(this.avatarWidth, this.avatarHeight);
        //http://ddz.image.tuyoo.com/avatar/head_female_2.png
        // cc.loader.load(url, function (err, texture) {
        //     if (!err){
        //         //这里要加缓存机制
        //         this.avatar.spriteFrame = new cc.SpriteFrame(texture);
        //         this.avatar.node.setContentSize(this.avatarWidth, this.avatarHeight);
        //     }
        //     else{
        //         //加载失败
        //     }
        // }.bind(this));
    },

    /**
     * 重置头像
     */
    resetAvatar: function resetAvatar() {
        this.setAvatarUrl();
    },

    /**
     *
     * 隐藏名称与阴影
     */
    hideNameDisplay: function hideNameDisplay() {
        this.lblName.visible = false;
        // this.avatarShadow.visible = false;
        this.avatarShadow.node.active = false;
    },

    /**
     * 显示名称与阴影
     */
    showNameDisplay: function showNameDisplay() {
        this.lblName.visible = true;
        // this.avatarShadow.visible = true;
        this.avatarShadow.node.active = false;
    }

    // start () {
    //
    // },

    // update (dt) {},
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Avatar.js.map
        