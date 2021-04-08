import React, {ComponentType} from 'react'
import {connect} from "react-redux"
import {Redirect} from 'react-router-dom'
import {StoreType} from "../../store"

const mapState = (state: StoreType) => ({
    isAuth: state.app.isAuth
})

type IState = ReturnType<typeof mapState>

export const withAuthRedirect = (Component: ComponentType) => {

    const authRedirect: React.FC<IState> = (props) => {
        const {isAuth, ...rest} = props

        if (!props.isAuth) {
            return <Redirect to='/login'/>
        }
        return <Component {...rest}/>
    }

    return connect(mapState)(authRedirect)
}