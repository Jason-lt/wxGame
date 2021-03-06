(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/ddz/ddz_res.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cbcefMopCtOIL9e6ieh+1mh', 'ddz_res', __filename);
// Script/ddz/ddz_res.js

"use strict";

//ddz的音乐文件都包含了hall的音乐文件，这里把hall需要的音乐文件拆了出来，但是代码里还是ddz.music，因为有缓存，多加载一次不会有太大影响，避免了修改代码（为了未来可能需要与移动端兼容）

ddz.EffectPath_mp3 = {
    "back_button_click_sound": 'resources/sound/back_button_Click_Sound.mp3',
    "button_click_sound": 'resources/sound/button_click_sound.mp3',
    "classic_Click_Sound": 'resources/sound/classic_Click_Sound.mp3',
    "competition_Click_Sound": 'resources/sound/competition_Click_Sound.mp3',
    "danji_Click_Sound": 'resources/sound/danji_Click_Sound.mp3',
    "happy_Click_Sound": 'resources/sound/happy_Click_Sound.mp3',
    "laizi_Click_Sound": 'resources/sound/laizi_Click_Sound.mp3',
    "Failure": 'resources/sound/Failure.mp3',
    "Upgrade": 'resources/sound/Upgrade.mp3',
    "Victory": 'resources/sound/Victory.mp3',
    "gold_lottery": 'resources/sound/gold_lottery.mp3',
    "female_1_point": 'resources/sound/female_1_point.mp3',
    "female_2_point": 'resources/sound/female_2_point.mp3',
    "female_3_point": 'resources/sound/female_3_point.mp3',
    "female_call_dizhu": 'resources/sound/female_call_dizhu.mp3',
    "female_not_call": 'resources/sound/female_not_call.mp3',
    "female_not_rob": 'resources/sound/female_not_rob.mp3',
    "female_rob_dizhu": 'resources/sound/female_rob_dizhu.mp3',
    "man_1_point": 'resources/sound/man_1_point.mp3',
    "man_2_point": 'resources/sound/man_2_point.mp3',
    "man_3_point": 'resources/sound/man_3_point.mp3',
    "man_call_dizhu": 'resources/sound/man_call_dizhu.mp3',
    "man_not_call": 'resources/sound/man_not_call.mp3',
    "man_not_rob": 'resources/sound/man_not_rob.mp3',
    "man_rob_dizhu": 'resources/sound/man_rob_dizhu.mp3',
    "showcards": 'resources/sound/showcards.mp3',
    "gold_lotteries": 'resources/sound/gold_lotteries.mp3',
    "multiple": 'resources/sound/multiple.mp3',
    "audio_reminded_myself": 'resources/sound/audio_reminded_myself.mp3',
    "female_boyibo": 'resources/sound/female_boyibo.mp3',
    "female_fengchui": 'resources/sound/female_fengchui.mp3',
    "female_guniang": 'resources/sound/female_guniang.mp3',
    "female_wodeng": 'resources/sound/female_wodeng.mp3',
    "female_wozha": 'resources/sound/female_wozha.mp3',
    "female_yizou": 'resources/sound/female_yizou.mp3',
    "female_zhade": 'resources/sound/female_zhade.mp3',
    "female_zhenpa": 'resources/sound/female_zhenpa.mp3',
    "male_boyibo": 'resources/sound/male_boyibo.mp3',
    "male_fengchui": 'resources/sound/male_fengchui.mp3',
    "male_guniang": 'resources/sound/male_guniang.mp3',
    "male_wodeng": 'resources/sound/male_wodeng.mp3',
    "male_wozha": 'resources/sound/male_wozha.mp3',
    "male_yizou": 'resources/sound/male_yizou.mp3',
    "male_zhade": 'resources/sound/male_zhade.mp3',
    "male_zhenpa": 'resources/sound/male_zhenpa.mp3',
    "female_airplane": 'resources/sound/female_airplane.mp3',
    "female_airplane_with_wing": 'resources/sound/female_airplane_with_wing.mp3',
    "female_bomb": 'resources/sound/female_bomb.mp3',
    "female_continuous_pair": 'resources/sound/female_continuous_pair.mp3',
    "female_four_with_two": 'resources/sound/female_four_with_two.mp3',
    "female_four_with_two_pair": 'resources/sound/female_four_with_two_pair.mp3',
    "female_I_got_left_one_cards": 'resources/sound/female_I_got_left_one_cards.mp3',
    "female_I_got_left_one_cards_erdou": 'resources/sound/female_I_got_left_one_cards_erdou.mp3',
    "female_I_got_left_two_cards": 'resources/sound/female_I_got_left_two_cards.mp3',
    "female_I_got_left_two_cards_erdou": 'resources/sound/female_I_got_left_two_cards_erdou.mp3',
    "female_mingpai": 'resources/sound/female_mingpai.mp3',
    "female_no": 'resources/sound/female_no.mp3',
    "female_pass": 'resources/sound/female_pass.mp3',
    "female_rocket": 'resources/sound/female_rocket.mp3',
    "female_shunzi": 'resources/sound/female_shunzi.mp3',
    "female_three_one": 'resources/sound/female_three_one.mp3',
    "female_three_with_one": 'resources/sound/female_three_with_one.mp3',
    "female_three_with_one_pair": 'resources/sound/female_three_with_one_pair.mp3',
    "man_aircraft_with_wings": 'resources/sound/man_aircraft_with_wings.mp3',
    "man_airplane": 'resources/sound/man_airplane.mp3',
    "man_bomb": 'resources/sound/man_bomb.mp3',
    "man_continuous_pair": 'resources/sound/man_continuous_pair.mp3',
    "man_four_with_one_pair": 'resources/sound/man_four_with_one_pair.mp3',
    "man_four_with_two": 'resources/sound/man_four_with_two.mp3',
    "man_I_got_left_one_cards": 'resources/sound/man_I_got_left_one_cards.mp3',
    "man_I_got_left_one_cards_erdou": 'resources/sound/man_I_got_left_one_cards_erdou.mp3',
    "man_I_got_left_two_cards": 'resources/sound/man_I_got_left_two_cards.mp3',
    "man_I_got_left_two_cards_erdou": 'resources/sound/man_I_got_left_two_cards_erdou.mp3',
    "man_mingpai": 'resources/sound/man_mingpai.mp3',
    "man_no": 'resources/sound/man_no.mp3',
    "man_pass": 'resources/sound/man_pass.mp3',
    "man_rocket": 'resources/sound/man_rocket.mp3',
    "man_shunzi": 'resources/sound/man_shunzi.mp3',
    "man_three_one": 'resources/sound/man_three_one.mp3',
    "man_three_with_one": 'resources/sound/man_three_with_one.mp3',
    "man_three_with_one_pair": 'resources/sound/man_three_with_one_pair.mp3',
    "airplane_beiguan": 'resources/sound/airplane_beiguan.mp3',
    "airplane_the_first_time": 'resources/sound/airplane_the_first_time.mp3',
    "bomb": 'resources/sound/bomb.mp3',
    "continuous_pair": 'resources/sound/continuous_pair.mp3',
    "rocket": 'resources/sound/rocket.mp3',
    "shunzi": 'resources/sound/shunzi.mp3',
    "click_cards": 'resources/sound/click_cards.mp3',
    "ie_boom": 'resources/sound/ie_boom.mp3',
    "ie_diamond": 'resources/sound/ie_diamond.mp3',
    "ie_egg": 'resources/sound/ie_egg.mp3',
    "ie_flower": 'resources/sound/ie_flower.mp3',
    "Playing_cards": 'resources/sound/Playing_cards.mp3',
    "table_victory": 'resources/sound/table_victory.mp3',
    "table_lose": 'resources/sound/table_lose.mp3'
};

ddz.MusicPath_mp3 = {
    "table_background_music": 'resources/sound/table_background_music.mp3'
};

ddz.SmiliesPath_mp3 = {
    flower: 'resources/smilies/ie_flower.mp3',
    diamond: 'resources/smilies/ie_diamond.mp3',
    egg: 'resources/smilies/ie_egg.mp3',
    brick: 'resources/smilies/ie_brick.mp3'
};

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
        //# sourceMappingURL=ddz_res.js.map
        