export const renderDialog = async (
  title,
  handler = (_html = '') => {},
  data = {},
  template = 'systems/wildsea/templates/dialogs/simple.hbs',
) => {
  const content = await renderTemplate(template, data)

  const result = await foundry.applications.api.DialogV2.wait({
    window: { title },
    content: content,
    buttons: [
      {
        action: 'yes',
        label: `<i class="fas fa-check"></i> ${game.i18n.localize('wildsea.submit')}`,
        default: true,
        callback: (event, button, dialog) => {
          // Provide jQuery-like array of the dialog element for backward compatibility with handler
          return handler([dialog.element])
        }
      },
      {
        action: 'cancel',
        label: `<i class="fas fa-times"></i> ${game.i18n.localize('wildsea.cancel')}`,
        callback: () => ({ cancelled: true })
      }
    ]
  })

  return result ?? { cancelled: true }
}
