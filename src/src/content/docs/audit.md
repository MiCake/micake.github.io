---
title: 自动审计
description: 了解 MiCake 的自动审计功能，自动记录实体的创建和修改时间等信息
---

MiCake 提供了自动审计功能，可以自动记录实体的创建和修改时间等信息。

## 审计接口

### IHasCreatedAt

记录创建时间：

```csharp
public class Article : AggregateRoot<int>, IHasCreatedAt
{
    public string Title { get; private set; }
    public string Content { get; private set; }
    
    // 自动填充
    public DateTime CreatedAt { get; set; }
}
```

### IHasUpdatedAt

记录修改时间：

```csharp
public class Article : AggregateRoot<int>, IHasCreatedAt, IHasUpdatedAt
{
    public string Title { get; private set; }
    
    // 自动填充
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    public void UpdateTitle(string newTitle)
    {
        Title = newTitle;
        // UpdatedAt 会自动更新
    }
}
```

### IHasAuditTimestamps

完整的时间审计接口，组合了创建和修改时间：

```csharp
public class Product : AggregateRoot<int>, IHasAuditTimestamps
{
    public string Name { get; private set; }
    
    // 创建时间
    public DateTime CreatedAt { get; set; }
    
    // 修改时间
    public DateTime? UpdatedAt { get; set; }
}
```

## 启用审计

审计功能默认已启用。你可以通过 `UseAudit` 扩展方法进行配置：

### 使用 AddMiCakeWithDefault

如果使用 `AddMiCakeWithDefault` 快速配置，可以通过 `AuditConfig` 进行设置：

```csharp
services.AddMiCakeWithDefault<MyAppModule, MyDbContext>(options =>
{
    options.AuditConfig = audit =>
    {
        audit.UseAudit = true;  // 启用审计（默认为 true）
        audit.UseSoftDeletion = false;  // 是否启用软删除（默认为 false）
        audit.AuditTimeProvider = () => DateTime.UtcNow;  // 自定义时间提供者
    };
});
```

### 使用 Builder 方式

如果使用 MiCake Builder 方式，可以调用 `UseAudit` 方法：

```csharp
var builder = services.AddMiCake<MyAppModule>();
builder.UseEFCore<MyDbContext>();
builder.UseAudit(opts => 
{
    opts.UseAudit = true;  // 启用审计（默认为 true）
    opts.UseSoftDeletion = true;  // 启用软删除
    opts.AuditTimeProvider = () => DateTime.UtcNow;  // 自定义时间提供者
});
```

## 自动填充

当保存实体时，审计字段会自动填充：

```csharp
// 创建实体
var article = new Article { Title = "My Article" };
await _articleRepository.AddAsync(article);
await _articleRepository.SaveChangesAsync();
// CreatedAt 自动设置为当前时间

// 更新实体
article.UpdateTitle("New Title");
await _articleRepository.UpdateAsync(article);
await _articleRepository.SaveChangesAsync();
// UpdatedAt 自动更新为当前时间
```

:::note
审计功能通过 `IAuditExecutor` 和 `IAuditProvider` 实现，在 Repository 的 `SaveChangesAsync` 时自动触发。
:::

## 自定义审计提供者

MiCake 使用 `IAuditProvider` 接口来提供审计逻辑。默认实现是 `DefaultTimeAuditProvider`，负责设置创建和修改时间。

### 实现自定义审计提供者

```csharp
public class CustomAuditProvider : IAuditProvider
{
    private readonly ICurrentUser _currentUser;
    
    public CustomAuditProvider(ICurrentUser currentUser)
    {
        _currentUser = currentUser;
    }
    
    public void ApplyAudit(AuditOperationContext context)
    {
        if (context?.Entity == null)
            return;

        switch (context.EntityState)
        {
            case RepositoryEntityStates.Added:
                SetCreationAudit(context.Entity);
                break;
                
            case RepositoryEntityStates.Modified:
                SetModificationAudit(context.Entity);
                break;
        }
    }
    
    private void SetCreationAudit(object entity)
    {
        if (entity is IHasCreatedAt hasCreationTime)
        {
            hasCreationTime.CreatedAt = DateTime.UtcNow;
        }
        
        // 可以扩展自定义的审计字段
        if (entity is IHasCreationUser hasCreationUser)
        {
            hasCreationUser.CreatedBy = _currentUser.Id;
        }
    }
    
    private void SetModificationAudit(object entity)
    {
        if (entity is IHasUpdatedAt hasModificationTime)
        {
            hasModificationTime.UpdatedAt = DateTime.UtcNow;
        }
        
        // 可以扩展自定义的审计字段
        if (entity is IHasModificationUser hasModificationUser)
        {
            hasModificationUser.ModifiedBy = _currentUser.Id;
        }
    }
}
```

### 注册自定义审计提供者

```csharp
public class MyAppModule : MiCakeModule
{
    public override void ConfigServices(ModuleConfigServiceContext context)
    {
        // 添加自定义审计提供者（会与默认的 DefaultTimeAuditProvider 一起工作）
        context.Services.AddScoped<IAuditProvider, CustomAuditProvider>();
        
        base.ConfigServices(context);
    }
}
```

