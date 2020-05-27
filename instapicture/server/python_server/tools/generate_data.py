import wmi
import os
import pymongo
import numpy as np
import random
import PIL
import pandas
import torch
import torch.nn as nn
import os.path as osp
from torchvision import transforms
from utils.imageio import imread
from sklearn.metrics.pairwise import cosine_similarity
import time
import datetime
from utils.name import get_random_full_name
torch.hub.set_dir(osp.join(osp.abspath(osp.curdir), 'Cache'))


"1. Define total tag list and other params"
IMG_FOLDER_NAME = ['n01440764', 'n02102040', 'n02979186', 'n03000684', 'n03028079',
                  'n03394916', 'n03417042', 'n03425413', 'n03445777', 'n03888257']
TotalTagList = ['鲤鱼', '史宾格犬', '磁带播放机', '链锯', '教堂',
                '法国号角', '垃圾车', '油泵', '高尔夫球', '降落伞']
ProfileImageUrlList = [
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-v2-fda399250493e674f2152c581490d6eb_1200x500.jpg',
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-v2-683621baf0000080e8f9112b078a6744_1440w.jpg',
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-uxtgcW0BJleJMoPMtGbb.jpg',
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-images.jpg',
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-images%20-8-.jpg',
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-images%20-7-.jpg',
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-images%20-6-.jpg',
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-images%20-5-.jpg',
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-images%20-4-.jpg',
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-images%20-3-.jpg',
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-images%20-2-.jpg',
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-images%20-1-.jpg',
    'http://kylinhub.oss-cn-shanghai.aliyuncs.com/2020-05-26-5b696acbN3b3ab8a3.jpg',
]
CommentList = [
    '感觉还不错',
    '垃圾',
    '稳的很',
    '我觉得挺好的',
    '非常棒！',
    '就那样吧',
    '很有艺术气息',
    '我爱你！！！',
    '别出来显摆了',
    '还行吧',
    '感觉看过类似的照片',
    '比较应景',
    '请收下我的膝盖orz',
    'Up主太强了！！',
    '我也想要一个',
    '感觉很fancy',
    '感觉很nice',
]
ItemTextList = [
    '你们觉得怎么样？', '我觉得还OK', '', '', '请大家给我点赞！', '最喜欢这个了哈哈哈', '给大家看看我的收藏', '', '', '',
    '', '今天有点小开心', ''
]
TOTAL_TAG_NUM = len(TotalTagList)
IMG_ROOT = osp.abspath('Data/imagenette2/train')
ImgPathList = [[] for _ in range(TOTAL_TAG_NUM)]
for root, dirs, files in os.walk(IMG_ROOT, topdown=False):
    for file in files:
        folder_name = osp.split(root)[-1]
        class_idx = IMG_FOLDER_NAME.index(folder_name)
        ImgPathList[class_idx].append(osp.join(folder_name, file))
NUM_USER = 1000
MAX_TAG_NUM_PER_USER = 3
IMG_FEAT_DIM = 512
USER_FEAT_DIM = 522
MEAN_PRIVATE_IMG_NUM_PER_USER = 8.4
MEAN_PUBLIC_IMG_NUM_PER_USER = 5.2
MEAN_PROS_NUM_PER_USER = 500
MEAN_CONS_NUM_PER_USER = 500
MEAN_FRIEND_NUM_PER_USER = 20
FRIEND_POST_K = 50
MEAN_COMMENT_NUM_PER_USER = 10
PRIVATE_IMG_WEIGHT = 1.0
PUBLIC_IMG_WEIGHT = 2.0
START_TIMESTAMP = time.mktime(time.strptime('May 1 2020  01:00:00', '%b %d %Y %I:%M:%S'))
END_TIMESTAMP = time.mktime(time.strptime('May 10 2020  11:59:00', '%b %d %Y %I:%M:%S'))
BIRTH_START_TIMESTAMP = time.mktime(time.strptime('May 1 1985  01:00:00', '%b %d %Y %I:%M:%S'))
BIRTH_END_TIMESTAMP = time.mktime(time.strptime('May 1 2005  01:00:00', '%b %d %Y %I:%M:%S'))

system = wmi.WMI()
cpu = system.Win32_Processor()


class Identity(nn.Module):
    def __init__(self):
        super(Identity, self).__init__()

    def forward(self, x):
        return x


preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])
model = torch.hub.load('pytorch/vision:v0.6.0', 'resnet34', pretrained=True)
model.fc = Identity()
model.eval()


