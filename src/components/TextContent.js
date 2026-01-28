export class TextContent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const heading = this.getAttribute("heading") || "Dior Holiday — Embracing the Extraordinary";
    const text =
      this.getAttribute("text") ||
      "O encanto das suas festas é iluminado pelas novas criações festivas Dior.<br />A verdadeira elegância se revela nos momentos de celebração, quando a Dior transforma cada detalhe em uma expressão radiante de alegria.";

    this.render(heading, text);
  }

  render(heading, text) {
    this.innerHTML = `
      <article class="grid-item grid-content">
        <header>
          <h1>${heading}</h1>
        </header>
        <p>${text}</p>
      </article>
    `;
  }
}

customElements.define("text-content", TextContent);
