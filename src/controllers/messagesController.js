const MessagesMemory = require('../dao/mongo/messagesMongoDAO')

class MessagesController {
  constructor(io) {
    this.io = io;
    this.messageMemory = new MessagesMemory(io);

    io.on('connection', this.connection.bind(this));
  }

  async connection(socket) {
    console.log('Nuevo cliente conectado', socket.id);

    socket.on('joinChat', this.joinChat.bind(this, socket));
    socket.on('newMessage', this.newMessage.bind(this, socket));
  }

  async joinChat(socket, newUser) {
    try {
      socket.broadcast.emit('notification', `El usuario ${newUser} se unió al chat`);

      const messages = await this.messageMemory.getMessages();

      const formattedMessages = messages.map((content) => ({
        ...content,
        formattedTimerecord: this.formatTimerecord(content.timerecord),
      }))

      socket.emit('previousMessages', formattedMessages);
    } catch (error) {
      socket.emit('notification', { 
        message: error.message, 
        type: 'error' 
    })
    }
  }

  async newMessage(socket, { user, content }) {
    try {
      const newMessage = await this.messageMemory.addMessage(user, content);
      socket.broadcast.emit('notification', `Hay un nuevo mensaje de ${user}`);

      this.io.emit('newMessage', {
        user: newMessage.user,
        content: newMessage.content,
        timerecord: this.formatTimerecord(newMessage.timerecord),
      })
    } catch (error) {
      socket.emit('notification', { 
        message: error.message, 
        type: 'error'
    })
    }
  }

  formatTimerecord(timerecord) {
    const date = new Date(timerecord)
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    return formattedDate;
  }
}

module.exports = MessagesController