def generate_id(counter):
    device_id = int(cpu[0].ProcessorId, 16) % 1000
    time_now = int(time.time()*1000) % 10000000
    pid = os.getpid() % 100
    counter = counter % 1000000
    id = int(time_now * 1e11 + device_id * 1e8 + pid * 1e6 + counter)
    return id


def normalize_l2(v):
    norm = np.linalg.norm(v, ord=2)
    if norm == 0:
        norm = np.finfo(v.dtype).eps
    return v/norm


def generate_random_timestamp(start_timestamp, end_timestamp):
    return datetime.datetime.fromtimestamp(random.randrange(start_timestamp, end_timestamp))


def generate_user_infos(db):
    UserInfos = db.UserInfos
    for user_i in range(NUM_USER):
        N_tag = random.randint(1, MAX_TAG_NUM_PER_USER)
        TagList = np.random.choice(TotalTagList, N_tag, replace=False).tolist()
        TagFeature = np.zeros(TOTAL_TAG_NUM)
        for tag in TagList:
            TagFeature[TotalTagList.index(tag)] = 1.0
        TagFeature = TagFeature.tolist()

        UserID = generate_id(user_i)
        cursor = UserInfos.find({'UserID': UserID})
        while cursor.count() > 0:
            # make sure that there aren't repetitive ID in the collection
            UserID = generate_id(user_i)
            cursor = UserInfos.find({'UserID': UserID})

        UserFeature = [0. for _ in range(USER_FEAT_DIM)]
        SocialFeature = [0. for _ in range(USER_FEAT_DIM)]
        UserInfo = {
            'Index': user_i,
            'UserID': UserID,
            'PhoneNum': None,
            'UserName': None,
            'Password': None,
            'Gender': None,
            'ProfileImagePath': None,
            'TagList': TagList,
            'BirthDate': None,
            'UploadImageNum': 0,
            'MaxImageNum': 100,
            'TagFeature': TagFeature,
            'UserFeature': UserFeature,
            'SocialFeature': SocialFeature,
        }
        UserInfos.insert_one(UserInfo)
    print('Finish generating UserInfos!')


def generate_private_images(db, ImgIdxPointerList):
    TOTAL_PRIVATE_IMG_COUNTER = 0
    Images = db.Images
    UserInfos = db.UserInfos
    for user_i in range(NUM_USER):
        start_time = time.time()
        UserInfo = UserInfos.find_one({'Index': user_i})
        UserID = UserInfo['UserID']
        N_private_img = np.random.poisson(lam=MEAN_PRIVATE_IMG_NUM_PER_USER)
        while N_private_img > UserInfo['MaxImageNum']:
            N_private_img = np.random.poisson(lam=MEAN_PRIVATE_IMG_NUM_PER_USER)
        TagList = UserInfo['TagList']
        effectivee_img_num = 0
        for img_i in range(N_private_img):
            if len(TagList) == 0:
                break
            class_idx = TotalTagList.index(np.random.choice(TagList))
            if ImgIdxPointerList[class_idx] >= len(ImgPathList[class_idx]):
                TagList.remove(TotalTagList[class_idx])
                continue
            effectivee_img_num += 1
            StoragePath = ImgPathList[class_idx][ImgIdxPointerList[class_idx]]
            ImgIdxPointerList[class_idx] += 1
            ImageID = generate_id(TOTAL_PRIVATE_IMG_COUNTER)
            cursor = Images.find({'ImageID': ImageID})
            while cursor.count() > 0:
                # make sure that there aren't repetitive ID in the collection
                ImageID = generate_id(TOTAL_PRIVATE_IMG_COUNTER)
                cursor = Images.find({'ImageID': ImageID})
            UploadTime = generate_random_timestamp(START_TIMESTAMP, END_TIMESTAMP)
            # Genrate image feature using pretrained-CNN
            img = imread(osp.join(IMG_ROOT, StoragePath), channel_order='rgb')
            PIL_img = PIL.Image.fromarray(img)
            input_tensor = preprocess(PIL_img)
            input_batch = input_tensor.unsqueeze(0)  # create a mini-batch as expected by the model
            with torch.no_grad():
                output = model(input_batch)
            ImageFeature = output[0].tolist()
            assert len(ImageFeature) == IMG_FEAT_DIM

            Image = {
                'ImageID': ImageID,
                'UserID': UserID,
                'UploadTime': UploadTime,
                'StoragePath': StoragePath,
                'FeatureWeight': PRIVATE_IMG_WEIGHT,
                'ImageFeature': ImageFeature
            }
            Images.insert_one(Image)
            # UploadImageNum + 1
            UserInfos.update_one({'UserID': UserID}, {'$inc': {'UploadImageNum': 1}})
            TOTAL_PRIVATE_IMG_COUNTER += 1
        end_time = time.time()
        duration = end_time - start_time
        avg_duration = duration / effectivee_img_num if effectivee_img_num > 0 else 0
        print('Total: {}, User {} generate {} private images, using {:.4f}s in total, {:.4f}s per img'.
              format(TOTAL_PRIVATE_IMG_COUNTER, user_i, effectivee_img_num, duration, avg_duration))
    print('Finish generating {} private images!'.format(TOTAL_PRIVATE_IMG_COUNTER))
    return TOTAL_PRIVATE_IMG_COUNTER


