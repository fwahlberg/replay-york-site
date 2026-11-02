// One-time setup: makes the website's existing public images visible in the editor.
// Run from studio/: sanity exec ../cms/seed-assets.mjs --with-user-token
import {createReadStream} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {getCliClient} from 'sanity/cli';
const client=getCliClient({apiVersion:'2025-02-19'});
const document=await client.getDocument('website');
if (!document) throw new Error('Seed the website document first.');
const draft=await client.getDocument('drafts.website');
const groups=[
  {file:'dancefloor.jpg',fields:['hero.photo','story.photo','nights.celebration.photo']},
  {file:'party.jpg',fields:['nights.first.photo']},
  {file:'replay-brand.jpg',fields:['nights.second.photo','seo.shareImage']},
];
const additions={};
for (const group of groups) {
  const missing=group.fields.filter(path=>!path.split('.').reduce((v,k)=>v?.[k],document)?.asset?._ref);
  if (!missing.length) continue;
  const asset=await client.assets.upload('image',createReadStream(fileURLToPath(new URL(`../dist/assets/${group.file}`,import.meta.url))),{filename:group.file});
  for (const path of missing) additions[path]={_type:'image',asset:{_type:'reference',_ref:asset._id}};
}
if (Object.keys(additions).length) {
  const transaction=client.transaction().patch('website',p=>p.setIfMissing(additions));
  // Add previews without publishing or overwriting existing draft content.
  if (draft) transaction.patch('drafts.website',p=>p.setIfMissing(additions));
  await transaction.commit();
}
console.log(`Initial image setup complete (${Object.keys(additions).length} image fields).`);
