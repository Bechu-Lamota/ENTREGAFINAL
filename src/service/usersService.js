const { inactiveMail } = require('../config/nodemailer')
const UsersRepository = require('../repository/usersRepository')
const { createHash, isValidPassword } = require('../utils/passwordHash')

class UsersService {
	constructor() {
		this.repository = new UsersRepository()
	}

	async getUsers() {
		const users = await this.repository.getUsers()
		return users
	}

	async getUserById(uid) {
		return this.repository.getUserById(uid)
	}

	async getUserByEmail(email) {
		return this.repository.getUserByEmail(email)
	}

	async addUser(body) {
		try {
			return this.repository.addUser(body)
		} catch (error) {
			throw error
		}
	}

	async resetPassword(uid, password) {
		const user = await this.repository.getUserById(uid)

		if (isValidPassword(password, user.password)) throw new Error('New Password cannot be same as old one')

		const newPassword = createHash(password)
		return this.repository.resetPassword(uid, newPassword)
	}

	async updateUserRole(uid, newRole) {
		const ROLE_PREMIUM = 'PREMIUM'
		try {
			const user = await this.repository.getUserById(uid)
			if (!user) throw new Error('User not found');

			if (user.role === newRole) throw new Error('Already has that role')

			if (newRole === ROLE_PREMIUM) {
				const requiredDocuments = [
					`${uid}_Identificacion`,
					`${uid}_Comprobante de domicilio`,
					`${uid}_Comprobante de estado de cuenta`
				];

				//el siguiente array contendrá los documentos que están en requiredDocuments pero no en user.documents
				const missingDocuments = requiredDocuments.filter(doc => !user.documents.some(userDoc => userDoc.name === doc));

				//si hay documentos faltantes se procede a
				if (missingDocuments.length > 0) {
					const splitDocuments = requiredDocuments.map(document => {
						const [id, type] = document.split('_');
						return { id, type };
					});

					//nuevo array con solo los "tipos" de los archivos que estarían faltando
					const missingTypes = splitDocuments
						.filter(doc => missingDocuments.includes(`${doc.id}_${doc.type}`))
						.map(doc => doc.type);

					const missingDocumentsMessage = `You are missing the following documents: ${missingTypes.join(', ')}`;
					throw new Error(missingDocumentsMessage);
				}
			}
			return this.repository.updateUserRole(uid, newRole)
		} catch (error) {
			throw error
		}
	}

	async updatLastConnection(user) {
		return this.repository.updateLastConnection(user)
	}

	async updateUserDocuments(uid, files) {
		const user = await this.repository.getUserById(uid)
		const documentsToUpload = user.documents || [];

		files.forEach(file => {
			const fileName = file.filename.split('.');
			documentsToUpload.push({
				name: fileName[0],
				reference: `${process.env.BASE_URL}:${process.env.PORT}/img/documents/${file.filename}`,
			});
		});

		return this.repository.updateUserDocuments(uid, documentsToUpload)
	}

	async deleteUser(uid) {
		return this.repository.deleteUser(uid)
	}

	async deleteInactive() {
		try {
			const inactiveTime = new Date();

			inactiveTime.setMinutes(inactiveTime.getDay() - 2);
			const usersToDelete = await this.repository.getUsers({ last_connection: { $lt: inactiveTime } })

			if (usersToDelete.length === 0) throw new Error('No users to delete')

			for (const user of usersToDelete) {
				if (user.email) {
					await sendMail('Baja por inactividad', inactiveMail(user))
				}
			}

			return this.repository.deleteInactive(usersToDelete)
		} catch (error) {
			throw error
		}
	}
}

module.exports = UsersService