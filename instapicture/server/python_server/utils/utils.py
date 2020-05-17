import os
import os.path as osp


def check_file_exist(filename, msg_tmpl='file "{}" does not exist'):
    if not osp.isfile(filename):
        raise FileNotFoundError(msg_tmpl.format(filename))


def mkdir_or_exist(dir_name, mode=0o777):
    if dir_name == '':
        return
    dir_name = osp.expanduser(dir_name)
    os.makedirs(dir_name, mode=mode, exist_ok=True)

def is_str(x):
    """Whether the input is an string instance.
    Note: This method is deprecated since python 2 is no longer supported.
    """
    return isinstance(x, str)