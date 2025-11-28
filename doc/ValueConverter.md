# ValueConverter 类型转换工具

## 概述

`ValueConverter` 提供统一的类型转换接口，使用注册表模式管理转换器，支持内置和自定义转换器。

## 命名空间

```csharp
using MiCake.Util.Convert;
```

## 基本用法与行为

### Convert 方法行为（关键点）

- API: ValueConverter.Convert<TSource, TDestination>(TSource source)
- 约束: TSource 和 TDestination 都使用 `notnull` 泛型约束（因此 null 的源会被视为非法）
- 当 source 为 null 时会抛出 `ArgumentNullException`（请注意：泛型约束 notnull 强调对 null 的约束）
- Convert 的实现流程：
    1. 查询 Registry 中已注册的转换器（按注册顺序返回）
    2. 逐个调用注册的转换器的 CanConvert + Convert，返回第一个非 null 的结果
    3. 若注册器没有返回值，则使用内置的 SystemValueConverter 作为后备
    4. 方法会捕获内部转换异常并最终返回目标类型默认值（例如 null、0、Guid.Empty 等），而不是让异常向外传播

示例：

```csharp
// 字符串转整数（会通过 SystemValueConverter）
int intValue = ValueConverter.Convert<string, int>("123");

// 字符串转日期
DateTime dateValue = ValueConverter.Convert<string, DateTime>("2024-01-01");

// Guid 转换（使用 GuidValueConverter）
Guid guid = ValueConverter.Convert<string, Guid>("550e8400-e29b-41d4-a716-446655440000")!;

// Version 转换（使用 VersionValueConverter）
Version? version = ValueConverter.Convert<string, Version>("1.2.3");
```

## 自定义转换器

### 创建转换器

```csharp
public class MoneyConverter : IValueConverter<string, Money>
{
    public bool CanConvert(string value)
    {
        return !string.IsNullOrEmpty(value) && value.Contains(' ');
    }

    public Money? Convert(string value)
    {
        var parts = value.Split(' ');
        return new Money(decimal.Parse(parts[0]), parts[1]);
    }
}
```

### 注册转换器

```csharp
// 使用工厂方法注册
ValueConverter.RegisterConverter(() => new MoneyConverter());

// 使用实例注册
ValueConverter.RegisterConverter(new MoneyConverter());
```

### 使用自定义转换器

```csharp
Money money = ValueConverter.Convert<string, Money>("99.99 USD");
## 注册表与线程安全

ValueConverter 使用一个 `IConverterRegistry` 来管理所有转换器，默认实现为 `DefaultConverterRegistry`。

- `DefaultConverterRegistry` 在内部使用一个 Dictionary<(Type, Type), List<object>> 并用锁保护读写，保证线程安全。
- 注册时可以同时添加实例或工厂方法（factory），工厂在 `GetConverters` 时会被调用以创建转换器实例。
- 对同一对 TSource/TDestination 可以注册多个转换器；Convert 会按注册顺序逐个尝试。

示例（工厂与实例）：

```csharp
// Register factory
ValueConverter.RegisterConverter<string, Money>(() => new MoneyConverter());

// Or register instance
ValueConverter.RegisterConverter<string, Money>(new MoneyConverter());
```

## 内置转换器与注册表初始化

- DefaultRegistry 在构造时预先注册了部分"特殊原语"转换器：
    - GuidValueConverter — 支持从 string、Guid 和 object 转换到 Guid（使用 Guid.TryParse，失败时返回 Guid.Empty）
    - VersionValueConverter — 支持从 string、Version 和 object 转换到 Version（使用 Version.TryParse，失败时返回 null）
    - SystemValueConverter — 作为通用后备，使用 System.Convert.ChangeType（捕获异常并返回默认值）

## 管理方法与 API

| 方法 | 说明 |
|------|------|
| `HasConverter<TSrc,TDest>()` | 检查注册表中是否存在任何转换器
| `ClearConverters<TSrc,TDest>()` | 清除对指定类型对的所有已注册转换器
| `ClearAll()` | 清空注册表
| `SetRegistry(IConverterRegistry)` | 切换到自定义注册表实现（非线程安全切换，用户负责可见性）
| `ResetRegistry()` | 将注册表重置为默认实现并重新注册内置转换器

示例：

```csharp
// 检查是否存在转换器
if (ValueConverter.HasConverter<string, Money>())
{
        // use specific converter
}

// 定制 Registry
var customRegistry = new DefaultConverterRegistry();
customRegistry.Register<string, MyType>(() => new MyTypeConverter());
ValueConverter.SetRegistry(customRegistry);

// 重置为默认注册表
ValueConverter.ResetRegistry();
```

## 何时实现自定义注册表

如果你需要不同的生命周期控制、不同的实例策略或需要延迟/跨域加载转换器，可以实现 `IConverterRegistry` 并使用 `ValueConverter.SetRegistry(myRegistry)`。

## 最佳实践与注意事项

1. 将专用转换器注册到注册表以覆盖通用 SystemValueConverter 的行为（例如复杂解析逻辑）。
2. Convert 在失败时返回目标类型的默认值（不要期望抛出异常）；如果需要严格失败检测，请在转换器实现中显式抛出或在调用方检测返回值。
3. DefaultConverterRegistry 使用锁保证线程安全注册/检索；如果你实现自己的 Registry，请提供合适的并发策略。
4. 注册多个转换器时注意顺序，ValueConverter 会按注册顺序依次尝试。

## 测试建议

为自定义转换器编写单元测试，覆盖：CanConvert 的边界、Convert 返回 null/默认值情形、与 SystemValueConverter 的互相降级场景。

```

## 管理方法

| 方法 | 说明 |
|------|------|
| `HasConverter<TSource, TDest>()` | 检查是否存在转换器 |
| `ClearConverters<TSource, TDest>()` | 清除指定类型的转换器 |
| `ClearAll()` | 清除所有转换器 |
| `SetRegistry(registry)` | 设置自定义注册表 |
| `ResetRegistry()` | 重置为默认注册表 |

## 内置转换器

- **SystemValueConverter**: 使用 `System.Convert.ChangeType` 的通用转换器
- **GuidValueConverter**: 字符串到 Guid 的转换
- **VersionValueConverter**: 字符串到 Version 的转换

## 自定义注册表

```csharp
// 创建自定义注册表
var customRegistry = new DefaultConverterRegistry();
customRegistry.Register<string, MyType>(() => new MyTypeConverter());

// 应用自定义注册表
ValueConverter.SetRegistry(customRegistry);

// 重置为默认注册表
ValueConverter.ResetRegistry();
```

## 最佳实践

1. **转换失败返回默认值**：`Convert` 方法在失败时返回目标类型的默认值
2. **优先注册专用转换器**：转换器按注册顺序尝试
3. **线程安全**：`DefaultConverterRegistry` 支持线程安全操作
