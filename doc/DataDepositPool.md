# DataDepositPool 数据存储池

## 概述

`DataDepositPool` 是一个带容量限制的临时数据存储池，适用于需要临时存储和检索数据的场景。

## 命名空间

```csharp
using MiCake.Util.Store;
```

## 构造函数

```csharp
// 默认容量 1000
var pool = new DataDepositPool();

// 自定义容量
var pool = new DataDepositPool(maxCapacity: 5000);
```

## 核心方法

### Deposit - 存储数据

```csharp
// 存储数据
pool.Deposit("user-1", userData);

// 替换已存在的数据
pool.Deposit("user-1", newUserData, isReplace: true);
```

### TakeOut - 获取数据

```csharp
// 获取数据（返回 object）
object? data = pool.TakeOut("user-1");

// 获取指定类型的数据
User? user = pool.TakeOut<User>("user-1");
```

### TakeOutByType - 按类型获取

```csharp
// 获取指定类型的所有数据
List<object> users = pool.TakeOutByType(typeof(User));
```

### ReleaseAll - 释放所有数据

```csharp
pool.ReleaseAll();
```

## 属性

| 属性 | 说明 |
|------|------|
| `Count` | 当前存储的数据数量 |
| `MaxCapacity` | 最大容量 |

## 使用示例

### 临时数据缓存

```csharp
public class SessionStore
{
    private readonly DataDepositPool _pool = new(maxCapacity: 10000);
    
    public void StoreSession(string sessionId, SessionData data)
    {
        _pool.Deposit(sessionId, data, isReplace: true);
    }
    
    public SessionData? GetSession(string sessionId)
    {
        return _pool.TakeOut<SessionData>(sessionId);
    }
    
    public void ClearAllSessions()
    {
        _pool.ReleaseAll();
    }
}
```

### 中间结果存储

```csharp
public class BatchProcessor
{
    private readonly DataDepositPool _resultPool = new();
    
    public void ProcessItem(string itemId, ProcessResult result)
    {
        _resultPool.Deposit($"result-{itemId}", result);
    }
    
    public List<ProcessResult> GetAllResults()
    {
        return _resultPool.TakeOutByType(typeof(ProcessResult))
            .Cast<ProcessResult>()
            .ToList();
    }
    
    public void Complete()
    {
        _resultPool.ReleaseAll();
        _resultPool.Dispose();
    }
}
```

## 异常处理

| 场景 | 异常 |
|------|------|
| key 为 null | `ArgumentNullException` |
| key 已存在且 isReplace = false | `InvalidOperationException` |
| 超出容量限制 | `InvalidOperationException` |
| 已释放后操作 | `ObjectDisposedException` |

## 最佳实践

1. **设置合理容量**：根据预期数据量设置 `maxCapacity`
2. **及时释放**：使用完毕后调用 `Dispose()` 或 `ReleaseAll()`
3. **使用泛型方法**：优先使用 `TakeOut<T>()` 获取强类型数据
4. **处理容量异常**：在存储前检查容量或捕获异常

```csharp
try
{
    pool.Deposit(key, data);
}
catch (InvalidOperationException ex) when (ex.Message.Contains("capacity"))
{
    // 处理容量超限
    pool.ReleaseAll();
    pool.Deposit(key, data);
}
```