:::tip
MiCake 支持多个 `IAuditProvider`，它们会按注册顺序依次执行。默认的 `DefaultTimeAuditProvider` 已经注册，你的自定义提供者会额外执行。
:::

## 最佳实践

### 1. 为需要审计的实体实现接口

```csharp
// ✅ 需要完整审计的实体
public class Order : AggregateRoot<int>, IHasAuditTimestamps
{
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// ✅ 只需要创建时间的实体
public class OrderItem : Entity<int>, IHasCreatedAt
{
    public DateTime CreatedAt { get; set; }
}

// ✅ 不需要审计的实体可以不实现接口
public class OrderItemDetail : Entity<int>
{
    // 不需要审计字段
}
```

### 2. 使用 UTC 时间

```csharp
// ✅ 使用 UTC 时间（推荐）
services.AddMiCakeWithDefault<MyAppModule, MyDbContext>(options =>
{
    options.AuditConfig = audit =>
    {
        audit.AuditTimeProvider = () => DateTime.UtcNow;
    };
});

// 或者使用默认配置（默认就是 UTC 时间）
services.AddMiCakeWithDefault<MyAppModule, MyDbContext>();
```

### 3. 自定义时间提供者

如果需要使用特定时区或测试时使用固定时间：

```csharp
// 使用本地时间
builder.UseAudit(opts => 
{
    opts.AuditTimeProvider = () => DateTime.Now;
});

// 或者使用静态属性配置（适用于测试）
DefaultTimeAuditProvider.CurrentTimeProvider = () => new DateTime(2025, 1, 1);
```

### 4. 结合软删除

```csharp
public class Product : AggregateRoot<int>, IAuditableWithSoftDeletion
{
    public string Name { get; private set; }
    
    // 审计字段
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // 软删除字段
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}

// 启用软删除功能
builder.UseAudit(opts => opts.UseSoftDeletion = true);
```

## 审计接口对照

| 接口                         | 字段                  | 说明                     |
| ---------------------------- | --------------------- | ------------------------ |
| `IHasCreatedAt`              | `DateTime CreatedAt`  | 创建时间                 |
| `IHasUpdatedAt`              | `DateTime? UpdatedAt` | 修改时间                 |
| `IHasAuditTimestamps`        | 包含上述两个字段      | 创建和修改时间的组合接口 |
| `ISoftDeletable`             | `bool IsDeleted`      | 软删除标记               |
| `IHasDeletedAt`              | `DateTime? DeletedAt` | 删除时间                 |
| `IAuditableWithSoftDeletion` | 包含上述所有字段      | 完整审计信息（含软删除） |

## 软删除

MiCake 提供了软删除功能，可以标记实体为已删除而不是物理删除。

### 启用软删除

```csharp
builder.UseAudit(opts => 
{
    opts.UseSoftDeletion = true;  // 启用软删除
});
```

### 使用软删除接口

```csharp
// 基本软删除
public class Article : AggregateRoot<int>, ISoftDeletable
{
    public bool IsDeleted { get; set; }
}

// 软删除 + 删除时间
public class Order : AggregateRoot<int>, ISoftDeletable, IHasDeletedAt
{
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}

// 完整审计 + 软删除
public class Product : AggregateRoot<int>, IAuditableWithSoftDeletion
{
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}
```

## 查询示例

```csharp
// 查询最近创建的订单
public async Task<List<Order>> GetRecentOrders()
{
    return await _orderRepository.Query()
        .OrderByDescending(o => o.CreatedAt)
        .Take(10)
        .ToListAsync();
}

// 查询指定时间范围内修改的订单
public async Task<List<Order>> GetModifiedOrders(DateTime startDate, DateTime endDate)
{
    return await _orderRepository.Query()
        .Where(o => o.UpdatedAt >= startDate && o.UpdatedAt <= endDate)
        .ToListAsync();
}

// 查询未删除的产品（启用软删除时）
public async Task<List<Product>> GetActiveProducts()
{
    return await _productRepository.Query()
        .Where(p => !p.IsDeleted)
        .ToListAsync();
}
```

## 工作原理

MiCake 的审计功能通过以下组件实现：

1. **IAuditProvider**: 审计提供者接口，定义审计逻辑
2. **DefaultTimeAuditProvider**: 默认时间审计提供者，处理创建和修改时间
3. **IAuditExecutor**: 审计执行器，负责调用所有注册的审计提供者
4. **AuditRepositoryLifetime**: Repository 生命周期钩子，在 `SaveChangesAsync` 前自动执行审计

审计只对实现了 MiCake DDD 领域对象接口（如 `Entity`、`AggregateRoot`）的实体生效。

## 小结

MiCake 自动审计功能特点：

- **简单易用**: 实现接口即可启用审计，无需手动设置时间
- **灵活配置**: 支持自定义时间提供者和审计提供者
- **自动触发**: 在 `SaveChangesAsync` 时自动填充审计字段
- **多提供者**: 支持注册多个审计提供者，按顺序执行
- **软删除支持**: 内置软删除功能，标记删除而非物理删除
- **类型安全**: 基于接口设计，编译时检查

核心接口：
- `IHasCreatedAt`: 创建时间
- `IHasUpdatedAt`: 修改时间  
- `IHasAuditTimestamps`: 完整时间审计
- `IAuditableWithSoftDeletion`: 完整审计 + 软删除
