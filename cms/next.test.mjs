import {test} from 'node:test'
import assert from 'node:assert/strict'
import {load} from 'cheerio'

const origin=process.env.REPLAY_TEST_URL || 'http://127.0.0.1:3001'
test('Next serves the complete public site with SEO, hours and tracked ticket links',async()=>{
  const response=await fetch(origin)
  assert.equal(response.status,200)
  const html=await response.text(),$=load(html)
  assert.match($('h1').text(),/GOOD TIMES.*ON REPEAT/s)
  assert.equal(new URL($('link[rel="canonical"]').attr('href')).href,'https://replayyork.co.uk/')
  assert.equal($('.opening-hours dt').length,7)
  assert.equal($('.opening-hours dt').first().text(),'Monday')
  assert.equal($('.opening-hours dd').first().text(),'Closed')
  assert.match($('.opening-hours dl').text(),/Friday6pm – 3am/)
  const tickets=$('[data-conversion="events_and_tickets_click"]')
  assert.equal(tickets.length,10)
  for(const node of tickets.toArray()) {
    const u=new URL($(node).attr('href'))
    assert.equal(u.hostname,'klurrb.com')
    assert.equal(u.pathname,'/join/replayyork')
    assert.equal(u.searchParams.get('utm_source'),'replayyork.co.uk')
    assert.ok(u.searchParams.get('utm_content'))
  }
  const structured=JSON.parse($('script[type="application/ld+json"]').text())
  assert.equal(structured['@graph'].find(x=>x['@type']==='NightClub').openingHoursSpecification[0].opens,'00:00')
  assert.equal($('#reward-dialog, [data-reward]').length,0)
  assert.equal($('.preview-control').length,0)
  assert.equal($('[data-sanity]').length>25,true)
  assert.match($('#hero-title').attr('data-sanity'),/base=%2Fadmin/)
  assert.doesNotMatch(html,/sk[A-Za-z0-9_-]{80,}/)
})
test('anonymous visitors cannot enable draft preview',async()=>{
  const response=await fetch(`${origin}/api/draft-mode/enable`,{redirect:'manual'})
  assert.ok([400,401,403,503].includes(response.status))
  assert.doesNotMatch(response.headers.get('set-cookie') || '',/__prerender_bypass/)
  await response.text()
})
test('admin deep links and the health endpoint resolve on Next',async()=>{
  const response=await fetch(`${origin}/admin/structure/website`)
  assert.equal(response.status,200)
  assert.match(await response.text(),/Replay York — Website editor/)
  assert.match(response.headers.get('x-robots-tag') || '',/noindex/)
  const health=await fetch(`${origin}/api/health`)
  assert.equal(health.status,200)
  assert.deepEqual(await health.json(),{status:'ok'})
})
test('unsigned requests cannot refresh the public cache',async()=>{
  const response=await fetch(`${origin}/api/revalidate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({_id:'website',_type:'website'})})
  assert.equal(response.status,process.env.REPLAY_REQUIRE_PUBLISHING==='true'?401:503)
  await response.text()
})
