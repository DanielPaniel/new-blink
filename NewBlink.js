class NewBlink extends HTMLElement {
  static observedAttributes = ["type"];
  constructor() {
    super();
    
    this.attachShadow({ mode: "open" });
    this._createShadowDom();
  }
  
     /**
     * Style and HTML for shadow dom
     */
    _createShadowDom() {
      let css =
      `<style>
        :host {
          display: inline-block;
          text-decoration: inherit;
        }
        /* The default proportions of blink as implemented by Firefox: 
          3/4 of a second visible, 1/4 of a second invisible
          https://en.wikipedia.org/wiki/Blink_element */
        div {
          --animation-random-index: 1;          
          animation: 1000ms infinite linear blink-animation--3-4;
        }
        .strobe {
          animation-name: blink-animation--1-1;
          animation-duration: 150ms;
        }
        .fade {
          animation-name: blink-animation--fade;
        }
        .inactive {
          animation-name: none;
        }
        .random {
          animation-name: none;
        }
        .random span {
          --animation-delay: 10ms;
          animation: 300ms infinite linear blink-animation--1-1;
          animation-delay: calc(var(--animation-delay) * var(--animation-random-index));
        }
        @keyframes blink-animation--3-4 {
          0%, 75% {
            opacity: 1;
          }
          76%, 100% {
            opacity: 0;
          }
        }
        @keyframes blink-animation--1-1 {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        
        /* visible/invisible proportions but with 15% x 2 fade, back and forth */
        @keyframes blink-animation--fade {
          0%, 52% {
            opacity: 1;
          }
          63%, 85% {
            opacity: 0;
          }
        }
        
        @media (prefers-reduced-motion) {
          .random span,
          div {
            animation: none;
          }
        }
      </style>`;

      let html = `
        <div class="">
          <slot></slot>
        </div>
        `;

      let template = document.createElement("template");
      template.innerHTML = css + html;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "type") {
          let classList = this.shadowRoot.querySelector("div").classList;
          classList.remove(...classList);
          if (newValue !== "") {
            classList.add(newValue);      
          } 
          if(newValue === "random") {
            this._setRandom();
          }
          if(oldValue === "random" && newValue !== "random") {
            this._unsetRandom();
          }
      }
    }
  
  _setRandom() {
    let letters = this.textContent.split('');
    let letterElements = [];
    letters.forEach((letter) => {
      let element = document.createElement("span");
      element.innerHTML = letter;
      element.style.setProperty("--animation-random-index", Math.round(Math.random(0, 1) * 100));
      letterElements.push(element);
    });
    
    this.innerHTML = '';
    this.shadowRoot.querySelector("slot").append(...letterElements);
  }
  
  _unsetRandom() {
    let textContent = this.shadowRoot.querySelector("slot").textContent;
    this.shadowRoot.querySelector("slot").innerHTML = '';
    this.innerHTML = textContent;
  }
  
  set type(name) {
    this.setAttribute("type", name);
  }
  
  get type() {
    return this.getAttribute("type");
  }
  
}
 customElements.define("new-blink", NewBlink);