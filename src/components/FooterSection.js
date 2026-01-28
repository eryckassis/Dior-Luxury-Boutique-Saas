// ============================================================================
// FOOTER SECTION COMPONENT - Web Component para Footer
// ============================================================================

export class FooterSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="footer-wrapper">
        <footer class="dior-footer" id="footercontent" data-gtm-event="footer_click">
          <!-- Reassurance Section -->
          <ul class="r-reassurance">
          <li class="r-reassurance__item">
            <a class="r-reassurance__cta" href="#" title="Amostra Grátis">
              <span class="r-reassurance__content">
                <span class="r-reassurance__title">Amostra Grátis</span>
                <span class="r-reassurance__text">Disponível para todos os produtos</span>
              </span>
              <i class="r-icon r-icon--ArrowRight" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.86893 5.86899C9.1423 5.59562 9.58551 5.59562 9.85888 5.86899L15.4949 11.505C15.7683 11.7784 15.7683 12.2216 15.4949 12.495L9.85888 18.131C9.58551 18.4044 9.1423 18.4044 8.86893 18.131C8.59556 17.8576 8.59556 17.4144 8.86893 17.1411L14.01 12L8.86893 6.85894C8.59556 6.58557 8.59556 6.14235 8.86893 5.86899Z" fill="currentColor"/>
                </svg>
              </i>
            </a>
          </li>
          <li class="r-reassurance__item">
            <a class="r-reassurance__cta" href="#" title="Embalagem Para Presente">
              <span class="r-reassurance__content">
                <span class="r-reassurance__title">Embalagem Para Presente</span>
                <span class="r-reassurance__text">Exclusividades da temporada</span>
              </span>
              <i class="r-icon r-icon--ArrowRight" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.86893 5.86899C9.1423 5.59562 9.58551 5.59562 9.85888 5.86899L15.4949 11.505C15.7683 11.7784 15.7683 12.2216 15.4949 12.495L9.85888 18.131C9.58551 18.4044 9.1423 18.4044 8.86893 18.131C8.59556 17.8576 8.59556 17.4144 8.86893 17.1411L14.01 12L8.86893 6.85894C8.59556 6.58557 8.59556 6.14235 8.86893 5.86899Z" fill="currentColor"/>
                </svg>
              </i>
            </a>
          </li>
          <li class="r-reassurance__item">
            <a class="r-reassurance__cta" href="#" title="Parcelamento em Até 10X">
              <span class="r-reassurance__content">
                <span class="r-reassurance__title">Parcelamento em Até 10X</span>
                <span class="r-reassurance__text">Das mãos de Dior para as suas</span>
              </span>
              <i class="r-icon r-icon--ArrowRight" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.86893 5.86899C9.1423 5.59562 9.58551 5.59562 9.85888 5.86899L15.4949 11.505C15.7683 11.7784 15.7683 12.2216 15.4949 12.495L9.85888 18.131C9.58551 18.4044 9.1423 18.4044 8.86893 18.131C8.59556 17.8576 8.59556 17.4144 8.86893 17.1411L14.01 12L8.86893 6.85894C8.59556 6.58557 8.59556 6.14235 8.86893 5.86899Z" fill="currentColor"/>
                </svg>
              </i>
            </a>
          </li>
        </ul>

        <!-- Main Footer Content -->
        <div class="r-footer__content-main js-footer-content-main">
          <!-- Left Column: Newsletter -->
          <div class="r-footer__left-column">
            <section class="r-newsletter">
              <h2 class="r-newsletter__title" id="footer-title-id">
                Inscreva-se para exclusividade
              </h2>
              <form class="js-footer-subscribe-form" data-gtm-link-name="Newsletter subscription" aria-labelledby="footer-title-id">
                <div class="r-form-field js-form-field">
                  <div class="r-newsletter__input-wrapper">
                    <div class="r-form-field__input r-form-field__input--secondary">
                      <div class="r-form-field__input-field">
                        <input
                          type="email"
                          name="hpEmailSignUp"
                          aria-labelledby="footer-form-email-label"
                          aria-describedby="footer-form-email-error"
                          maxlength="50"
                          autocomplete="email"
                        />
                        <label id="footer-form-email-label" for="hpEmailSignUp">Digite seu e-mail</label>
                      </div>
                    </div>
                    <div id="footer-form-email-error" class="invalid-feedback"></div>
                  </div>
                  <button class="r-newsletter__submit" type="submit" aria-label="Confirme" name="newsletter-form-open">
                    Confirme
                  </button>
                </div>
              </form>
            </section>

            <!-- Accessibility Toggle Desktop -->
            <div class="r-footer__accessibility-toggle r-accessibility-toggle r-footer__accessibility-toggle--desktop">
              Accessibility: Better contrast
              <label class="r-switch" for="accessibility-toggle-footer-desktop" aria-label="Toggle better text contrast to improve readability">
                <input class="r-switch__input js-accessibility-toggle" type="checkbox" data-gtm-ada-location="footer" id="accessibility-toggle-footer-desktop"/>
                <span class="r-switch__slider"></span>
              </label>
            </div>
          </div>

          <!-- Right Columns: Links -->
          <div class="r-footer__lists">
            <!-- Boutique Links -->
            <div class="r-footer__list-wrapper">
              <h2 class="r-footer__list-title">Encontre uma boutique</h2>
              <ul class="r-footer__list" role="list">
                <li class="r-footer__item" role="listitem">
                  <a href="#">Parfums Christian Dior Boutiques</a>
                </li>
                <li class="r-footer__item" role="listitem">
                  <a href="#">Christian Dior Couture Boutiques</a>
                </li>
              </ul>
            </div>

            <!-- Customer Service -->
            <div class="r-footer__list-wrapper">
              <h2 class="r-footer__list-title">Atendimento ao cliente</h2>
              <ul class="r-footer__list" role="list">
                <li class="r-footer__item" role="listitem">
                  <button class="r-footer__accordion-button" data-accordion-toggle="contact" aria-expanded="false">
                    Entre em contato conosco
                    <i class="r-icon r-icon--ArrowDown" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.131 9.50504C18.4044 9.7784 18.4044 10.2216 18.131 10.495L12.495 16.131C12.2216 16.4044 11.7784 16.4044 11.505 16.131L5.86899 10.495C5.59562 10.2216 5.59562 9.7784 5.86899 9.50504C6.14235 9.23167 6.58557 9.23167 6.85894 9.50504L12 14.6461L17.1411 9.50504C17.4144 9.23167 17.8576 9.23167 18.131 9.50504Z" fill="currentColor"/>
                      </svg>
                    </i>
                  </button>
                  <div class="r-footer__accordion-panel" data-accordion-panel="contact" aria-hidden="true">
                    <ul class="r-footer__list r-footer__list--accordion" role="list">
                      <li class="r-footer__item" role="listitem"><a href="#">Parfums Christian Dior</a></li>
                      <li class="r-footer__item" role="listitem"><a href="#">Christian Dior Couture</a></li>
                    </ul>
                  </div>
                </li>
                <li class="r-footer__item" role="listitem">
                  <button class="r-footer__accordion-button" data-accordion-toggle="delivery" aria-expanded="false">
                    Entrega e devoluções
                    <i class="r-icon r-icon--ArrowDown" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.131 9.50504C18.4044 9.7784 18.4044 10.2216 18.131 10.495L12.495 16.131C12.2216 16.4044 11.7784 16.4044 11.505 16.131L5.86899 10.495C5.59562 10.2216 5.59562 9.7784 5.86899 9.50504C6.14235 9.23167 6.58557 9.23167 6.85894 9.50504L12 14.6461L17.1411 9.50504C17.4144 9.23167 17.8576 9.23167 18.131 9.50504Z" fill="currentColor"/>
                      </svg>
                    </i>
                  </button>
                  <div class="r-footer__accordion-panel" data-accordion-panel="delivery" aria-hidden="true">
                    <ul class="r-footer__list r-footer__list--accordion" role="list">
                      <li class="r-footer__item" role="listitem"><a href="#">Parfums Christian Dior</a></li>
                      <li class="r-footer__item" role="listitem"><a href="#">Christian Dior Couture</a></li>
                    </ul>
                  </div>
                </li>
                <li class="r-footer__item" role="listitem">
                  <button class="r-footer__accordion-button" data-accordion-toggle="faq" aria-expanded="false">
                    FAQ
                    <i class="r-icon r-icon--ArrowDown" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.131 9.50504C18.4044 9.7784 18.4044 10.2216 18.131 10.495L12.495 16.131C12.2216 16.4044 11.7784 16.4044 11.505 16.131L5.86899 10.495C5.59562 10.2216 5.59562 9.7784 5.86899 9.50504C6.14235 9.23167 6.58557 9.23167 6.85894 9.50504L12 14.6461L17.1411 9.50504C17.4144 9.23167 17.8576 9.23167 18.131 9.50504Z" fill="currentColor"/>
                      </svg>
                    </i>
                  </button>
                  <div class="r-footer__accordion-panel" data-accordion-panel="faq" aria-hidden="true">
                    <ul class="r-footer__list r-footer__list--accordion" role="list">
                      <li class="r-footer__item" role="listitem"><a href="#">Parfums Christian Dior</a></li>
                      <li class="r-footer__item" role="listitem"><a href="#">Christian Dior Couture</a></li>
                    </ul>
                  </div>
                </li>
                <li class="r-footer__item" role="listitem">
                  <a href="#" class="js-request-invoice-email-guest">Receber a minha fatura</a>
                </li>
              </ul>
            </div>

            <!-- Dior House -->
            <div class="r-footer__list-wrapper">
              <h2 class="r-footer__list-title">Dior House</h2>
              <ul class="r-footer__list" role="list">
                <li class="r-footer__item" role="listitem">
                  <button class="r-footer__accordion-button" data-accordion-toggle="sustainability" aria-expanded="false">
                    Dior Sustainability
                    <i class="r-icon r-icon--ArrowDown" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.131 9.50504C18.4044 9.7784 18.4044 10.2216 18.131 10.495L12.495 16.131C12.2216 16.4044 11.7784 16.4044 11.505 16.131L5.86899 10.495C5.59562 10.2216 5.59562 9.7784 5.86899 9.50504C6.14235 9.23167 6.58557 9.23167 6.85894 9.50504L12 14.6461L17.1411 9.50504C17.4144 9.23167 17.8576 9.23167 18.131 9.50504Z" fill="currentColor"/>
                      </svg>
                    </i>
                  </button>
                  <div class="r-footer__accordion-panel" data-accordion-panel="sustainability" aria-hidden="true">
                    <ul class="r-footer__list r-footer__list--accordion" role="list">
                      <li class="r-footer__item" role="listitem"><a href="#">Parfums Christian Dior</a></li>
                      <li class="r-footer__item" role="listitem"><a href="#">Christian Dior Couture</a></li>
                    </ul>
                  </div>
                </li>
                <li class="r-footer__item" role="listitem">
                  <a href="#">Ética e compliance</a>
                </li>
                <li class="r-footer__item" role="listitem">
                  <a href="#">Carreiras</a>
                </li>
              </ul>
            </div>

            <!-- Legal Terms -->
            <div class="r-footer__list-wrapper">
              <h2 class="r-footer__list-title">Termos legais</h2>
              <ul class="r-footer__list" role="list">
                <li class="r-footer__item" role="listitem">
                  <button class="r-footer__accordion-button" data-accordion-toggle="legal-terms" aria-expanded="false">
                    Termos legais
                    <i class="r-icon r-icon--ArrowDown" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.131 9.50504C18.4044 9.7784 18.4044 10.2216 18.131 10.495L12.495 16.131C12.2216 16.4044 11.7784 16.4044 11.505 16.131L5.86899 10.495C5.59562 10.2216 5.59562 9.7784 5.86899 9.50504C6.14235 9.23167 6.58557 9.23167 6.85894 9.50504L12 14.6461L17.1411 9.50504C17.4144 9.23167 17.8576 9.23167 18.131 9.50504Z" fill="currentColor"/>
                      </svg>
                    </i>
                  </button>
                  <div class="r-footer__accordion-panel" data-accordion-panel="legal-terms" aria-hidden="true">
                    <ul class="r-footer__list r-footer__list--accordion" role="list">
                      <li class="r-footer__item" role="listitem"><a href="#">Parfums Christian Dior</a></li>
                      <li class="r-footer__item" role="listitem"><a href="#">Christian Dior Couture</a></li>
                    </ul>
                  </div>
                </li>
                <li class="r-footer__item" role="listitem">
                  <button class="r-footer__accordion-button" data-accordion-toggle="privacy" aria-expanded="false">
                    Política de privacidade
                    <i class="r-icon r-icon--ArrowDown" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.131 9.50504C18.4044 9.7784 18.4044 10.2216 18.131 10.495L12.495 16.131C12.2216 16.4044 11.7784 16.4044 11.505 16.131L5.86899 10.495C5.59562 10.2216 5.59562 9.7784 5.86899 9.50504C6.14235 9.23167 6.58557 9.23167 6.85894 9.50504L12 14.6461L17.1411 9.50504C17.4144 9.23167 17.8576 9.23167 18.131 9.50504Z" fill="currentColor"/>
                      </svg>
                    </i>
                  </button>
                  <div class="r-footer__accordion-panel" data-accordion-panel="privacy" aria-hidden="true">
                    <ul class="r-footer__list r-footer__list--accordion" role="list">
                      <li class="r-footer__item" role="listitem"><a href="#">Parfums Christian Dior</a></li>
                      <li class="r-footer__item" role="listitem"><a href="#">Christian Dior Couture</a></li>
                    </ul>
                  </div>
                </li>
                <li class="r-footer__item" role="listitem">
                  <button class="r-footer__accordion-button" data-accordion-toggle="sales" aria-expanded="false">
                    Condições gerais de venda
                    <i class="r-icon r-icon--ArrowDown" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.131 9.50504C18.4044 9.7784 18.4044 10.2216 18.131 10.495L12.495 16.131C12.2216 16.4044 11.7784 16.4044 11.505 16.131L5.86899 10.495C5.59562 10.2216 5.59562 9.7784 5.86899 9.50504C6.14235 9.23167 6.58557 9.23167 6.85894 9.50504L12 14.6461L17.1411 9.50504C17.4144 9.23167 17.8576 9.23167 18.131 9.50504Z" fill="currentColor"/>
                      </svg>
                    </i>
                  </button>
                  <div class="r-footer__accordion-panel" data-accordion-panel="sales" aria-hidden="true">
                    <ul class="r-footer__list r-footer__list--accordion" role="list">
                      <li class="r-footer__item" role="listitem"><a href="#">Parfums Christian Dior</a></li>
                      <li class="r-footer__item" role="listitem"><a href="#">Christian Dior Couture</a></li>
                    </ul>
                  </div>
                </li>
                <li class="r-footer__item" role="listitem">
                  <button class="r-footer__accordion-button" data-accordion-toggle="sitemap" aria-expanded="false">
                    Sitemap
                    <i class="r-icon r-icon--ArrowDown" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.131 9.50504C18.4044 9.7784 18.4044 10.2216 18.131 10.495L12.495 16.131C12.2216 16.4044 11.7784 16.4044 11.505 16.131L5.86899 10.495C5.59562 10.2216 5.59562 9.7784 5.86899 9.50504C6.14235 9.23167 6.58557 9.23167 6.85894 9.50504L12 14.6461L17.1411 9.50504C17.4144 9.23167 17.8576 9.23167 18.131 9.50504Z" fill="currentColor"/>
                      </svg>
                    </i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Sitemap Panel -->
        <div class="r-footer-sitemap" data-accordion-panel="sitemap" aria-hidden="true">
          <ul class="r-footer-sitemap__list" role="list">
            <li class="sitemap-list-item" role="listitem">Páginas mais recentes</li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Colônia Dior Sauvage Masculina</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Perfume Miss Dior Feminino</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Perfume J'adore Feminino</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Colônia Johnny Depp</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Perfume de Designer Feminino</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">La Collection Privée Perfume</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Velas de Luxo</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Colônia de Designer Masculina</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Perfume Rihanna</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Perfume para Bebê</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Conjuntos de Presente de Luxo</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Brilho Labial de Luxo</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Maquiagem de Luxo</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Maquiagem Labial de Luxo</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Sombras e Paletas de Olhos de Designer</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Esmalte de Unhas de Luxo</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Cuidados com a Pele e Higiene Masculina</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Creme Facial de Luxo</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Cuidados com a Pele Hidratantes</a></li>
            <li class="sitemap-list-item" role="listitem"><a href="#">Cuidados com a Pele Antienvelhecimento</a></li>
            <li role="listitem"><a class="sitemap-see-all-link" href="#">See all sitemap</a></li>
          </ul>
        </div>

        <!-- Accessibility Toggle Mobile -->
        <div class="r-footer__accessibility-toggle r-accessibility-toggle r-footer__accessibility-toggle--mobile">
          Accessibility: Better contrast
          <label class="r-switch" for="accessibility-toggle-footer-mobile" aria-label="Toggle better text contrast to improve readability">
            <input class="r-switch__input js-accessibility-toggle" type="checkbox" data-gtm-ada-location="footer" id="accessibility-toggle-footer-mobile"/>
            <span class="r-switch__slider"></span>
          </label>
        </div>

        <!-- Bottom Content -->
        <div class="r-footer__content-bottom">
          <!-- Social Media -->
          <div class="r-footer__follow-us">
            <div class="r-follow-us">
              <h3 class="r-follow-us__title">Siga-nos :</h3>
              <ul class="r-follow-us__list" role="list">
                <li role="listitem"><a class="r-follow-us__link" href="https://www.tiktok.com/@diorbeauty" title="Tiktok" target="_blank">Tiktok</a></li>
                <li role="listitem"><a class="r-follow-us__link" href="https://www.instagram.com/diorbeauty/" title="Instagram" target="_blank">Instagram</a></li>
                <li role="listitem"><a class="r-follow-us__link" href="https://x.com/DIOR" title="X" target="_blank">X</a></li>
                <li role="listitem"><a class="r-follow-us__link" href="https://www.facebook.com/Dior" title="Facebook" target="_blank">Facebook</a></li>
                <li role="listitem"><a class="r-follow-us__link" href="https://www.snapchat.com/add/dior" title="Snapchat" target="_blank">Snapchat</a></li>
              </ul>
            </div>
          </div>

          <!-- Dior Logo -->
          <a class="r-footer__logo" href="/" aria-label="Dior logo, go to homepage">
            <i class="r-icon r-icon--LogoDior" aria-hidden="true">
              <svg viewBox="0 0 106 30">
                <path fill="currentColor" d="M8.97806 27.4239C8.97806 28.0373 9.25693 28.2261 9.67223 28.2261H13.3467C22.396 28.2261 25.6702 21.3611 25.6702 14.4831C25.6702 7.60515 22.1873 0.932951 14.5475 0.932951H9.54784C9.04025 0.932951 8.99411 1.36438 8.99411 1.55325L8.97806 27.4239ZM0.333041 0.394165H14.1753C26.0936 0.394165 30.7361 7.33079 30.7361 14.6611C30.7361 21.9913 24.7544 28.7659 13.3949 28.7659H0.343072C0.111348 28.7659 0.0100314 28.6178 0.0100314 28.4856C0.0100314 28.3365 0.151473 28.2122 0.383198 28.2122H2.82583C3.57417 28.2122 4.08075 27.7699 4.08075 26.9269V2.25705C4.08075 1.64769 3.77279 0.963767 2.77567 0.963767H0.294922C0.113354 0.963767 0 0.829568 0 0.690398C0 0.551228 0.0471474 0.395159 0.333041 0.395159"></path>
                <path fill="currentColor" d="M31.9407 0.394165C31.7152 0.394165 31.5241 0.468733 31.5241 0.661617C31.5241 0.832627 31.6283 0.932051 31.8365 0.932051H34.2851C34.8522 0.932051 35.4001 1.31285 35.4001 2.38265V26.9514C35.4001 27.4555 35.0069 28.231 34.3124 28.231H31.8709C31.5959 28.231 31.5615 28.4478 31.5615 28.5352C31.5615 28.6227 31.5454 28.7659 31.8638 28.7659H43.7132C43.8871 28.7659 44.1338 28.7411 44.1338 28.569C44.1338 28.397 44.0893 28.23 43.7779 28.23H41.4922C41.1626 28.23 40.2689 28.0272 40.2689 27.0528V2.11122C40.2689 1.40233 40.7147 0.933045 41.5468 0.933045H43.782C43.9822 0.933045 44.0792 0.832627 44.0792 0.669571C44.0792 0.528388 43.966 0.395159 43.7193 0.395159H31.9407V0.394165Z"></path>
                <path fill="currentColor" d="M60.2899 29.5539C69.7115 29.5539 75.658 22.9376 75.658 14.777C75.658 6.61634 69.7665 0 60.2899 0C50.8134 0 44.9219 6.61634 44.9219 14.777C44.9219 22.9376 51.0585 29.5539 60.2899 29.5539ZM50.136 14.777C50.136 6.93831 53.666 0.583327 60.2899 0.583327C66.9138 0.583327 70.4449 6.93831 70.4449 14.777C70.4449 22.6156 67.1049 28.9706 60.2899 28.9706C53.4749 28.9706 50.136 22.6156 50.136 14.777Z"></path>
                <path fill="currentColor" d="M86.5271 0.936091H88.2953C91.3242 0.936091 96.2567 2.13214 96.2567 7.90601C96.2567 13.1971 91.8825 14.9911 87.8495 14.9911H85.2683V2.12412C85.2683 1.4099 85.7071 0.937093 86.5271 0.937093M105.573 28.8027C101.896 29.1944 99.8708 23.113 98.0021 20.2281C96.6199 18.0944 93.6646 15.9127 90.7381 15.497C95.5254 15.2215 100.913 13.6699 100.913 8.1965C100.913 3.75291 98.2041 0.394165 88.2336 0.394165H76.7396C76.5904 0.394165 76.4461 0.470295 76.4461 0.663626C76.4461 0.83592 76.5864 0.937093 76.7396 0.937093H79.3805C79.9378 0.937093 80.4781 1.32075 80.4781 2.39859V27.1519C80.4781 27.6588 80.091 28.4411 79.4074 28.4411H76.7884C76.5775 28.4411 76.4839 28.6204 76.4839 28.7106C76.4839 28.8007 76.5595 28.981 76.7805 28.981H88.9769C89.147 28.981 89.2893 28.8909 89.2893 28.7186C89.2893 28.5463 89.1799 28.4411 88.9391 28.4411H86.4723C86.1479 28.4411 85.2683 28.2358 85.2683 27.2541V15.5551H86.528C92.5591 15.5551 93.0019 22.1393 96.005 25.9118C98.5772 29.1443 101.929 29.554 103.827 29.554C104.637 29.554 105.205 29.527 105.706 29.4008C106.085 29.3046 106.155 28.7406 105.572 28.8037"></path>
              </svg>
            </i>
          </a>

          <!-- Locale Switcher -->
          <div class="r-footer__locale-switcher">
            <button class="r-open-country-modal js-footer-country-selector">
              <div class="r-open-country-modal__wrapper">
                <span class="r-open-country-modal__title">Escolha seu País ou Região e Idioma:</span>
                <span class="r-open-country-modal__content">Brasil (português)</span>
              </div>
              <i class="r-icon r-icon--ArrowRight" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.86893 5.86899C9.1423 5.59562 9.58551 5.59562 9.85888 5.86899L15.4949 11.505C15.7683 11.7784 15.7683 12.2216 15.4949 12.495L9.85888 18.131C9.58551 18.4044 9.1423 18.4044 8.86893 18.131C8.59556 17.8576 8.59556 17.4144 8.86893 17.1411L14.01 12L8.86893 6.85894C8.59556 6.58557 8.59556 6.14235 8.86893 5.86899Z" fill="currentColor"/>
                </svg>
              </i>
            </button>
          </div>
        </div>
        </footer>
      </div>
    `;
  }

  attachEventListeners() {
    // Placeholder animation (Dior style)
    this.initPlaceholderAnimation();

    // Mobile accordion for footer sections
    this.initMobileAccordion();

    // Accordion functionality
    const accordionButtons = this.querySelectorAll(".r-footer__accordion-button");
    accordionButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const panelId = button.getAttribute("data-accordion-toggle");
        const panel = this.querySelector(`[data-accordion-panel="${panelId}"]`);
        const isExpanded = button.getAttribute("aria-expanded") === "true";

        // Toggle aria-expanded
        button.setAttribute("aria-expanded", !isExpanded);

        // Toggle panel visibility
        if (panel) {
          panel.setAttribute("aria-hidden", isExpanded);
          panel.style.maxHeight = isExpanded ? "0" : panel.scrollHeight + "px";
        }
      });
    });

    // Newsletter form submission
    const newsletterForm = this.querySelector(".js-footer-subscribe-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const emailValue = emailInput.value;

        // Simple validation
        if (emailValue && emailValue.includes("@")) {
          alert("Obrigado por se inscrever!");
          emailInput.value = "";
        } else {
          alert("Por favor, insira um e-mail válido.");
        }
      });
    }

    // Accessibility toggle
    const accessibilityToggles = this.querySelectorAll(".js-accessibility-toggle");
    accessibilityToggles.forEach((toggle) => {
      toggle.addEventListener("change", (e) => {
        if (e.target.checked) {
          document.body.classList.add("high-contrast");
        } else {
          document.body.classList.remove("high-contrast");
        }
      });
    });
  }

  initMobileAccordion() {
    const listWrappers = this.querySelectorAll(".r-footer__list-wrapper");

    listWrappers.forEach((wrapper) => {
      const title = wrapper.querySelector(".r-footer__list-title");

      if (title) {
        title.addEventListener("click", () => {
          // Só funciona em mobile (menos de 768px)
          if (window.innerWidth <= 768) {
            // Fecha outros acordeões
            listWrappers.forEach((otherWrapper) => {
              if (otherWrapper !== wrapper && otherWrapper.classList.contains("active")) {
                otherWrapper.classList.remove("active");
              }
            });

            // Toggle do atual
            wrapper.classList.toggle("active");
          }
        });
      }
    });

    // Reseta acordeões quando a janela é redimensionada para desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        listWrappers.forEach((wrapper) => {
          wrapper.classList.remove("active");
        });
      }
    });
  }

  initPlaceholderAnimation() {
    const emailInput = this.querySelector('input[type="email"]');
    const label = this.querySelector("#footer-form-email-label");

    if (!emailInput || !label) return;

    emailInput.addEventListener("focus", () => {
      label.classList.add("label-focused");
    });

    emailInput.addEventListener("blur", () => {
      if (emailInput.value === "") {
        label.classList.remove("label-focused");
      }
    });

    // Mantém o label em cima se tiver valor
    if (emailInput.value !== "") {
      label.classList.add("label-focused");
    }
  }
}

customElements.define("footer-section", FooterSection);
