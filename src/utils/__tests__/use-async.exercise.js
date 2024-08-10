import {renderHook, act} from '@testing-library/react'
import {useAsync} from '../hooks'

// 💰 I'm going to give this to you. It's a way for you to create a promise
// which you can imperatively resolve or reject whenever you want.
function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

// Use it like this:
// const {promise, resolve} = deferred()
// promise.then(() => console.log('resolved'))
// do stuff/make assertions you want to before calling resolve
// resolve()
// await promise
// do stuff/make assertions you want to after the promise has resolved

const defaultState = {
    data: null,
    error: null,
    isError: false,
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    reset: expect.any(Function),
    run: expect.any(Function),
    setData: expect.any(Function),
    setError: expect.any(Function),
    status: "idle"
}

test('calling run with a promise which resolves', async () => {
    const {promise, resolve} = deferred()
    const {result} = renderHook(useAsync)

    expect(result.current).toEqual(defaultState)

    let p = null;
    act(() => {
        p = result.current.run(promise)
    })

    expect(result.current).toEqual({
        ...defaultState,
        isIdle: false,
        isLoading: true,
        status: 'pending'
    })

    const data = Symbol({some: 'data'})
    await act(async() => {
        resolve(data)
        await p
    })

    expect(result.current).toEqual({
        ...defaultState,
        data,
        isIdle: false,
        isLoading: false,
        isSuccess: true,
        status: 'resolved'
    })

    await act(() => result.current.reset())

    expect(result.current).toEqual(defaultState)
})

test('calling run with a promise which rejects', async () => {
    const {promise, reject} = deferred()
    const {result} = renderHook(useAsync)

    expect(result.current).toEqual(defaultState)

    let p = null;
    act(() => {
        p = result.current.run(promise)
    })

    expect(result.current).toEqual({
        ...defaultState,
        isIdle: false,
        isLoading: true,
        status: 'pending'
    })

    const rejectedState = Symbol('rejected state')
    await act(async() => {
        reject(rejectedState)
        await p.catch(() => {
            // ignore error
        })
    })

    expect(result.current).toEqual({
        ...defaultState,
        error: rejectedState,
        isError: true,
        isIdle: false,
        isLoading: false,
        isSuccess: false,
        status: 'rejected'
    })

    await act(() => result.current.reset())

    expect(result.current).toEqual(defaultState)
})

test('can specify an initial state', () => {
    const mockedData = Symbol('resolved data')
    const customInitialState = {
        status: 'resolved',
        data: mockedData
    }
    const {result} = renderHook(() => useAsync(customInitialState))

    expect(result.current).toEqual({
        ...defaultState,
        data: mockedData,
        status: 'resolved',
        isIdle: false,
        isSuccess: true
    })
})

test('can set the data', () => {
    const mockedData = Symbol('new data')
    const {result} = renderHook(useAsync)

    act(() => {result.current.setData(mockedData)})

    expect(result.current).toEqual({
        data: mockedData,
        error: null,
        isError: false,
        isIdle: false,
        isLoading: false,
        isSuccess: true,
        reset: expect.any(Function),
        run: expect.any(Function),
        setData: expect.any(Function),
        setError: expect.any(Function),
        status: "resolved"
    })
})

test.todo('can set the error')
// 💰 result.current.setError('whatever you want')

test.todo('No state updates happen if the component is unmounted while pending')
// 💰 const {result, unmount} = renderHook(...)
// 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)

test.todo('calling "run" without a promise results in an early error')
