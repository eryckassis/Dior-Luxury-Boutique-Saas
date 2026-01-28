import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import stripJsonComments from "strip-json-comments";
import postcss from "postcss";
import stripInlineComments from "postcss-strip-inline-comments";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração dos tipos de arquivo e suas extensões
const fileTypes = {
  javascript: [".js", ".jsx", ".mjs"],
  css: [".css"],
  html: [".html"],
  json: [".json"],
};

// Pastas para ignorar
const ignoreFolders = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  ".vscode",
  ".husky",
];

// Arquivos específicos para ignorar
const ignoreFiles = [
  ".prettierrc",
  ".gitignore",
  "package.json",
  "package-lock.json",
  "vite.config.js",
  "README.md",
];

// Função para verificar se deve ignorar a pasta
function shouldIgnoreFolder(folderPath) {
  return ignoreFolders.some((ignore) => folderPath.includes(ignore));
}

// Função para verificar se deve ignorar o arquivo
function shouldIgnoreFile(filePath) {
  const fileName = path.basename(filePath);
  return ignoreFiles.includes(fileName);
}

// Função para obter todos os arquivos recursivamente
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (!shouldIgnoreFolder(filePath)) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else {
      if (!shouldIgnoreFile(filePath)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

// Função para remover comentários de JavaScript
function removeJSComments(content) {
  // Remove comentários de linha única //
  content = content.replace(/^\s*\/\/.*$/gm, "");

  // Remove comentários de bloco /* */
  content = content.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove linhas vazias excessivas mas preserva estrutura
  content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

  return content.trim();
}

// Função para remover comentários de CSS
async function removeCSSComments(content) {
  try {
    const result = await postcss([stripInlineComments]).process(content, { from: undefined });

    // Remove comentários de bloco adicionais
    let processed = result.css.replace(/\/\*[\s\S]*?\*\//g, "");

    // Remove linhas vazias excessivas
    processed = processed.replace(/\n\s*\n\s*\n/g, "\n\n");

    return processed.trim();
  } catch (error) {
    // Fallback manual se PostCSS falhar
    let processed = content.replace(/\/\*[\s\S]*?\*\//g, "");
    processed = processed.replace(/\n\s*\n\s*\n/g, "\n\n");
    return processed.trim();
  }
}

// Função para remover comentários de HTML
function removeHTMLComments(content) {
  // Remove comentários HTML <!-- --> mas preserva comentários condicionais do IE
  content = content.replace(/<!--(?!\[if)[\s\S]*?(?<!\[endif\])-->/g, "");

  // Remove linhas vazias excessivas
  content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

  return content.trim();
}

// Função principal
async function removeCommentsFromProject() {
  const projectRoot = path.join(__dirname, "..");
  const allFiles = getAllFiles(projectRoot);

  let processedFiles = 0;
  let skippedFiles = 0;

  console.log("🚀 Iniciando remoção de comentários...\n");

  for (const filePath of allFiles) {
    const ext = path.extname(filePath).toLowerCase();
    const relativePath = path.relative(projectRoot, filePath);

    try {
      let shouldProcess = false;
      let content = fs.readFileSync(filePath, "utf8");
      let originalContent = content;

      // Processar JavaScript
      if (fileTypes.javascript.includes(ext)) {
        content = removeJSComments(content);
        shouldProcess = true;
      }

      // Processar CSS
      else if (fileTypes.css.includes(ext)) {
        content = await removeCSSComments(content);
        shouldProcess = true;
      }

      // Processar HTML
      else if (fileTypes.html.includes(ext)) {
        content = removeHTMLComments(content);
        shouldProcess = true;
      }

      if (shouldProcess && content !== originalContent && content.length > 0) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`✅ Processado: ${relativePath}`);
        processedFiles++;
      } else {
        skippedFiles++;
      }
    } catch (error) {
      console.error(`❌ Erro ao processar ${relativePath}:`, error.message);
      skippedFiles++;
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`   • Arquivos processados: ${processedFiles}`);
  console.log(`   • Arquivos ignorados: ${skippedFiles}`);
  console.log(`\n🎉 Remoção de comentários concluída!`);
  console.log(`\n🔧 Execute 'npm run format' para aplicar formatação do Prettier`);
}

// Executar script
removeCommentsFromProject().catch(console.error);
