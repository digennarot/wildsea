import { WILDSEA, registerSystemSettings } from './system/config.js'
import {
  loadHandlebarsHelpers,
  loadHandlebarsPartials,
} from './system/preload.js'
import WildseaActor from './system/actor.js'
import { addDiceColor } from './system/dice.js'
import WildseaAspectSheet from './system/sheets/aspect.js'
import WildseaAttributeSheet from './system/sheets/attribute.js'
import WildseaDicePool from './system/applications/dice_pool.js'
import WildseaItem from './system/item.js'
import WildseaJournalSheet from './system/sheets/journal.js'
import WildseaPlayerSheet from './system/sheets/player.js'
import WildseaResourceSheet from './system/sheets/resource.js'
import WildseaShipSheet from './system/sheets/ship.js'
import WildseaShipItemSheet from './system/sheets/ship_item.js'
import WildseaAdversarySheet from './system/sheets/adversary.js'
import { setupEnrichers } from './system/enrichers.js'
import { runMigrations } from './system/migrations.js'
import { PlayerModel, ShipModel, HazardModel } from './system/data/actor.js'
import { AspectModel, AttributeModel, DesignModel, FittingModel, ResourceModel, TemporaryTrackModel, UndercrewModel } from './system/data/item.js'

import * as WildseaTracks from './system/applications/tracks/index.js'

Hooks.once('init', () => {
  console.log('wildsea | Initializing')

  registerSystemSettings()

  if (game.settings.get('wildsea', 'showDepth'))
    WILDSEA.shipRatings.push('depth')

  CONFIG.wildsea = WILDSEA
  CONFIG.ActiveEffect.legacyTransferral = false
  game.wildsea = {}

  WildseaTracks.setup()

  loadHandlebarsPartials()
  loadHandlebarsHelpers()
  setupEnrichers()

  CONFIG.Actor.documentClass = WildseaActor
  CONFIG.Actor.dataModels = {
    player: PlayerModel,
    ship: ShipModel,
    hazard: HazardModel
  }

  CONFIG.Item.documentClass = WildseaItem
  CONFIG.Item.dataModels = {
    aspect: AspectModel,
    attribute: AttributeModel,
    design: DesignModel,
    fitting: FittingModel,
    resource: ResourceModel,
    temporaryTrack: TemporaryTrackModel,
    undercrew: UndercrewModel
  }

  foundry.documents.collections.Actors.unregisterSheet('core', foundry.appv1.sheets.ActorSheet)
  foundry.documents.collections.Actors.registerSheet('wildsea', WildseaPlayerSheet, { types: ['player'] })
  foundry.documents.collections.Actors.registerSheet('wildsea', WildseaShipSheet, { types: ['ship'] })
  foundry.documents.collections.Actors.registerSheet('wildsea', WildseaAdversarySheet, { types: ['hazard'] })

  foundry.documents.collections.Items.unregisterSheet('core', foundry.appv1.sheets.ItemSheet)
  foundry.documents.collections.Items.registerSheet('wildsea', WildseaAspectSheet, {
    types: ['aspect', 'temporaryTrack'],
  })
  foundry.documents.collections.Items.registerSheet('wildsea', WildseaResourceSheet, { types: ['resource'] })
  foundry.documents.collections.Items.registerSheet('wildsea', WildseaShipItemSheet, {
    types: ['design', 'fitting', 'undercrew'],
  })
  foundry.documents.collections.Items.registerSheet('wildsea', WildseaAttributeSheet, {
    types: ['attribute'],
  })

  foundry.documents.collections.Journal.unregisterSheet('core', foundry.appv1.sheets.JournalSheet)
  foundry.documents.collections.Journal.registerSheet('wildsea', WildseaJournalSheet)

  // CONFIG.TinyMCE is deprecated and removed in V14
})

Hooks.once('ready', () => {
  runMigrations()
})

Hooks.on('ready', async () => {
  game.wildsea.dicePool = new WildseaDicePool()
})

Hooks.on('renderJournalPageSheet', (_obj, html) => {
  html = $(html)
  if (game.user.isGM) {
    html.on('click', '.track', async (event) => {
      const data = event.currentTarget.dataset
      console.log(data)

      const result = await game.wildsea.trackDatabase.showTrackDialog(
        'wildsea.TRACKS.addTrack',
        data,
      )
      if (result.cancelled) return
      game.wildsea.trackDatabase.addTrack({ ...result })
    })
  }
})

Hooks.on('renderSceneControls', (_controls, html) => {
  html = $(html)
  const dicePoolButton = $(
    `<li class="dice-pool-control" data-control="dice-pool" data-tooltip="${game.i18n.localize(
      'wildsea.dicePoolTitle',
    )}">
        <i class="fas fa-dice"></i>
        <ol class="control-tools">
        </ol>
    </li>`,
  )

  html.find('.main-controls').append(dicePoolButton)
  html
    .find('.dice-pool-control')
    .removeClass('control-tool')
    .on('click', async () => {
      await game.wildsea.dicePool.toggle()
    })
})

Hooks.once('diceSoNiceReady', (dice3d) => {
  const dark = '#2e2c20'
  const mid = '#626256'
  const light = '#858778'

  addDiceColor(dice3d, 'wildsea-dark', 'Dark', dark)
  addDiceColor(dice3d, 'wildsea-mid', 'Mid', mid)
  addDiceColor(dice3d, 'wildsea-light', 'Light', light)
})
