# pipeit

.VERSION | LICENCE | VERSION | PUBLISH | BUILD
:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:
![fury](https://badge.fury.io/py/pipeit.svg)  |  ![licence](https://img.shields.io/github/license/GoodManWEN/pipeit) | ![pyversions](https://img.shields.io/pypi/pyversions/pipeit.svg) | ![Publish](https://github.com/GoodManWEN/pipeit/workflows/Publish/badge.svg) | ![Build](https://github.com/GoodManWEN/pipeit/workflows/Build/badge.svg)


Let's use python functional programming like Unix pipe! 

Inspired by [abersheeran/only-pipe](https://github.com/abersheeran/only-pipe) , [czheo/syntax_sugar_python](https://github.com/czheo/syntax_sugar_python) , [pipetools](https://pypi.org/project/pipetools/)

## Install

    pip install pipeit

## Usage
- Statements start with `PIPE` and end with `END` **OR** you can even ellipsis them.
- There're only two objects(`PIPE` & `END`) and three types(`Filter` ,`Map` & `Reduce`) in namespace, so feel free to use `from pipeit import *`.
- Convert filter into tuple or capital the first letter, e.g. `map(lambda x:x + 1) => (map , lambda x:x + 1)` or `Map(lambda x:x + 1)` , however **DO NOT MIX USE THEM**.
- It'll be 10% ~ 20% faster using the original python functional way than using these wrappers. 

## Example

```Python
>>> from pipit import PIPE , END , Map , Filter , Reduce

>>> data = PIPE | range(10) | (map , lambda x:x + 1) | (map , str) | list | END
>>> data
['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

# (map , lambda x:x + 1) equals to Map(lambda x:x + 1)
>>> func = lambda x: PIPE | range(x) | Map(lambda x:x + 1) | Map(str) | list | END
>>> func(10)
['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
```

Or you may want a more easy use.
```Python
>>> range(10) | Filter(lambda x:x<5) | list
[0, 1, 2, 3, 4]

>>> for _ in range(3) | Map(str):
        print(repr(_))


'0'
'1'
'2'
```
