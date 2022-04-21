export class Keyboard {
  /* 
  Private class fields
  class외부에서 읽히고 수정될 수 있다.
  ES2019부터 적용됨
  사용방법은 #(해쉬)를 붙여 사용한다.

  2022.4.21 
  이벤트 버블링 개선을 해본다.
  container에서 menu, input, keyboard 등 하위 요소들을 탐색하는 방법을 개선하겠다.

  1. keyboard 이벤트를 document에 걸도록 한다. 
  그 이유는? input 이벤트를 주게되면 
  input에 focus가 가지 않을 당시엔 
  어떤 키가 눌리는지 알 수 없기 때문에
  document에 걸어 알도록 한다.

 */
  //초기화
  #swichEl;
  #fontSelectEl;
  #containerEl;
  #keyboardEl;
  #inputGroupEl;
  #inputEl;
  // 키인지 마우스인지 판별
  #keyPress = false;
  #mouseDown = false;
  constructor() {
    this.#assignElement();
    this.#addEvent();
  }

  // method 생성
  #assignElement() {
    // getElementById 는 document에서만 사용이 가능
    // 하위 요소들을 querySelector로 바꾸어 사용
    // => 그렇게 되면 document에서 탐색을 하는 것이 아닌 container하위에서 탐색이 됨. => 비용 절감
    this.#containerEl = document.getElementById("container");
    this.#swichEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
    this.#keyboardEl = this.#containerEl.querySelector("#keyboard");
    this.#inputGroupEl = this.#containerEl.querySelector("#input-group");
    this.#inputEl = this.#inputGroupEl.querySelector("#input");
  }

  #addEvent() {
    this.#swichEl.addEventListener("change", this.#onChangeTheme);
    this.#fontSelectEl.addEventListener("change", this.#onChangeFont);
    document.addEventListener("keydown", this.#onKeyDown.bind(this));
    document.addEventListener("keyup", this.#onKeyUp.bind(this));
    this.#inputEl.addEventListener("input", this.#onInput.bind(this));
    this.#keyboardEl.addEventListener(
      "mousedown",
      this.#onMouseDown.bind(this)
    );
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));
  }

  // 이벤트 핸들러는 따로 분리해서 관리하는 것을 추천
  // Mouse event
  #onMouseDown(event) {
    if (this.#keyPress) return;
    this.#mouseDown = true;
    event.target.closest("div.key")?.classList.add("active");
  }
  #onMouseUp(event) {
    if (this.#keyPress) return;
    this.#mouseDown = false;
    // document에 이벤트리스너를 한 이유는 마우스 클릭 후 다른 곳에서 mouseup을 할 수 있기 때문에
    const keyEl = event.target.closest("div.key");
    const isActive = !!keyEl?.classList.contains("active");
    const val = keyEl?.dataset.val;
    // 띄어쓰기, 지우기 빼고 일반 영문을 누를 때
    if (isActive && !!val && val !== "Space" && val !== "Backspace") {
      this.#inputEl.value += val;
    }
    // 공백을 누를 때
    if (isActive && val === "Space") {
      this.#inputEl.value += " ";
    }
    // 지우기를 누를 때
    if (isActive && val === "Backspace") {
      this.#inputEl.value = this.#inputEl.value.slice(0, -1);
    }
    this.#keyboardEl.querySelector(".active")?.classList.remove("active");
  }
  // keyboard event
  #onKeyDown(event) {
    if (this.#mouseDown) return;
    this.#keyPress = true;
    // 눌린 key가 어떤 것인지 찾고, 그 요소 class에 active를 추가
    this.#keyboardEl
      .querySelector(`[data-code=${event.code}]`)
      ?.classList.add("active");
    // ? => Optional chaining if문을 대체할 수 있음.
  }
  #onKeyUp(event) {
    if (this.#mouseDown) return;
    this.#keyPress = false;
    this.#keyboardEl
      .querySelector(`[data-code=${event.code}]`)
      ?.classList.remove("active");
  }
  // input event
  #onInput(event) {
    // 한글 입력 값 문제 때문에 input으로 이벤트 변경함
    // 한글 입력 시 에러문을 띄우는 이벤트 (정규식 test method 사용)
    /* 
    한글 입력 시 key 값이 process로 나오기 때문에 keyCode 값을 사용함. 한글 (229)
    this.#inputGroupEl.classList.toggle(
        "error",
        event.keyCode === 229 ? true : false
      );
      => keyCode가 이제 사용되지 않는 선언문임.
       */
    this.#inputGroupEl.classList.toggle(
      "error",
      /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(event.data)
    );
    // 한글 입력 값을 빈 string으로 바꾸어 입력이 되지 않은 것은 느낌을 냄.
    event.target.value = event.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, "");
  }
  // change event
  #onChangeTheme(event) {
    document.documentElement.setAttribute(
      "theme",
      event.target.checked ? "dark-mode" : ""
    );
  }
  #onChangeFont(event) {
    document.body.style.fontFamily = event.target.value;
  }
}
