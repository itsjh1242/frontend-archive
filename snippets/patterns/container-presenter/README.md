# 🧩 Container-Presenter Pattern

컴포넌트의 역할을 **로직(Container)** 과 **UI(Presenter)** 로 명확히 나누는 가장 보편적인 React 디자인 패턴입니다.

---

## ✅ 개념 요약

| 역할          | 설명                                      |
| ------------- | ----------------------------------------- |
| **Container** | 상태 관리, 비즈니스 로직, API 호출 담당   |
| **Presenter** | 순수 UI 컴포넌트. props 기반으로만 렌더링 |

---

## 🎯 이 패턴이 실무에서 자주 쓰이는 이유

- **역할 분리**로 컴포넌트 책임이 명확해짐
- **UI만 따로 개발/테스트/리팩터링** 가능
- 디자이너나 퍼블리셔와 **협업 구조 분리**에 유리
- 상태 관리 라이브러리 (Zustand, Redux 등)와 호환성 우수

---

## 🔗 참고 자료

- [Container/Presentational Components – Dan Abramov](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
