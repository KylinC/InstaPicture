import torch
import torch.nn as nn
import PIL
from utils.imageio import imread
from torchvision import transforms


class ImageFeatureExtractor(object):
    def __init__(self, model_path='./Cache', model_name='resnet34'):
        torch.hub.set_dir(model_path)
        self.setup_model(model_name)

    def setup_model(self, model_name='resnet34', **kwargs):
        self.model = torch.hub.load('pytorch/vision:v0.6.0', model_name, pretrained=True)
        self.model.fc = Identity()
        self.model.eval()

        self.preprocess = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    def predict(self, img_path):
        img = imread(img_path, channel_order='rgb')
        PIL_img = PIL.Image.fromarray(img)
        input_tensor = self.preprocess(PIL_img)
        input_batch = input_tensor.unsqueeze(0)  # create a mini-batch as expected by the model

        with torch.no_grad():
            output = self.model(input_batch).squeeze(0).numpy().tolist()
        return output


class Identity(nn.Module):
    def __init__(self):
        super(Identity, self).__init__()

    def forward(self, x):
        return x
