import { createConfig, http } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'), // Локальная нода
  },
  connectors: [
    injected(), 
    walletConnect({ projectId: 'f3a281945e9f4270effe682d7f41183d' }), 
    //     1. Где взять Project ID?
    // Перейдите на WalletConnect Cloud

    // Войдите через GitHub или Email

    // Нажмите "New Project"
    // → Укажите название (например, MyDapp)
    // → Скопируйте Project ID (формат a1b2c3d4e5f6g7h8i9j0)
  ],
})