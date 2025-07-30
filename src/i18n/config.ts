// src/i18n/config.ts - Полные переводы
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Ресурсы переводов
const resources = {
  en: {
    translation: {
      // Общие
      'connectWallet': 'Connect Wallet',
      'balance': 'Balance',
      'max': 'MAX',
      'disconnect': 'Disconnect',
      'connected': 'Connected',
      
      // Навигация
      'swap': 'Swap',
      'buy': 'Buy',
      'sell': 'Sell',
      'transactions': 'Transactions',
      
      // Страница Swap
      'selling': 'You\'re selling',
      'buying': 'You\'re buying',
      'exchangeRate': 'Exchange Rate',
      'slippage': 'Slippage',
      'enterAmount': 'Enter amount',
      'selectDifferentTokens': '⚠️ Select different tokens',
      'insufficientBalance': '❌ Insufficient balance',
      'swapTokens': 'Swap',
      'flipTokens': 'Flip tokens',
      
      // Страница покупки
      'buyTokens': '💰 Buy Tokens',
      'buyDescription': 'Buy tokens with ETH at current rate',
      'paying': 'Paying (ETH)',
      'receiving': 'Receiving',
      'buyWith': 'Buy {{token}} with {{amount}} ETH',
      'howItWorks': 'How it works:',
      'buyExplanation': 'You send ETH, receive selected tokens at current market rate. Rates update in real-time.',
      'processingPurchase': '⏳ Processing purchase...',
      'enterETHAmount': 'Enter ETH amount',
      'insufficientETH': '❌ Insufficient ETH',
      
      // Страница продажи
      'sellTokens': '💸 Sell Tokens',
      'sellDescription': 'Sell tokens and receive ETH at current rate',
      'sellingTokens': 'Selling',
      'receivingETH': 'Receiving (ETH)',
      'sellFor': 'Sell {{token}} for {{amount}} ETH',
      'sellExplanation': 'You send tokens, receive ETH at current market rate. Rates update in real-time.',
      'processingSale': '⏳ Processing sale...',
      'enterTokenAmount': 'Enter token amount',
      'insufficientTokens': '❌ Insufficient {{token}}',
      
      // Страница транзакций
      'transactionHistory': '📜 Transaction History',
      'historyDescription': 'All your swap, buy and sell operations',
      'total': 'Total',
      'pending': 'Pending',
      'success': 'Success',
      'failed': 'Failed',
      'filter': 'Filter:',
      'all': 'All',
      'newest': 'Newest first',
      'oldest': 'Oldest first',
      'clear': 'Clear',
      'noTransactions': 'No transactions',
      'noTransactionsWithFilter': 'No transactions with status "{{filter}}"',
      'walletNotConnected': 'Wallet not connected',
      'connectToView': 'Connect wallet to view transaction history',
      'firstTransaction': 'Make your first swap, buy or sell operation',
      'changeFilter': 'Try changing the filter or make a new operation',
      'clearHistory': 'Clear all transaction history',
      'confirmClear': 'Are you sure you want to clear all transaction history?',
      
      // Типы операций
      'purchase': 'Purchase',
      'sale': 'Sale',
      'exchange': 'Exchange',
      
      // Статусы транзакций
      'statusPending': 'Pending',
      'statusSuccess': 'Success',
      'statusFailed': 'Failed',
      
      // Уведомления
      'swapStarted': 'Swap started',
      'swapSuccess': '✅ Swap successful!',
      'swapError': '❌ Swap error',
      'buyStarted': '💰 Purchase started',
      'buySuccess': '✅ Purchase successful!',
      'buyError': '❌ Purchase error',
      'sellStarted': '💸 Sale started',
      'sellSuccess': '✅ Sale successful!',
      'sellError': '❌ Sale error',
      'unknownError': 'Unknown error',
      'received': 'Received {{amount}} {{token}}',
      'swapping': 'Swapping {{inputAmount}} {{inputToken}} to {{outputAmount}} {{outputToken}}',

      
      // Информация о сделке
      'rate': 'Rate',
      'totalCost': 'Total cost',
      'ethPrice': 'ETH Price',
      'tokenPrice': '{{token}} Price',
      'networkFee': 'Network fee',
      'estimatedGas': '~{{amount}} ETH',
      'priceImpact': 'Price impact',
      'minimumReceived': 'Minimum received',
      
      // Токены
      'selectToken': 'Select token',
      'selectTokenForSelling': 'Select token to sell',
      'selectTokenForBuying': 'Select token to buy',
      'searchTokens': 'Search by name or symbol...',
      'addCustomToken': 'Add token by address:',
      'contractAddress': '0x... (contract address)',
      'addToken': 'Add',
      'tokenFound': 'Found:',
      'symbol': 'Symbol:',
      'decimals': 'Decimals:',
      'tokenNotFound': '⚠️ Token not found or not an ERC20 contract',
      'invalidAddress': 'Invalid address format',
      
      // Ошибки и предупреждения
      'walletNotConnectedError': 'Wallet not connected',
      'invalidAmount': 'Invalid amount',
      'amountTooSmall': 'Amount too small',
      'amountTooLarge': 'Amount too large',
      'selectDifferentTokensError': 'Select different tokens',
      'loadingBalance': '⏳ Loading...',
      'balanceError': '❌ Error',
      'retryConnection': 'Retry connection',
      
      // Дополнительная информация
      'aboutTransactionHistory': 'About transaction history:',
      'historyStoredLocally': 'History is stored locally in your browser. Data is not sent to the server and is only available to you.',
      'developmentMode': '🛠️ Development Mode',
      'debugInfo': 'Debug Info',
      'fixedVersion': '🔧 Fixed version with direct useBalance',
      'connectionStatus': 'Connected: {{status}}',
      'balanceStatus': 'Balance: {{status}}',
      'stateStatus': 'State: {{status}}',
      
      // Форматирование
      'timeAgo': '{{time}} ago',
      'justNow': 'Just now',
      'minutesAgo': '{{count}}m ago',
      'hoursAgo': '{{count}}h ago',
      'daysAgo': '{{count}}d ago',
      'txHash': 'TxHash: {{hash}}',
      'gasUsed': 'Gas: {{amount}}',
      'exchangeRateDisplay': '1 {{from}} = {{rate}} {{to}}'
    }
  },
  ru: {
    translation: {
      // Общие
      'connectWallet': 'Подключить кошелек',
      'balance': 'Баланс',
      'max': 'МАКС',
      'disconnect': 'Отключить',
      'connected': 'Подключен',
      
      // Навигация
      'swap': 'Обмен',
      'buy': 'Покупка',
      'sell': 'Продажа',
      'transactions': 'Транзакции',
      
      // Страница Swap
      'selling': 'Продаете',
      'buying': 'Получаете',
      'exchangeRate': 'Курс обмена',
      'slippage': 'Проскальзывание',
      'enterAmount': 'Введите сумму',
      'selectDifferentTokens': '⚠️ Выберите разные токены',
      'insufficientBalance': '❌ Недостаточно средств',
      'swapTokens': 'Обменять',
      'flipTokens': 'Поменять местами',
      
      // Страница покупки
      'buyTokens': '💰 Покупка токенов',
      'buyDescription': 'Купите токены за ETH по текущему курсу',
      'paying': 'Платите (ETH)',
      'receiving': 'Получаете',
      'buyWith': 'Купить {{token}} за {{amount}} ETH',
      'howItWorks': 'Как это работает:',
      'buyExplanation': 'Вы отправляете ETH, получаете выбранные токены по текущему рыночному курсу. Курсы обновляются в реальном времени.',
      'processingPurchase': '⏳ Обработка покупки...',
      'enterETHAmount': 'Введите сумму ETH',
      'insufficientETH': '❌ Недостаточно ETH',
      
      // Страница продажи
      'sellTokens': '💸 Продажа токенов',
      'sellDescription': 'Продайте токены и получите ETH по текущему курсу',
      'sellingTokens': 'Продаете',
      'receivingETH': 'Получаете (ETH)',
      'sellFor': 'Продать {{token}} за {{amount}} ETH',
      'sellExplanation': 'Вы отправляете токены, получаете ETH по текущему рыночному курсу. Курсы обновляются в реальном времени.',
      'processingSale': '⏳ Обработка продажи...',
      'enterTokenAmount': 'Введите количество токенов',
      'insufficientTokens': '❌ Недостаточно {{token}}',
      
      // Страница транзакций
      'transactionHistory': '📜 История транзакций',
      'historyDescription': 'Все ваши операции обмена, покупки и продажи',
      'total': 'Всего',
      'pending': 'В ожидании',
      'success': 'Успешно',
      'failed': 'Неудачно',
      'filter': 'Фильтр:',
      'all': 'Все',
      'newest': 'Сначала новые',
      'oldest': 'Сначала старые',
      'clear': 'Очистить',
      'noTransactions': 'Нет транзакций',
      'noTransactionsWithFilter': 'Нет транзакций со статусом "{{filter}}"',
      'walletNotConnected': 'Кошелек не подключен',
      'connectToView': 'Подключите кошелек для просмотра истории транзакций',
      'firstTransaction': 'Совершите первую операцию обмена, покупки или продажи',
      'changeFilter': 'Попробуйте изменить фильтр или совершите новую операцию',
      'clearHistory': 'Очистить всю историю транзакций',
      'confirmClear': 'Вы уверены, что хотите очистить всю историю транзакций?',
      
      // Типы операций
      'purchase': 'Покупка',
      'sale': 'Продажа',
      'exchange': 'Обмен',
      
      // Статусы транзакций
      'statusPending': 'В ожидании',
      'statusSuccess': 'Успешно',
      'statusFailed': 'Неудачно',
      
      // Уведомления
      'swapStarted': 'Своп начат',
      'swapSuccess': '✅ Своп выполнен успешно!',
      'swapError': '❌ Ошибка свопа',
      'buyStarted': '💰 Покупка начата',
      'buySuccess': '✅ Покупка успешна!',
      'buyError': '❌ Ошибка покупки',
      'sellStarted': '💸 Продажа начата',
      'sellSuccess': '✅ Продажа успешна!',
      'sellError': '❌ Ошибка продажи',
      'unknownError': 'Неизвестная ошибка',
      'received': 'Получено {{amount}} {{token}}',
      'swapping': 'Обмениваем {{inputAmount}} {{inputToken}} на {{outputAmount}} {{outputToken}}',

      
      // Информация о сделке
      'rate': 'Курс',
      'totalCost': 'Общая стоимость',
      'ethPrice': 'Цена ETH',
      'tokenPrice': 'Цена {{token}}',
      'networkFee': 'Комиссия сети',
      'estimatedGas': '~{{amount}} ETH',
      'priceImpact': 'Влияние на цену',
      'minimumReceived': 'Минимум к получению',
      
      // Токены
      'selectToken': 'Выберите токен',
      'selectTokenForSelling': 'Выберите токен для продажи',
      'selectTokenForBuying': 'Выберите токен для покупки',
      'searchTokens': 'Поиск по названию или символу...',
      'addCustomToken': 'Добавить токен по адресу:',
      'contractAddress': '0x... (адрес контракта)',
      'addToken': 'Добавить',
      'tokenFound': 'Найден:',
      'symbol': 'Символ:',
      'decimals': 'Decimals:',
      'tokenNotFound': '⚠️ Токен не найден или это не ERC20 контракт',
      'invalidAddress': 'Неверный формат адреса',
      
      // Ошибки и предупреждения
      'walletNotConnectedError': 'Кошелек не подключен',
      'invalidAmount': 'Неверная сумма',
      'amountTooSmall': 'Сумма слишком мала',
      'amountTooLarge': 'Сумма слишком велика',
      'selectDifferentTokensError': 'Выберите разные токены',
      'loadingBalance': '⏳ Загрузка...',
      'balanceError': '❌ Ошибка',
      'retryConnection': 'Повторить подключение',
      
      // Дополнительная информация
      'aboutTransactionHistory': 'О истории транзакций:',
      'historyStoredLocally': 'История сохраняется локально в вашем браузере. Данные не передаются на сервер и доступны только вам.',
      'developmentMode': '🛠️ Режим разработки',
      'debugInfo': 'Отладочная информация',
      'fixedVersion': '🔧 Исправленная версия с прямым useBalance',
      'connectionStatus': 'Подключение: {{status}}',
      'balanceStatus': 'Баланс: {{status}}',
      'stateStatus': 'Состояние: {{status}}',
      
      // Форматирование
      'timeAgo': '{{time}} назад',
      'justNow': 'Только что',
      'minutesAgo': '{{count}}м назад',
      'hoursAgo': '{{count}}ч назад',
      'daysAgo': '{{count}}д назад',
      'txHash': 'TxHash: {{hash}}',
      'gasUsed': 'Gas: {{amount}}',
      'exchangeRateDisplay': '1 {{from}} = {{rate}} {{to}}'
    }
  }
}

// Инициализация i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru', // Язык по умолчанию
    fallbackLng: 'en', // Резервный язык
    
    interpolation: {
      escapeValue: false // React уже защищает от XSS
    },
    
    // Настройки для лучшей производительности
    react: {
      useSuspense: false // Отключаем Suspense для простоты
    },
    
    // Включаем интерполяцию для переменных в переводах
    // Например: t('buyWith', { token: 'USDC', amount: '0.5' })
    // Результат: "Купить USDC за 0.5 ETH"
    keySeparator: false, // Отключаем разделитель ключей для простоты
    nsSeparator: false,  // Отключаем пространства имен
  })

export default i18n