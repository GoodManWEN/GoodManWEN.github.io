# ThreadPoolExecutorPlus

.VERSION | LICENCE | VERSION | PUBLISH | BUILD 
:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:
![fury](https://badge.fury.io/py/ThreadPoolExecutorPlus.svg) | ![licence](https://img.shields.io/github/license/GoodManWEN/ThreadPoolExecutorPlus) | ![pyversions](https://img.shields.io/pypi/pyversions/ThreadPoolExecutorPlus.svg) | ![Publish](https://github.com/GoodManWEN/ThreadPoolExecutorPlus/workflows/Publish/badge.svg) | ![Build](https://github.com/GoodManWEN/ThreadPoolExecutorPlus/workflows/Build/badge.svg)

This package provides you a duck typing of concurrent.futures.ThreadPoolExecutor , which has the very similar api and could fully replace ThreadPoolExecutor in your code.

The reason why this pack exists is we would like to solve several specific pain spot of memory control in native python one. 

## Feature
- Fully replaceable with concurrent.futures.ThreadPoolExecutor , for example in asyncio.
- Whenever submit a new task , executor will perfer to use existing idle thread rather than create a new one.
- Executor will automatically shrink itself duriung leisure time in order to achieve higher efficiency and less memory.

## Install

    pip install ThreadPoolExecutorPlus

## Usage
Same api as concurrent.futures.ThreadPoolExecutor , with some more control function added: 

##### set_daemon_opts(min_workers = None, max_workers = None, keep_alive_time = None)
    
&emsp;&emsp;&emsp; In order to guarantee same api interface , new features should be modfied after object created.  
&emsp;&emsp;&emsp; Could change minimum/maximum activate worker num , and set after how many seconds will the  
&emsp;&emsp;&emsp; idle thread terminated.   
&emsp;&emsp;&emsp; By default , min_workers = 4 , max_workers = 16 times cpu_core count on windows and 32x on  
&emsp;&emsp;&emsp; linux , keep_alive_time = 100s. 

## Example

Very the same code in official doc [#threadpoolexecutor-example](https://docs.python.org/3/library/concurrent.futures.html#threadpoolexecutor-example) , with executor replaced:
```Python3
# requests_test.py
import concurrent.futures
import ThreadPoolExecutorPlus
import urllib.request

URLS = ['http://www.foxnews.com/',
        'http://www.cnn.com/',
        'http://europe.wsj.com/',
        'http://www.bbc.co.uk/',
        'http://some-made-up-domain.com/']

def load_url(url, timeout):
    with urllib.request.urlopen(url, timeout=timeout) as conn:
        return conn.read()

with ThreadPoolExecutorPlus.ThreadPoolExecutor(max_workers=5) as executor:
    # Try modify deamon options
    executor.set_daemon_opts(min_workers = 2 , max_workers = 10 , keep_alive_time = 60)
    future_to_url = {executor.submit(load_url, url, 60): url for url in URLS}
    for future in concurrent.futures.as_completed(future_to_url):
        url = future_to_url[future]
        try:
            data = future.result()
        except Exception as exc:
            print('%r generated an exception: %s' % (url, exc))
        else:
            print('%r page is %d bytes' % (url, len(data)))
```

Same code in offcial doc [#executing-code-in-thread-or-process-pools](https://docs.python.org/3/library/asyncio-eventloop.html#executing-code-in-thread-or-process-pools) with executor replaced:
```Python3
# Runs on python version above 3.7
import asyncio
import ThreadPoolExecutorPlus

def blocking_io():
    with open('/dev/urandom', 'rb') as f:
        return f.read(100)

def cpu_bound():
    return sum(i * i for i in range(10 ** 7))

async def main():
    loop = asyncio.get_running_loop()

    with ThreadPoolExecutorPlus.ThreadPoolExecutor() as pool:
        result1 = await loop.run_in_executor(
            pool, blocking_io)
        result2 = await loop.run_in_executor(
            pool, cpu_bound)
        print('custom thread pool', result1)
        print('custom thread pool', result2)

asyncio.run(main())
```

Feature demo:
```Python3
# feature_demo.py
from ThreadPoolExecutorPlus import ThreadPoolExecutor
import time , datetime

def log(stmt , name = 'MAIN THREAD'):
    print(f"[{datetime.datetime.strftime(datetime.datetime.now() , '%Y-%m-%d %H:%M:%S')}][{name}] {stmt}")

def some_func(arg):
    # does some heavy lifting
    # outputs some results
    log(f"New task triggered in sub thread , sleep {arg} seconds." , 'SUB THREAD ')
    time.sleep(arg)
    log(f"Terminated." , 'SUB THREAD ') 
    return arg

with ThreadPoolExecutor() as executor:
    log(f"max_workers = {executor._max_workers}")
    log(f"min_workers = {executor._min_workers}")
    log("====================================================")

    # We continuously generate tasks which blocks 0.5s every 1 second.
    # Observe its thread control behaviour.
    # Thus find it perfer to reuse existing threads.
    log("Reuse test:")
    for _ in range(10):
        executor.submit(some_func , 0.5)
        time.sleep(1)
        log(f"Current poll size = {len(executor._threads)}")

    log("====================================================")

    # Observe the behaviour after all task done.
    # Controler will make fast reaction after new options set ,
    # and automaticlly shrink no-use threads.
    log("Shrink test:")
    log("Adjust timeout time to 10 seconds.")
    executor.set_daemon_opts(min_workers = 2 , max_workers = 10 , keep_alive_time = 10)
    for _ in range(10):
        executor.submit(some_func , 3)
        time.sleep(0.01)
    log("10 new tasks created.")


    time.sleep(3)
    log("All task done.")
    
    for _ in range(15):
        log(f"Current poll size = {len(executor._threads)} , {_ + 1}s passed.")
        time.sleep(1)
```
