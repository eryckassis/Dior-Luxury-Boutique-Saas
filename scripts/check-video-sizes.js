/**
 * Script para verificar tamanhos dos vídeos
 * Execute: node scripts/check-video-sizes.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videosDir = path.join(__dirname, '..', 'public', 'videos');
const VERCEL_LIMIT_MB = 100;

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function checkVideoSizes() {
  console.log('\n📹 Verificando tamanhos dos vídeos...\n');
  console.log('=' .repeat(60));
  
  if (!fs.existsSync(videosDir)) {
    console.log('❌ Pasta de vídeos não encontrada:', videosDir);
    return;
  }

  const files = fs.readdirSync(videosDir);
  const videoFiles = files.filter(f => 
    f.endsWith('.mp4') || f.endsWith('.webm') || f.endsWith('.mov')
  );

  let totalSize = 0;
  const oversizedFiles = [];
  const safeFiles = [];

  videoFiles.forEach(file => {
    const filePath = path.join(videosDir, file);
    const stats = fs.statSync(filePath);
    const sizeMB = stats.size / (1024 * 1024);
    totalSize += stats.size;

    if (sizeMB > VERCEL_LIMIT_MB) {
      oversizedFiles.push({ name: file, size: stats.size, sizeMB });
    } else {
      safeFiles.push({ name: file, size: stats.size, sizeMB });
    }
  });

  // Mostrar arquivos que excedem o limite
  if (oversizedFiles.length > 0) {
    console.log('\n🚨 ARQUIVOS ACIMA DE 100MB (precisam ir para CDN):\n');
    oversizedFiles
      .sort((a, b) => b.size - a.size)
      .forEach(f => {
        console.log(`   ❌ ${f.name.padEnd(30)} ${formatBytes(f.size).padStart(10)}`);
      });
  }

  // Mostrar arquivos seguros
  if (safeFiles.length > 0) {
    console.log('\n✅ ARQUIVOS ABAIXO DE 100MB (podem ficar no Vercel):\n');
    safeFiles
      .sort((a, b) => b.size - a.size)
      .forEach(f => {
        console.log(`   ✓ ${f.name.padEnd(30)} ${formatBytes(f.size).padStart(10)}`);
      });
  }

  console.log('\n' + '=' .repeat(60));
  console.log(`\n📊 RESUMO:`);
  console.log(`   Total de vídeos: ${videoFiles.length}`);
  console.log(`   Tamanho total: ${formatBytes(totalSize)}`);
  console.log(`   Acima de 100MB: ${oversizedFiles.length}`);
  console.log(`   Abaixo de 100MB: ${safeFiles.length}`);

  if (oversizedFiles.length > 0) {
    console.log(`\n💡 RECOMENDAÇÃO:`);
    console.log(`   Mova os ${oversizedFiles.length} arquivo(s) acima para um CDN externo.`);
    console.log(`   Consulte: CDN-SETUP-GUIDE.md\n`);
  } else {
    console.log(`\n🎉 Todos os vídeos estão dentro do limite do Vercel!\n`);
  }
}

checkVideoSizes();
