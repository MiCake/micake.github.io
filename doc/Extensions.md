# Extensions 扩展方法

## 概述

MiCake 提供了一系列常用的扩展方法，简化日常开发中的常见操作。

## 命名空间

```csharp
using MiCake.Util.Extensions;
```

## 字符串扩展

### 判空方法

```csharp
// 判断是否为 null 或空
bool isEmpty = str.IsNullOrEmpty();

// 判断是否为 null、空或纯空白
bool isBlank = str.IsNullOrWhiteSpace();
```

### 截取方法

```csharp
// 从开头截取
string left = "HelloWorld".Left(5);  // "Hello"

// 从结尾截取
string right = "HelloWorld".Right(5);  // "World"

// 截断（超过最大长度时）
string truncated = longText.Truncate(100);

// 带后缀截断
string truncatedWithPostfix = longText.TruncateWithPostfix(100);  // "文本内容..."
string truncatedCustom = longText.TruncateWithPostfix(100, ">>>");  // "文本内容>>>"
```

### 大小写转换

```csharp
// PascalCase 转 camelCase
string camel = "HelloWorld".ToCamelCase();  // "helloWorld"

// camelCase 转 PascalCase
string pascal = "helloWorld".ToPascalCase();  // "HelloWorld"

// 转句子格式
string sentence = "HelloWorld".ToSentenceCase();  // "Hello world"
```

### 前后缀操作

```csharp
// 确保以特定字符开头/结尾
string ensured = path.EnsureEndsWith('/');
string ensured = path.EnsureStartsWith('/');

// 移除前后缀
string removed = "HelloWorld".RemovePostFix("World");  // "Hello"
string removed = "HelloWorld".RemovePreFix("Hello");  // "World"
```

### 其他方法

```csharp
// 枚举转换
var status = "Active".ToEnum<Status>();
var status = "active".ToEnum<Status>(ignoreCase: true);

// MD5 哈希
string hash = "password".ToMd5();

// 转字节数组
byte[] bytes = str.GetBytes();
byte[] bytes = str.GetBytes(Encoding.UTF8);

// 规范化换行符
string normalized = text.NormalizeLineEndings();

// 替换首次出现
string replaced = text.ReplaceFirst("old", "new");
```

## 集合扩展

### 判空

```csharp
// 判断集合是否为 null 或空
bool isEmpty = collection.IsNullOrEmpty();
```

### 条件添加

```csharp
// 如果不包含则添加
bool added = list.AddIfNotContains(item);

// 使用条件判断
bool added = list.AddIfNotContains(item, x => x.Id == item.Id);

// 使用工厂方法
bool added = list.AddIfNotContains(
    x => x.Name == "test", 
    () => new Item { Name = "test" }
);

// 批量添加（排除已存在的）
var addedItems = list.AddIfNotContains(newItems);
```

### 批量移除

```csharp
// 移除满足条件的所有项
var removed = collection.RemoveAll(x => x.IsExpired);
```

## 使用示例

### 字符串处理

```csharp
public class TextProcessor
{
    public string ProcessTitle(string title)
    {
        if (title.IsNullOrWhiteSpace())
            return "未命名";
            
        return title
            .ToPascalCase()
            .TruncateWithPostfix(50);
    }
    
    public string NormalizePath(string path)
    {
        return path
            .RemovePreFix("/", "\\")
            .RemovePostFix("/", "\\")
            .EnsureStartsWith('/');
    }
}
```

### 集合操作

```csharp
public class TagManager
{
    private readonly List<string> _tags = new();
    
    public void AddTag(string tag)
    {
        _tags.AddIfNotContains(tag.ToLowerInvariant());
    }
    
    public void AddTags(IEnumerable<string> tags)
    {
        _tags.AddIfNotContains(tags.Select(t => t.ToLowerInvariant()));
    }
    
    public int CleanupInvalidTags()
    {
        return _tags.RemoveAll(t => t.IsNullOrWhiteSpace()).Count;
    }
}
```

## 可用扩展类

| 类 | 说明 |
|----|------|
| `StringExtensions` | 字符串扩展方法 |
| `CollectionExtensions` | ICollection 扩展方法 |
| `ListExtensions` | IList 扩展方法 |
| `DictionaryExtensions` | IDictionary 扩展方法 |
| `ComparableExtensions` | IComparable 扩展方法 |
| `RangeExtensions` | Range 扩展方法 |
