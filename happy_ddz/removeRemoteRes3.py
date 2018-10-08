# -*- coding:utf-8 -*-

import os

localResPath = '/Users/tuyoo/newSvn/h5/happy_ddz/build/wechatgame/res/';

remoteRes = [
     'raw-assets/resources/table',
     'raw-assets/particle',
]

retainRes = [
    '05a7f3fe3.json',
    '043e46bcf.json',
    '03355a6bd.json',
    '0f3fd8fcd.json',
    '0c781b430.json',
    '01cebba05.json',
    '09a748761.json',
    '0b72be2ae.json',
    '09f634a00.json',
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

my_imoort_file = localResPath + "import"
# for i in os.listdir(my_imoort_file):
#     if i not in retainRes:
#         # print '删除预制件文件: %s 成功!'%i
#         path_file = os.path.join(my_imoort_file,i)
#         for f in os.listdir(path_file):
#             path_file3 =os.path.join(path_file,f)
#             if os.path.isfile(path_file3):
#                 os.remove(path_file3)
#                 print '删除预制件文件: %s 成功!'%path_file3



for i in os.listdir(my_imoort_file):
    # print '删除预制件文件: %s 成功!'%i
    path_file = os.path.join(my_imoort_file,i)
    for f in os.listdir(path_file):
        print '文件名: %s 成功!'%f
        if f not in retainRes:
            path_file3 =os.path.join(path_file,f)
            if os.path.isfile(path_file3):
                os.remove(path_file3)
                print '删除预制件文件: %s 成功!'%path_file3











