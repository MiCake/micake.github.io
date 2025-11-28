# DynamicQuery 动态查询

## 概述

DynamicQuery 提供一套轻量、类型安全的构建块，用于在运行时根据 DTO/查询对象生成 LINQ 过滤和排序表达式：

- 使用属性（[DynamicFilter] / [DynamicFilterJoin]）在查询对象上声明过滤规则
- 自动跳过空值 / 空集合（细节见下文）
- 支持嵌套属性、集合值、多操作符和组合布尔逻辑（AND/OR）
- 能把生成的结构应用到 IQueryable 上，返回可被 EF Core、LINQ to Objects 等执行器消化的表达式树

## 命名空间

```csharp
using MiCake.Util.Query.Dynamic;
```

## 核心组件（类 / 枚举 / 扩展）

### Filter - 单字段过滤器

```csharp
var filter = Filter.Create(
    propertyName: "Name",
    values: new List<FilterValue> 
    { 
        FilterValue.Create("张三", ValueOperatorType.Contains) 
    },
    valuesJoinType: FilterJoinType.Or
);
```

### Sort - 排序

```csharp
var sort = new Sort
{
    PropertyName = "CreateTime",
    Ascending = false  // 降序
};
```

### FilterValue - 过滤值

```csharp
var filterValue = FilterValue.Create(
    value: "test",
    operatorType: ValueOperatorType.Contains
);
```

## 操作符类型 (ValueOperatorType)

| 操作符 | 说明 |
|--------|------|
| `Equal` | 等于 |
| `NotEqual` | 不等于 |
| `Contains` | 包含 (字符串/集合的子项匹配) |
| `StartsWith` | 以...开始 |
| `EndsWith` | 以...结尾 |
| `GreaterThan` | 大于 |
| `LessThan` | 小于 |
| `GreaterThanOrEqual` | 大于等于 |
| `LessThanOrEqual` | 小于等于 |

## 使用属性自动生成过滤 (GenerateFilterGroup)

### 定义查询对象和类级配置

```csharp
public class ProductQueryDto : IDynamicQueryObj
{
    [DynamicFilter(OperatorType = ValueOperatorType.Contains)]
    public string? Name { get; set; }

    [DynamicFilter(PropertyName = "Price", OperatorType = ValueOperatorType.GreaterThanOrEqual)]
    public decimal? MinPrice { get; set; }

    [DynamicFilter(PropertyName = "Price", OperatorType = ValueOperatorType.LessThanOrEqual)]
    public decimal? MaxPrice { get; set; }

    [DynamicFilter(OperatorType = ValueOperatorType.Equal)]
    public int? CategoryId { get; set; }
}
```

### GenerateFilterGroup 的行为要点

```csharp
var queryDto = new ProductQueryDto
{
    Name = "手机",
    MinPrice = 1000,
    CategoryId = 5
};

// 自动生成过滤条件
FilterGroup filterGroup = queryDto.GenerateFilterGroup();
```

### 应用到 IQueryable（Filter / Sort 扩展）

```csharp
var query = _dbContext.Products.AsQueryable();

// 应用动态过滤
query = query.ApplyFilters(filterGroup);

// 应用排序
query = query.ApplySorting(new Sort { PropertyName = "Price", Ascending = true });
```

## FilterGroup 和 CompositeFilterGroup

用于组合多个过滤条件：

```csharp
var group = new FilterGroup
{
    Filters = new List<Filter>
    {
        Filter.Create("Name", new List<FilterValue> { ... }),
        Filter.Create("Price", new List<FilterValue> { ... })
    },
    FiltersJoinType = FilterJoinType.And  // AND 连接
};
```

## 嵌套属性和安全性

支持点号表示法访问嵌套属性：

```csharp
[DynamicFilter(PropertyName = "Address.City")]
public string? City { get; set; }
```

## 实现细节与注意事项

