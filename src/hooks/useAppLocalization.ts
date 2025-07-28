// src/hooks/useAppLocalization.ts - Расширенная локализация
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAtom } from 'jotai'
import { uiSettingsAtom } from '../store/atoms'

export function useAppLocalization() {
  const { t, i18n } = useTranslation()
  const [settings, setSettings] = useAtom(uiSettingsAtom)
  
  // Текущий язык
  const currentLanguage = i18n.language || settings.language
  const isRussian = currentLanguage === 'ru'
  const isEnglish = currentLanguage === 'en'

  // Переключение языка
  const switchLanguage = useCallback(async (lang?: 'en' | 'ru') => {
    const newLang = lang || (currentLanguage === 'en' ? 'ru' : 'en')
    
    try {
      // Обновляем i18n
      await i18n.changeLanguage(newLang)
      
      // Сохраняем в состоянии
      setSettings(prev => ({ ...prev, language: newLang }))
      
      return newLang
    } catch (error) {
      console.error('Ошибка смены языка:', error)
      return currentLanguage
    }
  }, [currentLanguage, i18n, setSettings])


  return {
    // Основные
    t,
    currentLanguage,
    isRussian,
    isEnglish,
    switchLanguage,
    
    // Быстрые проверки
    isCurrentLang: (lang: string) => currentLanguage === lang
  }
}