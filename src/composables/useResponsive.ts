import { useBreakpoints } from '@vueuse/core'

export function useResponsive() {
  const breakpoints = useBreakpoints({
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  })

  const isMobile = breakpoints.smaller('md')
  const isTablet = breakpoints.between('md', 'lg')
  const isDesktop = breakpoints.greaterOrEqual('lg')

  return {
    isMobile,
    isTablet,
    isDesktop,
  }
}