def generate_items(db, ImgIdxPointerList):
    TOTAL_PUBLIC_IMG_COUNTER = 0
    Images = db.Images
    Items = db.Items
    UserInfos = db.UserInfos
    for user_i in range(NUM_USER):
        start_time = time.time()
        UserInfo = UserInfos.find_one({'Index': user_i})
        UserID = UserInfo['UserID']
        N_public_img = np.random.poisson(lam=MEAN_PUBLIC_IMG_NUM_PER_USER)
        TagList = UserInfo['TagList']
        effectivee_img_num = 0
        for img_i in range(N_public_img):
            if len(TagList) == 0:
                break
            class_idx = TotalTagList.index(np.random.choice(TagList))
            if ImgIdxPointerList[class_idx] >= len(ImgPathList[class_idx]):
                TagList.remove(TotalTagList[class_idx])
                continue
            effectivee_img_num += 1
            StoragePath = ImgPathList[class_idx][ImgIdxPointerList[class_idx]]
            ImgIdxPointerList[class_idx] += 1
            ItemID = generate_id(TOTAL_PUBLIC_IMG_COUNTER)
            cursor = Items.find({'ItemID': ItemID})
            while cursor.count() > 0:
                # make sure that there aren't repetitive ID in the collection
                ItemID = generate_id(TOTAL_PUBLIC_IMG_COUNTER)
                cursor = Items.find({'ItemID': ItemID})
            ImageID = ItemID
            UploadTime = generate_random_timestamp(START_TIMESTAMP, END_TIMESTAMP)
            # Genrate image feature using pretrained-CNN
            img = imread(osp.join(IMG_ROOT, StoragePath), channel_order='rgb')
            PIL_img = PIL.Image.fromarray(img)
            input_tensor = preprocess(PIL_img)
            input_batch = input_tensor.unsqueeze(0)  # create a mini-batch as expected by the model
            with torch.no_grad():
                output = model(input_batch)
            ImageFeature = output[0].tolist()
            assert len(ImageFeature) == IMG_FEAT_DIM

            Image = {
                'ImageID': ImageID,
                'UserID': UserID,
                'UploadTime': UploadTime,
                'StoragePath': StoragePath,
                'FeatureWeight': PUBLIC_IMG_WEIGHT,
                'ImageFeature': ImageFeature
            }
            Images.insert_one(Image)
            # UploadImageNum + 1
            UserInfos.update_one({'UserID': UserID}, {'$inc': {'UploadImageNum': 1}})
            TOTAL_PUBLIC_IMG_COUNTER += 1

            Item = {
                'ClassIdx': class_idx,
                'ItemID': ItemID,
                'OwnerID': UserID,
                'Text': None,
                'ImageID': ImageID,
                'ProsNum': 0,
                'ConsNum': 0,
                'CommentNum': 0,
                'CommentIDList': [],
                'UploadTime': UploadTime
            }
            Items.insert_one(Item)
        end_time = time.time()
        duration = end_time - start_time
        avg_duration = duration / effectivee_img_num if effectivee_img_num > 0 else 0
        print('Total: {}, User {} generate {} public items, using {:.4f}s in total, {:.4f}s per img'.
              format(TOTAL_PUBLIC_IMG_COUNTER, user_i, effectivee_img_num, duration, avg_duration))
    return TOTAL_PUBLIC_IMG_COUNTER


