 # EASYRPC
 High availability rpc framework ,easy to use. 
 
 # Features
 - Both synchronize and asynchronize is allowed register to server.
 - Both synchronize and asynchronize call method is provided by the client.
 - High performance & low latency with async preforked module.
 - Supported for both pypy and cpython 36up version on Linux and Windows platform.
 - Distributed notice service supported by etcd.(Under development.
 - Some more black magics.
 
 # Installation
 

```
pip3 install git+https://github.com/NCNU-OpenSource/testrepo.git
```
> Notification : Currently continuous integration not activated , reliability might be limited.

 # Get started
 
 > Notification : since distributed support is still under development , only easy mode (no support from etcd) is allowed in current version.
 
 To get started , you may create a rpc server like this
 ```Python3
 # server.py
 from easyrpc import *
 import asyncio
 
 s = rpc_server(port = 25000)
 
 @s.register()
 def test(n):
     return n+1
 
 # standard startover with standard asyncio api , easy to control
 asyncio.run(s.start_serving())
 ```
 \* if you're using pypy or python version 3.6 ,you may need to pass eventloop explicitly like this:
 ```
 loop = asyncio.get_event_loop()
 loop.run_until_complete(s.start_serving(loop))
 ```
 
Then you may create a client file like this:<br>
which allows you to call whatever function you have registered in your server.
```Python3
# client.py
from easyrpc import *

c = rpc_client(port = 25000)

ret = c.test(1)
print(ret) ; assert ret == 2
```
# Usage
Quick view about advanced features:
- You can register both synchronize and asynchronize functions ,they will all behave asynchronizely as service.
- You can use prefork method to improve handling capacity.
- When register you can use `maximum_flow:int` to control overall flow capability of each function registered.
- `unstable_network:bool` helps you control if your server need to maintain a datastructure preventing repeated execute cause by network fluctuation ,  which may reduce performanceor , just resend call when request failed.
```Python3
# server.py
from easyrpc import *

s = rpc_server(port = 25000)

@s.register()
async def fib_async(n):
    a , b = 0 , 1
    for i in range(n):
        a , b = b , a + b
    return a

@s.register(maximum_flow = 100)
def fib_sync(n):
    if n<2:
        return n
    return fib(n-1) + fib(n-2)

s.prefork(bindcore = False)
asyncio.run(s.start_serving())
```
`bindcore:bool` binds each process to a cpu core specifily which helps reduce cache miss ,but limits the flexibility of kernel's tasks scheduling .Default False.

> Notification: since fork copy memory space as the same from parent to child process , where you fork matters . For example ,if you fork before register function ,then each function will have its own process lock. Fork *IS NOT* supported on windows.

- Both synchronize and asynchronize method is offered by client ,use `sync:bool` to control.
```Python3
# client_demo2.py
from easyrpc import *
import asyncio
import time

c = rpc_client(port = 25000)

# This function blocks until answer returns back
assert c.fib_async(1, sync = True) == None 

async def main():
    start_time = time.time()
    tasks = (c.fib_async(i) for i in range(1000))
    ret = await asyncio.gather(*tasks)   # you can make multiple \
                                         # requests at the same time. 
    print(f"Get {len(ret)} results ,for last three result  \
          shows {ret[-3:]} ,takes time {time.time()-start_time}s.")
asyncio.run(main())
```
- sync functions registered whill be running in process pool , since it takes a long communicating time(about 1ms) , make sure if you could get more time back when you call it. The following example shows that with this frame work you can take advantage of multi cores.
```Python3
# client_demo3.py
from easyrpc import *
from multiprocessing import cpu_count
import asyncio , time

c = rpc_client(port = 25000)

async def main():
    start_time_1 = time.time()
    ret1 = await c.fib_sync(30)
    end_time_1 = time.time()
    ret2 = await asyncio.gather((c.fib_sync(30) for i in range(cpu_count())))
    end_time_2 = time.time()
    assert ret2 == [ret1] * cpu_count()
    print(f"Single call takes time {end_time_1 - start_time}s while {cpu_count()} \
          times call takes {end_time_2 - end_time_1}s")
asyncio.run(main())
```

# Some more magic.
Pickle is a magic library python provides serialize service ,which is a stack describe language in essence. It maks it possible to share high level objects between process ,however it's low performance comparing to msgpack and not secure against erroneous maliciously constructed data.
Pickle protocol is defaultly disabled in easyrpc.
For flaxible use ,pickle can help us dealing with server's own data structure bu sending ape. 

```Python3
from easyrpc import *
import asyncio ,os

c = rpc_client(port = 25000)

func = lambda x ,y:(os.system('clear') ,print("This is a magic!") , x**2 + y)
assistant = c.magicwarp(func) # warp function to a magic assistant object
ret = c.magiccall(assistant)(11 , 10) # with help of assistant ,magic call returns a callable.
assert ret == [None , None , 131]
```
You will suprizingly relize that console of server.py has been changed.

# API Reference
Documentation of exposed interfaces
#### Class : rpc_server(\[host:str , port:int , allow_pickle:bool , unstable_network:bool\])
Create a rpc server.
* ##### Parameters:
    - host ,port : Location to bind server.
    - allow_pickle : Allow magic call or user level pickle protocol ,in consideration of security you should only allow this option in a reliable environment. Default True.
    - unstable_network : If turned on , server will maintain a data structure which avoids rehandling request ,will cause performance loss. Default False.

    #### \* method : register(\[name:str , timeout:int , maximum_flow:int\])
    Register a function, need to be used as quadratic decorator.
    * ##### Parameters:
        - name : What name you declare this service.
        - timeout : Time to close a connection from a clinet if no heartbeat .Default 60
        - maximum_overflow : If > 0 , new request will be rejected if currently running example number larger than overflow ,this is a fuse to protect server for cpu bound tasks. Disabled if == 0. Default disabled.

    #### \* method : Prefork(\[max_workers:int , bindcore:bool\])
    Use multiple cores. Not supported on windows.
    * ##### Parameters:
        - max_workers : How many process you fork. Default the same number as your cpu core nums.
        - bindcore : bindcore binds each process to a cpu core specifily which helps reduce cache miss ,but limits the flexibility of kernel's tasks scheduling. Default False.

    #### \* method : start_serving(\[Loop:asyncio.EventLoop\])
    Start serving. Use standard asyncio apis to start.
    * ##### Parameters:
        - Loop : Since python36 has no ability to get current running loop , use this pass eventloop explicitly.

#### Class : rpc_client(\[host:int , port:int\])
Create a client.
* ##### Parameters:
    #### \* method : set_event_loop(loop:asyncio.EventLoop)
    * ##### Parameters:
        - Loop : Will be used in async mode in python36, use this set eventloop before async call.

    #### \* method : async_call(name:str , \*args , \*\*kwargs)
    Explicit way to make a async call ,which gives you a slightly better performance. 
    * ##### Parameters:
        - name : Function name string.
        - \*args , \*\*kwargs : Functions arguments.

    #### \* method : sync_call(name:str , \*args , \*\*kwargs)
    Explicit way to make a sync call ,which gives you a slightly better performance. 

    #### \*method : magicwarp(func : Callable) -> MagicAssistant
    Wrap a function pointer into a magic assistant data structure ,which flatten your stack.

    #### \* method : magiccall(assistant:MagicianAssistant) -> Callable
    Make a magic call with help of assistant ,you should use it like this : c.magiccall(assistant)(\*args , \*\*kwargs)

#### Class : base_selector():
#### &emsp;&emsp; Class : msgpack_selector():
&emsp;&emsp;Provide support for msgpack protocol serialization.

#### &emsp;&emsp; Class : pickle_selector():
&emsp;&emsp;Provide support for pickle protocol serialization.


# Performace

- RPS on different platform.
> Testing platform: <br>
>    CPU : Ryzen 1700x<br>
>    network interface : Intel(R) Dual Band Wireless-AC 3165<br>
>    VM 0kb local loopback<br>

![](https://github.com/NCNU-OpenSource/testrepo/blob/master/benchmarks.png?raw=true)

- Latency<br>

|class |pypy3| uvloop | cpython
| --------| -------- | -------- | --------|
| Server|0.110ms| 0.142ms| 0.155ms|
| Client |0.390ms|0.422ms|0.460ms|

- Latency Comparison<br>
|easyrpc| grpc | 
| 0.420ms| 3.766ms| 
