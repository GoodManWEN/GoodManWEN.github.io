# fnvhash-c

.VERSION | LICENCE | VERSION | PUBLISH | BUILD | DOCS 
:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:
![fury](https://img.shields.io/pypi/v/fnvhash-c.svg) | ![licence](https://img.shields.io/github/license/GoodManWEN/py-fnvhash-c) | ![pyversions](https://img.shields.io/pypi/pyversions/fnvhash-c.svg) | ![Publish](https://github.com/GoodManWEN/py-fnvhash-c/workflows/Publish/badge.svg) | ![Build](https://github.com/GoodManWEN/py-fnvhash-c/workflows/Build/badge.svg) | ![Docs](https://readthedocs.org/projects/fnvhash-c/badge/?version=latest)

Python FNV hash implementation based on cython, to give you an alternative choice when you need a high speed hash in python, could reduce the latency of a single call to tens of nanoseconds.

Because of deprecation, we selectively did not implement FNV-0. 

With code structure referenced to [https://github.com/znerol/py-fnvhash](https://github.com/znerol/py-fnvhash)

## Install

    pip install fnvhash-c

## Feature
- Implementation in pure C, you can expect a 30x to 50x speedup.
- Hash latency reduce to under 100ns.
- A simple bloom filter built inside , which uses a slightly different parameter than the default value to keep result diverse. Ultra fast to use for distributed blacklist scenarios.
- CityHash included, since the [original repo](https://github.com/escherba/python-cityhash) is no longer maintained, it is difficult to compile directly on windows.

## Documentation
https://fnvhash-c.readthedocs.io

## Example

```Python3
# example.py
import fnvhash_c

print(fnvhash_c.fnv1_32(b'Hello world!'))
print(fnvhash_c.fnv1a_32(b'Hello world!'))
print(fnvhash_c.fnv1_64(b'Hello world!'))
print(fnvhash_c.fnv1a_64(b'Hello world!'))

center = fnvhash_c.BloomFilter(capability = 4096) 
# To reduce runtime overhead, The default capacity is set to a constant compiled in the program.
# If you wish to change it, you need to compile the libs yourself to make sure the program work fine.
# Generally speaking, depending on the conversion time between Python and C, 
# a shorter capability usually helps to make filter run faster.

import random
random_char_generator = lambda : f"{random.randint(1000000000,9999999999)}+salt".encode()

test_time = 1000000
hit = 0
miss = 0
for _ in range(test_time):
    if center.hit(random_char_generator()):
        hit += 1
    else:
        miss += 1

# Since the filter is total blank ,the hit rate should be very low
assert (hit * 100 / test_time) <= 0.01
print(f"Empty filter hit rate: {round(hit * 100 / test_time)}%")

# Now we put something into the filter list.
black_list = [random_char_generator() for _ in range(10000)]
for char in black_list:
    center.update(char)
    
hit = 0
for _ in range(test_time):
    if center.hit(random_char_generator()):
        hit += 1
print(f"Filter with 10k elements hit rate: {round(hit * 100 / test_time,2)}%")

hit = 0
for char in black_list:
    if center.hit(char):
        hit += 1
print(f"Items in the blacklist hit rate: {round(hit * 100 / len(black_list),2)}%", ) # should be 100%
```
