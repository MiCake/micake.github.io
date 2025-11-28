# BoundedLruCache 缓存工具

## 概述

`BoundedLruCache<TKey, TValue>` 是一个线程安全的 LRU（Least Recently Used）缓存实现，具有容量限制和可选的分段策略。

## 命名空间

```csharp
using MiCake.Util.Cache;
```

## 构造函数

```csharp
public BoundedLruCache(
    int maxSize = 1000,           // 最大缓存条目数
    int? segments = null,          // 分段数（用于提高并发性能）
    bool useLockFreeApproximation = false  // 是否使用无锁近似算法
)
```

## 核心方法

### GetOrAdd - 获取或添加缓存项

```csharp
var cache = new BoundedLruCache<string, Product>(maxSize: 500);

var product = cache.GetOrAdd("product-1", key => 
{
    // 缓存未命中时执行
    return LoadProductFromDatabase(key);
});
```

### TryGetValue - 尝试获取缓存项

```csharp
if (cache.TryGetValue("product-1", out var product))
{
    Console.WriteLine($"缓存命中: {product.Name}");
}
```

### AddOrUpdate - 添加或更新缓存项

```csharp
cache.AddOrUpdate("product-1", newProduct);
```

### Remove - 移除缓存项

```csharp
bool removed = cache.Remove("product-1");
```

### Clear - 清空缓存

```csharp
cache.Clear();
```

## 属性

| 属性 | 说明 |
|------|------|
| `Count` | 当前缓存项数量 |
| `MaxSize` | 最大容量 |

## 使用示例

### 基本用法

```csharp
// 创建缓存实例
var cache = new BoundedLruCache<int, Product>(maxSize: 1000);

// 获取或添加
var product = cache.GetOrAdd(productId, id => 
    _repository.FindAsync(id).Result);

// 使用完毕后释放
cache.Dispose();
```

### 高并发场景

```csharp
// 使用分段和无锁近似算法提高性能
var cache = new BoundedLruCache<string, Product>(
    maxSize: 10000,
    segments: 4,
    useLockFreeApproximation: true
);
```

### 服务中使用

```csharp
public class ProductService
{
    private readonly BoundedLruCache<int, Product> _cache;
    private readonly IRepository<Product, int> _repository;
    
    public ProductService(IRepository<Product, int> repository)
    {
        _repository = repository;
        _cache = new BoundedLruCache<int, Product>(maxSize: 500);
    }
    
    public async Task<Product> GetProduct(int id)
    {
        return _cache.GetOrAdd(id, async productId =>
        {
            return await _repository.FindAsync(productId) 
                ?? throw new DomainException("Product not found");
        });
    }
    
    public void InvalidateCache(int productId)
    {
        _cache.Remove(productId);
    }
}
```

## 最佳实践

1. **合理设置容量**：根据内存和数据量设置合适的 `maxSize`
2. **注册为单例**：在 DI 容器中注册为单例以复用实例
3. **及时释放**：使用 `Dispose()` 释放资源
4. **适合缓存不经常变化的数据**

## 注意事项

- 当缓存满时，最久未访问的项会被自动移除
- 小缓存（maxSize < 16）使用单段以保证确定性 LRU 语义
- 无锁模式下工厂方法可能被多次调用，建议使用幂等工厂
