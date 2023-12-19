const messageModel = require('../models/messageModel')

class MessagesMemory {
    constructor (io) {
      this.messagesModel = messageModel
      this.io = io
    }
    
    async getMessages() {
        try{
            const messages = await this.messagesModel.find()
            
            return messages
        } catch (error) {
            throw error
                }
            }

    async addMessage( user, content, timerecord ) {
        try{
            const newMessage = await this.messagesModel.create({
                user: user,
                content: content,
                timerecord: timerecord
            })
            
            this.emitMessage(newMessage)

            return newMessage
        } catch (error) {
            throw error
                }
            }

    emitMessage(message) { //De esta manera el evento tiene un método privado
        this.io.emit('newMessage', {
            user: message.user,
            message: message.content,
            timerecord: message.timerecord
        })
    }

    }

module.exports = MessagesMemory