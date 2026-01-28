import "../components/AppNavigation.js";
import "../components/HeroSection.js";
import "../components/TextContent.js";
import "../components/VideoSection.js";
import "../components/KeyholeSection.js";
import "../components/AnimatedSections.js";
import "../components/HorizontalScrollSection.js";
import "../components/FooterSection.js";

export class DiorHolidayPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="all-content" id="all-content" role="main">
        <!-- Navigation -->
        <app-navigation></app-navigation>

        <!-- Horizontal Scroll Section -->
        <horizontal-scroll-section></horizontal-scroll-section>

        <!-- Footer -->
        <footer-section></footer-section>
      </div>
    `;
  }
}

customElements.define("dior-holiday-page", DiorHolidayPage);
