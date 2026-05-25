export function formatearMoneda  (valor: number)  {
    return Number(valor).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}
