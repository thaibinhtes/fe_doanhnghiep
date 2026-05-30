import L from 'leaflet'

const iconOptions: L.IconOptions = {
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
}

export const defaultMarkerIcon = L.icon(iconOptions)

/** Fix broken default marker icons when bundling Leaflet with Vite. */
export function setupLeafletIcons(): void {
  // Leaflet's bundled default icon paths break under Vite; override globally.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions(iconOptions)
  L.Marker.prototype.options.icon = defaultMarkerIcon
}
