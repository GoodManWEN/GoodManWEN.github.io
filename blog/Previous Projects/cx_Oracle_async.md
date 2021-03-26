# cx_Oracle_async

.VERSION | LICENCE | VERSION | PUBLISH | BUILD | DOCS | VISITORS
:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:
![fury](https://img.shields.io/pypi/v/cx-Oracle-async.svg) | ![licence](https://img.shields.io/github/license/GoodManWEN/cx_Oracle_async) | ![pyversions](https://img.shields.io/pypi/pyversions/cx-Oracle-async.svg) | ![Publish](https://github.com/GoodManWEN/cx_Oracle_async/workflows/Publish/badge.svg) | ![Build](https://github.com/GoodManWEN/cx_Oracle_async/workflows/Build/badge.svg) | ![Docs](https://readthedocs.org/projects/cx-oracle-async/badge/?version=latest) | ![Visitors](https://visitor-badge.glitch.me/badge?page_id=goodmanwen.cx_Oracle_async&style=flat-square&color=0088cc)

A very simple asynchronous wrapper that allows you to get access to the Oracle database in asyncio programs. 

Easy to use , buy may not the best practice for efficiency concern.

## Requirements
- [cx_Oracle >= 8.1.0](https://github.com/oracle/python-cx_Oracle) (Take into consideration that author of cx_Oracle said he's trying to implement asyncio support , APIs maybe change in future version. Switch to 8.1.0 if there's something wrong makes it not gonna work.)
- [ThreadPoolExecutorPlus >= 0.2.0](https://github.com/GoodManWEN/ThreadPoolExecutorPlus)

## Install

    pip install cx_Oracle_async

## Feature
- Nearly all the same as aiomysql in asynchronous operational approach , with limited cx_Oracle feature support.
- No automaticly date format transition built-in.
- AQ feature added , check [docs here](https://cx_oracle_async.readthedocs.io/en/latest/user_guide/advancedfeatures.html#oracle-advanced-queuing-aq) for further information.
- You can modify some of the connection properties simply like you're using cx_Oracle. 
- You can do basic insert / select / delete etc.
- If you're connecting to database which is on a different machine from python process , you need to install oracle client module in order to use this library. Check [cx-Oracle's installation guide](https://cx-oracle.readthedocs.io/en/latest/user_guide/installation.html) for further information.

## Documentation

[https://cx_oracle_async.readthedocs.io](https://cx_oracle_async.readthedocs.io)

## Performance
query type | asynchronous multithreading | synchronous multithreading | synchronous single thread
-|-|-|-
fast single line query | 6259.80 q/s | 28906.93 q/s | 14805.61 q/s
single line insertion | 1341.88 q/s | 1898 q/s | 1685.17 q/s

*/\* Test platform: \*/*<br>
*AMD Ryzen 3700x*<br>
*Windows 10 LTSC*<br>
*Oracle 19c*<br>
*You can find performance test codes [here](https://github.com/GoodManWEN/cx_Oracle_async/blob/main/misc).* 

## Examples
Before running examples , make sure you've already installed a [Oracle Client](https://cx-oracle-async.readthedocs.io/en/latest/user_guide/quickstart.html#install-oracle-client) on your machine.
```Python
# basic_usages.py
import asyncio
import cx_Oracle_async

async def main():
    oracle_pool = await cx_Oracle_async.create_pool(
        host='localhost', 
        port='1521',
        user='user', 
        password='password',
        service_name='orcl', 
        min = 2,
        max = 4,
    )

    async with oracle_pool.acquire() as connection:
        async with connection.cursor() as cursor:
            await cursor.execute("SELECT * FROM V$SESSION")
            print(await cursor.fetchall())

    await oracle_pool.close()

if __name__ == '__main__':
    asyncio.run(main())
```
