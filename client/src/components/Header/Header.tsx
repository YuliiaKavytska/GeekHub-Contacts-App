import React, {useCallback} from 'react'
import {NavLink} from 'react-router-dom'
import logo from '../../assets/image/logo.png'
import {connect} from "react-redux"
import {StoreType} from "../../store"
import {LogOutTC} from "../../store/profile-reducer"

const Header: React.FC<StateType> = ({isAuth, LogOutTC}) => {

    const logOut = useCallback(() => {
        LogOutTC()
    }, [LogOutTC])

    return <nav className="navbar navbar-dark bg-primary sticky-top">
        <NavLink to='/' className="navbar-brand mr-auto">
            <img src={logo} width="35" height="35" className="d-inline-block align-top mr-3" alt="" loading="lazy"/>
            Contacts APP
        </NavLink>
        {isAuth
            ? <div>
                <NavLink to='/contacts' className="btn btn-success my-2 my-sm-0 mr-3">Contacts</NavLink>
                <NavLink to='/contacts' onClick={logOut} className="btn btn-danger my-2 my-sm-0 mr-3">Log Out</NavLink>
            </div>
            : <div>
                <NavLink to='/login' className="btn btn-success my-2 my-sm-0 mr-3">Log In</NavLink>
                <NavLink to='/signUp' className="btn btn-info my-2 my-sm-0">Sign Up</NavLink>
            </div>
        }
    </nav>
}
const mapState = (state: StoreType) => ({
    isAuth: state.app.isAuth
})
const dispatchType = {LogOutTC}

interface IDispatch {
    LogOutTC: () => void
}

type StateType = ReturnType<typeof mapState> & IDispatch

export default connect(mapState, dispatchType)(Header)