# CheckValue 参数验证

## 概述

`CheckValue` 提供参数验证的静态方法，用于确保方法参数符合预期条件。

## 命名空间

```csharp
using MiCake.Util;
```

## 验证方法

### NotNull - 非空验证

```csharp
// 基本验证
CheckValue.NotNull(value, nameof(value));

// 带自定义消息
CheckValue.NotNull(value, nameof(value), "值不能为空");

// 字符串带长度限制
CheckValue.NotNull(str, nameof(str), maxLength: 100, minLength: 1);
```

### NotEmpty - 非空集合/字符串验证

```csharp
// 验证字符串（去除空格后）
CheckValue.NotEmpty(str, nameof(str));

// 验证集合至少包含一个元素
CheckValue.NotEmpty(list, nameof(list));
```

### NotNullOrEmpty - 非空或空字符串验证

```csharp
// 验证字符串非null且非空
CheckValue.NotNullOrEmpty(str, nameof(str));

// 带长度限制
CheckValue.NotNullOrEmpty(str, nameof(str), maxLength: 50, minLength: 5);

// 验证集合
CheckValue.NotNullOrEmpty(collection, nameof(collection));
```

### NotNullOrWhiteSpace - 非空白字符串验证

```csharp
// 验证字符串非null、非空、非纯空白
CheckValue.NotNullOrWhiteSpace(str, nameof(str));

// 带长度限制
CheckValue.NotNullOrWhiteSpace(str, nameof(str), maxLength: 100, minLength: 1);
```

### Length - 长度验证

```csharp
// 验证字符串长度
CheckValue.Length(str, nameof(str), maxLength: 100);
CheckValue.Length(str, nameof(str), maxLength: 100, minLength: 10);
```

## 使用示例

### 方法参数验证

```csharp
public void CreateOrder(string customerName, decimal amount, List<OrderItem> items)
{
    CheckValue.NotNullOrWhiteSpace(customerName, nameof(customerName), maxLength: 50);
    CheckValue.NotEmpty(items, nameof(items));
    
    if (amount <= 0)
        throw new ArgumentException("金额必须大于0", nameof(amount));
    
    // 业务逻辑...
}
```

### 构造函数验证

```csharp
public class Product
{
    public Product(string name, string description)
    {
        Name = CheckValue.NotNullOrEmpty(name, nameof(name), maxLength: 100);
        Description = CheckValue.NotNull(description, nameof(description), maxLength: 500);
    }
    
    public string Name { get; }
    public string Description { get; }
}
```

## 异常类型

| 验证方法 | 条件 | 抛出异常 |
|----------|------|----------|
| `NotNull` | 值为 null | `ArgumentNullException` |
| `NotEmpty` | 集合为空 | `ArgumentException` |
| `NotNullOrEmpty` | null 或空字符串 | `ArgumentException` |
| `NotNullOrWhiteSpace` | null、空或纯空白 | `ArgumentException` |
| `Length` | 长度超出范围 | `ArgumentException` |

## 返回值

所有验证方法都返回验证后的值，支持链式调用：

```csharp
var validName = CheckValue.NotNullOrEmpty(name, nameof(name));
```
