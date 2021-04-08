import {BaseThunkType, InferActionsTypes} from "."
import {IContact, IUser} from "../types/types"
import {actions as appActions, ActionsType as appActionsTypes, ShowErrorTC} from './app-reducer'
import {ajax, createFormData} from "./commonFunktion"

let initialState = {
    profile: null as IUser | null
}

const profileReducer = (state = initialState, action: ActionTypes): StateType => {
    switch (action.type) {
        case "CA/PROFILE/SET_PROFILE":
            return {
                ...state,
                profile: action.profile
            }
        case "CA/CONTACTS/TOGGLE_FAV_USER":
            const changedContacts = state.profile?.contacts?.map(contact => {
                if (contact.id === action.id) {
                    return {
                        ...contact,
                        isFavorite: action.event
                    }
                }
                return contact
            })
            return {
                ...state,
                profile: {
                    ...state.profile,
                    contacts: changedContacts
                } as IUser
            }
        case "CA/CONTACTS/DELETE_CONTACT":
            return {
                ...state,
                profile: {
                    ...state.profile,
                    contacts: state.profile?.contacts?.filter(contact => contact.id !== action.id)
                } as IUser
            }
        case "CA/CONTACTS/EDIT_USER_DATA":
            const updatedContacts = state.profile?.contacts?.map(contact =>
                contact.id === action.data.id ? action.data : contact)
            return {
                ...state,
                profile: {
                    ...state.profile,
                    contacts: updatedContacts
                } as IUser
            }
        case "CA/CONTACTS/ADD_CONTACT":
            let withNewContact
            if (state.profile?.contacts) {
                withNewContact = [...state.profile.contacts, action.contact]
            } else {
                withNewContact = [action.contact]
            }
            return {
                ...state,
                profile: {
                    ...state.profile,
                    contacts: withNewContact
                } as IUser
            }
        default:
            return state
    }
}

export const actions = {
    setProfile: (profile: IUser | null) => ({type: 'CA/PROFILE/SET_PROFILE', profile} as const),
    toggleFavoriteUser: (id: number, event: boolean) => ({type: 'CA/CONTACTS/TOGGLE_FAV_USER', id, event} as const),
    deleteContact: (id: number) => ({type: 'CA/CONTACTS/DELETE_CONTACT', id} as const),
    addContact: (contact: IContact) => ({type: 'CA/CONTACTS/ADD_CONTACT', contact} as const),
    editUserData: (data: IContact) => ({type: 'CA/CONTACTS/EDIT_USER_DATA', data} as const)
}

export const getUserTC = (userData: { email: string, password: string }): ThunkType<Promise<boolean | undefined>> => async (dispatch) => {
    const response = await ajax('/api/getUser', 'POST', userData)

    if (response.status === 200) {
        const jsonResp = await response.json()
        const profile = jsonResp.data
        dispatch(actions.setProfile(profile))
        return true
    }
    try {
        const jsonResp = await response.json()
        if (jsonResp.hasOwnProperty('message')) {
            await dispatch(ShowErrorTC(jsonResp))
        }
    } catch (err) {
        await dispatch(ShowErrorTC({message: 'Some error: user wasn`t be got.'}))
    }
}

export const changeFavoriteUserTC = (contactId: number, event: boolean): ThunkType => async (dispatch, getState) => {
    dispatch(actions.toggleFavoriteUser(contactId, event))
    let response
    if (event) {
        response = await ajax(`/api/user/favorite/${contactId}`, 'PUT')
    } else {
        response = await ajax(`/api/user/favorite/${contactId}`, 'DELETE')
    }
    if (response.status !== 200) {
        dispatch(actions.toggleFavoriteUser(contactId, !event))

        try {
            const jsonResp = await response.json()
            if (jsonResp.hasOwnProperty('message')) {
                await dispatch(ShowErrorTC(jsonResp))
            }
        } catch (err) {
            await dispatch(ShowErrorTC({message: 'Some error: can`t set contact`s favorite status.'}))
        }
    }
}

export const deleteContactTC = (id: number): ThunkType => async (dispatch, getState) => {
    const deletedContact = getState().profile.profile?.contacts?.find(contact => contact.id === id)
    dispatch(actions.deleteContact(id))

    const response = await ajax(`/api/user/contact/${id}`, 'DELETE')
    if (response.status !== 200) {
        if (deletedContact) {
            dispatch(actions.addContact(deletedContact))
        }

        try {
            const jsonResp = await response.json()
            if (jsonResp.hasOwnProperty('message')) {
                await dispatch(ShowErrorTC(jsonResp))
            }
        } catch (err) {
            await dispatch(ShowErrorTC({message: 'Some error: Something wrong, user can`t be deleted.'}))
        }
    }
}

export const LogOutTC = (): ThunkType => async (dispatch) => {
    dispatch(appActions.setAuthorized(false))
    dispatch(actions.setProfile(null))
    localStorage.removeItem('CA/user')
}

export const editContactDataTC = (data: IContact<string | File>): ThunkType<Promise<boolean | undefined>> => async (dispatch, getState) => {
    const currentContactState = getState().profile.profile?.contacts?.find(contact => contact.id === data.id)

    const formData = createFormData(data)
    if (typeof data.avatar === 'object') {
        data.avatar = '/' + data.avatar.name
    }
    dispatch(actions.editUserData(data as IContact))

    let response = await fetch(`/api/user/contact/edit`, {method: "POST", body: formData})
    if (response.status === 200) return true

    dispatch(actions.editUserData(currentContactState as IContact))

    try {
        const jsonResp = await response.json()
        if (jsonResp.hasOwnProperty('message')) {
            await dispatch(ShowErrorTC(jsonResp))
        }
    } catch (err) {
        await dispatch(ShowErrorTC({message: 'Some error: Something wrong, user`s info can`t be changed.'}))
    }
}

export const newContactTC = (data: IContact<string | File>): ThunkType<Promise<boolean | undefined>> => async (dispatch, getState) => {
    const userId = getState().profile.profile?.id

    const formData = createFormData(data)
    if (typeof data.avatar === 'object') {
        data.avatar = '/' + data.avatar.name
    }

    const response = await fetch(`/api/user/${userId}/contact/new`, {method: "POST", body: formData})
    if (response.status === 200) {
        const responseJson = await response.json()
        data.id = responseJson.id
        dispatch(actions.addContact(data as IContact))
        return true
    }

    try {
        const jsonResp = await response.json()
        if (jsonResp.hasOwnProperty('message')) {
            await dispatch(ShowErrorTC(jsonResp))
        }
    } catch (err) {
        await dispatch(ShowErrorTC({message: 'Some error: Something wrong, user`s info can`t be added.'}))
    }
}

type StateType = typeof initialState
export type ActionTypes = InferActionsTypes<typeof actions>
type ThunkType<P = Promise<void>> = BaseThunkType<ActionTypes | appActionsTypes, P>
export default profileReducer