def generate_pros(db):
    TOTAL_PROS_COUNTER = 0
    UserInfos = db.UserInfos
    Items = db.Items
    Pros = db.Pros
    Item_dict_per_class_list = [[] for _ in range(TOTAL_TAG_NUM)]
    for class_idx in range(TOTAL_TAG_NUM):
        Item_dict_per_class_list[class_idx] = list(Items.find({'ClassIdx': class_idx},
                                                              {'ItemID': 1, 'UploadTime': 1, '_id': 0}))
    for user_i in range(NUM_USER):
        start_time = time.time()
        UserInfo = UserInfos.find_one({'Index': user_i})
        UserID = UserInfo['UserID']
        TagList = UserInfo['TagList']
        TagIdxList = [TotalTagList.index(tag) for tag in TagList]
        N_pros = np.random.poisson(lam=MEAN_PROS_NUM_PER_USER)
        for pro_i in range(N_pros):
            class_idx = np.random.choice(TagIdxList)
            Item = np.random.choice(Item_dict_per_class_list[class_idx])
            ItemID = int(Item['ItemID'])
            ProID = generate_id(TOTAL_PROS_COUNTER)
            UploadTimeStamp = time.mktime(Item['UploadTime'].timetuple())
            Time = generate_random_timestamp(UploadTimeStamp, END_TIMESTAMP)

            Pro = {
                'ProID': ProID,
                'ItemID': ItemID,
                'ProUserID': UserID,
                'Time': Time
            }
            Pros.insert_one(Pro)
            Items.update_one({'ItemID': ItemID}, {'$inc': {'ProsNum': 1}})
            TOTAL_PROS_COUNTER += 1
        end_time = time.time()
        duration = end_time - start_time
        avg_duration = duration / N_pros
        print('Total: {}, User {} generate {} pros, using {:.4f}s in total, {:.4f}s per pro'.
              format(TOTAL_PROS_COUNTER, user_i, N_pros, duration, avg_duration))
    return TOTAL_PROS_COUNTER


def generate_cons(db):
    TOTAL_CONS_COUNTER = 0
    UserInfos = db.UserInfos
    Items = db.Items
    Cons = db.Cons
    Item_dict_per_class_list = [[] for _ in range(TOTAL_TAG_NUM)]
    for class_idx in range(TOTAL_TAG_NUM):
        Item_dict_per_class_list[class_idx] = list(Items.find({'ClassIdx': class_idx},
                                                              {'ItemID': 1, 'UploadTime': 1, '_id': 0}))
    for user_i in range(NUM_USER):
        start_time = time.time()
        UserInfo = UserInfos.find_one({'Index': user_i})
        UserID = UserInfo['UserID']
        TagList = UserInfo['TagList']
        TagIdxList = [TotalTagList.index(tag) for tag in TagList]
        DislikeTagIdxList = list(set([i for i in range(TOTAL_TAG_NUM)]) - set(TagIdxList))
        N_cons = np.random.poisson(lam=MEAN_CONS_NUM_PER_USER)
        for con_i in range(N_cons):
            class_idx = np.random.choice(DislikeTagIdxList)
            Item = np.random.choice(Item_dict_per_class_list[class_idx])
            ItemID = int(Item['ItemID'])
            ConID = generate_id(TOTAL_CONS_COUNTER)
            UploadTimeStamp = time.mktime(Item['UploadTime'].timetuple())
            Time = generate_random_timestamp(UploadTimeStamp, END_TIMESTAMP)

            Con = {
                'ConID': ConID,
                'ItemID': ItemID,
                'ConUserID': UserID,
                'Time': Time
            }
            Cons.insert_one(Con)
            Items.update_one({'ItemID': ItemID}, {'$inc': {'ConsNum': 1}})
            TOTAL_CONS_COUNTER += 1
        end_time = time.time()
        duration = end_time - start_time
        avg_duration = duration / N_cons
        print('Total: {}, User {} generate {} cons, using {:.4f}s in total, {:.4f}s per con'.
              format(TOTAL_CONS_COUNTER, user_i, N_cons, duration, avg_duration))
    return TOTAL_CONS_COUNTER


