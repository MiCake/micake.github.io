# CircuitBreaker 熔断器

## 概述

`GenericCircuitBreaker<TRequest, TResponse>` 是通用熔断器实现，用于保护系统免受外部服务故障影响，支持自动故障转移和多种提供者选择策略。

## 命名空间

```csharp
using MiCake.Util.Resilience;
```

## 熔断器状态与实现细节

GenericCircuitBreaker 使用每个 provider 的独立状态对象 (CircuitBreakerState) 来跟踪运行状况。

```
Closed（关闭）→ Open（打开）→ HalfOpen（半开）→ Closed
        ↑              ↓               ↓
    正常运行       失败次数超限       尝试恢复
```

每个 provider 的 `CircuitBreakerState` 包含以下字段（在代码里由 `CircuitBreakerState` 表示）：

- `State` (CircuitState) — 当前状态 (Closed/Open/HalfOpen)
- `FailureCount` — 累计失败次数（用于触发 Open）
- `SuccessiveSuccesses` — 连续成功次数（用于从 HalfOpen 切换到 Closed）
- `LastFailureTime` — 最近失败时间（用于计算 Open 状态超时）
- `LastTestTime` — 最近测试时间（保留字段）
- `ConcurrentOperations` — 当前并发请求数（控制最大并发）

这些字段驱动状态机和并发限制 (MaxConcurrentOperations)；库通过锁保护这些变更以保证线程安全。

## 配置选项

```csharp
var config = new CircuitBreakerConfig
{
    FailureThreshold = 3,           // 失败阈值（默认：3）
    SuccessThreshold = 2,           // 恢复成功阈值（默认：2）
    OpenStateTimeout = TimeSpan.FromMinutes(5),  // 熔断超时时间
    MaxConcurrentOperations = 100,   // 最大并发数
    SelectionStrategy = ProviderSelectionStrategy.PriorityOrder  // 选择策略
};
```

## 提供者选择策略与行为

| 策略 | 说明 |
|------|------|
| `PriorityOrder` | 按优先级顺序选择 |
| `RoundRobin` | 轮询选择 |
| `LeastLoad` | 选择负载最低的提供者 |
| `ParallelRace` | 并行执行多个 provider 并返回第一个成功的结果（适合低延迟优先的场景） |

选择策略说明：

- PriorityOrder（默认）: 按优先级（由配置或 SetProviderPriorities 指定）顺序尝试 provider，遇到第一个成功返回。
- RoundRobin: 每次请求使用轮询顺序分配 provider，提高均衡使用率。
- LeastLoad: 优先使用当前并发最小的 provider（根据 `ConcurrentOperations` 字段排序）。
- ParallelRace: 并发发起到多个 provider，返回最先成功的响应，适合多副本的“竞速”场景。

## Provider 接口和契约 (ICircuitBreakerProvider)

```csharp
public class MyServiceProvider : ICircuitBreakerProvider<MyRequest, MyResponse>
{
    public string ProviderName => "MyService";

    public async Task<MyResponse?> ExecuteAsync(
        MyRequest request, 
        CancellationToken cancellationToken = default)
    {
        // 执行实际请求
        return await _httpClient.SendAsync(request);
    }

    public async Task<bool> IsAvailableAsync(CancellationToken cancellationToken = default)
    {
        // 检查服务可用性
        return await _healthCheck.CheckAsync();
    }
}
```

## 使用示例

### 基本用法

```csharp
var providers = new[] { new PrimaryProvider(), new BackupProvider() };
var logger = LoggerFactory.Create(...).CreateLogger<...>();

var circuitBreaker = new GenericCircuitBreaker<MyRequest, MyResponse>(
    providers, logger, config);

var response = await circuitBreaker.ExecuteAsync(request);
```

### 设置优先级

```csharp
circuitBreaker.SetProviderPriority("PrimaryService", 0);   // 最高优先级
circuitBreaker.SetProviderPriority("BackupService", 1);    // 次优先级
```

### 获取状态

```csharp
var status = circuitBreaker.GetProvidersStatus();
foreach (var (name, info) in status)
{
    Console.WriteLine($"{name}: 状态={info.State}, 失败={info.Failures}");
}
```

### 刷新提供者状态

```csharp
await circuitBreaker.RefreshProviderStatusAsync();
```

## 最佳实践

1. **提供降级方案**：熔断器打开时返回缓存数据或默认值
2. **合理设置阈值**：根据服务特性调整失败和恢复阈值
3. **监控状态**：定期检查提供者状态进行告警
4. **使用日志**：熔断器会自动记录状态变化

```csharp
try
{
    return await circuitBreaker.ExecuteAsync(request);
}
catch
{
    // 所有提供者都失败，返回降级数据
    return GetCachedData();
}
```
