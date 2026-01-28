import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import postcss from "postcss";
import stripInlineComments from "postcss-strip-inline-comments";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileTypes = {
  javascript: [".js", ".jsx", ".mjs"],
  css: [".css"],
  html: [".html"],
  json: [".json"],
};

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

const ignoreFiles = [
  ".prettierrc",
  ".gitignore",
  "package.json",
  "package-lock.json",
  "vite.config.js",
  "README.md",
];

function shouldIgnoreFolder(folderPath) {
  return ignoreFolders.some((ignore) => folderPath.includes(ignore));
}

function shouldIgnoreFile(filePath) {
  const fileName = path.basename(filePath);
  return ignoreFiles.includes(fileName);
}

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

function removeJSComments(content) {
  content = content.replace(/^\s*\/\/.*$/gm, "");

  content = content.replace(/\/\*[\s\S]*?\*\//g, "");

  content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

  return content.trim();
}

async function removeCSSComments(content) {
  try {
    const result = await postcss([stripInlineComments]).process(content, { from: undefined });

    let processed = result.css.replace(/\/\*[\s\S]*?\*\//g, "");

    processed = processed.replace(/\n\s*\n\s*\n/g, "\n\n");

    return processed.trim();
  } catch (error) {
    let processed = content.replace(/\/\*[\s\S]*?\*\//g, "");
    processed = processed.replace(/\n\s*\n\s*\n/g, "\n\n");
    return processed.trim();
  }
}

function removeHTMLComments(content) {
  content = content.replace(/<!--(?!\[if)[\s\S]*?(?<!\[endif\])-->/g, "");

  content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

  return content.trim();
}

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

      if (fileTypes.javascript.includes(ext)) {
        content = removeJSComments(content);
        shouldProcess = true;
      } else if (fileTypes.css.includes(ext)) {
        content = await removeCSSComments(content);
        shouldProcess = true;
      } else if (fileTypes.html.includes(ext)) {
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

removeCommentsFromProject().catch(console.error);
