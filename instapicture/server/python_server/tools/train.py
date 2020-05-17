import torch
import logging
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter
from dataset.mongo_dataset import MongoDataset
from model.two_net import TwoNet
import argparse
import datetime
import numpy as np
import os
import os.path as osp


def parse_args():
    parser = argparse.ArgumentParser(description='Train a recommendation model')
    parser.add_argument('data_path', help='the path of data storage')
    parser.add_argument('--resume_from', help='the checkpoint file to resume from')
    parser.add_argument('--work_dir', default='work_dir', help='the dir to save logs and models')
    parser.add_argument('--epoch_num', default=2, type=int, help='the number of training epochs')
    args = parser.parse_args()
    return args


def get_root_logger(log_level=logging.INFO, log_dir='work_dir'):
    logger = logging.getLogger()
    logger.setLevel(log_level)
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

    file_name = osp.abspath(osp.join(log_dir, '{}.log.json'.format(datetime.datetime.now().strftime('%a-%b-%d-%H_%M_%S'))))
    file_handler = logging.FileHandler(file_name, 'w')
    file_handler.setLevel(level=log_level)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(level=log_level)
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)
    return logger


def accuracy(pred, target, threshold=0.5):
    bin_pred = (pred.sigmoid() >= threshold).to(torch.int)
    correct = (bin_pred == target).to(torch.float)
    return torch.mean(correct)


def main():
    args = parse_args()
    logger = get_root_logger('INFO', args.work_dir)
    writer = SummaryWriter(osp.join(args.work_dir, 'exp-bs128-no_dropout'))
    EPOCH_NUM = args.epoch_num

    dataset_all = MongoDataset(args.data_path)
    data_size_all = len(dataset_all)
    train_size = int(0.7 * data_size_all)
    val_size = data_size_all - train_size
    dataset_train, dataset_val = torch.utils.data.random_split(dataset_all, [train_size, val_size])
    dataloader_train = DataLoader(dataset_train, batch_size=128, shuffle=True, num_workers=2)
    dataloader_val = DataLoader(dataset_val, batch_size=256, shuffle=False, num_workers=2)

    model = TwoNet()

    optimizer = torch.optim.Adam(model.parameters(), lr=0.001, betas=(0.9, 0.999), eps=1e-08, weight_decay=0, amsgrad=False)
    loss_func = torch.nn.BCEWithLogitsLoss(reduction='mean')

    logger.info('Begin training! Total epochs={}.'.format(EPOCH_NUM))
    for epoch in range(EPOCH_NUM):
        model.train()
        running_loss = 0
        for iter, data in enumerate(dataloader_train):
            optimizer.zero_grad()

            user_feature, social_feature, item_feature, label = \
                data['user_feature'], data['social_feature'], data['item_feature'], data['label']
            output = model(user_feature, social_feature, item_feature).squeeze()

            loss = loss_func(output, label.to(torch.float))
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
            if (iter + 1) % 100 == 0:
                writer.add_scalar('train_loss', running_loss / 100,
                                  epoch * len(dataloader_train) + iter)
                log_str = 'Train Epoch [{}][{}/{}]: Loss={:.5f}'.format(
                    epoch + 1, iter + 1, len(dataloader_train), running_loss / 100)
                logger.info(log_str)
                running_loss = 0

            if (iter + 1) % 500 == 0 or iter + 1 == len(dataloader_train):
                model.eval()
                accuracy_list = []
                loss_list = []
                with torch.no_grad():
                    for data in dataloader_val:
                        user_feature, social_feature, item_feature, label = \
                            data['user_feature'], data['social_feature'], data['item_feature'], data['label']
                        output = model(user_feature, social_feature, item_feature).squeeze()
                        loss_list.append(loss_func(output, label.to(torch.float)).item())
                        accuracy_list.append(accuracy(output, label))
                mean_accuracy = np.mean(accuracy_list)
                mean_loss = np.mean(loss_list)
                logger.info('Val Epoch [{}][{}/{}]: Accuracy={:.5f}, Loss={:.5f}'.format(
                    epoch + 1, iter + 1, len(dataloader_train), mean_accuracy, mean_loss))
                writer.add_scalar('val_loss', mean_loss, epoch * len(dataloader_train) + iter)
                writer.add_scalar('val_accuracy', mean_accuracy, epoch * len(dataloader_train) + iter)
                model.train()
        torch.save(model, osp.join(args.work_dir, 'epoch_{}.pth'.format(epoch+1)))
    writer.close()


if __name__ == '__main__':
    main()