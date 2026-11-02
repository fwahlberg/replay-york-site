import {createClient, defineQuery} from 'next-sanity'

export const client=createClient({
  projectId:'7i0l1smd',dataset:'production',apiVersion:'2026-02-01',useCdn:true,
  stega:{studioUrl:'/admin'},
})
export const WEBSITE_QUERY=defineQuery(`*[_type == "website" && _id == "website"][0]{...,
  hero{...,photo{...,asset->}},story{...,photo{...,asset->}},
  nights{...,first{...,photo{...,asset->}},second{...,photo{...,asset->}},celebration{...,photo{...,asset->}}},
  settings{...,logo{...,asset->}},seo{...,shareImage{...,asset->}}}`)
