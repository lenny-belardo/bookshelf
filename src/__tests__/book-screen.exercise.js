import * as React from 'react'
import {
  render,
  screen,
  waitForLoadingToFinish,
  userEvent,
  loginAsUser,
} from 'test/app-test-utils'
import faker from 'faker'
import {buildBook, buildListItem} from 'test/generate'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import {formatDate} from 'utils/misc'
import {App} from 'app'

const fakeTimerUserEvent = userEvent.setup({ advanceTimers: () => jest.runOnlyPendingTimers(), })

test('renders all the book information', async () => {
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`

  await render(<App />, {route})

  expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute(
    'src',
    book.coverImageUrl,
  )
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()

  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('textbox', {name: /notes/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})

test('can create a list item for the book', async () => {
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`

  await render(<App />, {route})

  const addToListButton = screen.getByRole('button', {name: /add to list/i})
  await userEvent.click(addToListButton)
  expect(addToListButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(
    screen.getByRole('button', {name: /mark as read/i}),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', {name: /remove from list/i}),
  ).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /notes/i})).toBeInTheDocument()

  const startDateNode = screen.getByLabelText(/start date/i)
  expect(startDateNode).toHaveTextContent(formatDate(Date.now()))

  expect(
    screen.queryByRole('button', {name: /add to list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
})

test('can remove a list item for the book', async () => {
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`
  const user = await loginAsUser()

  await listItemsDB.create(buildListItem({owner: user, book}))

  await render(<App />, {route, user})

  expect(screen.getByRole('button', {name: /Remove from list/i})).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', {name: /Remove from list/i}))

  expect(screen.queryByRole('button', {name: /Remove from list/i})).not.toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /Add to list/i})).toBeInTheDocument()
})

test('can mark a list item as read', async () => {
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`
  const user = await loginAsUser()

  const listItem = await listItemsDB.create(buildListItem({owner: user, book, finishDate: null}))

  await render(<App />, {route, user})

  const markAsRead = screen.getByRole('button', {name: /mark as read/i})

  expect(markAsRead).toBeInTheDocument()

  await userEvent.click(markAsRead)

  expect(markAsRead).toBeDisabled()

  expect(screen.queryByRole('button', {name: /mark as read/i})).not.toBeInTheDocument()
  expect(screen.getByRole('button', {name: /mark as unread/i})).toBeInTheDocument()
  expect(screen.getByRole('button', {name: /remove from list/i})).toBeInTheDocument()
  expect(screen.getByLabelText(/start and finish date/i)).toHaveTextContent(`${formatDate(listItem.startDate)} — ${formatDate(Date.now())}`)
})

test('can edit a note', async () => {
  jest.useFakeTimers()
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`
  const user = await loginAsUser()

  const listItem = await listItemsDB.create(buildListItem({owner: user, book}))

  await render(<App />, {route, user})

  const newNotes = faker.lorem.words()
  const notesTextarea = screen.getByRole('textbox', {name: /notes/i})

  expect(notesTextarea).toBeInTheDocument()
  expect(notesTextarea).toHaveValue(listItem.notes)

  fakeTimerUserEvent.clear(notesTextarea)
  fakeTimerUserEvent.type(notesTextarea, newNotes)

  await screen.findByLabelText(/loading/i)
  await waitForLoadingToFinish()

  expect(notesTextarea).toHaveValue(newNotes)

  expect(await listItemsDB.read(listItem.id)).toMatchObject({
    notes: newNotes
  })
})
