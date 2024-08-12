import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'

afterEach(async () => {
    queryCache.clear()
    await auth.logout()
})

test('renders all the book information', async () => {
    const user = buildUser()
    window.localStorage.setItem(auth.localStorageKey, 'SOME_TOKEN')

    const book = buildBook()
    window.history.pushState({}, 'Test page', `/book/${book.id}`)

    const originalFetch = window.fetch
    window.fetch = async (url, config) => {
        console.log("url", url)
        if (url.endsWith('/bootstrap')) {
            return {
                ok: true,
                json: async () => ({
                    user: {
                        ...user,
                        token: 'SOME_TOKEN'
                    },
                    listItems: [],
                })
            }
        } else if (url.endsWith(`/books/${book.id}`)) {
            return {
                ok: true,
                json: async () => ({book})
            }
        }

        return originalFetch(url, config)
    }

    render(<App />, {wrapper: AppProviders})
    await waitForElementToBeRemoved(() => [
        ...screen.queryAllByText(/loading/i),
        ...screen.queryAllByLabelText(/loading/i)
    ])

    expect(screen.getByText(book.title)).toBeInTheDocument()
    expect(screen.getByText(book.author)).toBeInTheDocument()
    expect(screen.getByText(book.publisher)).toBeInTheDocument()
    expect(screen.getByText(book.synopsis)).toBeInTheDocument()

    expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute('src', book.coverImageURL)

    expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /remove from list/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /mark as read/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /mark as unread/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('textarea', {name: /notes/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()

    expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()

    // screen.debug()

    // 🐨 reassign window.fetch to another function and handle the following requests:
    // - url ends with `/bootstrap`: respond with {user, listItems: []}
    // - url ends with `/list-items`: respond with {listItems: []}
    // - url ends with `/books/${book.id}`: respond with {book}
    // 💰 return Promise.resolve({ok: true, json: async () => ({ /* response data here */ })})


    // 🐨 assert the book's info is in the document
})

