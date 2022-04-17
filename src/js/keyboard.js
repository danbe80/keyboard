export class Keyboard {
  /* 
  Private class fields
  class외부에서 값을 가져오고나 적용시킬 수 없게 해줌
  ES2019부터 적용됨
  사용방법은 #(해쉬)를 붙여 사용한다.
  */
  #swichEl;
  #fontSelectEl;
  constructor() {
    this.#assignElement();
    this.#addEvent();
  }

  #assignElement() {
    this.#swichEl = document.getElementById("switch");
    this.#fontSelectEl = document.getElementById("font");
  }

  #addEvent() {
    this.#swichEl.addEventListener("change", (event) => {
      document.documentElement.setAttribute(
        "theme",
        event.target.checked ? "dark-mode" : ""
      );
    });
    this.#fontSelectEl.addEventListener("change", (event) => {
      document.body.style.fontFamily = event.target.value;
    });
  }
}
