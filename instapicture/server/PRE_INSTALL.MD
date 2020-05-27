### Dependencies

- Python >=3.6

Install necessary packages:

```bash
pip install -r requirements.txt
```



### Configuring Python Dependency

`node-gyp` requires that you have installed a compatible version of Python, one of: v2.7, v3.5, v3.6,
v3.7, or v3.8. If you have multiple Python versions installed, you can identify which Python
version `node-gyp` should use in one of the following ways:

1. If `node-gyp` is called by way of `npm`, *and* you have multiple versions of
Python installed, then you can set `npm`'s 'python' config key to the appropriate
value:

``` bash
$ npm config set python /path/to/executable/python
```

2. If the `PYTHON` environment variable is set to the path of a Python executable,
then that version will be used, if it is a compatible version.

3. If the `NODE_GYP_FORCE_PYTHON` environment variable is set to the path of a
Python executable, it will be used instead of any of the other configured or
builtin Python search paths. If it's not a compatible version, no further
searching will be done.