1. 空值会被自动跳过 —— 这使得在 Web API 接收 DTO 并直接传给 GenerateFilterGroup 时非常方便。
2. 对于 `FilterValue.Value` 的类型转换：
   - 底层使用 `TypeDescriptor.GetConverter`（如果源为字符串并且目标类型的 TypeConverter 支持）否则回退到 `System.Convert.ChangeType`。
   - 转换失败会抛出 `InvalidOperationException`（并包含原始异常），因此当接受的字符串不能被转换为目标类型时会被明确提示。
3. 对 `In` 操作符的处理：
   - 若 `FilterValue.Value` 是 IList，会被转换为目标元素的强类型 List（例如 `List<int>`），并在表达式中作为常量传入。
   - 若对可空目标类型（Nullable<T>)，会为可空类型构造相应的 List。
4. 当 Filter 作用于非 nullable 值类型且 `FilterValue.Value` 为 null 时，会抛出 `ArgumentException`（不能将 null 转换为非可空类型）。
5. 对属性访问的限制：仅允许对具有 `public get` 的属性构建过滤器，其他情况会触发 `SecurityException`。

## FilterExtensions 的行为摘要

- `Filter(IEnumerable<Filter>)`：将多个 Filter 应用到 IQueryable，默认以 AND 将每个 Filter 的字段条件合并（FilterGroup 默认 join 可配置）。
- `Filter(FilterGroup)`：使用 FilterGroup 的 FiltersJoinType 控制字段间的组合。
- `Filter(CompositeFilterGroup)`：可以组合多组 FilterGroup，并通过 CompositeFilterGroup.FilterGroupsJoinType 控制各组间的组合。
- `GetFilterExpression<T>`：返回编译表达式 (Expression<Func<T,bool>>?)，若没有 filter 返回 null。

## SortingExtensions 行为要点

- `Sort(Sort)` / `Sort(IEnumerable<Sort>)`：把 Sort 应用到 IQueryable；自动判断是否已有 OrderBy/ThenBy；若已存在排序则使用 ThenBy/ThenByDescending，否则使用 OrderBy/OrderByDescending。

## 示例：完整工作流

```csharp
// DTO
[DynamicFilterJoin(JoinType = FilterJoinType.And)]
public class ProductQuery : IDynamicQueryObj
{
    [DynamicFilter(OperatorType = ValueOperatorType.Contains)]
    public string? Name { get; set; }

    [DynamicFilter(PropertyName = "Price", OperatorType = ValueOperatorType.GreaterThanOrEqual)]
    public decimal? MinPrice { get; set; }
    
    [DynamicFilter(PropertyName = "Price", OperatorType = ValueOperatorType.LessThanOrEqual)]
    public decimal? MaxPrice { get; set; }
}

// In controller/service
var dto = new ProductQuery { Name = "phone", MinPrice = 1000 }; // MaxPrice null 会被跳过
var filterGroup = dto.GenerateFilterGroup();

var query = _dbContext.Products.AsQueryable()
    .Filter(filterGroup)
    .Sort(new Sort { PropertyName = "Price", Ascending = true })
    .Page(1, 20); // paging extension from util

var result = await query.ToListAsync();
```

## 调试 & 测试建议

1. 测试 `GenerateFilterGroup` 在各种边界值上的行为（空字符串、空集合、0、false、空 Guid）。
2. 测试 `FilterExtensions` 构建的表达式是否在 EF Core 下被正确翻译（注意有些复杂表达式或方法调用不被 EF 提供者翻译）。
3. 验证对非可空目标类型传入 null 时，会抛出 `ArgumentException`。

---

如果你希望，我可以把 `DynamicQuery` 的表达式示例转换为更直观的对比（例如把 FilterGroup 生成的表达式树可视化或写入单元测试示例）。

1. **使用 `IDynamicQueryObj`**：实现接口以使用扩展方法
2. **空值自动跳过**：null 值和空字符串不会生成过滤条件
3. **支持集合值**：过滤值为集合时自动生成多值过滤
