import { html } from 'hybrids'
import marked from 'marked'
import hljs from 'highlight.js'

import atomClassStyles from '../assets/atom-class.scss'
import iconfontStyles from '../assets/iconfont.scss'

import atomOneLightTheme from 'highlight.js/scss/atom-one-light.scss'

marked.setOptions({
  highlight(
    code: string, lang: string, _callback?: (error, code?: string) => void
  ): string | void {
    if (lang !== '') {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
})

export { html } from 'hybrids'

export function sHtml(htmlStr: string) {
  const stringArray: string[] & {
    raw?: string[]
  } = [htmlStr]
  stringArray.raw = [htmlStr]
  return html(stringArray as TemplateStringsArray)
}

export function mdHtml(
  mdStr: string
) {
  return sHtml(marked(mdStr)).style(
    atomOneLightTheme
  )
}

export function gHtml(parts: TemplateStringsArray, ...args: unknown[]) {
  return html(parts, ...args).style(
    atomClassStyles, iconfontStyles
  )
}
