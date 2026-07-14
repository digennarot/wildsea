import { WILDSEA } from '../config.js'
import WildseaItemSheet from './item.js'
import { renderDialog } from '../dialog.js'

export default class WildseaShipItemSheet extends WildseaItemSheet {
  static DEFAULT_OPTIONS = {
    position: {
      width: 600,
      height: 'auto',
    },
    tabGroups: {
      primary: 'main'
    }
  }

  static PARTS = {
    main: {
      template: 'systems/wildsea/templates/sheets/ship_item.hbs'
    }
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options)
    context.hasTrack = ['undercrew'].includes(this.document.type)
    return context
  }

  _onRender(context, options) {
    super._onRender(context, options)
    const html = this.element
    if (this.isEditable) {
      if (this.document.isOwner) {
        html.querySelectorAll('.addRatingMod').forEach(el => el.addEventListener('click', this.addRatingMod.bind(this)))
        html.querySelectorAll('.editRatingMod').forEach(el => el.addEventListener('click', this.editRatingMod.bind(this)))
        html.querySelectorAll('.deleteRatingMod').forEach(el => el.addEventListener('click', this.deleteRatingMod.bind(this)))

        html.querySelectorAll('.editEffect').forEach(el => el.addEventListener('click', this.editEffect.bind(this)))
        html.querySelectorAll('.deleteEffect').forEach(el => el.addEventListener('click', this.deleteEffect.bind(this)))
      }
    }
  }

  async addRatingMod(event) {
    event.preventDefault()

    const data = await renderDialog(
      game.i18n.localize('wildsea.ratingMod'),
      this.processRatingModDialog,
      { config: WILDSEA },
      '/systems/wildsea/templates/dialogs/design_rating_mod.hbs',
    )

    if (data.cancelled) return

    data.id = foundry.utils.randomID()
    const ratingMods =
      this.document.system.ratingMods != null
        ? [...this.document.system.ratingMods]
        : []
    ratingMods.push(data)

    this.document.update({
      system: {
        ratingMods,
      },
    })
  }

  async editRatingMod(event) {
    event.preventDefault()
    const ratingModId = event.currentTarget.dataset.ratingModId
    const ratingMods = this.document.system.ratingMods
    const ratingMod = ratingMods.filter((e) => e.id === ratingModId)[0]

    const data = await renderDialog(
      game.i18n.localize('wildsea.ratingMod'),
      this.processRatingModDialog,
      {
        config: WILDSEA,
        ...ratingMod,
      },
      '/systems/wildsea/templates/dialogs/design_rating_mod.hbs',
    )

    if (data.cancelled) return

    ratingMod.rating = data.rating
    ratingMod.value = data.value

    this.document.update({
      system: {
        ratingMods,
      },
    })
  }

  async deleteRatingMod(event) {
    event.preventDefault()
    const ratingModId = event.currentTarget.dataset.ratingModId
    this.document.update({
      system: {
        ratingMods: this.document.system.ratingMods.filter(
          (e) => e.id !== ratingModId,
        ),
      },
    })
  }

  processRatingModDialog(html) {
    const form = html[0].querySelector('form')
    return {
      rating: form.rating.value,
      value: parseInt(form.value.value || 0),
    }
  }

  editEffect(event) {
    event.preventDefault()
    const effectId = event.currentTarget.dataset.effectId
    this.document.effects.get(effectId).sheet.render(true)
  }

  deleteEffect(event) {
    event.preventDefault()
    const effectId = event.currentTarget.dataset.effectId
    this.document.deleteEmbeddedDocuments('ActiveEffect', [effectId])
  }
}
