import type { Token } from "../store/atoms"
import { useTokenBalance } from "./useTokenBalance"
import { useTokenInfo } from "./useTokenInfo"
import { useTokenPrice } from "./useTokenPrice"

export function useToken(token?: Token) {
  const balance = useTokenBalance(token)
  const info = useTokenInfo(token?.address)
  const price = useTokenPrice(info.data?.symbol)

  return {
    ...balance,
    info: info.data,
    price: price.data,
    isLoading: balance.isLoading || info.isLoading || price.isLoading,
    error: balance.error || info.error || price.error,
  }
}