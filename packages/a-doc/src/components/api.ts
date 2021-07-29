import { define, property } from 'hybrids'

import { gHtml, mdHtml } from '../core/gHtml'
import styles from './api.scss'

export interface ApiTag {
  name: string
  path: string
  desc: string
  method: 'get' | 'post' | 'delete' | 'patch'
  isOpen: boolean
}

export default define<ApiTag>('a-doc-api', {
  name: property(''),
  path: property(''),
  desc: property(''),
  method: property('get'),
  isOpen: property(false),
  render: ({ name, path, desc, method, isOpen }) => gHtml`
  <div class="name">${ name }</div>
  <div class="path">${ path }</div>
  <div class="desc hljs">${ mdHtml(desc) }</div>
  <div title="${ method }"
       onclick="${ (host) => (host.isOpen = !host.isOpen) }"
       class="material-icons method bc-${method}">
    ${ isOpen ? 'fullscreen_exit' : 'fullscreen' }
  </div>
  `.style(styles)
})
