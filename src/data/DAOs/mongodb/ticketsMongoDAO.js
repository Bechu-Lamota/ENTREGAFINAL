const ticketModel = require('../models/ticketModel')
const { v4: uuidv4 } = require('uuid')

class ticketsMongoDAO {
	constructor() {
		this.ticket = ticketModel
	}

	async getTicketById(id) {
		try {
			const order = await this.ticket.findById(id)
			if (!order) {
				throw new Error('Orden no encontrada')
			}
			return order
		} catch (error) {
			throw error
		}
	}

	async addTicket(data) {
		try {
			const order = await this.ticket.create({
				code: uuidv4(),
				amount: data.amount,
				purchaser: data.purchaser
			})
			return order
		} catch (error) {
			throw error
		}
	}
}

module.exports = ticketsMongoDAO