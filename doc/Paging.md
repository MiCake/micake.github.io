# Paging 分页工具

## 概述

分页工具提供了统一的分页请求和响应模型，以及 IQueryable 扩展方法。

## 命名空间

```csharp
using MiCake.Util.Query.Paging;
```

## 核心类型

### PagingRequest - 分页请求

```csharp
var request = new PagingRequest(pageIndex: 1, pageSize: 20);

// 获取当前页起始位置（从0开始）
int startNo = request.CurrentStartNo;  // (1-1) * 20 = 0
```

### PagingRequest&lt;T&gt; - 带数据的分页请求

```csharp
var request = new PagingRequest<ProductFilter>(
    pageIndex: 1, 
    pageSize: 20, 
    data: new ProductFilter { Category = "Electronics" }
);

var filter = request.Data;
```

### PagingResponse - 分页响应

```csharp
var response = new PagingResponse(currentIndex: 1, total: 100);
```

### PagingResponse&lt;T&gt; - 带数据的分页响应

```csharp
var response = new PagingResponse<Product>(
    currentIndex: 1,
    total: 100,
    data: products
);
```

## 扩展方法

### Page - 应用分页

```csharp
// 使用 PagingRequest
var pagedQuery = query.Page(new PagingRequest(1, 20));

// 直接指定参数
var pagedQuery = query.Page(page: 1, pageSize: 20);
```

## 使用示例

### 基本分页查询

```csharp
public async Task<PagingResponse<Product>> GetProducts(PagingRequest request)
{
    var query = _dbContext.Products.AsQueryable();
    
    // 获取总数
    var totalCount = await query.CountAsync();
    
    // 应用分页
    var items = await query
        .Page(request)
        .ToListAsync();
    
    return new PagingResponse<Product>(
        request.PageIndex,
        totalCount,
        items
    );
}
```

### 带过滤条件的分页

```csharp
public async Task<PagingResponse<Product>> SearchProducts(
    PagingRequest<ProductFilter> request)
{
    var query = _dbContext.Products.AsQueryable();
    
    // 应用过滤条件
    if (!string.IsNullOrEmpty(request.Data.Name))
    {
        query = query.Where(p => p.Name.Contains(request.Data.Name));
    }
    
    if (request.Data.MinPrice.HasValue)
    {
        query = query.Where(p => p.Price >= request.Data.MinPrice.Value);
    }
    
    var totalCount = await query.CountAsync();
    var items = await query.Page(request).ToListAsync();
    
    return new PagingResponse<Product>(
        request.PageIndex,
        totalCount,
        items
    );
}
```

### 配合动态查询

```csharp
public async Task<PagingResponse<Product>> DynamicSearch(
    ProductQueryDto queryDto, 
    PagingRequest request)
{
    var query = _dbContext.Products.AsQueryable();
    
    // 应用动态过滤
    var filterGroup = queryDto.GenerateFilterGroup();
    query = query.ApplyFilters(filterGroup);
    
    var totalCount = await query.CountAsync();
    var items = await query.Page(request).ToListAsync();
    
    return new PagingResponse<Product>(
        request.PageIndex,
        totalCount,
        items
    );
}
```

## 注意事项

- 页码从 1 开始（不是 0）
- `pageSize` 必须大于等于 1
- `pageIndex` 必须大于等于 1
- 传入无效参数会抛出 `ArgumentException`
