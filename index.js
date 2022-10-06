const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '1661204435:AAFaUQ0bn-SMxe852BJlzPxUm8L0XkoaOA0'

const bot = new TelegramApi(token, { polling: true })

const chats = {}



const startGame = async (chatId) => {
  await bot.sendMessage(chatId,'Сейчас я загадаю число от 0 до 9, а вы должны его угадать')
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
  bot.setMyCommands[
    ({ command: '/start', description: 'Начальное приветствие' },
    { command: '/sayHi', description: 'Поздороваться' },
    { command: '/game', description: 'Игра' })
  ]

  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/2.webp'
      )

      return bot.sendMessage(
        chatId,
        `Доброе пожаловать ${msg.from.first_name} ${msg.from.last_name}  в телеграм бот Бакыта`
      )
    }

    if (text === '/sayHi') {
      return bot.sendMessage(chatId, `Привет ${msg.from.username} !!!`)
    }

    if (text === '/game') {
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, 'Я вас не понял, попробуйте еще раз.')
  })

  bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return startGame(chatId)
    }

    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю вы отгадали цифру ${chats[chatId]}`, againOptions)
    } else {
      return bot.sendMessage(chatId, `К сожалению вы не угадали, бот загадал число ${chats[chatId]}`, againOptions)
    }
    
  })
}

start()
