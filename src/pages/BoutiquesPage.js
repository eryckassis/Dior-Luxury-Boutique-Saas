// ============================================================================
// BOUTIQUES PAGE - Página de localização das boutiques Dior
// ============================================================================

import "../components/AppNavigation.js";
import "../components/FooterSection.js";
import "../styles/boutiques.css";

// Dados das boutiques Dior em São Paulo (dados reais)
const DIOR_BOUTIQUES = [
  {
    id: 1,
    name: "DIOR São Paulo Jardim Shoppes",
    type: "Boutique Dior",
    address: "Rua Haddock Lobo 1644 – L01, Cerqueira César",
    city: "São Paulo",
    state: "Sergipe",
    cep: "01414-002",
    lat: -23.5629,
    lng: -46.6689,
    phone: "+55 11 3081-8686",
    hours: {
      open: "10:00",
      close: "22:00",
    },
    categories: ["Moda feminina", "Moda masculina", "Joalheria"],
    services: ["Boutique Dior"],
  },
  {
    id: 2,
    name: "DIOR São Paulo Cidade Jardim",
    type: "Boutique Dior",
    address: "Avenida Magalhães De Castro, 12000, Jardim Panorama",
    city: "São Paulo São Paulo",
    cep: "05502-001",
    lat: -23.6005,
    lng: -46.7105,
    phone: "+55 11 3552-7000",
    hours: {
      open: "10:00",
      close: "22:00",
    },
    categories: ["Moda feminina", "Moda masculina", "Joalheria"],
    services: ["Boutique Dior"],
  },
];

// Tipos de filtros
const FILTER_TYPES = [
  { id: "boutique", name: "Boutique Dior", icon: "CD" },
  { id: "restaurante", name: "Restaurante e Café Dior", icon: "CD" },
  { id: "galeria", name: "Galeria Dior", icon: "⊕" },
  { id: "spa", name: "Spa Dior", icon: "◎" },
  { id: "varejista", name: "Varejista Dior", icon: "◯" },
];

export class BoutiquesPage extends HTMLElement {
  constructor() {
    super();
    this.map = null;
    this.markers = [];
    this.activeFilters = ["boutique"];
    this.searchQuery = "";
  }

  connectedCallback() {
    this.render();
    this.loadGoogleMaps();
    this.initEventListeners();
  }

