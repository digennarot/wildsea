import { WILDSEA } from '../config.js'
import { enrich, listToRows, clamp, clickModifiers } from '../helpers.js'
import WildseaActorSheet from './actor.js'

export default class WildseaPlayerSheet extends WildseaActorSheet {
  static DEFAULT_OPTIONS = {
    classes: ['wildsea', 'sheet', 'actor', 'player'],
    window: { resizable: true },
    tag: 'form',
    width: 1000,
    height: 750,
  }

  static get PARTS() {
    return {
      sheet: { template: `${WILDSEA.root_path}/templates/sheets/player.hbs` }
    }
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options)
    context.edgesList = listToRows(WILDSEA.edges, 3)
    context.skillsList = listToRows(WILDSEA.skills, 2)
    context.languagesList = listToRows(WILDSEA.languages, 2)

    for (const item of this.document.items) {
      item.system.enrichedDetails = await enrich(item.system.details)
    }

    const resources = this.document.itemTypes.resource
    for (const resourceType of WILDSEA.resourceTypes) {
      context.system[resourceType] = resources
        .filter((r) => r.system.type === resourceType)
        .sort((a, b) => (a.sort < b.sort ? -1 : 1))
    }

    const milestones = this.document.system.milestones || []
    for (const subtype of WILDSEA.milestoneSubtypes) {
      context.system[`milestone_${subtype}`] = milestones.filter(
        (m) => m.subtype === subtype,
      )
    }

    context.aspects = this.document.itemTypes.aspect.sort((a, b) =>
      a.sort < b.sort ? -1 : 1,
    )

    context.temporaryTracks = this.document.itemTypes.temporaryTrack.sort((a, b) =>
      a.sort < b.sort ? -1 : 1,
    )

    context.system.resources = this.document.itemTypes.resource.sort((a, b) =>
      a.sort < b.sort ? -1 : 1,
    )

    return context
  }

  _onRender(context, options) {
    super._onRender(context, options)
    const html = this.element
    if (this.isEditable) {
      if (this.document.isOwner) {
        // List tracks (edges, skills, languages)
        html.querySelectorAll('.list-track .track').forEach((el) => {
          el.addEventListener('click', this.increaseListTrack.bind(this))
          el.addEventListener('contextmenu', this.decreaseListTrack.bind(this))
        })

        // Mire tracks
        html.querySelectorAll('.mire .track').forEach((el) => {
          el.addEventListener('click', this.increaseMireTrack.bind(this))
          el.addEventListener('contextmenu', this.decreaseMireTrack.bind(this))
        })

        // Add item buttons (+)
        html.querySelectorAll('.addItem').forEach((el) => {
          el.addEventListener('click', this.addItem.bind(this))
        })
      }
    }

    // Roll clicks on edge/skill/language labels
    html.querySelectorAll('.roll').forEach((el) => {
      el.addEventListener('click', this.updateRoll.bind(this))
    })
  }

  async increaseListTrack(event) {
    event.preventDefault()
    const target = event.currentTarget
    const data = target.closest('.track').dataset

    switch (data.itemType) {
      case 'edge':
        this.adjustEdge(data.itemId)
        break
      case 'skill':
        this.adjustSkill(data.itemId)
        break
      case 'language':
        this.adjustLanguage(data.itemId)
        break
      default:
        break
    }
  }

  async decreaseListTrack(event) {
    event.preventDefault()

    const target = event.currentTarget
    const data = target.closest('.track').dataset

    switch (data.itemType) {
      case 'edge':
        this.adjustEdge(data.itemId, -1)
        break
      case 'skill':
        this.adjustSkill(data.itemId, -1)
        break
      case 'language':
        this.adjustLanguage(data.itemId, -1)
        break
      default:
        break
    }
  }

  async adjustEdge(key, change = 1) {
    const currentValue = this.document.system.edges[key] || 0
    const newValue = clamp(currentValue + change, WILDSEA.edgeMax)

    this.document.update({
      system: {
        edges: {
          [key]: newValue,
        },
      },
    })
  }

  async adjustSkill(key, change = 1) {
    const currentValue = this.document.system.skills[key] || 0
    const newValue = clamp(currentValue + change, WILDSEA.skillMax)

    this.document.update({
      system: {
        skills: {
          [key]: newValue,
        },
      },
    })
  }

  async adjustLanguage(key, change = 1) {
    const currentValue = this.document.system.languages[key] || 0
    const newValue = clamp(currentValue + change, WILDSEA.languageMax)

    this.document.update({
      system: {
        languages: {
          [key]: newValue,
        },
      },
    })
  }

  async addItem(event) {
    event.preventDefault()

    const target = event.currentTarget
    const data = target.dataset

    switch (data.itemType) {
      case 'aspect':
        this.addAspect()
        break
      case 'drive':
        this.addSlimItem('drives')
        break
      case 'milestone':
        this.addSlimItem('milestones', data.itemSubtype)
        break
      case 'mire':
      case 'mires':
        this.addSlimItem('mires')
        break
      case 'resource':
        this.addResource()
        break
      case 'temporaryTrack':
        this.addTemporaryTrack()
        break
      default:
        ui.notifications.warn(
          `Type "${data.itemType}" not recognised or not implemented`,
        )
        break
    }
  }

  async addAspect() {
    const defaultData = {}

    const itemData = {
      name: game.i18n.localize('wildsea.newAspectName'),
      type: 'aspect',
      system: {
        details: game.i18n.localize('wildsea.newAspectDetails'),
        ...defaultData,
      },
    }

    this.addEmbeddedDocument(itemData)
  }

  async addResource() {
    const defaultData = {}

    const itemData = {
      name: game.i18n.localize('wildsea.newResourceName'),
      type: 'resource',
      system: {
        ...defaultData,
      },
    }

    this.addEmbeddedDocument(itemData)
  }

  async addTemporaryTrack() {
    const defaultData = {}

    const itemData = {
      name: game.i18n.localize('wildsea.newTemporaryTrackName'),
      type: 'temporaryTrack',
      system: {
        details: game.i18n.localize('wildsea.newTemporaryTrackDetails'),
        ...defaultData,
      },
    }

    this.addEmbeddedDocument(itemData)
  }

  async increaseMireTrack(event) {
    event.preventDefault()
    const itemId = event.currentTarget.dataset.itemId
    this.adjustSlimTrack(itemId, 'mires', clickModifiers(event))
  }

  async decreaseMireTrack(event) {
    event.preventDefault()
    const itemId = event.currentTarget.dataset.itemId
    this.adjustSlimTrack(itemId, 'mires', clickModifiers(event), -1)
  }

  async updateRoll(event) {
    event.preventDefault()
    const data = event.currentTarget.dataset
    const dicePool = game.wildsea.dicePool

    switch (data.type) {
      case 'edge':
        dicePool.setEdge(data.value)
        break
      case 'skill':
        dicePool.setSkill(data.value)
        break
      case 'language':
        dicePool.setLanguage(data.value)
        break
    }
  }
}
