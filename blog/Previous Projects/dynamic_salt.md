# Dynamic Salt

.LICENCE | BUILD
:-------------------------:|:-------------------------:
![licence](https://img.shields.io/github/license/GoodManWEN/dynamic_salt) | ![Build](https://github.com/GoodManWEN/dynamic_salt/workflows/Build/badge.svg)

Accepts a byte string, add salt at dynamic locations & values under some certain rules. 

## Usage

Clone and build, modify `secret` in `\src\lib.rs` if you like
```
# Windows Powershell
git clone https://github.com/GoodManWEN/dynamic_salt.git
cd dynamic_salt
cargo build --release
cp .\target\release\*.dll .\
```

Python script,
```python
# run.py
from dsalt import salt_core

print(salt_core(b"Hello World"))
print(salt_core("你好世界".encode()))
```

## Performance

For short utf-8 strings, latency should between 300-500ns on current CPUs.