def generate_user_feature(db):
    Images = db.Images
    UserInfos = db.UserInfos
    start_time = time.time()
    for user_i in range(NUM_USER):
        UserInfo = UserInfos.find_one({'Index': user_i})
        UserID = UserInfo['UserID']
        img_feature_and_weights = Images.find({'UserID': UserID}, {'FeatureWeight': 1, 'ImageFeature': 1, '_id': 0})
        img_feature_and_weights = list(img_feature_and_weights)
        if len(img_feature_and_weights) > 0:
            img_feature_and_weights = pandas.DataFrame(img_feature_and_weights)
            img_features = np.concatenate(img_feature_and_weights['ImageFeature'].values, axis=0).reshape((-1, IMG_FEAT_DIM))
            weights = img_feature_and_weights['FeatureWeight'].values[:, np.newaxis]
            weighted_img_feature = (img_features * weights).sum(axis=0) / weights.sum()
        else:
            weighted_img_feature = np.zeros(IMG_FEAT_DIM)
        tag_feature = np.fromiter(UserInfo['TagFeature'], dtype=np.float)
        UserFeature = np.concatenate([weighted_img_feature, tag_feature]).tolist()
        assert len(UserFeature) == USER_FEAT_DIM
        UserInfos.update_one({'UserID': UserID}, {'$set': {'UserFeature': UserFeature}})
        print('User {} generates user feature.'.format(user_i))
    end_time = time.time()
    print('Finish generating user feature, using {:.4f}s in total'.format(end_time - start_time))


def generate_social_feature(db):
    UserInfos = db.UserInfos
    Friends = db.Friends
    users = pandas.DataFrame(
        UserInfos.find({}, {'UserID': 1, 'UserFeature': 1, 'TagList':1, '_id': 0}))
    user_features = np.concatenate(users['UserFeature'].values).reshape((NUM_USER, -1))
    user_IDs = users['UserID'].values
    similarity = cosine_similarity(user_features)
    sort_similarity_idxs = np.argsort(similarity, axis=1)[:, ::-1]
    for user_i in range(NUM_USER):
        N_friend = np.random.poisson(lam=MEAN_FRIEND_NUM_PER_USER)
        while N_friend + 1 > NUM_USER:
            N_friend = np.random.poisson(lam=MEAN_FRIEND_NUM_PER_USER)
        post_friend_idxs = sort_similarity_idxs[user_i, 1:FRIEND_POST_K + 1]
        friend_idxs = np.random.choice(post_friend_idxs, N_friend)
        friend_IDs = user_IDs[friend_idxs]
        UserID = int(user_IDs[user_i])

        user_tag_list = users['TagList'].values[user_i]
        # print('user tag list: {}'.format(user_tag_list))
        # friends = UserInfos.find({'UserID': {'$in': friend_IDs.tolist()}}, {'TagList': 1, '_id': 0})
        # friends = list(friends)
        # friends = pandas.DataFrame(friends)
        # print('friends tag list: {}'.format(friends['TagList'].values))
        for friend_ID in friend_IDs:
            Friend = {
                'CelebrityID': int(friend_ID),
                'FollowerID': UserID
            }
            Friends.insert_one(Friend)
        SocialFeature = np.mean(user_features[friend_idxs, :], axis=0).tolist()
        UserInfos.update_one({'UserID': UserID}, {'$set': {'SocialFeature': SocialFeature}})
        print('User {} generates {} friends and corresponding social feature.'.format(user_i, N_friend))


def generate_user_basic_info(db):
    UserInfos = db.UserInfos
    cursor = UserInfos.find({}, {'UserID': 1})
    for idx, user_dict in enumerate(cursor):
        UserID = user_dict['UserID']
        PhoneNum = str(int(189*1e8 + random.randint(0, 9999)*1e4 + idx))
        UserName = get_random_full_name()
        Password = ''.join(random.sample("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_1234567890", 6))
        Gender = random.sample(['男', '女'], 1)[0]
        ProfileImagePath = random.sample(ProfileImageUrlList, 1)[0]
        birth_time = random.randint(BIRTH_START_TIMESTAMP, BIRTH_END_TIMESTAMP)
        date_local = time.localtime(birth_time)
        BirthDate = time.strftime("%Y-%m-%d", date_local)

        UserInfos.update_one({'UserID': UserID},
                             {'$set': {'PhoneNum': PhoneNum,
                                       'UserName': UserName,
                                       'Password': Password,
                                       'Gender': Gender,
                                       'ProfileImagePath': ProfileImagePath,
                                       'BirthDate': BirthDate
                                       }})
    print('Finiesh generating basic user info!')


