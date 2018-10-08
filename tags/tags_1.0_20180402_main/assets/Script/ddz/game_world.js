// 整个游戏的数据，集中存放
ddz.GameWorld = {
    chatData : [], // 聊天数据缓存

    shareMassageList :{
        getRewardForMain:[
            "单手玩转斗地主，丰厚奖励等你来拿！",
            "我正在玩斗地主赢奖励，快跟我一起来玩吧！",
            "玩斗地主赢大奖，这个秘密我只告诉你，快一起来玩吧!"],
        congratulation :[
            "我获得了今日分奖资格，快来一起赢取丰厚大奖",
            "斗地主赢大奖，这个秘密我只告诉你！",
            "我获得了领取丰厚大奖资格，快来一起分奖！"],
        getRewardPacket:[
            "我在富豪斗地主赢得了丰厚大奖，快来和我一起玩！",
            "斗地主赢丰富奖励，快来试试你能赢多少",
            "斗地主领丰厚奖励大奖，来和我比一比，谁领更多"],
        shareButton:[
            "闯七关，平分100万丰厚奖励！"],
        getdiamond:[
            "快来帮帮忙，我和最终大奖的距离就差一个你！",
            "闯关赢丰富大奖，我需要你的援手！",
            "我正在闯关赢百万丰厚奖励，快来帮帮忙！"],
        rankList :[
            "闯关高手榜，快来看看你第几"]
    },
    // shareImageList :{
    //     getRewardForMain:[
    //         // ty.SystemInfo.cdnPath + cc.url.raw('resources/share/6.png')],
    //
    //     ty.SystemInfo.cdnPath + cc.url.raw('resources/share/12.png')],
    //     congratulation :[
    //         ty.SystemInfo.cdnPath + cc.url.raw('resources/share/7.png')],
    //     getRewardPacket:[
    //         ty.SystemInfo.cdnPath + cc.url.raw('resources/share/10.png'),
    //         ty.SystemInfo.cdnPath + cc.url.raw('resources/share/11.png')],
    //     shareButton:[
    //         ty.SystemInfo.cdnPath + cc.url.raw('resources/share/1.png'),
    //         ty.SystemInfo.cdnPath + cc.url.raw('resources/share/2.png')],
    //     getdiamond:[
    //         ty.SystemInfo.cdnPath + cc.url.raw('resources/share/8.png'),
    //         ty.SystemInfo.cdnPath + cc.url.raw('resources/share/9.png')],
    //     rankList :[
    //         ty.SystemInfo.cdnPath + cc.url.raw('resources/share/6.png')]
    // }

    shareImageList :{
        getRewardForMain:[
            ty.SystemInfo.cdnPath + 'res/raw-assets/resources/share/12.png'],
        congratulation :[
            ty.SystemInfo.cdnPath + 'res/raw-assets/resources/share/7.png'],
        getRewardPacket:[
            ty.SystemInfo.cdnPath + 'res/raw-assets/resources/share/10.png',
            ty.SystemInfo.cdnPath + 'res/raw-assets/resources/share/11.png'],
        getRewardPacketForNumber:[
            ty.SystemInfo.cdnPath + 'res/raw-assets/resources/share/4.png',
            ty.SystemInfo.cdnPath + 'res/raw-assets/resources/share/5.png'],
        shareButton:[
            ty.SystemInfo.cdnPath + 'res/raw-assets/resources/share/1.png',
            ty.SystemInfo.cdnPath + 'res/raw-assets/resources/share/2.png'],
        getdiamond:[
            ty.SystemInfo.cdnPath + 'res/raw-assets/resources/share/8.png',
            ty.SystemInfo.cdnPath + 'res/raw-assets/resources/share/9.png'],
        rankList :[
            ty.SystemInfo.cdnPath + 'res/raw-assets/resources/share/6.png']
    }
};