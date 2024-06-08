import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import List from '@editorjs/list'
import Code from '@editorjs/code'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Header from '@editorjs/header'
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import SimpleImage from '@editorjs/simple-image'
import FontSize from 'editorjs-inline-font-size-tool'
import ColorPlugin from 'editorjs-text-color-plugin'
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune'
import Paragraph from '@editorjs/paragraph'
// import { Too } from "@editorjs/editorjs"


export const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: {
    class: Table,
    inlineToolbar: true
  },
  list: {
    class: List,
    inlineToolbar: true
  },
  // warning: Warning,
  code: Code,
  linkTool: LinkTool,
  // image: {
  //   class: TestImagePlugin,
  //   inlineToolbar: true
  // },
  // raw: Raw,
  header: {
    class: Header,
    inlineToolbar: true,
    tunes: ['anyTuneName'],
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ['anyTuneName'],
  },
  // quote: Quote,
  marker: Marker,
  // checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
  fontSize: FontSize,
  Color: ColorPlugin,
  anyTuneName: {
    class:AlignmentTuneTool,
    config:{
      default: "left",
      blocks: {
        header: 'center',
        list: 'left'
      }
    },
  }
  // toggle: {
  //   class: ToggleBlock,
  //   inlineToolbar: true,
  // },
}