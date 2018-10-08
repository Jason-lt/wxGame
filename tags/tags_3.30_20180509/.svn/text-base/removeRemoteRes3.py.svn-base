# -*- coding:utf-8 -*-

import os

localResPath = '/Users/tuyoo/Documents/zhangmanWork/h5/tags/tags_3.30_20180509/build/wechatgame/res/';

remoteRes = [
    'raw-assets/resources/spine/ddz_newoneself_dizhu.atlas',
    'raw-assets/resources/spine/ddz_newoneself_dizhu.png',

    'raw-assets/resources/spine/ddz_newoneself_dizhupo.atlas',
    'raw-assets/resources/spine/ddz_newoneself_dizhupo.png',

    'raw-assets/resources/spine/ddz_newoneself_nongmin.atlas',
    'raw-assets/resources/spine/ddz_newoneself_nongmin.png',

    'raw-assets/resources/spine/ddz_newoneself_nvwa.atlas',
    'raw-assets/resources/spine/ddz_newoneself_nvwa.png',

    'raw-assets/resources/table/ddz_poker.png',

    'raw-assets/resources/table/ddz_table_ani_bomb.png',
    'raw-assets/resources/table/ddz_table_ani_common.png',
    'raw-assets/resources/table/ddz_table_ani_rocket.png',

    'raw-assets/resources/table/dizhu_table_chuntian.png',
    'raw-assets/resources/table/interactive_emo.png',
    'raw-assets/resources/table/interactive_emo1.png',
    'raw-assets/resources/table/lottery_win_bg.png'
]

for filePath in remoteRes:

	my_file = localResPath + filePath
	if os.path.exists(my_file):
	    os.remove(my_file)
	    print '删除文件：%s成功！'%my_file
	else:
	    print '找不到文件:%s'%my_file

