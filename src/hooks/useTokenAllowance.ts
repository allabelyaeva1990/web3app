import type { Address } from "viem"
import { ERC20_ABI } from "../constants/erc-20-abi"
import type { Token } from "../store/atoms"
import { useAccount, useReadContract } from "wagmi"

export function useTokenAllowance(token?: Token, spender?: string) {
  const { address } = useAccount()

  return useReadContract({
    address: token?.address as Address,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && spender ? [address, spender as Address] : undefined,
    query: {
      enabled: !!(
        address && 
        spender && 
        token?.address && 
        token?.address !== '0x0000000000000000000000000000000000000000'
      ),
      // Allowance может изменяться, но не так часто
      refetchInterval: 30 * 1000, // 30 секунд
    }
  })
}