  render() {
    this.innerHTML = `
      <app-navigation></app-navigation>
      
      <main class="boutiques-page">
        <div class="boutiques-container">
          <!-- Lado Esquerdo - Lista de Lojas -->
          <aside class="boutiques-sidebar">
            <!-- Botão Voltar -->
            <div class="boutiques-header">
              <button class="boutiques-back-btn" data-route="/">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Voltar</span>
              </button>
            </div>
            
            <!-- Campo de Busca -->
            <div class="boutiques-search">
              <input 
                type="text" 
                class="boutiques-search-input" 
                placeholder="Pesquisar por endereço, cidade, código postal..."
                id="boutiques-search"
              />
              <button class="boutiques-location-btn" title="Usar minha localização">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            
            <!-- Filtros -->
            <div class="boutiques-filters">
              <button class="boutiques-filter-toggle">
                <span>Filtro</span>
              </button>
              <span class="boutiques-filter-divider">|</span>
              <div class="boutiques-filter-tags">
                ${FILTER_TYPES.map(
                  (filter) => `
                  <button class="boutiques-filter-tag ${
                    filter.id === "boutique" ? "active" : ""
                  }" data-filter="${filter.id}">
                    <span class="filter-icon">${filter.icon}</span>
                    <span>${filter.name}</span>
                  </button>
                `
                ).join("")}
              </div>
            </div>
            
            <!-- Contador de Endereços -->
            <div class="boutiques-count">
              <span id="boutiques-count-number">${
                DIOR_BOUTIQUES.length
              }</span> ENDEREÇOS PRÓXIMOS
            </div>
            
            <!-- Lista de Boutiques -->
            <div class="boutiques-list" id="boutiques-list">
              ${this.renderBoutiquesList(DIOR_BOUTIQUES)}
            </div>
          </aside>
          
          <!-- Lado Direito - Mapa -->
          <div class="boutiques-map-container">
            <div class="boutiques-map" id="boutiques-map">
              <!-- Google Maps será inserido aqui -->
              <div class="map-loading">
                <div class="map-loading-spinner"></div>
                <p>Carregando mapa...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer-section></footer-section>
    `;
  }

  renderBoutiquesList(boutiques) {
    if (boutiques.length === 0) {
      return `
        <div class="boutiques-empty">
          <p>Nenhuma boutique encontrada com os filtros selecionados.</p>
        </div>
      `;
    }

    return boutiques
      .map(
        (boutique) => `
      <article class="boutique-card" data-boutique-id="${boutique.id}">
        <div class="boutique-card-header">
          <div class="boutique-info">
            <h3 class="boutique-name">${boutique.name}</h3>
            <span class="boutique-type">${boutique.type}</span>
          </div>
          <div class="boutique-status">
            <span class="status-dot"></span>
            <span class="status-text">Aberto agora - Fecha às ${
              boutique.hours.close
            }</span>
          </div>
        </div>
        
        <div class="boutique-address">
          <p>${boutique.address}, ${boutique.city} ${boutique.cep}</p>
        </div>
        
        <div class="boutique-categories">
          ${boutique.categories
            .map(
              (cat, index) => `
            <span class="boutique-category">${cat}</span>
            ${
              index < boutique.categories.length - 1
                ? '<span class="category-separator">·</span>'
                : ""
            }
          `
            )
            .join("")}
          ${
            boutique.categories.length > 3
              ? `<a href="#" class="boutique-more-link">Mais 1</a>`
              : ""
          }
        </div>
      </article>
    `
      )
      .join("");
  }

  async loadGoogleMaps() {
    // Verifica se já existe a API carregada
    if (window.google && window.google.maps) {
      this.initMap();
      return;
    }

    // Cria o script do Google Maps
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBVJWaOUZWfNI1T5BqxQqCTz4e4rJLVeJY&callback=initBoutiquesMap`;
    script.async = true;
    script.defer = true;

    // Callback global para quando o Maps carregar
    window.initBoutiquesMap = () => {
      this.initMap();
    };

    document.head.appendChild(script);
  }

  initMap() {
    const mapContainer = document.getElementById("boutiques-map");
    if (!mapContainer) return;

    // Remove loading
    const loading = mapContainer.querySelector(".map-loading");
    if (loading) loading.remove();

    // Centro em São Paulo
    const center = { lat: -23.5829, lng: -46.6889 };

    // Cria o mapa com estilo clean
    this.map = new google.maps.Map(mapContainer, {
      center: center,
      zoom: 13,
      styles: this.getMapStyles(),
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },
    });

    // Adiciona marcadores
    this.addMarkers();
  }

  getMapStyles() {
    // Estilo clean e elegante para o mapa
    return [
      {
        featureType: "all",
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }],
      },
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#616161" }],
      },
      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#f5f5f5" }],
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [{ color: "#bdbdbd" }],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#eeeeee" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#757575" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#e5e5e5" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.text.fill",
        stylers: [{ color: "#757575" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#dadada" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#616161" }],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }],
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [{ color: "#e5e5e5" }],
      },
      {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [{ color: "#eeeeee" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#c9c9c9" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }],
      },
    ];
  }

  addMarkers() {
    // Remove marcadores existentes
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];

    // Cria marcador customizado Dior
    const markerIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#1a1a1a",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeWeight: 2,
      scale: 12,
    };

    DIOR_BOUTIQUES.forEach((boutique) => {
      // Cria marcador com label "CD"
      const marker = new google.maps.Marker({
        position: { lat: boutique.lat, lng: boutique.lng },
        map: this.map,
        title: boutique.name,
        icon: markerIcon,
        label: {
          text: "CD",
          color: "#ffffff",
          fontSize: "9px",
          fontWeight: "bold",
          fontFamily: "Hellix, sans-serif",
        },
      });

      // InfoWindow ao clicar
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; font-family: Hellix, sans-serif;">
            <h4 style="margin: 0 0 5px; font-size: 14px;">${boutique.name}</h4>
            <p style="margin: 0; color: #666; font-size: 12px;">${boutique.address}</p>
            <p style="margin: 5px 0 0; color: #666; font-size: 12px;">${boutique.city} ${boutique.cep}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(this.map, marker);
      });

      this.markers.push(marker);
    });

    // Ajusta o zoom para mostrar todos os marcadores
    if (this.markers.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach((marker) => bounds.extend(marker.getPosition()));
      this.map.fitBounds(bounds, { padding: 50 });
    }
  }

  initEventListeners() {
    // Busca
    const searchInput = document.getElementById("boutiques-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.filterBoutiques();
      });
    }

    // Filtros
    const filterTags = this.querySelectorAll(".boutiques-filter-tag");
    filterTags.forEach((tag) => {
      tag.addEventListener("click", () => {
        tag.classList.toggle("active");
        const filterId = tag.dataset.filter;

        if (this.activeFilters.includes(filterId)) {
          this.activeFilters = this.activeFilters.filter((f) => f !== filterId);
        } else {
          this.activeFilters.push(filterId);
        }

        this.filterBoutiques();
      });
    });

    // Botão de localização
    const locationBtn = this.querySelector(".boutiques-location-btn");
    if (locationBtn) {
      locationBtn.addEventListener("click", () => this.getUserLocation());
    }

    // Clique nos cards das boutiques
    const boutiqueCards = this.querySelectorAll(".boutique-card");
    boutiqueCards.forEach((card) => {
      card.addEventListener("click", () => {
        const boutiqueId = parseInt(card.dataset.boutiqueId);
        this.focusBoutique(boutiqueId);
      });
    });
  }

  filterBoutiques() {
    let filtered = DIOR_BOUTIQUES;

    // Filtra por busca
    if (this.searchQuery) {
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(this.searchQuery) ||
          b.address.toLowerCase().includes(this.searchQuery) ||
          b.city.toLowerCase().includes(this.searchQuery) ||
          b.cep.includes(this.searchQuery)
      );
    }

    // Atualiza a lista
    const listContainer = document.getElementById("boutiques-list");
    const countElement = document.getElementById("boutiques-count-number");

    if (listContainer) {
      listContainer.innerHTML = this.renderBoutiquesList(filtered);

      // Re-adiciona event listeners nos novos cards
      const newCards = listContainer.querySelectorAll(".boutique-card");
      newCards.forEach((card) => {
        card.addEventListener("click", () => {
          const boutiqueId = parseInt(card.dataset.boutiqueId);
          this.focusBoutique(boutiqueId);
        });
      });
    }

    if (countElement) {
      countElement.textContent = filtered.length;
    }
  }

  focusBoutique(boutiqueId) {
    const boutique = DIOR_BOUTIQUES.find((b) => b.id === boutiqueId);
    if (!boutique || !this.map) return;

    // Centraliza o mapa na boutique
    this.map.setCenter({ lat: boutique.lat, lng: boutique.lng });
    this.map.setZoom(16);

    // Encontra e abre o InfoWindow do marcador correspondente
    const markerIndex = DIOR_BOUTIQUES.findIndex((b) => b.id === boutiqueId);
    if (markerIndex >= 0 && this.markers[markerIndex]) {
      google.maps.event.trigger(this.markers[markerIndex], "click");
    }

    // Destaca o card
    const cards = this.querySelectorAll(".boutique-card");
    cards.forEach((card) => card.classList.remove("active"));

    const activeCard = this.querySelector(`[data-boutique-id="${boutiqueId}"]`);
    if (activeCard) {
      activeCard.classList.add("active");
    }
  }

  getUserLocation() {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (this.map) {
          this.map.setCenter(userLocation);
          this.map.setZoom(14);

          // Adiciona marcador da localização do usuário
          new google.maps.Marker({
            position: userLocation,
            map: this.map,
            title: "Sua localização",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#4285f4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
              scale: 8,
            },
          });
        }
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        alert("Não foi possível obter sua localização.");
      }
    );
  }

  disconnectedCallback() {
    // Cleanup
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];
  }
}

customElements.define("boutiques-page", BoutiquesPage);
