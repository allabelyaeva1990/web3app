import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  slippage: number
  deadline: number 
  userPreferences: {
    soundEnabled: boolean
    autoConnect: boolean
  }
  
  setSlippage: (value: number) => void
  setDeadline: (value: number) => void
  setSoundEnabled: (enabled: boolean) => void
  setAutoConnect: (enabled: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      slippage: 0.5,
      deadline: 20,
      userPreferences: {
        soundEnabled: true,
        autoConnect: false
      },
      
      setSlippage: (value) => set({ 
        slippage: Math.max(0.1, Math.min(50, value)) // От 0.1% до 50%
      }),
      
      setDeadline: (value) => set({ 
        deadline: Math.max(1, Math.min(60, value)) // От 1 до 60 минут
      }),
      
      setSoundEnabled: (enabled) => set((state) => ({
        userPreferences: { ...state.userPreferences, soundEnabled: enabled }
      })),
      
      setAutoConnect: (enabled) => set((state) => ({
        userPreferences: { ...state.userPreferences, autoConnect: enabled }
      }))
    }),
    {
      name: 'app-settings', // ключ в localStorage
    }
  )
)