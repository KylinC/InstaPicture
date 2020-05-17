import torch
import os
import os.path as osp
import pandas
import numpy as np
import pymongo
import datetime
import time


class MongoDataset(torch.utils.data.Dataset):
    "Dataset generated from .npy files"

    def __init__(self, storage_path):
        self.image_features_slim = torch.from_numpy(np.load(
            osp.join(storage_path, 'image_features_slim.npy'))).to(torch.float32)
        self.user_features_slim = torch.from_numpy(np.load(
            osp.join(storage_path, 'user_features_slim.npy'))).to(torch.float32)
        self.social_features_slim = torch.from_numpy(np.load(
            osp.join(storage_path, 'social_features_slim.npy'))).to(torch.float32)
        self.user_image_label_tuples = torch.from_numpy(np.load(
            osp.join(storage_path, 'user_image_label_tuples.npy'))).to(torch.float32)

        # image_featre_var, image_featre_mean = torch.var_mean(self.image_features_slim, dim=0)
        # self.image_features_slim = (self.image_features_slim - image_featre_mean) / torch.sqrt(image_featre_var)
        # user_feature_var, user_feature_mean = torch.var_mean(self.user_features_slim, dim=0)
        # self.user_features_slim = (self.user_features_slim - user_feature_mean) / torch.sqrt(user_feature_var)
        # social_feature_var, social_feature_mean = torch.var_mean(self.social_features_slim, dim=0)
        # self.social_features_slim = (self.social_features_slim - social_feature_mean) / torch.sqrt(social_feature_var)

    def __len__(self):
        return self.user_image_label_tuples.size(0)

    def __getitem__(self, idx):
        if torch.is_tensor(idx):
            idx = idx.item()
        user_idx, image_idx, label = self.user_image_label_tuples[idx, :]
        user_feature = self.user_features_slim[int(user_idx), :]
        social_feature = self.social_features_slim[int(user_idx), :]
        item_feature = self.image_features_slim[int(image_idx), :]
        sample = {
            'user_feature': user_feature,
            'social_feature': social_feature,
            'item_feature': item_feature,
            'label': int(label)
        }
        return sample


def gen_dataset_and_save_npy(database, start_time, end_time, storage_path):
    """
    generate dataset and save .npy to the disk, based on MongoDB databse
    :param database: a MongoDB database
    :param start_time: datetime object
    :param end_time: datetime object
    :param storage_path: the dir path to save .npy files
    """
    db = database
    Pros_dict_list = db.Pros.find({'Time': {'$gte': start_time, '$lte': end_time}},
                                  {'ItemID': 1, 'ProUserID': 1, '_id': 0})
    Pros_dict_list = list(Pros_dict_list)
    Cons_dict_list = db.Cons.find({'Time': {'$gte': start_time, '$lte': end_time}},
                                  {'ItemID': 1, 'ConUserID': 1, '_id': 0})
    Cons_dict_list = list(Cons_dict_list)
    Pros = pandas.DataFrame(Pros_dict_list)
    Cons = pandas.DataFrame(Cons_dict_list)
    pro_item_ids_full, pro_user_ids_full = Pros['ItemID'].values.tolist(), Pros['ProUserID'].values.tolist()
    con_item_ids_full, con_user_ids_full = Cons['ItemID'].values.tolist(), Cons['ConUserID'].values.tolist()
    num_pros, num_cons = len(pro_item_ids_full), len(con_item_ids_full)
    item_ids_slim = np.sort(list(set(pro_item_ids_full + con_item_ids_full)))
    num_items_slim = len(item_ids_slim)
    user_ids_slim = np.sort(list(set(pro_user_ids_full + con_user_ids_full)))
    num_users_slim = len(user_ids_slim)

    db.Items.create_index([('ItemID', pymongo.ASCENDING)])
    Items_dict_list = db.Items.find({'ItemID': {'$in': item_ids_slim.tolist()}},
                                    {'ImageID': 1}, sort=[("ItemID", pymongo.ASCENDING)])
    Items_dict_list = list(Items_dict_list)
    image_ids_slim = pandas.DataFrame(Items_dict_list)['ImageID'].values
    sorted_image_ids_slim = np.sort(image_ids_slim).tolist()
    item_idxs_to_image_idxs = [_ for _ in range(num_items_slim)]
    for item_idx, image_id in enumerate(image_ids_slim):
        item_idxs_to_image_idxs[item_idx] = sorted_image_ids_slim.index(image_id)

    db.Images.create_index([('ImageID', pymongo.ASCENDING)])
    Images_dict_list = db.Images.find({'ImageID': {'$in': image_ids_slim.tolist()}},
                                      {'ImageFeature': 1}, sort=[("ImageID", pymongo.ASCENDING)])
    Images_dict_list = list(Images_dict_list)
    image_features_slim = np.vstack(pandas.DataFrame(Images_dict_list)['ImageFeature'].values.tolist())

    db.UserInfos.create_index([('UserID', pymongo.ASCENDING)])
    Users_dict_list = db.UserInfos.find({'UserID': {'$in': user_ids_slim.tolist()}},
                                        {'UserFeature': 1, 'SocialFeature': 1}, sort=[('UserID', pymongo.ASCENDING)])
    Users_dict_list = list(Users_dict_list)
    Users = pandas.DataFrame(Users_dict_list)
    user_features_slim = np.vstack(Users['UserFeature'].values.tolist())
    social_features_slim = np.vstack(Users['SocialFeature'].values.tolist())

    user_image_label_list = []
    start_time = time.time()
    for pro_idx, (item_id, user_id) in enumerate(zip(pro_item_ids_full, pro_user_ids_full)):
        item_idx = np.argwhere(item_ids_slim == item_id)[0][0]
        image_idx = item_idxs_to_image_idxs[item_idx]
        user_idx = np.argwhere(user_ids_slim == user_id)[0][0]
        user_image_label_list.append((user_idx, image_idx, 1))
    end_time = time.time()
    duration = end_time - start_time
    print('Using {:.4f}s to generate pro idxs, avg {:.4f}s per pro.'.format(duration, duration / num_pros))

    start_time = time.time()
    for con_idx, (item_id, user_id) in enumerate(zip(con_item_ids_full, con_user_ids_full)):
        item_idx = np.argwhere(item_ids_slim == item_id)[0][0]
        image_idx = item_idxs_to_image_idxs[item_idx]
        user_idx = np.argwhere(user_ids_slim == user_id)[0][0]
        user_image_label_list.append((int(user_idx), int(image_idx), 0))
    end_time = time.time()
    duration = end_time - start_time
    print('Using {:.4f}s to generate con idxs, avg {:.4f}s per con.'.format(duration, duration / num_cons))

    if not osp.exists(storage_path):
        os.mkdir(storage_path)
    np.save(osp.join(storage_path, 'image_features_slim.npy'), image_features_slim)
    np.save(osp.join(storage_path, 'user_features_slim.npy'), user_features_slim)
    np.save(osp.join(storage_path, 'social_features_slim.npy'), social_features_slim)
    np.save(osp.join(storage_path, 'user_image_label_tuples.npy'), np.array(user_image_label_list))


if __name__ == '__main__':
    client = pymongo.MongoClient(host='localhost', port=27017)
    db = client['InstaPicture']
    start_time = datetime.datetime(2020, 5, 1, 1, 0, 0, 0)
    end_time = datetime.datetime(2020, 5, 10, 11, 59, 0, 0)
    dir_path = osp.abspath('../Data/train_v1')
    gen_dataset_and_save_npy(db, start_time, end_time, dir_path)
