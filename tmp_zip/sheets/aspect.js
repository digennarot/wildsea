import { WILDSEA } from '../config.js'
import { enrich } from '../helpers.js'

const { HandlebarsApplicationMixin } = foundry.applications.api
const { ItemSheetV2 } = foundry.applications.sheets

export default class WildseaAspectSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ['wildsea', 'sheet', 'item'],
    position: {
      width: 600,
      height: 400,
    },
    window: {
      resizable: true,
    }
  }

  static PARTS = {
    main: {
      template: 'systems/wildsea/templates/sheets/aspect.hbs'
    }
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options)
    context.system = this.document.system
    context.system.enrichedDetails = await enrich(this.document.system.details)
    return context
  }
}
