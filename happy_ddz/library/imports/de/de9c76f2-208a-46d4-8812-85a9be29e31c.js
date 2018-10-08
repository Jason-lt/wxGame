"use strict";
cc._RF.push(module, 'de9c7byIIpG1IgSham+KeMc', 'ddz_window_match_rewards');
// Script/ComponentScript/window/ddz_window_match_rewards.js

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
        titleLable: {
            default: null,
            type: cc.Label
        },
        closeButton: {
            default: null,
            type: cc.Button
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        listItem: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function onLoad() {
        this.linecount = 1;
        this.spacing = 20;
        this.spacing_x = 20;

        this.content = this.scrollView.content;
        this.items = [];
        this.initialize();
    },

    initialize: function initialize() {
        var matchData = hall.ME.matchInfo.getCurrentMatchData();
        this.titleLable.string = matchData.matchName;
        var ranks = hall.ME.matchInfo.matchDesMap[matchData.matchId.toString()].ranks;
        var totalCount = ranks.length;
        this.content.height = totalCount * 52;
        for (var i = 0; i < totalCount; i++) {
            var item = cc.instantiate(this.listItem);
            item.getComponent("ddz_cell_match_reward").updateItem(ranks[i].start, ranks[i].end, ranks[i].desc);
            this.content.addChild(item);
            item.setPosition(0, -52 * i - 26);
            this.items.push(item);
        }
    },

    onClickClose: function onClickClose() {
        this.node.removeFromParent();
        this.node.destroy();
    }
    // update (dt) {},
});

cc._RF.pop();