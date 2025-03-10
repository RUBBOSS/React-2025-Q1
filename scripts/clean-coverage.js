import fs from 'fs';
import path from 'path';

const coverageDir = path.join(__dirname, '..', 'coverage');

function removeEslintDisable(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/\/\* eslint-disable \*\/\n?/g, '');
    fs.writeFileSync(filePath, content);
  }
}

removeEslintDisable(path.join(coverageDir, 'block-navigation.js'));
removeEslintDisable(path.join(coverageDir, 'sorter.js'));
