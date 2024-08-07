import {server, rest} from 'test/server'
import {client} from '../api-client'

beforeAll(() => server.listen())

afterAll(() => server.close())

afterEach(() => server.resetHandlers())

const apiURL = process.env.REACT_APP_API_URL

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult))
    }),
  )

  const result = await client(endpoint);

  expect(result).toEqual(mockResult)
})

test('adds auth token when a token is provided', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  const token = 'token'
  let request = null

  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req

      return res(ctx.json(mockResult))
    }))

  await client(endpoint, {token});

  expect(request.headers.get('Authorization')).toEqual(`Bearer ${token}`)
})

test('allows for config overrides', async () => {
  const endpoint = 'test-endpoint'
  const mockResult = {mockValue: 'VALUE'}
  const config = {
    method: 'PUT',
    headers: {'Content-Type': 'application/svg'}
  }
  let request = null

  server.use(
    rest.put(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      request = req

      return res(ctx.json(mockResult))
    })
  )

  await client(endpoint, config)

  expect(request.mode).toEqual('cors')
  expect(request.headers.get('Content-Type')).toEqual(config.headers['Content-Type'])
})

test('when data is provided, it is stringified and the method defaults to POST', async () => {
  const endpoint = 'test-endpoint'
  const data = {
    data: "some data"
  }

  server.use(
    rest.post(`${apiURL}/${endpoint}`, (req, res, ctx) => {
      return res(ctx.json(req.body))
    })
  )

  const result = await client(endpoint, {data})

  expect(result).toEqual(data)
})
