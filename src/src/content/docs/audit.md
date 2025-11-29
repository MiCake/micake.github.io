---
title: 自动审计
description: 了解 MiCake 的自动审计功能，自动记录实体的创建和修改时间、操作人等信息
---

MiCake 提供了自动审计功能，可以自动记录实体的创建和修改时间、操作人等信息。

## 审计接口

### IHasCreationTime

记录创建时间：

```csharp
public class Article : AggregateRoot<int>, IHasCreationTime
{
    public string Title { get; private set; }
    public string Content { get; private set; }
    
    // 自动填充
    public DateTime CreatedTime { get; set; }
}
```

### IHasModificationTime

记录修改时间：

```csharp
public class Article : AggregateRoot<int>, IHasCreationTime, IHasModificationTime
{
    public string Title { get; private set; }
    
    // 自动填充
    public DateTime CreatedTime { get; set; }
    public DateTime? ModifiedTime { get; set; }
    
    public void UpdateTitle(string newTitle)
    {
        Title = newTitle;
        // ModifiedTime 会自动更新
    }
}
```

### 完整的审计接口

```csharp
public class Product : AggregateRoot<int>, IHasAudit
{
    public string Name { get; private set; }
    
    // 创建信息
    public DateTime CreatedTime { get; set; }
    public int? CreatedBy { get; set; }
    
    // 修改信息
    public DateTime? ModifiedTime { get; set; }
    public int? ModifiedBy { get; set; }
}
```

## 启用审计

### 在配置中启用

```csharp
services.AddMiCakeWithDefault<MyAppModule, MyDbContext>(options =>
{
    options.AuditConfig = audit =>
    {
        audit.UseAudit = true;  // 启用审计
        audit.AuditTimeProvider = () => DateTime.UtcNow;  // 可选：自定义时间格式
    };
}).Build();
```

## 自动填充

当保存实体时，审计字段会自动填充：

```csharp
// 创建实体
var article = new Article { Title = "My Article" };
await _articleRepository.AddAsync(article);
await _articleRepository.SaveChangesAsync();
// CreatedTime 自动设置为当前时间

// 更新实体
article.UpdateTitle("New Title");
await _articleRepository.UpdateAsync(article);
await _articleRepository.SaveChangesAsync();
// ModifiedTime 自动更新为当前时间
```

## 自定义审计提供者

### 实现审计提供者

```csharp
public class CurrentUserAuditProvider : IAuditProvider
{
    private readonly ICurrentUser _currentUser;
    
    public CurrentUserAuditProvider(ICurrentUser currentUser)
    {
        _currentUser = currentUser;
    }
    
    public void SetCreationAuditProperties(object entity)
    {
        if (entity is IHasCreationTime hasCreation)
        {
            hasCreation.CreatedTime = DateTime.UtcNow;
        }
        
        if (entity is IHasCreationUser hasCreationUser)
        {
            hasCreationUser.CreatedBy = _currentUser.Id;
        }
    }
    
    public void SetModificationAuditProperties(object entity)
    {
        if (entity is IHasModificationTime hasModification)
        {
            hasModification.ModifiedTime = DateTime.UtcNow;
        }
        
        if (entity is IHasModificationUser hasModificationUser)
        {
            hasModificationUser.ModifiedBy = _currentUser.Id;
        }
    }
}
```

### 注册审计提供者

```csharp
public class MyAppModule : MiCakeModule
{
    public override void ConfigureServices(ModuleConfigServiceContext context)
    {
        context.Services.AddScoped<IAuditProvider, CurrentUserAuditProvider>();
        base.ConfigureServices(context);
    }
}
```

## 最佳实践

### 1. 为需要审计的实体实现接口

```csharp
// ✅ 需要审计的实体
public class Order : AggregateRoot<int>, IHasCreationTime, IHasModificationTime
{
    public DateTime CreatedTime { get; set; }
    public DateTime? ModifiedTime { get; set; }
}

// 不需要审计的实体可以不实现接口
public class OrderItem : Entity<int>
{
    // 不需要审计字段
}
```

### 2. 使用 UTC 时间

```csharp
// ✅ 使用 UTC 时间
services.AddMiCakeWithDefault<MyAppModule, MyDbContext>(options =>
{
    options.AuditConfig = audit =>
    {
        audit.UseAudit = true;
        audit.AuditTimeProvider = () => DateTime.UtcNow;
    };
}).Build();
```

### 3. 记录操作人

```csharp
public class Order : AggregateRoot<int>, IHasAudit
{
    public DateTime CreatedTime { get; set; }
    public int? CreatedBy { get; set; }
    public DateTime? ModifiedTime { get; set; }
    public int? ModifiedBy { get; set; }
}

// 实现自定义审计提供者来填充 CreatedBy 和 ModifiedBy
```

### 4. 结合软删除

```csharp
public class Product : AggregateRoot<int>, IHasAuditWithSoftDeletion
{
    public string Name { get; private set; }
    
    // 审计字段
    public DateTime CreatedTime { get; set; }
    public DateTime? ModifiedTime { get; set; }
    
    // 软删除字段
    public bool IsDeleted { get; set; }
    public DateTime? DeletionTime { get; set; }
}
```

## 审计接口对照

| 接口 | 字段 | 说明 |
|------|------|------|
| `IHasCreationTime` | `DateTime CreatedTime` | 创建时间 |
| `IHasModificationTime` | `DateTime? ModifiedTime` | 修改时间 |
| `IHasCreationUser` | `int? CreatedBy` | 创建人 |
| `IHasModificationUser` | `int? ModifiedBy` | 修改人 |
| `IHasAudit` | 包含上述所有字段 | 完整审计信息 |

## 查询示例

```csharp
// 查询最近创建的订单
public async Task<List<Order>> GetRecentOrders()
{
    return await _orderRepository.Query()
        .OrderByDescending(o => o.CreatedTime)
        .Take(10)
        .ToListAsync();
}

// 查询指定时间范围内修改的订单
public async Task<List<Order>> GetModifiedOrders(DateTime startDate, DateTime endDate)
{
    return await _orderRepository.Query()
        .Where(o => o.ModifiedTime >= startDate && o.ModifiedTime <= endDate)
        .ToListAsync();
}

// 查询指定用户创建的订单
public async Task<List<Order>> GetUserOrders(int userId)
{
    return await _orderRepository.Query()
        .Where(o => o.CreatedBy == userId)
        .ToListAsync();
}
```

## 小结

MiCake 自动审计功能：

- 实现审计接口（`IHasCreationTime`、`IHasModificationTime`）
- 在 `SaveChangesAsync` 时自动填充
- 支持自定义审计提供者
- 记录创建和修改信息
- 可结合软删除使用
