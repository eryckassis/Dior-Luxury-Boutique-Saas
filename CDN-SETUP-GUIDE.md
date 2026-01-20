# Guia de Configuração do CDN Gratuito

Este guia explica como configurar um CDN gratuito para hospedar vídeos grandes (acima de 100MB) que excedem o limite do Vercel.

## Opção 1: Cloudflare R2 (RECOMENDADO) ⭐

**Gratuito:** 10GB armazenamento + 10 milhões requests/mês

### Passo 1: Criar conta no Cloudflare
1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. Crie uma conta gratuita
3. No menu lateral, clique em **R2 Object Storage**

### Passo 2: Criar um Bucket
1. Clique em **Create bucket**
2. Nome: `dior-media` (ou outro nome)
3. Região: Escolha a mais próxima dos seus usuários

### Passo 3: Configurar Acesso Público
1. Vá em **Settings** do bucket
2. Em **Public access**, clique em **Allow Access**
3. Copie a URL pública (ex: `https://pub-abc123.r2.dev`)

### Passo 4: Upload dos Vídeos
**Via Dashboard:**
1. Clique no bucket
2. Arraste os vídeos da pasta `public/videos/`

**Via CLI (wrangler):**
```bash
npm install -g wrangler
wrangler login
wrangler r2 object put dior-media/diorVideo.mp4 --file=./public/videos/diorVideo.mp4
```

### Passo 5: Configurar no Projeto
Edite `src/config/cdn.js`:
```javascript
const CDN_CONFIG = {
  enabled: true,
  baseUrl: 'https://pub-SEU-ID.r2.dev',
  localPath: '/videos/',
};
```

---

## Opção 2: Cloudinary

**Gratuito:** 25GB armazenamento + transformações

### Passo 1: Criar conta
1. Acesse [cloudinary.com](https://cloudinary.com)
2. Crie uma conta gratuita
3. Anote seu **Cloud Name** no dashboard

### Passo 2: Upload dos Vídeos
1. Vá em **Media Library**
2. Crie uma pasta `videos`
3. Faça upload dos vídeos

### Passo 3: Configurar no Projeto
```javascript
const CDN_CONFIG = {
  enabled: true,
  baseUrl: 'https://res.cloudinary.com/SEU-CLOUD-NAME/video/upload/v1',
  localPath: '/videos/',
};
```

**Vantagem:** Cloudinary oferece otimização automática de vídeo!

---

## Opção 3: Backblaze B2 + Cloudflare

**Gratuito:** 10GB + bandwidth grátis via Cloudflare

### Configuração:
1. Crie conta em [backblaze.com](https://www.backblaze.com/b2)
2. Crie um bucket público
3. Conecte com Cloudflare CDN (bandwidth grátis)

---

## Opção 4: GitHub Releases (Simples)

**Gratuito:** 2GB por arquivo, bandwidth ilimitado

### Passo 1: Criar Release
1. Vá no seu repositório GitHub
2. Clique em **Releases** > **Create new release**
3. Anexe os vídeos como assets

### Passo 2: Usar URL direta
```javascript
const CDN_CONFIG = {
  enabled: true,
  baseUrl: 'https://github.com/eryckassis/Dior-Luxury-Boutique-Saas/releases/download/v1.0',
  localPath: '/videos/',
};
```

---

## Usando o CDN no Código

### Importar a função helper:
```javascript
import { getVideoUrl } from '../config/cdn.js';

// Antes (local):
<video src="/videos/diorVideo.mp4" />

// Depois (CDN):
<video src={getVideoUrl('diorVideo.mp4')} />
```

### Exemplo de componente:
```javascript
import { getVideoUrl } from '../config/cdn.js';

function VideoPlayer({ filename }) {
  return (
    <video 
      src={getVideoUrl(filename)}
      autoPlay 
      muted 
      loop 
      playsInline
    />
  );
}
```

---

## Script para Verificar Tamanhos

Execute para ver quais vídeos precisam ir para o CDN:

```bash
node scripts/check-video-sizes.js
```

---

## Checklist de Migração

- [ ] Criar conta no CDN escolhido
- [ ] Fazer upload de todos os vídeos
- [ ] Atualizar `src/config/cdn.js` com a URL do CDN
- [ ] Definir `enabled: true`
- [ ] Testar localmente
- [ ] Remover vídeos grandes de `public/videos/`
- [ ] Fazer deploy no Vercel

---

## Comparação dos CDNs

| CDN | Armazenamento Grátis | Bandwidth | Dificuldade |
|-----|---------------------|-----------|-------------|
| Cloudflare R2 | 10GB | 10M req/mês | Média |
| Cloudinary | 25GB | 25GB/mês | Fácil |
| Backblaze B2 | 10GB | Grátis c/ CF | Média |
| GitHub Releases | Ilimitado | Ilimitado | Fácil |

---

## Suporte

Se tiver dúvidas, consulte:
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
