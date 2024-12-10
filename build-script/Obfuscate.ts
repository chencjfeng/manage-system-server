/**
 * @Author: ChenJF
 * @Date: 2024/2/7 09:37
 * @Description: 混淆代码
 */
import fs from "fs";
import JavaScriptObfuscator from 'javascript-obfuscator';
import path from "path";

function obfuscateFile(filePath) {
  const input = fs.readFileSync(filePath, 'utf8');
  const obfuscationResult = JavaScriptObfuscator.obfuscate(input, {
    compact: true,
    controlFlowFlattening: false, // false，可以打印log的文件名
  });

  const obfuscatedCode = obfuscationResult.getObfuscatedCode();
  fs.writeFileSync(filePath, obfuscatedCode, 'utf8');
}

function obfuscateDirectory(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });

  files.forEach((file) => {
    const fullPath = path.join(directory, file.name);
    if (file.isFile() && path.extname(file.name) === '.js') {
      obfuscateFile(fullPath);
      console.log(`File obfuscated: ${fullPath}`);
    } else if (file.isDirectory()) {
      obfuscateDirectory(fullPath);
    }
  });
}

const distDirectory = path.join(__dirname, '../dist');
obfuscateDirectory(distDirectory);
