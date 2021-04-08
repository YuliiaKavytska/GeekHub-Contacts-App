import {BaseThunkType, InferActionsTypes} from "."
import {IError, ILogin, IRegisterData} from "../types/types"
import {getUserTC} from "./profile-reducer"
import {ajax} from "./commonFunktion"

let initialState = {
    initialized: false,
    error: null as IError | null,
    isAuth: false
}

const appReducer = (state = initialState, action: ActionsType): StateType => {
    switch (action.type) {
        case "CA/APP/SET_INITIALIZED":
            return {
                ...state,
                initialized: true
            }
        case "CA/APP/SET_ERROR":
            return {
                ...state,
                error: action.err
            }
        case "CA/PROFILE/SET_AUTHORIZED":
            return {
                ...state,
                isAuth: action.event
            }
        default:
            return state
    }
}

export const actions = {
    setInitialized: () => ({type: 'CA/APP/SET_INITIALIZED'} as const),
    setError: (err: IError | null) => ({type: 'CA/APP/SET_ERROR', err} as const),
    setAuthorized: (event: boolean) => ({type: 'CA/PROFILE/SET_AUTHORIZED', event} as const)
}

export const initializeAppTC = (): ThunkType => async (dispatch, getState) => {
    let storage = await localStorage.getItem('CA/user')
    if (storage) {
        try {
            const userData = JSON.parse(storage)

            if (userData.hasOwnProperty('email') && userData.hasOwnProperty('password')) {
                const response = await dispatch(getUserTC(userData))

                if (response) {
                    dispatch(actions.setAuthorized(true))
                }
            } else {
                await dispatch(ShowErrorTC({message: 'Your data is incorrect. Log In with correct login and password'}))
            }
        } catch (err) {
            await dispatch(ShowErrorTC({message: 'Some error: Something wrong, user`s info can`t be got.'}))
        }
    }
    if (!getState().app.initialized) {
        dispatch(actions.setInitialized())
    }
}

export const RegisterTC = (data: IRegisterData): ThunkType => async (dispatch) => {
    let response = await ajax('/api/signUp', 'POST', data)
    if (response.status === 200) {
        localStorage.setItem('CA/user', JSON.stringify({email: data.email, password: data.password}))
        await dispatch(initializeAppTC())
    } else {
        try {
            const jsonResp = await response.json()
            if (jsonResp.hasOwnProperty('message')) {
                await dispatch(ShowErrorTC(jsonResp))
            }
        } catch (err) {
            await dispatch(ShowErrorTC({message: 'Some error: Something wrong, user`s info can`t be registered.'}))
        }
    }
}

export const LogInTC = (data: ILogin): ThunkType => async (dispatch) => {
    localStorage.setItem('CA/user', JSON.stringify(data))
    await dispatch(initializeAppTC())
}

export const ShowErrorTC = (err: IError, time: number = 5000): ThunkType => async (dispatch) => {
    dispatch(actions.setError(err))
    setTimeout(() => dispatch(actions.setError(null)), time)
}

type StateType = typeof initialState
export type ActionsType = InferActionsTypes<typeof actions>
type ThunkType<T = Promise<void>> = BaseThunkType<ActionsType, T>
export default appReducer