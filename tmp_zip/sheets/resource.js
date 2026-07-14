import { WILDSEA } from '../config.js'
import WildseaItemSheet from './item.js'

export default class WildseaResourceSheet extends WildseaItemSheet {
  static DEFAULT_OPTIONS = {
    position: {
      width: 500,
      height: 165,
    }
  }

  static PARTS = {
    main: {
      template: 'systems/wildsea/templates/sheets/resource.hbs'
    }
  }
}
