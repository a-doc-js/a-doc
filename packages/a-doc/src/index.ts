import { OpenAPIV3 } from 'openapi-types'
type OpenApi = OpenAPIV3.Document
import { define, property } from 'hybrids'

import styles from './a-doc.scss'

import { gHtml, html } from './core/gHtml'

import './components/collection'

interface ADoc {
  openapiUrl: string
}

let _openApi: OpenApi
const refresh = ({ openapiUrl }: ADoc) => {
  fetch(openapiUrl)
    .then(result => result.json())
    .then(json => (_openApi = json))
}

define<ADoc>('a-doc', {
  openapiUrl: property('', refresh),
  render: (_) => gHtml`
    <div class="header">
      <div class="favicon">A-Doc</div>
      <div class="opts">
        <span
          onclick="${ refresh }"
          class="material-icons refresh">refresh</span>
        <span
          class="material-icons settings">settings</span>
      </div>
    </div>
    <div class="container">
      <div class="panel">
        <div class="collections">
          ${[1, 2].map(
            (item, index) => html`<a-doc-collection
              label="${item}"
              isOpen="${index === 0}"></a-doc-collection>`
          )}
        </div>
      </div>
      <div class="detail">
        <div class="tabs"></div>
        <div class="logs"></div>
      </div>
    </div>
  `.style(styles)
})
