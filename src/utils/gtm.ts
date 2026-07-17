export const GTM_ID = 'GTM-TSQK8K3Q'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

/**
 * Pushes a generic event to the GTM dataLayer.
 * @param eventName Name of the event to track.
 * @param payload Additional data to send with the event.
 */
export const pushEvent = (eventName: string, payload?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...payload,
    })
  }
}

/**
 * Pushes a pageview event to the GTM dataLayer.
 * @param url The URL path of the page being viewed.
 */
export const pushPageview = (url: string) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: url,
    })
  }
}
