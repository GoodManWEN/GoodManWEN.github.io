# aioredlock-py
![fury](https://img.shields.io/pypi/v/aioredlock-py.svg)
![licence](https://img.shields.io/github/license/GoodManWEN/aioredlock-py)
![pyversions](https://img.shields.io/pypi/pyversions/aioredlock-py.svg)
![Publish](https://github.com/GoodManWEN/aioredlock-py/workflows/Publish/badge.svg)
![Build](https://github.com/GoodManWEN/aioredlock-py/workflows/Build/badge.svg)
![Docs](https://readthedocs.org/projects/aioredlock-py/badge/?version=latest)

Secure and efficient distributed locks (Redisson like) implemetation. Ensure efficient performance with biased locking's implementation, can load more than 1k/s of concurrent requests with default parameter settings.

## Requirements
- aioredis>=2.0.0

## Install

    pip install aioredlock-py

## Feature
- Ensure reliability with context manager.
- Use lua scripts to ensure atomicity on lock release.
- Notification prompt you to cancel the following execution if acquisition fails
- Reliable in high concurrency.

## Documentation
https://aioredlock-py.readthedocs.io

## Basic usage
```python
import asyncio
import aioredis
from aioredlock_py import Redisson

async def single_thread(redis):
    for _ in range(10):
        async with Redisson(redis, key="no1") as lock:
            if not lock:
                # If the lock still fails after several attempts, `__aenter__` 
                # will return None to prompt you to cancel the following execution
                return 'Do something, failed to acquire lock' # raise ...
            # else 
            # Service logic protected by Redisson
            await redis.incr("foo")

async def test_long_term_occupancy(redis):
    async with Redisson(redis, key="no1", ex=10) as lock:
        if not lock: return;
        # Service logic protected by Redisson
        await redis.set("foo", 0)
        # By default, a lock is automatically released if no action is 
        # taken for 20 seconds after redisson holds it. Let's assume that 
        # your service logic takes a long time (30s in this case) to process,
        # you don't need to worry about it causing chaos, because there's 
        # background threads help you automatically renew legally held locks.
        await asyncio.sleep(30)
        await redis.incr("foo")


async def main():
    redis = aioredis.from_url("redis://localhost")
    await redis.delete("redisson:no1")
    await redis.set("foo", 0)
    await asyncio.gather(*(single_thread(redis) for _ in range(20)))
    assert int(await redis.get("foo")) == 200
    # await test_long_term_occupancy(redis)

asyncio.run(main())
```
