/**
 * CDN Configuration for Large Media Files
 *
 * Opções de CDN gratuitos:
 * 1. Cloudflare R2 - 10GB grátis/mês (RECOMENDADO)
 * 2. Cloudinary - 25GB grátis
 * 3. Bunny CDN - 14 dias trial
 * 4. Backblaze B2 + Cloudflare - 10GB grátis
 */

// Configuração do CDN - Altere para sua URL do R2/Cloudinary
const CDN_CONFIG = {
  // Defina como true quando os vídeos estiverem no CDN
  enabled: true,

  // URL base do seu CDN (ex: Cloudflare R2 public bucket)
  // Cloudflare R2: https://pub-XXXXXX.r2.dev
  // Cloudinary: https://res.cloudinary.com/seu-cloud-name/video/upload
  baseUrl:
    "https://github.com/user-attachments/assets/fc44ae85-3175-4228-81bd-8285b65878b2",

  // Fallback para arquivos locais quando CDN não está configurado
  localPath: "/videos/",
};

/**
 * Retorna a URL do vídeo (CDN ou local)
 * @param {string} filename - Nome do arquivo de vídeo
 * @returns {string} URL completa do vídeo
 */
export function getVideoUrl(filename) {
  if (CDN_CONFIG.enabled && CDN_CONFIG.baseUrl) {
    return `${CDN_CONFIG.baseUrl}/${filename}`;
  }
  return `${CDN_CONFIG.localPath}${filename}`;
}

/**
 * Retorna a URL da imagem (CDN ou local)
 * @param {string} filename - Nome do arquivo de imagem
 * @returns {string} URL completa da imagem
 */
export function getImageUrl(filename) {
  if (CDN_CONFIG.enabled && CDN_CONFIG.baseUrl) {
    return `${CDN_CONFIG.baseUrl}/images/${filename}`;
  }
  return `/images/${filename}`;
}

/**
 * Lista de vídeos grandes para migrar para o CDN
 * Execute: node scripts/check-video-sizes.js para ver os tamanhos
 */
export const LARGE_VIDEOS = [
  "aArteDePresentear.mp4",
  "Anya.mp4",
  "bolsinhas.mp4",
  "book.webm",
  "desfile.webm",
  "diorama.mp4",
  "diorRivera.mp4",
  "diorVerao.mp4",
  "diorVerao2.mp4",
  "diorVideo.mp4",
  "diorvideopresente.mp4",
  "get.mp4",
  "grisDior.mp4",
  "lady.mp4",
  "Letter.mp4",
  "love.mp4",
  "midior.mp4",
  "missdiorvideo.mp4",
  "missdiorvideo2.mp4",
  "rivera.mp4",
  "videoLips.mp4",
  "videomoda.mp4",
];

export default CDN_CONFIG;
