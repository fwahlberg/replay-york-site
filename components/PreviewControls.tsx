'use client'
import {useIsPresentationTool} from 'next-sanity/hooks'
export function PreviewControls() {
  return useIsPresentationTool() ? null : <a href="/api/draft-mode/disable" className="preview-control">Exit draft preview</a>
}
