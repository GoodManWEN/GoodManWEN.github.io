# fastapi-queue
![fury](https://img.shields.io/pypi/v/fastapi-queue.svg)
![licence](https://img.shields.io/github/license/GoodManWEN/fastapi-queue)
![pyversions](https://img.shields.io/pypi/pyversions/fastapi-queue.svg)
![Publish](https://github.com/GoodManWEN/fastapi-queue/workflows/Publish/badge.svg)
![Build](https://github.com/GoodManWEN/fastapi-queue/workflows/Build/badge.svg)
![Docs](https://readthedocs.org/projects/fastapi-queue/badge/?version=latest)

A python implementation of a task queue based on `Redis` that can serve as a peak shaver and protect your app.

[中文文档](https://github.com/GoodManWEN/fastapi-queue/tree/main/misc/readme_ch.md)

## What is fastapi-queue?
Fastapi-queue provides a high-performance redis-based task queue that allows requests sent by clients to the `FastAPI` server to be cached in the queue for delayed execution. This means that you don't have to worry about overwhelming your back-end data service, nor do you have to worry about requests being immediately rejected due to exceeding the load limit, when there is an influx of requests to your app in a very short period of time.

## Why fastapi-queue?
This module is for people who want to use task queues but don't want to start too many dependencies to prevent increased maintenance costs. For example if you want to enjoy the benefits of queues but want to maintain a lightweight application and don't want to install `Celery` & `RabbitMQ`, then fastapi-queue is your choice, you just need to rely on python runtime and `Redis` environment.

## Feature
- Separate gateway and service nodes.
- Superior horizontal scalability.
- Fully asynchronous framework, ultra fast.

## Requirements
- fastapi
- aioredis >= 2.0.0
- ThreadPoolExecutorPlus >= 0.2.2
- msgpack >= 1.0.0

## Install

    pip install fastapi-queue

## Documentation
[https://fastapi-queue.readthedocs.io](https://fastapi-queue.readthedocs.io) \(on going\)

## Response sequence description

![](https://raw.githubusercontent.com/goodmanwen/fastapi-queue/main/misc/Schematic.png)

## Examples

Gateway
```python
'''
A gateway application made with FastAPI, which only handles whether or not to allow the 
request, but no need to handle the exact request logic.
'''
from typing import Optional, Any
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi_queue import DistributedTaskApplyManager
import aioredis


app = FastAPI()
redis = aioredis.Redis.from_url("redis://localhost")


def get_response(success_status: bool, result: Any) -> JSONResponse | dict:
    if success_status:
        return {"status": 200, "data": result}
    if result == -1:
        return JSONResponse(status_code=503, content="Service Temporarily Unavailable")
    else:
        return JSONResponse(status_code=500, content="Internal Server Error")


@app.get('/')
async def root(request: Request):
    success_status: bool = False
    async with DistributedTaskApplyManager(
        redis = redis, 
        request_path = request.url.path,
    ) as dtmanager:
        if not dtmanager.success(): 
            # Exceed the maximum capacity of the back-end queue, return 503 directly.
            return JSONResponse(status_code=503, content="Service Temporarily Unavailable")
        success_status, result = await dtmanager.rclt(form_data = {}, task_level = 0)
    return get_response(success_status, result)


@app.get('/sync-test')
async def sync_test(request: Request, x: int):
    success_status: bool = False
    async with DistributedTaskApplyManager(
        redis = redis, 
        request_path = request.url.path,
    ) as dtmanager:
        if not dtmanager.success():
            return JSONResponse(status_code=503, content="Service Temporarily Unavailable")
        success_status, result = await dtmanager.rclt(form_data = {'x': x}, task_level = 0)
    return get_response(success_status, result)

@app.get('/async-test')
async def async_test(request: Request, n: int):
    n = min(n, 80)
    success_status: bool = False
    async with DistributedTaskApplyManager(
        redis = redis, 
        request_path = request.url.path,
    ) as dtmanager:
        if not dtmanager.success():
            return JSONResponse(status_code=503, content="Service Temporarily Unavailable")
        success_status, result = await dtmanager.rclt(form_data = {'n': n}, task_level = 0)
    return get_response(success_status, result)
```

Service nodes
```python
'''
The following code will create a pool of workers of 4 processes with 4 threads under 
each process. They rely on redis for synchronization, so you can run other instances 
as you like without worrying about creating conflicts.
'''
from fastapi_queue import QueueWorker
from loguru import logger
import asyncio  
import aioredis
import signal 
import sys 
import os 

queueworker = None

async def async_root(*args):
    return "Hello world."

def sync_prime_number(redis, mysql, x):
    # Example synchronous function to determine if the input x is a prime number.
    # redis and mysql clients are entered by default, starting from the third parameter 
    # is your custom parameters, only keyword parameters are supported. 
    import math, time
    if x == 1:
        return True
    for numerator in range(2, int(math.sqrt(x))):
        if x % numerator == 0:
            return False
    time.sleep(0.2) # Simulation of calculation time
    return True

async def async_fibonacci(redis, mysql, n):
    # Example asynchronous function to calculate the nth position of the Fibonacci series.
    # redis and mysql clients are entered by default, starting from the third parameter 
    # is your custom parameters, only keyword parameters are supported.

    # Be sure to note that all data to upload and download must be serializable by msgpack.
    # This means that if you transfer some custom object, or in this case a very large integer, 
    # the request will be responsed with an internal server error (http 500).
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b 
    await asyncio.sleep(0.2) # Simulation of calculation time
    return a 

route_table = {
    '/': async_root,
    '/sync-test': sync_prime_number,
    '/async-test': async_fibonacci,
}

route_table_maximum_concurrency = {
    '/': 9999,
    '/sync-test': 320,
    '/async-test': 1000,
}

async def main(pid, logger):
    global queueworker

    first_time_run = True
    while True:
        run_startup, first_time_run = (True if pid != 0 else False) and first_time_run, False
        redis = aioredis.Redis.from_url("redis://localhost")
        try:
            worker = QueueWorker(
                redis, 
                threads=4, 
                route_table_maximum_concurrency = route_table_maximum_concurrency, 
                allowed_type_limit=None, 
                run_startup=run_startup,
                logger=logger,
            )
            queueworker = worker
            [worker.method_register(name, func) for name, func in route_table.items()]
            await worker.run_serve()
            if worker.closeing():
                break
        except Exception as e:
            debug = True
            if debug:
                raise e
    await redis.close()
    logger.info(f"Pid: {worker.pid}, shutdown")


def sigint_capture(sig, frame):
    if queueworker: queueworker.graceful_shutdown(sig, frame)
    else: sys.exit(1)


if __name__ == '__main__':
    logger.remove()
    logger.add(sys.stderr, level="DEBUG", enqueue=True)
    signal.signal(signal.SIGINT, sigint_capture) # In order for the program to capture the `ctrl+c` close signal
    for _ in range(3):
        pid = os.fork()
        if pid == 0: break
    asyncio.run(main(pid, logger))
```

## Performance

Due to the fully asynchronous support, complex interprocedural calls exhibit a very low processing latency.

(Latency vs. number of request threads on going)

(Maximum capability requests per second vs. number of service nodes on going)

## Tips

- The code has been carefully debugged and functions reliably, but I haven't spent much time making it a generic module, which means that if you encounter bugs you'll need to modify the code yourself, and they're usually caused by oversights of detail somewhere.
- The service has undergone rigorous stress tests and can work for hours under concurrent requests from hundreds of clients, but for reliability of protection, you need to carefully set the upper limit of your load. Where `RateLimiter` can provide you with a low consumption **roughly** pre-intercepted function.

For example,
```python
from fastapi_queue import RateLimiter
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

...

@app.on_event("startup")
async def startup():
    RateLimiter().porter_run_serve()

...

@app.get("/")
@RateLimiter(bucket = 5000, limits_s = 1000)
async def root(request: Request):  
    '''
    The two parameters of RateLimiter mean that this particular FastAPI instance 
    holds a total of 5000 tokens and takes one token each time a request is received. 
    If there is a large influx of requests come in a short period of time, when 
    the number of remaining tokens in the bucket decreases to 0, the server will 
    simply reject all requests without forwarding them to the queue-worker. With 
    current parameters, this bucket now keeps a maximum of 5000 tokens and restores 
    1000 tokens per second.
    '''
    async with DistributedTaskApplyManager(
        ...
    )
```
