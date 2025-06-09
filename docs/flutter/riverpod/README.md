# 🌱 Flutter Riverpod 정리

> **Riverpod**은 Flutter 앱에서 상태를 관리하기 위한 선언적이고 타입 안전한 프레임워크임

---

## 왜 Riverpod인가?

| 기존 Provider      | Riverpod              |
| ------------------ | --------------------- |
| context 필요       | context 없이 작동     |
| 테스트 어려움      | 테스트 용이           |
| 글로벌 접근 어려움 | 어디서든 접근 쉬움    |
| 타입 추론 제한     | 향상된 타입 추론 제공 |

---

## 주요 Provider 종류

### 1. `Provider`

- 외부에서 읽기만 가능한 값 제공

```dart
final nameProvider = Provider<String>((ref) => '홍길동');
```

### 2. `ConsumerWidget`

- provider를 구독하는 위젯

```dart
class MyWidget extends ConsumerWidget {
    @override
    Widget build(BuildContext context, WidgetRef ref) {
        final name = ref.watch(nameProvider);
        return Text(name);
    }
}
```

### 3. `StateProvider`

- 간단한 상태 저장/변경

```dart
final counterProvider = StateProvider<int>((ref) => 0);
ref.read(counterProvider.notifier).state++;
```

### 4. `StateNotifierProvider`

- 로직이 포함된 상태 관리에 사용

```dart
class Counter extends StateNotifier<int> {
    Counter() : super(0);
    void increment() => state++;
}

final counterProvider = StateNotifierProvider<Counter, int>((ref) => Counter());
```

### 5. `FutureProvider`

- 비동기 함수의 결과를 상태로 제공

```dart
final dataProvider = FutureProvider<String>((ref) async {
    await Future.delayed(Duration(seconds: 1));
    return '데이터 도착';
});
```

## 디렉토리 구조 예시

```
lib/
├── main.dart
├── providers/
│   └── counter_provider.dart
├── screens/
│   └── home_screen.dart
└── widgets/
    └── counter_button.dart
```

## 테스트 예시

```dart
test('Counter 증가 테스트', () {
    final container = ProviderContainer();
    final notifier = container.read(counterProvider.notifier);

    notifier.increment();
    expect(container.read(counterProvider), 1);
});
```

## 정리

- 선언적이고 타입 안정성 높은 상태 관리
- `context` 없이도 어디서든 접근 가능
- 전역 상태 및 비동기 처리에 적합
- 테스트, 유지보수, 리팩토링에 강함
