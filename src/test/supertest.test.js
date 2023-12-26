// npm run supertest
import chai from 'chai'
import supertest from 'supertest'
import ProductsController from '../controllers/productsController'

const expect = chai.expect
const requester = supertest('http://localhost:8080')

//Utilizando los archivos de la clase 40
describe('Testing ecommerce SWISH', function () {
	describe('Test de PRODUCTOS', function () {
		const product = {
			tittle: 'Yogurt',
			description: 'Yogurt vegano refinado',
			price: '200',
			code: 'YoG-VgGn200',
			thumbnail: '"jzavis/upload/ygVgn200.png"',
			category: 'Almacen'
		}

		it('Debe crear correctamente un producto', async function () {
			const { _body } = (await requester.post('/api/products')).send(product)
			console.log({ _body })

			expect(_body.payload).to.be.ok
		})

		it('Debe obtener correctamente un producto', async function () {
			const { _body } = (await requester.get('/api/products')).setEncoding(product)
			console.log({ _body })

			expect(_body.payload).to.be.ok
		})

		it('Debe eliminar correctamente un producto', async function () {
			const { _body } = (await requester.delete('/api/products/:id')).send(product)
			console.log({ _body })

			expect(_body.payload).to.be.ok
		})

		beforeEach(function () {
			this.thimeout(5000) //Cada test que ejecute tendra un tiempo de 5 segundos.
		})
	})

	//HANDS ON LAB
	describe('Test avanzado de SESIONES', function () {
		const user = {
			name: 'TEST1',
			lastname: '0001',
			age: '29',
			email: `emailpruebaNumero_${(new Date()).getTime()}@mail.com`,
			phone: '1122334455',
			password: '123',
			role: 'ADMIN'
		}

		it('Debe registrar correctamente el usuario', async function () {
			const { _body } = (await requester.post('/api/sessions/register')).send(user)
			console.log({ _body })

			expect(_body.payload).to.be.ok
		})

		it('Debe logguearse correctamente el usuario creado recientemente y devolver una cookie', async function () {
			const { headers } = await requester.post('/api/sessions/login').send({
				email: user.email,
				password: user.password
			})

			const cookieResult = headers['set-cookie']
			cookie = {
				name: cookieResult.split('=')[0],//Me divide las posiciones desde el punto marcado '='
				value: cookieResult.split('=')[1].replace(': Max-Age', '')
			}

			expect(cookie.name).to.be.ok.and.eql('coderCookie')
			expect(cookie.value).to.be.ok
		})

		it('Debe enviar la cookie que contiene el usuario y obtiene el payload', async function () {
			const { _body, statusCode, ok } = await (await requester.get('/api/sessions/current')).send('Cookie', [
				`${cookie.name}=${cookie.value}`
			])

			console.log({ _body, statusCode, ok })
		})
	})

	describe('Test avanzado de CARRITOS', function () {
		before(function () {
			this.ProductsController = new ProductsController()
		})

		it('Debe obtener correctamente todos los carritos', async function () {
			const { body } = await requester.get('/api/carts')
			console.log({ body })

			expect(body).to.be.an('array')
			expect(body.length).to.be.greaterThan(0)
		});

		it('Debe obtener correctamente un carrito por ID', async function () {
			const { body } = await requester.get('/api/carts/:cid')
			console.log({ body })

			expect(body).to.be.an('object')
		});

		it('Debe agregar correctamente un producto al carrito', async function () {
			const product = await this.ProductsController.getProductById({ _id: product.id})
			const { body } = await requester.post('/api/carts/:id/product/:pid').send({ product })
			console.log({ body })

			expect(body.message).to.equal('Product added to cart successfully')
		});
	})
})