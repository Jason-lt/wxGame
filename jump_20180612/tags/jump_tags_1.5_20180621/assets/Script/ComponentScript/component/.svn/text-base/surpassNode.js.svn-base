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
        nameLabel : {
            default : null,
            type : cc.Label
        }
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

// {"openid":"oxc3D5H5zOKU3FAkOo4lTqOI6-ec",
// "nickname":"。",
// "avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epgxe4F7dIHkJqOPibibibwlN1TS89XWzuqZJJqSQusAeK079fpryd1K6UHBtrEnsvgzvkpBefqbXZAw/132",
// "KVDataList":[{"key":"userId","value":"0"},{"key":"sumScore","value":"640"}],
// "sumScore":640,
// "userId":"0"}

    changeName : function (user){
        if(user && user.nickname){
            this.nameLabel.string = user.nickname;
        }else {
            this.nameLabel.string = "好友";
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    // update (dt) {},
});
