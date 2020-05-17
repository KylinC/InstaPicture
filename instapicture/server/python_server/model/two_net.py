import torch
import torch.nn as nn
from collections import OrderedDict


class TwoNet(nn.Module):

    def __init__(self,
                 user_feat_dim=522,
                 social_feat_dim=522,
                 item_feat_dim=512,
                 user_net_hidden_dim1=1024,
                 user_net_hidden_dim2=512,
                 item_net_hidden_dim=512,
                 output_feat_dim=256
                 ):
        super(TwoNet, self).__init__()
        self.user_feat_dim = user_feat_dim
        self.social_feat_dim = social_feat_dim
        self.item_feat_dim = item_feat_dim
        self.user_net_hidden_dim1 = user_net_hidden_dim1
        self.user_net_hidden_dim2 = user_net_hidden_dim2
        self.item_net_hidden_dim = item_net_hidden_dim
        self.output_feat_dim = output_feat_dim

        self.relu = nn.ReLU(inplace=True)

        self.user_net = nn.Sequential(OrderedDict([
            ('fc1', nn.Linear(self.user_feat_dim + self.social_feat_dim, self.user_net_hidden_dim1)),
            # ('dropout1', nn.Dropout(p=0.5)),
            ('relu1', self.relu),
            ('fc2', nn.Linear(self.user_net_hidden_dim1, self.user_net_hidden_dim2)),
            # ('dropout2', nn.Dropout(p=0.5)),
            ('relu2', self.relu),
            ('fc3', nn.Linear(self.user_net_hidden_dim2, self.output_feat_dim))
        ]))

        self.item_net = nn.Sequential(OrderedDict([
            ('fc1', nn.Linear(self.item_feat_dim, self.item_net_hidden_dim)),
            ('relu1', self.relu),
            ('fc2', nn.Linear(self.item_net_hidden_dim, self.output_feat_dim))
        ]))

        self.dist_fc = nn.Linear(self.output_feat_dim, 1)
        self.dist_drop_out = nn.Dropout(p=0.2)

        self.init_weights()

    def init_weights(self):
        for m in self.user_net:
            if isinstance(m, nn.Linear):
                nn.init.normal_(m.weight, 0, 0.01)
                nn.init.constant_(m.bias, 0)

        for m in self.item_net:
            if isinstance(m, nn.Linear):
                nn.init.normal_(m.weight, 0, 0.01)
                nn.init.constant_(m.bias, 0)

        nn.init.normal_(self.dist_fc.weight, 0, 0.01)
        nn.init.constant_(self.dist_fc.bias, 0)

    def forward(self, user_feature, social_feature, item_feature, **kwargs):
        user_feature_all = torch.cat([user_feature, social_feature], dim=1)
        user_output_feat = self.user_net(user_feature_all)
        item_output_feat = self.item_net(item_feature)

        diff_square = (user_output_feat - item_output_feat) ** 2
        distance = self.dist_fc(diff_square)
        # distance = self.dist_drop_out(distance)
        # distance = torch.cosine_similarity(user_output_feat, item_output_feat, dim=1) / 2 + 1
        # distance = distance.clamp(min=1e-5, max=1-1e-5)
        return distance


if __name__ == '__main__':
    model = TwoNet()
    user_feature = torch.rand(4, 522)
    social_feature = torch.rand(4, 522)
    item_feature = torch.rand(4, 512)

    model.eval()
    distance = model(user_feature, social_feature, item_feature)
    print(distance)
