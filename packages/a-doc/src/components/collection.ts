import { define, property } from 'hybrids'

import { gHtml, html } from '../core/gHtml'

import styles from './collection.scss'

import './api'
import { ApiTag } from './api'

export interface Collection {
}

export interface CollectionTag {
  label: string
  isOpen: boolean
  apis: Record<string, unknown>[]
}

export default define<CollectionTag>('a-doc-collection', {
  label: property(''),
  isOpen: property(false),
  apis: [],
  render: ({ label }) => gHtml`
  <div class="label" onclick="${(c: CollectionTag) => (c.isOpen = !c.isOpen)}">
    ${label} <span class="material-icons ani fold-btn">chevron_right</span>
  </div>
  <div class="apis">
    ${([{
      name: 'Get user',
      path: '/users/{uid}',
      desc: '未描述内容\n* 123\n* 123',
      method: 'get'
    }] as ApiTag[]).map((api, index) => html`
    <a-doc-api
      name="${api.name}"
      path="${api.path}"
      desc="${api.desc}"
      method="${api.method}"></a-doc-api>
    `.key(index))}
  </div>
  `.style(styles)
})
