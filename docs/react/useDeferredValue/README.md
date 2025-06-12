# useDeferredValue (React 19.1 기준)

> 렌더링을 살잒 늦춰주는 고마운 친구
> "급한 입력 먼저 처리하고, 무거운 컴포넌트는 숨 좀 돌린 뒤 천천히 불러올게요~"

---

## 이 훅 왜 쓸까?

- 사용자가 input에 빠르게 타이핑 중일 때,
- 결과로 렌더링 되는 컴포넌트가 **무거워서 뚝뚝 끊긴다?**
- `useDeferredValue`로 **렌더링만 잠깐 지연**하면 해결됨

예를 들어 검색창이 있다면?

- **입력은 즉시 반영** (예: `query`)
- **검색 결과는 살짝 늦게 반영** (예: `deferredQuery`)

---

## 언제 유용할까?

| 상황                                       | 해결 포인트                      |
| ------------------------------------------ | -------------------------------- |
| 검색어 입력 중인데 검색 결과가 버벅거림    | 결과를 `deferredQuery`로 렌더링  |
| 필터 버튼 누를 때마다 리스트 리렌더 버벅임 | 필터 기준 `deferredValue`로 처리 |
| 차트, 로그, 통계 같은 컴포넌트 느림        | defer로 타이핑 중 UI 멈춤 방지   |

---

## 🧪 기본 예제

```tsx
import { useState, useDeferredValue } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어 입력"
      />
      <SearchResults query={deferredQuery} />
    </>
  );
}
```

> 비유하자면:
> 사용자가 말은 바로바로 하지만, 옆에 받아적는 속기사(SearchResults)는 살짝 늦게 반응하는 느낌

## 콘텐츠가 지연 상태임을 표시하기

```tsx
const isStale = query !== deferredQuery;

{
  isStale && <p className="text-sm text-gray-500">결과 업데이트 중...</p>;
}
```

## 주의사항

- `value`는 primitive나 memoized object로 써야함
  -> render 중 만든 객체는 매번 참조가 바뀌어 re-render 지옥에 빠짐

  > useDeferredValue에 넣는 값은 매 렌더마다 내용이 바뀌지 않아야 함
  > React는 값이 바뀌었는지 확인할 때 Object.is()를 씀 > 그런데, 이런 코드는 문제가 생김

  ```tsx
  const deferred = useDeferredValue({ name: "철수" });
  ```

  - 위 코드는 매번 { name: '철수' }라는 새 객체를 만들기 때문에 매번 새로운 값처럼 인식
  - deferredValue가 매 렌더마다 다시 작동하게 됨 -> 퍼포먼스 낭비로 이어짐

  그럼 어떻게 써야 하냐면:

  - primitive 값 (string, number, boolean 등) -> OK
  - 또는 메모이제이션된 객체를 사용

  ```tsx
  const user = useMemo(() => ({ name: "철수" }), []);
  const deferredUser = useDeferredValue(user);
  ```

- defer는 렌더링만 늦춤
  -> fetch나 네트워크 요청을 지연하진 않음
- delay 시간 지정 불가
  -> React가 내부에서 "이제 슬슬 렌더해도 되겠군" 판단함

## Suspense랑도 찰떡궁합

- background 렌더 중 `Suspense` 발생해도 fallback 안보임
- 사용자는 "로딩 중"같은 UI 대신 이전 결과 그대로 보게 됨

<details>
<summary>Suspense란?</summary>

> Suspense는 "데이터나 컴포넌트가 아직 준비 안 됐을 때" 대신 보여줄 대기 UI를 설정하는 기능
>
> **예시로 비유하자면:**
>
> - 사용자가 페이지를 열자마자 서버에 데이터를 요청함
> - 근데 데이터가 아직 안 옴
> - React가 바로 렌더 못 하고 이렇게 말함:  
>   "준비될 때까지 fallback(로딩 컴포넌트) 보여줘"

</details>

## 마무리 요약

```txt
- 빠른 입력과 무거운 렌더링을 분리하고 싶을 때
- 검색, 필터, 차트 등 성능 미감한 UI에 사용
- "입력은 지금! 결과는 나중!" 전략
```

## Reference

- React 공식 문서 - https://react.dev/reference/react/useDeferredValue
