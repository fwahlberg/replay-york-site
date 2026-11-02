import {readFile,writeFile} from 'node:fs/promises';
const path = new URL('../public/admin/index.html',import.meta.url);
const html = await readFile(path,'utf8');
await writeFile(path,html.replace('<title>Sanity Studio</title>','<title>Replay York — Website editor</title>')
  .replaceAll('href="/static/', 'href="/admin/static/'));
