import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve } from 'node:path';

const distRoot = resolve('docs/.vitepress/dist');
const configuredBase = process.env.VITEPRESS_BASE || '/';
const normalizedBase = '/' + configuredBase.replace(/^\/+|\/+$/g, '') + '/';

if (!existsSync(distRoot)) {
  console.error('Build não encontrado. Execute npm run build antes de check:links.');
  process.exit(1);
}

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const entry = join(directory, name);
    return statSync(entry).isDirectory() ? walk(entry) : [entry];
  });
}

function stripBase(reference) {
  if (!reference.startsWith('/')) {
    return reference;
  }

  if (normalizedBase === '//') {
    return reference.slice(1);
  }

  if (reference === normalizedBase.slice(0, -1)) {
    return '';
  }

  if (reference.startsWith(normalizedBase)) {
    return reference.slice(normalizedBase.length);
  }

  return reference.slice(1);
}

function candidatePaths(htmlFile, reference) {
  const withoutSuffix = reference.split('#')[0].split('?')[0];
  const decoded = decodeURIComponent(withoutSuffix);
  const target = decoded.startsWith('/')
    ? resolve(distRoot, stripBase(decoded))
    : resolve(dirname(htmlFile), decoded);

  if (extname(target)) {
    return [target];
  }

  return [target, target + '.html', join(target, 'index.html')];
}

const htmlFiles = walk(distRoot).filter((file) => file.endsWith('.html'));
const problems = [];
const referencePattern = /(?:href|src)=["']([^"']+)["']/g;
const optionalMediaPattern = /^\/(?:screenshots\/[a-z0-9-]+\.png|videos\/[a-z0-9-]+\.webm)$/;

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8');
  let match;

  while ((match = referencePattern.exec(html)) !== null) {
    const reference = match[1];

    if (
      !reference
      || reference.startsWith('#')
      || /^(?:https?:|mailto:|tel:|data:|javascript:)/.test(reference)
    ) {
      continue;
    }

    const normalizedReference = reference.startsWith(normalizedBase)
      ? '/' + reference.slice(normalizedBase.length)
      : reference;

    if (optionalMediaPattern.test(normalizedReference)) {
      continue;
    }

    const candidates = candidatePaths(htmlFile, reference).map((item) => normalize(item));

    if (!candidates.some((candidate) => existsSync(candidate))) {
      problems.push({
        page: htmlFile.slice(distRoot.length + 1),
        reference,
      });
    }
  }
}

if (problems.length > 0) {
  console.error('Referências locais não resolvidas:');
  for (const problem of problems) {
    console.error('- ' + problem.page + ' -> ' + problem.reference);
  }
  process.exit(1);
}

console.log('Links e assets locais verificados em ' + htmlFiles.length + ' páginas HTML.');
