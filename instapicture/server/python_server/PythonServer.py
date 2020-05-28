import torch
import zerorpc
import pymongo
import pandas
import os.path as osp
from model.cnn import ImageFeatureExtractor
import numpy as np

PORT = 4242


class PythonServer(object):
    def __init__(self,
                 rec_model_path='./python_server/work_dir/exp-bs64-no_dropout/epoch_2.pth',
                 cnn_model_path='./python_server/Cache',
                 img_root='./public/uploads'):
        self.IMG_FEAT_DIM = 512
        self.USER_FEAT_DIM = 522
        self.TAG_FEAT_DIM = 10
        self.TotalTagList = ['鲤鱼', '史宾格犬', '磁带播放机', '链锯', '教堂',
                             '法国号角', '垃圾车', '油泵', '高尔夫球', '降落伞']
        self.TOTAL_TAG_NUM = len(self.TotalTagList)
        self.img_root = img_root
        try:
            self.client = pymongo.MongoClient(host='localhost', port=27017)
            self.db = self.client['picturebase']
            self.create_Images_Index()
            self.create_Items_Index()
            self.create_UserInfos_Index()
            self.create_Friends_Index()
            print('Connect MongoDB successfully!')
        except Exception as e:
            print('Failed to connect MongoDB!')
            raise e
        try:
            self.rec_model = torch.load(rec_model_path)
            print('Load recommendation model successfully!')
        except Exception as e:
            print('Failed to load recommendation model!')
            raise e
        try:
            self.cnn_model = ImageFeatureExtractor(cnn_model_path)
            print('Load CNN model successfully!')
        except Exception as e:
            print('Failed to load CNN model!')
            raise e

    def listen(self):
        print(f'Python Server started listening on {PORT} ...')

    def create_Items_Index(self):
        self.db.Items.create_index([('ItemID', pymongo.ASCENDING)], background=True)

    def create_Images_Index(self):
        self.db.Images.create_index([('ImageID', pymongo.ASCENDING)], background=True)

    def create_UserInfos_Index(self):
        self.db.UserInfos.create_index([('UserID', pymongo.ASCENDING)], background=True)

    def create_Friends_Index(self):
        self.db.Friends.create_index([('FollowerID', pymongo.ASCENDING)], background=True)

    def get_rec_items(self, user_id, pre_K=300, post_K=30, final_K=10):
        user_id = int(user_id)
        pre_K = min(self.db.Items.count_documents({}), pre_K)

        Users_dict = self.db.UserInfos.find_one({'UserID': user_id},
                                                {'UserFeature': 1, 'SocialFeature': 1, 'TagList': 1, 'UploadImageNum': 1})
        if Users_dict is None:
            return []
        tag_list = Users_dict['TagList']
        post_K = min(pre_K, len(tag_list) * post_K)

        user_feature = torch.tensor(Users_dict['UserFeature'], dtype=torch.float)
        social_feature = torch.tensor(Users_dict['SocialFeature'], dtype=torch.float)
        upload_image_num = Users_dict['UploadImageNum']
        user_feature_batch = user_feature.repeat(pre_K, 1)
        social_feature_batch = social_feature.repeat(pre_K, 1)

        pre_Items_dict_list = self.db.Items.aggregate([{'$sample': {'size': pre_K}}])
        pre_Items_dict_list = list(pre_Items_dict_list)
        pre_Items = pandas.DataFrame(pre_Items_dict_list)
        pre_item_ids = pre_Items['ItemID'].values
        # pre_item_class_idxs = pre_Items['ClassIdx'].values
        pre_item_feature_batch = torch.from_numpy(np.vstack(
            pre_Items['ItemFeature'].values.tolist())).to(dtype=torch.float)

        friends_dict_list = self.db.Friends.find({'FollowerID': user_id}, {'CelebrityID': 1})
        friend_num = friends_dict_list.count()
        if upload_image_num == 0 and friend_num >= 3:
            user_feature_batch = social_feature_batch

        if upload_image_num >= 3 or friend_num >= 3:
            with torch.no_grad():
                scores = self.rec_model(user_feature_batch, social_feature_batch, pre_item_feature_batch).squeeze()
            sorted_idxs = torch.argsort(scores, descending=True).numpy()
            post_sorted_idxs = sorted_idxs[:post_K]
        else:
            post_sorted_idxs = np.random.choice([i for i in range(pre_K)], post_K)
        perm_post_sorted_idxs = np.random.permutation(post_sorted_idxs)
        final_sorted_idxs = perm_post_sorted_idxs[:final_K]

        # print('final_sorted_idxs: {}'.format(final_sorted_idxs))
        # print('final_sorted_scores: {}'.format(scores.sigmoid()[torch.tensor(final_sorted_idxs, dtype=torch.long)]))
        # print('top {} class idxs: {}'.format(post_K, pre_item_class_idxs[torch.tensor(sorted_idxs[:post_K], dtype=torch.long)]))
        # print('final class idxs: {}'.format(pre_item_class_idxs[torch.tensor(final_sorted_idxs, dtype=torch.long)]))

        final_item_ids = pre_item_ids[final_sorted_idxs].tolist()

        return final_item_ids

    def get_rec_users(self, user_id, pre_K=700, post_K=20, final_K=5):
        user_id = int(user_id)
        pre_K = min(self.db.UserInfos.count_documents({}), pre_K)

        Users_dict = self.db.UserInfos.find_one({'UserID': user_id}, {'UserFeature': 1, 'UploadImageNum': 1})
        if Users_dict is None:
            return []
        post_K = min(pre_K, post_K)

        user_feature = torch.tensor(Users_dict['UserFeature'], dtype=torch.float).unsqueeze(0)
        upload_image_num = Users_dict['UploadImageNum']

        pre_UserInfos_dict_list = self.db.UserInfos.aggregate([{'$sample': {'size': pre_K}}])
        pre_UserInfos_dict_list = list(pre_UserInfos_dict_list)
        pre_UserInfos = pandas.DataFrame(pre_UserInfos_dict_list)
        pre_friend_ids = pre_UserInfos['UserID'].values
        pre_friend_user_feature_batch = torch.from_numpy(np.vstack(
            pre_UserInfos['UserFeature'].values.tolist())).to(dtype=torch.float)
        # pre_friend_tag_list = pre_UserInfos['TagList'].values

        if upload_image_num >= 3:
            similarities = torch.cosine_similarity(user_feature, pre_friend_user_feature_batch)
        else:
            similarities = torch.cosine_similarity(user_feature[:, -self.TAG_FEAT_DIM:],
                                                   pre_friend_user_feature_batch[:, -self.TAG_FEAT_DIM:])
        sorted_idxs = torch.argsort(similarities, descending=True).numpy()
        post_sorted_idxs = sorted_idxs[:post_K]
        # print('Top {} similarity: {}'.format(post_K, similarities[torch.tensor(post_sorted_idxs, dtype=torch.long)]))
        perm_post_sorted_idxs = np.random.permutation(post_sorted_idxs)
        final_sorted_local_idxs = torch.argsort(similarities[perm_post_sorted_idxs[:final_K]], descending=True)
        # print('final_sorted_local_idxs: {}'.format(final_sorted_local_idxs))
        final_sorted_idxs = perm_post_sorted_idxs[:final_K][final_sorted_local_idxs]
        # print('final_sorted_idxs: {}'.format(final_sorted_idxs))
        # print('Final similarity: {}'.format(similarities[perm_post_sorted_idxs[:final_K]][final_sorted_local_idxs]))

        final_user_ids = pre_friend_ids[final_sorted_idxs].tolist()

        return final_user_ids
        # return pre_friend_tag_list[final_sorted_idxs].tolist()

    def update_user_feature(self, user_id):
        user_id = int(user_id)
        User_dict = self.db.UserInfos.find_one({'UserID': user_id}, {'TagList': 1})
        if User_dict is None:
            return
        img_feature_and_weights = self.db.Images.find({'UserID': user_id}, {'FeatureWeight': 1, 'ImageFeature': 1})
        img_feature_and_weights = list(img_feature_and_weights)

        if len(img_feature_and_weights) > 0:
            img_feature_and_weights = pandas.DataFrame(img_feature_and_weights)
            img_features = np.vstack(img_feature_and_weights['ImageFeature'].values.tolist())
            weights = img_feature_and_weights['FeatureWeight'].values[:, np.newaxis]
            weighted_img_feature = (img_features * weights).sum(axis=0) / weights.sum()
        else:
            weighted_img_feature = np.zeros(self.IMG_FEAT_DIM)

        TagFeature = np.zeros(self.TOTAL_TAG_NUM)
        TagList = User_dict['TagList']
        for tag in TagList:
            TagFeature[self.TotalTagList.index(tag)] = 1.0
        TagFeature = TagFeature.tolist()
        # print('TagFeature: {}'.format(TagFeature))

        UserFeature = np.concatenate([weighted_img_feature, TagFeature]).tolist()
        assert len(UserFeature) == self.USER_FEAT_DIM
        self.db.UserInfos.update_one({'UserID': user_id}, {'$set': {'UserFeature': UserFeature, 'TagFeature': TagFeature}})

    def update_social_feature(self, user_id):
        user_id = int(user_id)
        user_dict = self.db.UserInfos.find_one({'UserID': user_id}, {'UserFeature': 1})
        if user_dict is None:
            return
        friends_dict_list = self.db.Friends.find({'FollowerID': user_id}, {'CelebrityID': 1})
        friends_dict_list = list(friends_dict_list)
        if len(friends_dict_list) > 0:
            friend_ids = pandas.DataFrame(friends_dict_list)['CelebrityID'].values.tolist()
            users_dict_list = self.db.UserInfos.find({'UserID': {'$in': friend_ids}}, {'UserID': 1, 'UserFeature': 1})
            users_dict_list = list(users_dict_list)

            friends_infos = pandas.DataFrame(users_dict_list)
            friend_user_features = np.vstack(friends_infos['UserFeature'].values.tolist())
            SocialFeature = np.mean(friend_user_features, axis=0).tolist()
        else:
            SocialFeature = user_dict['UserFeature']
        self.db.UserInfos.update_one({'UserID': user_id}, {'$set': {'SocialFeature': SocialFeature}})

    def update_image_feature(self, image_id, weight=1.0):
        image_id = int(image_id)
        weight = float(weight)
        image_dict = self.db.Images.find_one({'ImageID': image_id}, {'StoragePath': 1})
        if image_dict is None:
            return
        image_path = osp.join(self.img_root, image_dict['StoragePath'])
        # print('image_path: {}'.format(image_path))
        image_feature = self.cnn_model.predict(image_path)

        # print('Feature weight: {}'.format(weight))
        self.db.Images.update_one({'ImageID': image_id},
                                  {'$set': {'FeatureWeight': weight, 'ImageFeature': image_feature}})

    def update_item_feature(self, item_id):
        item_id = int(item_id)
        item_dict = self.db.Items.find_one({'ItemID': item_id}, {'ImageID': 1})
        image_id = item_dict['ImageID']
        # print('image_id: {}'.format(image_id))
        image_dict = self.db.Images.find_one({'ImageID': image_id}, {'ImageFeature': 1})
        image_feature = image_dict['ImageFeature']
        item_feature = image_feature

        self.db.Items.update_one({'ItemID': item_id}, {'$set': {'ItemFeature': item_feature}})

try:
    s = zerorpc.Server(PythonServer())
    s.bind(f'tcp://0.0.0.0:{PORT}')
    s.run()
    print('PythonServer running...')
except Exception as e:
    print('unable to start PythonServer:', e)
    raise e
