export function formatearFecha(fecha: string) {
  if (!fecha) return ''

  const partes = fecha.split('T')
  const fechaSolo = partes[0]

  if (!fechaSolo) return ''

  const [anio, mes, dia] = fechaSolo.split('-')

  return `${dia}/${mes}/${anio}`
}
