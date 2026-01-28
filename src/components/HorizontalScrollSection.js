import { cartService } from "../services/CartService.js";

export class HorizontalScrollSection extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();

    setTimeout(() => {
      this.initScrollAnimation();
      this.initVideoControls();
      this.initButtonAnimations();
      this.initPietroButton();
      this.initParallaxGallery();
      this.initBagButtons();
    }, 100);
  }

  render() {
    this.innerHTML = `
      <section id="panels" class="horizontal-panels-section">
        <div id="panels-container" class="horizontal-panels-container">
          
          <!-- Panel 1 -->
          <article id="panel-1" class="panel full-screen-panel panel-red">
            <div class="panel-wrapper">
              <div class="panel-content-grid">
                <div class="panel-image-col">
                  <img src="/images/image.png" alt="Dior Holiday Panel 1">
                </div>
                <div class="panel-text-col">
                 <h2 class="panel-first-title">Bem vindo ao circo dos sonhos Dior</h2>
                  <p class="panel-description-2">
                    Bem vindo ao circo dos sonhos DIOR 
                        onde luxo e fantasia se encontram.
                  </p>
                  <div class="panels-navigation">
                    <div class="nav-panel" data-sign="plus">
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <!-- Panel 2 -->
          <article id="panel-2" class="panel full-screen-panel panel-orange">
            <div class="panel-wrapper">
              <div class="panel-content-grid">
                <div class="panel-image-col">
                  <div class="splash-option-darkening"></div>
                  <div class="splash-option-overlay"></div>
                  <video
                    src="/videos/diorVideo.mp4"
                    class="splash-option-bg"
                    autoplay
                    muted
                    loop
                    playsinline
                    id="panel2-video"
                  ></video>
                  <!-- Video Controls -->
                  <div class="video-controls">
                    <button class="video-control play-pause-btn" id="panel2-play-pause" data-block="button">
                      <span class="button__flair"></span>
                      <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                      </svg>
                      <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" style="display: none;">
                        <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="white"/>
                      </svg>
                    </button>
                    <button class="video-control mute-btn" id="panel2-mute" data-block="button">
                      <span class="button__flair"></span>
                      <svg class="unmuted-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z" fill="white"/>
                      </svg>
                      <svg class="muted-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" style="display: none;">
                        <path d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V10.18L16.45 12.63C16.48 12.43 16.5 12.21 16.5 12ZM19 12C19 12.94 18.8 13.82 18.46 14.64L19.97 16.15C20.63 14.91 21 13.5 21 12C21 7.72 18.01 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12ZM4.27 3L3 4.27L7.73 9H3V15H7L12 20V13.27L16.25 17.52C15.58 18.04 14.83 18.46 14 18.7V20.76C15.38 20.45 16.63 19.82 17.68 18.96L19.73 21L21 19.73L12 10.73L4.27 3ZM12 4L9.91 6.09L12 8.18V4Z" fill="white"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="panel-text-col">
                  <h2 class="panel-title">Calendário do Advento</h2>
                  <p class="panel-description">
                    Uma nova surpresa a cada dia. Celebre a contagem regressiva 
                    para as festas com momentos únicos de beleza.
                  </p>
                  <div class="panels-navigation">
                    <div class="nav-panel" data-sign="minus">
                      <a href="#panel-1" class="anchor-panel" data-block="button">
                        <span class="button__label">Anterior</span>
                        <span class="button__flair"></span>
                      </a>
                    </div>
                    <div class="nav-panel" data-sign="plus">
                      <a href="#panel-3" class="anchor-panel" data-block="button">
                        <span class="button__label">Próximo</span>
                        <span class="button__flair"></span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <!-- Panel 3 -->
          <article id="panel-3" class="panel full-screen-panel panel-purple">
            <div class="panel-wrapper">
              <div class="panel-content-grid">
                <div class="panel-image-col">
                  <img src="/images/Image 2 Dior.jpg" alt="Dior Holiday Panel 3">
                </div>
                <div class="panel-text-col">
                  <h2 class="panel-title">Presentes Exclusivos</h2>
                  <p class="panel-description">
                    Encontre o presente perfeito. Das fragrâncias icônicas aos 
                    acessórios luxuosos, cada peça conta uma história.
                  </p>
                  <div class="panels-navigation">
                    <div class="nav-panel" data-sign="minus">
                      <a href="#panel-2" class="anchor-panel" data-block="button">
                        <span class="button__label">Anterior</span>
                        <span class="button__flair"></span>
                      </a>
                    </div>
                    <div class="nav-panel" data-sign="plus">
                      <a href="#panel-4" class="anchor-panel" data-block="button">
                        <span class="button__label">Próximo</span>
                        <span class="button__flair"></span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
      
      <!-- Nova seção: O desfile encantado de presentes excepcionais -->
      <section class="presentes-section">
        <div class="presentes-container">
          <div class="presentes-header">
            <p class="presentes-label">Exclusivos para as Festas</p>
            <h2 class="presentes-title">O desfile encantado de presentes excepcionais</h2>
            <p class="presentes-subtitle">
              A Dior convida você para seu desfile extraordinário, apresentando as criações<br>
              mais exclusivas em edição limitada, para as celebrações mais<br>
              mágicas e encantadoras.
            </p>
          </div>
          
          <div class="presentes-grid">
            <div class="presente-item">
              <div class="presente-image-wrapper">
                <img src="/images/firtsProduct.webp" alt="Le Cirque des Rêves Dior - edição limitada">
              </div>
              <div class="presente-info">
                <h3 class="presente-name">Le Cirque des Rêves Dior</h3>
                <p class="presente-description">Coffret de fragrâncias - edição limitada</p>
                <div class="presente-intensity">
                  <span class="presente-intensity-label">Intensity</span>
                  <div class="presente-intensity-bars">
                    <span class="presente-intensity-bar filled"></span>
                    <span class="presente-intensity-bar filled"></span>
                    <span class="presente-intensity-bar filled"></span>
                    <span class="presente-intensity-bar filled"></span>
                  </div>
                </div>
                <div class="presente-footer">
                  <p class="presente-price">A partir de R$ 6.450</p>
                  <button class="presente-bag-button" aria-label="Adicionar ao carrinho">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="presente-item">
              <div class="presente-image-wrapper">
                <img src="/images/secondProduct.webp" alt="Coffret de Enfeites Perfumados">
              </div>
              <div class="presente-info">
                <h3 class="presente-name">Coffret de Enfeites Perfumados</h3>
                <p class="presente-description">Decoração perfumada - edição limitada</p>
                <div class="presente-intensity">
                  <span class="presente-intensity-label">Intensity</span>
                  <div class="presente-intensity-bars">
                    <span class="presente-intensity-bar filled"></span>
                    <span class="presente-intensity-bar filled"></span>
                    <span class="presente-intensity-bar filled"></span>
                    <span class="presente-intensity-bar"></span>
                  </div>
                </div>
                <div class="presente-footer">
                  <p class="presente-price">A partir de R$ 3.780</p>
                  <button class="presente-bag-button" aria-label="Adicionar ao carrinho">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="presente-item">
              <div class="presente-image-wrapper">
                <img src="/images/thirtyproduct.webp" alt="Dior Palette Couture - edição limitada">
              </div>
              <div class="presente-info">
                <h3 class="presente-name">Dior Palette Couture</h3>
                <p class="presente-description">Palette de maquiagem - edição limitada</p>
                <div class="presente-intensity">
                  <span class="presente-intensity-label">Intensity</span>
                  <div class="presente-intensity-bars">
                    <span class="presente-intensity-bar filled"></span>
                    <span class="presente-intensity-bar filled"></span>
                    <span class="presente-intensity-bar"></span>
                    <span class="presente-intensity-bar"></span>
                  </div>
                </div>
                <div class="presente-footer">
                  <p class="presente-price">A partir de R$ 990</p>
                  <button class="presente-bag-button" aria-label="Adicionar ao carrinho">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Seção 1: A arte de presentear -->
      <section class="tema-pietro-section tema-pietro-section--first">
        <!-- Imagem de fundo que ocupa toda a seção -->
        <div class="tema-pietro-background">
          <img src="/images/diorpage.png" alt="Tema Pietro Ruffo">
        </div>
        
        <!-- Conteúdo de texto sobreposto na imagem -->
        <div class="tema-pietro-content">
          <h2 class="tema-pietro-title">A arte de presentear</h2>
          <p class="tema-pietro-description"></p>
          
          <!-- Botão com animação GSAP -->
          <a href="#" class="tema-pietro-button" data-block="button" data-route="/arte-de-presentear">
            <span class="button__label">Explorar</span>
            <span class="button__flair"></span>
          </a>
        </div>
      </section>
      
      <!-- Seção 2: A arte de presentear (com espaçamento) -->
      <section class="tema-pietro-section tema-pietro-section--second">
        <!-- Imagem de fundo que ocupa toda a seção -->
        <div class="tema-pietro-background">
          <img src="/images/jadore.png" alt="Tema Pietro Ruffo">
        </div>
        
        <!-- Conteúdo de texto sobreposto na imagem -->
        <div class="tema-pietro-content">
          <h2 class="tema-pietro-title">Para ela</h2>
          <p class="tema-pietro-description">Realize seu desejo.</p>
          
          <!-- Botão com animação GSAP -->
          <a href="#" class="tema-pietro-button" data-block="button">
            <span class="button__label">Explorar</span>
            <span class="button__flair"></span>
          </a>
        </div>
      </section>

      <!-- Seção 2: A arte de presentear (com espaçamento) -->
      <section class="tema-pietro-section tema-pietro-section--second">
        <!-- Imagem de fundo que ocupa toda a seção -->
        <div class="tema-pietro-background">
          <img src="/images/sauvage.png" alt="Tema Pietro Ruffo">
        </div>
        
        <!-- Conteúdo de texto sobreposto na imagem -->
        <div class="tema-pietro-content">
          <h2 class="tema-pietro-title">Para ele</h2>
          <p class="tema-pietro-description">Realize suas fantasias.</p>
          
          <!-- Botão com animação GSAP -->
          <a href="#" class="tema-pietro-button" data-block="button">
            <span class="button__label">Explorar</span>
            <span class="button__flair"></span>
          </a>
        </div>
      </section>
      
      <!-- Nova seção: Parallax Gallery com 3 imagens lado a lado -->
      <section class="parallax-intro">
  <div class="parallax-intro-container">
    <h2 class="parallax-intro-title">Um tema deslumbrante imaginado por Pietro Ruffo</h2>
    <p class="parallax-intro-description">
      Inspirado nas artes circenses, o artista e amigo da Maison, Pietro Ruffo, imaginou um tema deslumbrante: sob a estrela da sorte cintilante de Monsieur Dior, um espetáculo encantado ganha vida em uma paleta cintilante de variações em ouro, prata e rosa.
    </p>
  </div>
</section>
      <section class="parallax-gallery">
        <div class="parallax-panel parallax-panel--1">
          <div class="parallax-column">
            <div class="parallax-image-wrap">
              <img class="parallax-img" src="/images/produto3d.jpg" alt="Dior Collection 1" />
            </div>
            <p class="parallax-product-name">Coffret Miss Dior Eau de Parfum</p>
            <p class="parallax-product-description">Eau de Parfum - edição limitada</p>
            <div class="parallax-intensity">
              <span class="parallax-intensity-label">Intensity</span>
              <div class="parallax-intensity-bars">
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar"></span>
              </div>
            </div>
            <div class="parallax-footer">
              <p class="parallax-price">A partir de R$ 1.235</p>
              <button class="parallax-bag-button" aria-label="Adicionar ao carrinho">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="parallax-panel parallax-panel--2">
          <div class="parallax-column">
            <div class="parallax-image-wrap">
              <img class="parallax-img" src="/images/produto3d2.jpg" alt="Dior Collection 2" />
            </div>
            <p class="parallax-product-name">J'adore Eau de Parfum Coffret</p>
            <p class="parallax-product-description">Coffret com fragrância floral - edição limitada</p>
            <div class="parallax-intensity">
              <span class="parallax-intensity-label">Intensity</span>
              <div class="parallax-intensity-bars">
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar filled"></span>
              </div>
            </div>
            <div class="parallax-footer">
              <p class="parallax-price">A partir de R$ 965</p>
              <button class="parallax-bag-button" aria-label="Adicionar ao carrinho">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="parallax-panel parallax-panel--3">
          <div class="parallax-column">
            <div class="parallax-image-wrap">
              <img class="parallax-img" src="/images/produto3d3.jpg" alt="Dior Collection 3" />
            </div>
            <p class="parallax-product-name">Diorshow Volume & Definition</p>
            <p class="parallax-product-description">Máscara de cílios - edição limitada</p>
            <div class="parallax-intensity">
              <span class="parallax-intensity-label">Intensity</span>
              <div class="parallax-intensity-bars">
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar"></span>
                <span class="parallax-intensity-bar"></span>
              </div>
            </div>
            <div class="parallax-footer">
              <p class="parallax-price">A partir de R$ 530</p>
              <button class="parallax-bag-button" aria-label="Adicionar ao carrinho">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

       <section class="parallax-intro">
  <div class="parallax-intro-container">
  </div>
</section>
      <section class="parallax-gallery">
        <div class="parallax-panel parallax-panel--1">
          <div class="parallax-column">
            <div class="parallax-image-wrap">
              <img class="parallax-img" src="/images/cofre.jpg" alt="Dior Collection 1" />
            </div>
            <p class="parallax-product-name">Coffret Capture Duo</p>
            <p class="parallax-product-description">Cuidado anti-idade - edição limitada</p>
            <div class="parallax-intensity">
              <span class="parallax-intensity-label">Intensity</span>
              <div class="parallax-intensity-bars">
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar filled"></span>
              </div>
            </div>
            <div class="parallax-footer">
              <p class="parallax-price-second">A partir de R$ 1.235</p>
              <button class="parallax-bag-button" aria-label="Adicionar ao carrinho">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="parallax-panel parallax-panel--2">
          <div class="parallax-column">
            <div class="parallax-image-wrap">
              <img class="parallax-img" src="/images/diorhomme.jpg" alt="Dior Collection 2" />
            </div>
            <p class="parallax-product-name">Coffret Dior Homme</p>
            <p class="parallax-product-description">A eau de toilette Dior Homme e o seu travel spray em um único coffret presente de edição limitada</p>
            <div class="parallax-intensity">
              <span class="parallax-intensity-label">Intensity</span>
              <div class="parallax-intensity-bars">
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar"></span>
              </div>
            </div>
            <div class="parallax-footer">
              <p class="parallax-price-second">A partir de R$ 965</p>
              <button class="parallax-bag-button" aria-label="Adicionar ao carrinho">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="parallax-panel parallax-panel--3">
          <div class="parallax-column">
            <div class="parallax-image-wrap">
              <img class="parallax-img" src="/images/diormaster.jpg" alt="Dior Collection 3" />
            </div>
            <p class="parallax-product-name">O Ritual de Brilho Natural</p>
            <p class="parallax-product-description">Kit de maquiagem - edição limitada</p>
            <div class="parallax-intensity">
              <span class="parallax-intensity-label">Intensity</span>
              <div class="parallax-intensity-bars">
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar filled"></span>
                <span class="parallax-intensity-bar"></span>
                <span class="parallax-intensity-bar"></span>
              </div>
            </div>
            <div class="parallax-footer">
              <p class="parallax-price-second">A partir de R$ 530</p>
              <button class="parallax-bag-button" aria-label="Adicionar ao carrinho">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
      
    `;
  }

  initScrollAnimation() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.error("GSAP or ScrollTrigger not loaded");
      return;
    }

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    let panelsSection = this.querySelector("#panels");
    let panelsContainer = this.querySelector("#panels-container");

    if (!panelsSection || !panelsContainer) {
      console.error("Panels elements not found");
      return;
    }

    const panels = gsap.utils.toArray("#panels-container .panel");

    if (panels.length === 0) {
      console.error("No panels found");
      return;
    }

    let tween;

    document.querySelectorAll(".anchor-panel").forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        let targetElem = document.querySelector(e.target.getAttribute("href"));
        let y = targetElem;

        if (targetElem && panelsContainer.isSameNode(targetElem.parentElement)) {
          let totalScroll = tween.scrollTrigger.end - tween.scrollTrigger.start;
          let totalMovement = (panels.length - 1) * targetElem.offsetWidth;
          y = Math.round(
            tween.scrollTrigger.start + (targetElem.offsetLeft / totalMovement) * totalScroll,
          );
        }

        gsap.to(window, {
          scrollTo: {
            y: y,
            autoKill: false,
          },
          duration: 1,
        });
      });
    });

    tween = gsap.to(panels, {
      x: () => -1 * (panelsContainer.scrollWidth - innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: panelsContainer,
        pin: true,
        pinSpacing: true,
        start: "top top",
        scrub: 1,
        end: () => "+=" + (panelsContainer.scrollWidth - innerWidth),
        invalidateOnRefresh: true,
      },
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    });
  }

  initVideoControls() {
    const video = this.querySelector("#panel2-video");
    const playPauseBtn = this.querySelector("#panel2-play-pause");
    const muteBtn = this.querySelector("#panel2-mute");

    if (!video || !playPauseBtn || !muteBtn) return;

    const playIcon = playPauseBtn.querySelector(".play-icon");
    const pauseIcon = playPauseBtn.querySelector(".pause-icon");
    const mutedIcon = muteBtn.querySelector(".muted-icon");
    const unmutedIcon = muteBtn.querySelector(".unmuted-icon");

    playPauseBtn.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
      } else {
        video.pause();
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
      }
    });

    muteBtn.addEventListener("click", () => {
      if (video.muted) {
        video.muted = false;
        mutedIcon.style.display = "none";
        unmutedIcon.style.display = "block";
      } else {
        video.muted = true;
        mutedIcon.style.display = "block";
        unmutedIcon.style.display = "none";
      }
    });

    if (!video.paused) {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    }
  }

  initButtonAnimations() {
    const anchorButtons = this.querySelectorAll(".anchor-panel");

    anchorButtons.forEach((button) => {
      const flair = button.querySelector(".button__flair");
      if (!flair) return;

      button.addEventListener("mouseenter", (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        flair.style.transformOrigin = `${x}px ${y}px`;

        gsap.to(flair, {
          scale: 2.5,
          duration: 0.6,
          ease: "power2.out",
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(flair, {
          scale: 0,
          duration: 0.4,
          ease: "power2.in",
        });
      });
    });

    const videoControls = this.querySelectorAll(".video-control");

    videoControls.forEach((button) => {
      const flair = button.querySelector(".button__flair");
      if (!flair) return;

      button.addEventListener("mouseenter", (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        flair.style.transformOrigin = `${x}px ${y}px`;

        gsap.to(flair, {
          scale: 2,
          duration: 0.5,
          ease: "power2.out",
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(flair, {
          scale: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      });
    });
  }

  initPietroButton() {
    const pietroButtons = this.querySelectorAll(".tema-pietro-button");

    if (pietroButtons.length > 0 && window.Button) {
      pietroButtons.forEach((button) => {
        new window.Button(button);
      });
    }
  }

  initParallaxGallery() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.error("GSAP or ScrollTrigger not loaded for parallax");
      return;
    }

    setTimeout(() => {
      const panels = this.querySelectorAll(".parallax-panel");

      if (panels.length === 0) {
        console.error("No parallax panels found");
        return;
      }

      console.log(`Found ${panels.length} parallax panels`);

      panels.forEach((panel, index) => {
        const image = panel.querySelector(".parallax-img");

        if (image) {
          console.log(`Setting up parallax for panel ${index + 1}`);

          gsap.fromTo(
            image,
            {
              yPercent: -20, // Posição inicial (imagem mais alta)
            },
            {
              yPercent: 15, // Posição final (imagem mais baixa)
              scrollTrigger: {
                trigger: panel,
                scrub: true, // Sincroniza com o scroll
                start: "top bottom", // Inicia quando o topo do painel toca o fundo da tela
                end: "bottom top", // Termina quando o fundo do painel sai do topo da tela
              },
              ease: "none", // Movimento linear para efeito parallax suave
            },
          );
        } else {
          console.error(`No image found in panel ${index + 1}`);
        }
      });

      ScrollTrigger.refresh();
    }, 200);
  }

  initBagButtons() {
    requestAnimationFrame(() => {
      const parallaxBagButtons = this.querySelectorAll(".parallax-bag-button");

      const parallaxProductsData = [
        {
          id: "holiday-1",
          name: "Coffret Miss Dior Eau de Parfum - edição limitada",
          volume: "Kit",
          price: 1235,
          image: "/images/produto3d.jpg",
        },
        {
          id: "holiday-2",
          name: "J'adore Eau de Parfum Coffret - Edição Limitada",
          volume: "Kit",
          price: 965,
          image: "/images/produto3d2.jpg",
        },
        {
          id: "holiday-3",
          name: "Diorshow Volume & Definition - edição limitada",
          volume: "Kit",
          price: 530,
          image: "/images/produto3d3.jpg",
        },
        {
          id: "holiday-4",
          name: "Coffret Capture Duo",
          volume: "Kit",
          price: 1235,
          image: "/images/cofre.jpg",
        },
        {
          id: "holiday-5",
          name: "Coffret Dior Homme - Edição Limitada",
          volume: "Kit",
          price: 965,
          image: "/images/diorhomme.jpg",
        },
        {
          id: "holiday-6",
          name: "O Ritual de Brilho Natural - Edição Limitada",
          volume: "Kit",
          price: 530,
          image: "/images/diormaster.jpg",
        },
      ];

      parallaxBagButtons.forEach((button, index) => {
        const productData = parallaxProductsData[index];
        if (!productData) return;

        button.dataset.productId = productData.id;
        button.dataset.productName = productData.name;
        button.dataset.productVolume = productData.volume;
        button.dataset.productPrice = productData.price;
        button.dataset.productImage = productData.image;

        button.addEventListener("click", (e) => {
          e.preventDefault();
          cartService.addItem({
            id: productData.id,
            name: productData.name,
            volume: productData.volume,
            price: productData.price,
            image: productData.image,
          });
          this.animateButtonFeedback(button);
        });
      });

      const presenteBagButtons = this.querySelectorAll(".presente-bag-button");

      const presenteProductsData = [
        {
          id: "presente-1",
          name: "Le Cirque des Rêves Dior",
          volume: "Kit",
          price: 6450,
          image: "/images/firtsProduct.webp",
        },
        {
          id: "presente-2",
          name: "Coffret de Enfeites Perfumados",
          volume: "Kit",
          price: 3780,
          image: "/images/secondProduct.webp",
        },
        {
          id: "presente-3",
          name: "Dior Palette Couture",
          volume: "Kit",
          price: 990,
          image: "/images/thirtyproduct.webp",
        },
      ];

      presenteBagButtons.forEach((button, index) => {
        const productData = presenteProductsData[index];
        if (!productData) return;

        button.dataset.productId = productData.id;
        button.dataset.productName = productData.name;
        button.dataset.productVolume = productData.volume;
        button.dataset.productPrice = productData.price;
        button.dataset.productImage = productData.image;

        button.addEventListener("click", (e) => {
          e.preventDefault();

          cartService.addItem({
            id: productData.id,
            name: productData.name,
            volume: productData.volume,
            price: productData.price,
            image: productData.image,
          });

          this.animateButtonFeedback(button);
        });
      });
    });
  }

  animateButtonFeedback(button) {
    if (!window.gsap) return;

    window.gsap
      .timeline()
      .to(button, {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.in",
      })
      .to(button, {
        scale: 1.1,
        duration: 0.2,
        ease: "back.out(2)",
      })
      .to(button, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });

    const originalSVG = button.innerHTML;
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    setTimeout(() => {
      button.innerHTML = originalSVG;
    }, 1000);
  }

  disconnectedCallback() {
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger && this.contains(trigger.vars.trigger)) {
        trigger.kill();
      }
    });
  }
}

customElements.define("horizontal-scroll-section", HorizontalScrollSection);
