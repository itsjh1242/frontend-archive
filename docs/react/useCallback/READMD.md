# useCallback

> `useCallback` - 함수도 기억할 수 있다. 불필요한 렌더링을 막아주는 콜백 메모이제이션 훅

## 이걸 왜 쓰는가?

React는 컴포넌트가 렌더링될 때마다 함수도 새로 만듦.
그래서 memoized 컴포넌트나 `useEffect`, `useMemo`, `React.memo` 등이 함수가 바뀌었다고 착각해서 불필요하게 실행되거나 렌더링됨.

이때 `useCallback`으로 함수를 기억시켜주면,
의존성 배열이 바뀌지 않는 한 같은 함수로 인식하게 해줌.

## 언제 유용한가?

- `React.memo`로 감싼 자식 컴포넌트에 함수를 props로 넘길 때
- `useEffect` 의존성 배열에 콜백을 넣어야 할 때
- 리스트에서 각 항목에 대한 콜백을 재사용할 때
- 커스텀 훅 내부에서 콜백의 재생성을 방지하고 싶을 때

## 기본 예제

```tsx
import { useCallback, useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return <button onClick={handleClick}>Click me: {count}</button>;
}
```

- 이 코드는 매 렌더링마다 `handleClick` 함수가 재생성되지 않음
- `React.memo`와 함께 쓸 때 정말 효과적임

## 실무 활용 예제

```tsx
const ListItem = React.memo(
  ({ onClick, value }: { onClick: () => void; value: string }) => {
    console.log("렌더링: ", value);
  }
);

function List() {
  const [selected, setSelected] = useState<string | null>(null);
  const items = ["A", "B", "C"];

  const handleClick = useCallback((val: string) => {
    setSelected(val);
  }, []);

  return (
    <ul>
      {items.map((item) => (
        <ListItem key={item} value={item} onClick={() => handleClick(item)} />
      ))}
    </ul>
  );
}
```

✅ `useCallback`으로 `handleClick`을 메모이제이션 안 하면 `ListItem`들이 전부 다시 렌더링됨.

<details>
<summary>왜 useCallback을 안 쓰면 ListItem이 다시 렌더링될까?</summary>

> 자식 컴포넌트가 받은 `props`가 "매번 새로 만들어진 함수"이기 때문.
> React는 `props`가 바뀌면 `React.memo`로 감싸도 자식 컴포넌트를 다시 렌더링 함.
> 그리고 JS에서 함수는 매번 새로 생성되면 === (동일성 비교)에서 false로 인식됨.

예시 비교:

```tsx
<ListItem onClick={() => handleClick(item)} />
```

- 이 코드는 `List` 컴포넌트가 렌더링될 때마다 `() => handleClick(item)`을 새로 생성함
- 즉, `onClick` props가 항상 새 참조값을 가진 다른 함수가 됨
- 그래서 `React.memo`는 "어? props 바뀌었네~"하고 `ListItem`을 다시 렌더링함

useCallback으로 감싸면?

```tsx
const handleClick = useCallback((val: string) => {
  setSelected(val);
}, []);

<ListItem onClick={() => handleClick(item)} />;
```

- `handleClick` 자체는 기억된 동일한 함수
- `() => handleClick(item)`도 매번 새로 만들어지긴 하지만, 상황에 따라 `useMemo`로 `item => () => handleClick(item)`을 고정하면 해결 가능

</details>

<details>
<summary>Child 컴포넌트가 매번 다른 prop을 받아서 리렌더링되면 뭐가 안 좋은데?</summary>

```tsx
const Child = React.memo(({ onClick }) => {
  console.log("rendered!");
  return <button onClick={onClick}>Child</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>Parent Increase</button>
      <Child onClick={() => console.log("child clicked")} />
    </>
  );
}
```

여기서 무슨 일이?

- `Parent`가 `count` 때문에 리렌더링됨
- 이때 `() => console.log("child clicked")는 매번 새로 만들어진 함수임`
- 그래서 `Child`는 매번 다른 `onClick` props를 받았다고 판단됨 -> `React.memo`가 있어도 렌더링을 막지 못함
- Child 안에 렌더링 비용이 큰 로직이 있다면 불필요한 연산 낭비
- 리스트처럼 많은 자식이 있다면 성능 저하로 직결

해결법:

- `useCallback`으로 `onClick`을 메모이제이션하면, 같은 함수로 간주되어 불필요한 렌더링을 막을 수 있음

</details>

## 함수형 스타일: 커스터마이징 팁

- 의존성 배열 안에 state, props 등 함수 내부에서 쓰는 모든 값을 넣어야 함
- 필요 없는 의존성 하나 빠지면 stale value 발생 주의

```tsx
const handle = useCallback(() => {
  doSomething(value); // 이 value가 바뀌면 handle도 다시 만들어야 함.
}, [value]);
```

## 주의사항 및 팁

- `useCallback(fn, [])`은 정말 의존성이 없을 때만
- `useCallback`은 성능 최적화 용도이지, 무조건 써야 하는 건 아님
- 너무 많이 쓰면 오히려 코드 복잡도만 올라감