def generate_comments(db):
    TOTAL_COMMENT_COUNTER = 0
    Comments = db.Comments
    UserInfos = db.UserInfos
    Items = db.Items
    items_dict_list = Items.find({}, {'ItemID': 1, 'UploadTime': 1})
    items_dict_list = list(items_dict_list)
    cursor = UserInfos.find({}, {'UserID': 1})
    for idx, user_dict in enumerate(cursor):
        UserID = user_dict['UserID']
        N_comments = np.random.poisson(lam=MEAN_COMMENT_NUM_PER_USER)
        for comment_i in range(N_comments):
            item_idx = np.random.choice(range(len(items_dict_list)))
            ItemID = items_dict_list[item_idx]['ItemID']
            item_time = items_dict_list[item_idx]['UploadTime']
            UploadTimeStamp = time.mktime(item_time.timetuple())
            Time = generate_random_timestamp(UploadTimeStamp, END_TIMESTAMP)
            CommentText = np.random.choice(CommentList)
            CommentID = generate_id(TOTAL_COMMENT_COUNTER)
            Comment = {
                'CommentID': CommentID,
                'ItemID': ItemID,
                'CommentUserID': UserID,
                'CommentText': CommentText,
                'Time': Time
            }
            Comments.insert_one(Comment)
            Items.update_one({'ItemID': ItemID}, {'$push': {'CommentIDList': CommentID},
                                                  '$inc': {'CommentNum': 1}})
            TOTAL_COMMENT_COUNTER += 1
    print('Finish generating {} comments!'.format(TOTAL_COMMENT_COUNTER))


def generate_item_texts(db):
    Items = db.Items
    cursor = Items.find({}, {'ItemID': 1})
    for idx, item_dict in enumerate(cursor):
        ItemID = item_dict['ItemID']
        Text = np.random.choice(ItemTextList)
        Items.update_one({'ItemID': ItemID}, {'$set': {'Text': Text}})
    print('Finish generating item texts!')


if __name__ == '__main__':
    client = pymongo.MongoClient(host='localhost', port=27017)
    db = client['InstaPicture']

    "2. Generate User basic infomation"
    # generate_user_infos(db)

    "3. Generate Items"
    # ImgIdxPointerList = [0 for _ in range(TOTAL_TAG_NUM)]
    # TOTAL_PUBLIC_IMG_NUM = generate_items(db, ImgIdxPointerList)
    # print('ImgIdxPointerList: ', ImgIdxPointerList)

    "4. Generate Images"
    # TOTAL_PRIVATE_IMG_NUM = generate_private_images(db, ImgIdxPointerList)
    # print('ImgIdxPointerList: ', ImgIdxPointerList)

    "5. Generate Pros"
    # db.Items.update_many({}, {'$set': {'ProsNum': 0}})
    # TOTAL_PROS_NUM = generate_pros(db)

    "5. Generate Cons"
    # db.Items.update_many({}, {'$set': {'ConsNum': 0}})
    # TOTAL_CONS_NUM = generate_cons(db)

    "6. Generate user feature"
    # db.Images.update_many({}, {'$set': {'FeatureWeight': PRIVATE_IMG_WEIGHT}})
    # public_img_id_dict_list = list(db.Items.find({}, {'ImageID': 1, '_id': 0}))
    # public_img_id_list = [img['ImageID'] for img in public_img_id_dict_list]
    # db.Images.update_many({'ImageID': {'$in': public_img_id_list}}, {'$set': {'FeatureWeight': PUBLIC_IMG_WEIGHT}})
    # generate_user_feature(db)

    "7. Generate social feature"
    # generate_social_feature(db)

    "8. Delete extra fields and update extra fields"
    # db.UserInfos.update_many({'Index': {'$exists': True}}, {'$unset': {'Index': 1}}, False)
    # db.Items.update_many({'CommentUserIDList': {'$exists': True}}, {'$unset': {'CommentUserIDList': 1}}, upsert=False)
    # db.Items.update_many({}, {'$set': {'CommentIDList': [], 'CommentNum': 0}})

    # db.Items.create_index([('ItemID', pymongo.ASCENDING)])
    # db.Images.create_index([('ImageID', pymongo.ASCENDING)])
    # Items_dict_cursor = db.Items.find({}, {'ItemID': 1, 'ImageID': 1}, sort=[("ItemID", pymongo.ASCENDING)])
    # for idx, Item_dict in enumerate(Items_dict_cursor):
    #     item_id = Item_dict['ItemID']
    #     image_id = Item_dict['ImageID']
    #
    #     image_dict = db.Images.find_one({'ImageID': image_id}, {'ImageFeature': 1})
    #     image_feature = image_dict['ImageFeature']
    #     db.Items.update_one({'ItemID': item_id}, {'$set': {'ItemFeature': image_feature}})

    "9. Generate user basic infos(username, password etc) "
    # generate_user_basic_info(db)

    "10. Generate comments"
    # db.Items.update_many({}, {'$set': {'CommentIDList': [], 'CommentNum': 0}})
    # generate_comments(db)

    "11. Generate item text"
    # generate_item_texts(db)



