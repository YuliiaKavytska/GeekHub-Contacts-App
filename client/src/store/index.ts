import {Action, applyMiddleware, combineReducers, createStore} from "redux"
import thunkMiddleware, {ThunkAction} from 'redux-thunk'
import appReducer from "./app-reducer"
import profileReducer from "./profile-reducer"

let reducersBranch = combineReducers({
    app: appReducer,
    profile: profileReducer,
})

const store = createStore(reducersBranch, applyMiddleware(thunkMiddleware))

export type StoreType = ReturnType<typeof store.getState>

export type InferActionsTypes<T> = T extends { [key: string]: (...args: any[]) => infer U } ? U : never
export type BaseThunkType<AT extends Action, P = Promise<void>> = ThunkAction<P, StoreType, unknown, AT>

export default store
