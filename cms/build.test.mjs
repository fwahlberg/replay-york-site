import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {load} from 'cheerio';

test('published content renders safely, keeps tracked links and fails without replacing a good build', async () => {
  const output = new URL('../dist/index.html',import.meta.url);
  const original = await readFile(output,'utf8');
  const directory = await mkdtemp(join(tmpdir(),'replay-cms-'));
  const loader = join(directory,'fixture.mjs');
  await writeFile(loader,`globalThis.fetch=async()=>new Response(JSON.stringify({result:JSON.parse(process.env.REPLAY_TEST_CONTENT)}),{status:Number(process.env.REPLAY_TEST_STATUS||200)});`);
  const defaults=JSON.parse(await readFile(new URL('../site/content.defaults.json',import.meta.url),'utf8'));
  const build = (content,status=200) => spawnSync(process.execPath,['--import',loader,'cms/build.mjs'],{
    cwd:new URL('../',import.meta.url),encoding:'utf8',
    env:{...process.env,REPLAY_TEST_CONTENT:JSON.stringify(content),REPLAY_TEST_STATUS:String(status)},
  });
  try {
    const content=structuredClone(defaults);
    content.hero.title='<script>alert("hello")</script>\nON REPEAT.';
    content.settings.email='bookings@example.com';
    content.settings.ticketsUrl='https://example.com/tickets?event=replay';
    content.nights.first.ticketUrl='https://example.com/friday';
    content.settings.lostPropertyUrl='https://example.com/lost-property';
    delete content.story.photoNote;
    content.visit.openingHours=[{day:'Friday',opens:'22:00',closes:'03:00'}];
    assert.equal(build(content).status,0);
    const $=load(await readFile(output,'utf8'));
    assert.equal($('#hero-title script').length,0);
    assert.match($('#hero-title').text(),/<script>alert/);
    assert.equal($('.stock-note').length,0);
    assert.equal($('body').attr('data-contact-email'),'bookings@example.com');
    assert.equal($('.faq a[href="mailto:bookings@example.com"]').text(),'bookings@example.com');
    assert.equal($('.faq a[href="https://example.com/lost-property"]').length,1);
    assert.equal($('[data-conversion="events_and_tickets_click"]').length,10);
    for (const el of $('[data-conversion="events_and_tickets_click"]').toArray()) {
      const u=new URL($(el).attr('href'));
      assert.equal(u.hostname,'example.com');
      assert.equal(u.searchParams.get('utm_source'),'replayyork.co.uk');
      assert.ok(u.searchParams.get('utm_content'));
    }
    assert.equal(new URL($('.friday-art').attr('href')).pathname,'/friday');
    const schema=JSON.parse($('script[type="application/ld+json"]').text());
    const venue=schema['@graph'].find(x=>x['@type']==='NightClub');
    assert.equal(venue.openingHoursSpecification[0].closes,'03:00');
    assert.equal(venue.email,'bookings@example.com');
    assert.equal($('[href*="reward"], #reward-dialog').length,0);
    const good=await readFile(output,'utf8');
    content.settings.ticketsUrl='javascript:alert(1)';
    assert.notEqual(build(content).status,0);
    assert.equal(await readFile(output,'utf8'),good);
    assert.notEqual(build(defaults,503).status,0);
    assert.equal(await readFile(output,'utf8'),good);
  } finally {
    await writeFile(output,original);
    await rm(directory,{recursive:true,force:true});
  }
});
