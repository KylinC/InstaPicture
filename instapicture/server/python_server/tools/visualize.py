import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

if __name__ == '__main__':
    train_loss_file = 'work_dir/exp-bs64-no_dropout/run-exp-bs64-no_dropout-tag-train_loss.csv'
    val_loss_file = 'work_dir/exp-bs64-no_dropout/run-exp-bs64-no_dropout-tag-val_loss.csv'
    val_accuracy_file = 'work_dir/exp-bs64-no_dropout/run-exp-bs64-no_dropout-tag-val_accuracy.csv'

    train_loss = pd.read_csv(train_loss_file)
    val_loss = pd.read_csv(val_loss_file)
    val_accuracy = pd.read_csv(val_accuracy_file)

    train_loss_step, train_loss_value = train_loss['Step'].values, train_loss['Value'].values
    val_loss_step, val_loss_value = val_loss['Step'].values, val_loss['Value'].values
    val_accuracy_step, val_accuracy_value = val_accuracy['Step'].values, val_accuracy['Value'].values

    plt.figure()
    plt.plot(train_loss_step, train_loss_value, linewidth=1, label='train')
    plt.plot(val_loss_step, val_loss_value, linewidth=1, label='val')
    plt.legend(loc='best')
    plt.xlabel('Iter')
    plt.ylabel('Loss')
    plt.title('Training and validation cross entropy loss')

    plt.figure()
    plt.plot(val_accuracy_step, val_accuracy_value, linewidth=1, label='val')
    plt.legend(loc='best')
    plt.xlabel('Iter')
    plt.ylabel('Accuracy')
    plt.title('0-1 classification accuracy')

    plt.show()