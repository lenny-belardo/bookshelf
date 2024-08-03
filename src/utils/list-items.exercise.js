import {queryCache, useMutation, useQuery} from 'react-query'
import {client} from 'utils/api-client'

const defaultMutationOptions = {onSettled: () => queryCache.invalidateQueries('list-items')}

function useListItems(user) {
    const {data: listItems} = useQuery({
        queryKey: 'list-items',
        queryFn: () =>
          client(`list-items`, {token: user.token}).then(data => data.listItems),
    })

    return listItems ?? []
}

function useListItem(user, bookId) {
    const listItems = useListItems(user);
    return listItems.find(li => li.bookId === bookId) ?? null
}

function useUpdateListItem(user) {
    return useMutation(
        updates =>
          client(`list-items/${updates.id}`, {
            method: 'PUT',
            data: updates,
            token: user.token,
          }),
        defaultMutationOptions,
      )
}


function useRemoveListItem(user) {
    return useMutation(
        ({id}) => client(`list-items/${id}`, {method: 'DELETE', token: user.token}),
        defaultMutationOptions,
    )
}

function useCreateListItem(user) {
    return useMutation(
        ({bookId}) => client(`list-items`, {data: {bookId}, token: user.token}),
        defaultMutationOptions,
    )
}

export {useListItem, useCreateListItem, useListItems, useRemoveListItem, useUpdateListItem}
