import torch
import numpy as np
from dataset.mongo_dataset import MongoDataset
import matplotlib.pyplot as plt

if __name__ == '__main__':
    data_path = '../Data/train_v1'
    model = torch.load('work_dir/exp-bs64-no_dropout/epoch_2.pth')
    dataset = MongoDataset(data_path)

    image_feature_slim = dataset.image_features_slim
    social_feature_slim = dataset.social_features_slim
    user_feature_slim = dataset.user_features_slim
    user_image_label_tuples = dataset.user_image_label_tuples.to(torch.int)

    num_users = len(user_feature_slim)
    num_items = len(image_feature_slim)
    SAMPLE_USER_NUM = 1000
    user_idxs = np.random.choice([i for i in range(num_users)], SAMPLE_USER_NUM)
    k_list = [5, 20, 30, 50, 100, 200, 300, 400, 500, 600, 700, 800, 1000, 1200, 1300, 1500]
    precision_all = np.zeros((SAMPLE_USER_NUM, len(k_list)))
    recall_all = np.zeros((SAMPLE_USER_NUM, len(k_list)))

    for idx, user_idx in enumerate(user_idxs):
        user_feature_batch = user_feature_slim[user_idx][np.newaxis, :].repeat(num_items, 1)
        social_feature_batch = social_feature_slim[user_idx][np.newaxis, :].repeat(num_items, 1)
        item_feature_batch = image_feature_slim

        scores = model(user_feature_batch, social_feature_batch, item_feature_batch).squeeze()
        sorted_idxs = torch.argsort(scores, descending=True)

        pos_item_idxs_full = user_image_label_tuples[:, 2] == 1
        user_item_idxs_full = user_image_label_tuples[:, 0] == user_idx
        pos_user_item_idxs_full = pos_item_idxs_full * user_item_idxs_full
        gt_user_pos_item_idxs_set = set(user_image_label_tuples[
                                            torch.nonzero(pos_user_item_idxs_full).squeeze(), 1].tolist())
        precisons_user = np.zeros((1, len(k_list)))
        recalls_user = np.zeros((1, len(k_list)))
        for k_idx, top_k in enumerate(k_list):
            top_k_item_idxs_set = set(sorted_idxs[:top_k].tolist())
            intersection = top_k_item_idxs_set & gt_user_pos_item_idxs_set
            precison = len(intersection) / len(top_k_item_idxs_set)
            recall = len(intersection) / len(gt_user_pos_item_idxs_set)
            precisons_user[0, k_idx] = precison
            recalls_user[0, k_idx] = recall
        precision_all[idx, :] = precisons_user
        recall_all[idx, :] = recalls_user
        print(idx)

    mean_precisions = np.mean(precision_all, axis=0).squeeze()
    mean_recalls = np.mean(recall_all, axis=0).squeeze()

    plt.figure()
    plt.plot(k_list, mean_precisions, linewidth=1)
    plt.xlabel('Top-K')
    plt.ylabel('Average Precision')
    plt.title('Average Precision@K among all users')
    plt.show()

    plt.figure()
    plt.plot(k_list, mean_recalls, linewidth=1)
    plt.xlabel('Top-K')
    plt.ylabel('Average Recall')
    plt.title('Average Recall@K among all users')
    plt.show()