# State: A Component's Memory

> `useState` - 매번 기억을 잃어버리는 컴포넌트에게 '기억 상자'를 주는 훅

## 왜 이걸 굳이 정리하는가?

`useState`는 React 개발자라면 누구나, 매일같이, 습관처럼 사용하는 훅이다.
그래서 오히려 대충 쓰는 경향이 있다...😅

```tsx
const [value, setValue] = useState("");
```

이 코드 한 줄이 하는 일을 '변수처럼 쓰면 되지'라고만 알고 있다면, 절반밖에 모르는거다.
이걸 정리하는 이유는 "이제는 좀 알고 쓰자!",
그냥 '기억'이 아니라 React의 렌더링 사이클과 동작 원리를 이해하는 핵심 포인트이기 때문이다.

## 이걸 왜 쓰는가?

React 컴포넌트는 배우처럼 매번 대본을 잊고 다시 등장한다.
`let count = 0`처럼 변수로 저장하면 무대에 오를 때마다 처음부터 다시 0!
그래서 `useState`는 배우의 머릿속이 아닌, 무대 뒤 기억 상자에 정보를 저장해주는 역할을 한다.
그 기억 상자 덕분에 컴포넌트는 리렌더링이 되어도 지난 상태를 기억할 수 있음!

## 언제 유용한가?

- 버튼을 누를 때마다 숫자를 올리고 싶을 때
- 입력창에 글자를 입력하고 그걸 기억해두고 싶을 때
- 탭, 토글, 체크박스 등 UI 요소 상태 관리할 때

## 기본 예제

```tsx
// useState 활용한 예제
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>클릭한 횟수: {count}</button>
  );
}
```

버튼을 누를 때마다 `count`가 업데이트되고, 컴포넌트가 다시 렌더링되며 최신 값을 유지

```tsx
// useState 활용 하지 않고 그냥 변수 사용한 예제
function Counter() {
  let count = 0;

  return (
    <button
      onClick={() => {
        count += 1;
        console.log(count);
      }}
    >
      클릭한 횟수: {count}
    </button>
  );
}
```

이 경우 `count`는 버튼 클릭할 때마다 증가하지만, 화면엔 절대 반영되지 않음
왜냐면 컴포넌트가 리렌더링될 때마다 `count = 0`부터 다시 시작되기 때문임.
즉, React는 '변수의 변화'만으로는 렌더링을 트리거하지 않음.

## 실무 활용 예제

```tsx
function 로그인폼() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  return (
    <form>
      <input
        type="text"
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
    </form>
  );
}
```

입력값을 즉시 반영하고 기억하는 기능에 쓰임
-> 유효성 검사, 로그인 요청 등 거의 모든 곳에서 사용

## 확장 사용법 / 커스터마이징

- 복잡한 초기값 계산이 있다면?

```tsx
const [초기값, set초기값] = useState(() => {
  console.log("한 번만 실행됨");
  return 복잡한계산();
});
```

- 여러 값을 객체로 관리하고 싶다면?

```tsx
const [user, setUser] = useState({ name: "", age: 0 });

setUser((prev) => ({ ...prev, name: "민수" }));
```

## 주의사항 및 팁

- `useState`는 조건문이나 반복문 안에서 쓰면 안 돼.
  -> 항상 컴포넌트 최상단에서 호출해야 함.
- 상태를 직접 바꾸면 안 돼.
  -> `setCount(count + 1)` 같이 set함수로만 변경해야함
- 상태 업데이트가 비동기일 수 있으니, 이전 값을 기반으로 할 땐 함수형 업데이트 사용:

```tsx
setCount((prev) => prev + 1); // 안전하고 정확함!
```

## Reference

- React 공식 문서 - https://react.dev/learn/state-a-components-memory
- React API (useSTate) - https://react.dev/reference/react/useState
