# -*- coding:utf-8 -*-

import os

localResPath = '/Users/xiaochuntian/fuhaoh5/h5/tu-weixin-game/build/wechatgame/res/';

remoteRes = [
     'raw-assets/resources/table',
     'raw-assets/resources/spine',
]

for filePath in remoteRes:
    my_file = localResPath + filePath
    for i in os.listdir(my_file):
        path_file = os.path.join(my_file,i)
        if os.path.isfile(path_file):
            os.remove(path_file)
            print '删除文件：%s成功！'%path_file
        else:
            for f in os.listdir(path_file):
                path_file2 =os.path.join(path_file,f)
                if os.path.isfile(path_file2):
                    os.remove(path_file2)
                    print '删除第二层文件: %s 成功!'%path_file2