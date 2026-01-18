import Decimal from 'decimal.js'

export const CURRENCY_SYMBOLS: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
  HKD: 'HK$',
}

export const CURRENCY_DECIMALS: Record<string, number> = {
  CNY: 2,
  USD: 2,
  EUR: 2,
  JPY: 0,
  GBP: 2,
  HKD: 2,
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number | string,
  currency: string,
  options: {
    showSymbol?: boolean
    showCode?: boolean
    precision?: number
  } = {}
): string {
  const {
    showSymbol = true,
    showCode = true,
    precision = CURRENCY_DECIMALS[currency] || 2,
  } = options

  const decimal = new Decimal(amount)
  const formatted = decimal.toFixed(precision)

  const parts = formatted.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const numberStr = parts.join('.')

  const symbol = showSymbol ? CURRENCY_SYMBOLS[currency] || '' : ''
  const code = showCode ? ` ${currency}` : ''

  return `${symbol}${numberStr}${code}`
}

/**
 * 货币转换
 */
export function convertCurrency(
  amount: number | string,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number
): string {
  if (fromCurrency === toCurrency) {
    return new Decimal(amount).toFixed(CURRENCY_DECIMALS[toCurrency])
  }

  const decimal = new Decimal(amount)
  const rate = new Decimal(exchangeRate)
  const result = decimal.times(rate)

  return result.toFixed(CURRENCY_DECIMALS[toCurrency])
}
