import {defineConfig, defineField, defineType} from 'sanity'
import {structureTool} from 'sanity/structure'
import defaults from '../site/content.defaults.json'

const text = (name: string, title: string, max = 180) => defineField({
  name, title, type: 'string', validation: r => r.required().max(max),
})
const multiline = (name: string, title: string, max = 600) => defineField({
  name, title, type: 'text', rows: 3, validation: r => r.required().max(max),
})
const url = (name: string, title: string) => defineField({
  name, title, type: 'url', validation: r => r.required().uri({scheme: ['https']}),
})
const photo = (name = 'photo', title = 'Photograph') => defineField({
  name, title, type: 'image', options: {hotspot: true},
  description: 'Upload a replacement. Leave empty to use the current website photograph.',
})
const night = (name: string, title: string) => defineField({
  name, title, type: 'object', fields: [
    text('title', 'Heading', 70), multiline('description', 'Description', 350),
    text('tag', 'Small label', 45), multiline('posterTitle', 'Words on the image (one line per row)', 85),
    defineField({name: 'caption', title: 'Image caption', type: 'string', validation: r => r.max(70)}),
    photo(), text('photoAlt', 'Describe the photograph for accessibility', 240),
    defineField({name: 'ticketUrl', title: 'Specific event link (optional)', type: 'url',
      description: 'Leave empty to use the main events and tickets link.',
      validation: r => r.uri({scheme: ['https']})}),
  ],
})
const website = defineType({
  name: 'website', title: 'Website content', type: 'document',
  initialValue: defaults,
  groups: [
    {name:'home', title:'Home page', default:true}, {name:'nights', title:'Featured nights'},
    {name:'visit', title:'Visiting & FAQs'}, {name:'links', title:'Contact & links'}, {name:'seo', title:'Search & sharing'},
  ],
  fields: [
    defineField({name:'hero', title:'Welcome & scroll animation', type:'object', group:'home', fields:[
      multiline('title','Main heading (one line per row)',65), multiline('description','Introduction',240),
      photo(), text('photoAlt','Describe the photograph for accessibility',240),
      text('momentIntro','Scroll animation introduction',90), multiline('momentTitle','Scroll animation heading',65),
      text('momentCaption','Scroll animation caption',120),
    ]}),
    defineField({name:'story', title:'The music & atmosphere', type:'object', group:'home', fields:[
      multiline('title','Heading (one line per row)',75), text('intro','Introduction',180),
      multiline('body','Main text (separate paragraphs with a blank line)',1200), photo(),
      text('photoAlt','Describe the photograph for accessibility',240),
      defineField({name:'photoNote',title:'Note beneath the photograph',type:'string',description:'Clear this after uploading Replay’s own photograph.',validation:r=>r.max(140)}),
    ]}),
    defineField({name:'membership',title:'Membership',type:'object',group:'home',fields:[
      multiline('title','Heading (one line per row)',80), multiline('description','Description',400),
      text('note','Small print',200),
    ]}),
    defineField({name:'footer',title:'Closing section & footer',type:'object',group:'home',fields:[
      multiline('title','Closing heading (one line per row)',70), text('intro','Closing introduction',150),
      text('tagline','Footer tagline',150),
    ]}),
    defineField({name:'nights',title:'Featured nights & celebrations',type:'object',group:'nights',fields:[
      multiline('title','Section heading (one line per row)',70), multiline('description','Introduction',240),
      night('first','First featured night'), night('second','Second featured night'),
      defineField({name:'celebration',title:'Celebrations',type:'object',fields:[
        text('title','Heading',70), multiline('description','Description',350), text('tag','Small label',45),
        multiline('posterTitle','Words on the image (one line per row)',85), photo(),
        text('photoAlt','Describe the photograph for accessibility',240),
      ]}),
    ]}),
    defineField({name:'visit',title:'Visiting & frequently asked questions',type:'object',group:'visit',fields:[
      multiline('description','Location introduction',400),
      defineField({name:'openingHours',title:'Regular opening hours (optional)',type:'array',description:'Only add confirmed regular hours. Event-specific times can stay on the ticket listings.',of:[{type:'object',name:'hours',fields:[
        defineField({name:'day',title:'Day',type:'string',options:{list:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']},validation:r=>r.required()}),
        defineField({name:'closed',title:'Closed on this day',type:'boolean',initialValue:false}),
        ...['opens','closes'].map(name=>defineField({name,title:name==='opens'?'Opens (24-hour time)':'Closes (24-hour time)',type:'string',hidden:({parent})=>parent?.closed,
          validation:r=>r.custom((value,context)=>(context.parent as {closed?:boolean})?.closed || (typeof value==='string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)) ? true : 'Enter a 24-hour time, such as 22:00.')})),
      ],preview:{select:{title:'day',opens:'opens',closes:'closes',closed:'closed'},prepare:({title,opens,closes,closed})=>({title,subtitle:closed?'Closed':`${opens || '…'}–${closes || '…'}`})}}],validation:r=>r.max(7).custom(value=>{
        const days=(value || []).map((row: {day?:string})=>row.day).filter(Boolean);
        return new Set(days).size===days.length || 'Include each day only once.';
      })}),
      defineField({name:'faqs',title:'Frequently asked questions',type:'array',of:[{type:'object',name:'faq',fields:[
        text('question','Question',140), multiline('answer','Answer',800),
        defineField({name:'action',title:'Optional link or button',type:'string',options:{list:[{title:'No link',value:'none'},{title:'Website link',value:'link'},{title:'Open group enquiry',value:'enquiry'}]},initialValue:'none'}),
        defineField({name:'linkLabel',title:'Link text',type:'string',description:'Write {{link}} in the answer where this should appear.',validation:r=>r.max(90)}),
        defineField({name:'linkUrl',title:'Link address',type:'url',description:'Not needed for the group enquiry button.',validation:r=>r.uri({scheme:['https','mailto']})}),
      ],preview:{select:{title:'question'}}}],validation:r=>r.required().min(1).max(15)}),
    ]}),
    defineField({name:'settings',title:'Contact & booking links',type:'object',group:'links',fields:[
      defineField({name:'email',title:'Enquiry email',type:'string',validation:r=>r.required().email()}),
      url('ticketsUrl','Main events & tickets link'), url('membershipUrl','Membership link'),
      url('instagramUrl','Instagram'), url('facebookUrl','Facebook'),
      url('lostPropertyUrl','Lost property form'), url('giftCardsUrl','Gift cards'),
      photo('logo','Logo (optional replacement)'),
    ]}),
    defineField({name:'seo',title:'Search engines & social sharing',type:'object',group:'seo',fields:[
      text('title','Page title',70), multiline('description','Search description',180), photo('shareImage','Social sharing image'),
    ]}),
  ],
  preview:{prepare:()=>({title:'Replay York website',subtitle:'Edit the website, then press Publish'})},
})

export default defineConfig({
  name:'replay-york', title:'Replay York', projectId:'7i0l1smd', dataset:'production',
  releases:{enabled:false}, scheduledDrafts:{enabled:false}, scheduledPublishing:{enabled:false},
  plugins:[structureTool({structure:S=>S.list().title('Replay York').items([
    S.listItem().title('Website content').id('website').child(
      S.document().schemaType('website').documentId('website').title('Website content'),
    ),
  ])})],
  schema:{types:[website],templates:[]},
  document:{comments:{enabled:false},actions:(previous, context)=>context.schemaType==='website'
    ? previous.filter(a=>!['delete','duplicate','unpublish'].includes(a.action || ''))
    : previous},
})
