import React, {ComponentType, useCallback} from "react"
import {Redirect, useHistory, useParams} from "react-router-dom"
import {ShowErrorTC} from "../../store/app-reducer"
import {StoreType} from "../../store"
import {deleteContactTC, editContactDataTC} from "../../store/profile-reducer"
import {compose} from "redux"
import {connect} from "react-redux"
import {withAuthRedirect} from "../HOC/withAuthRedirect"
import Edit from "./Edit"
import {IContact, IError} from "../../types/types"

const EditContainer: React.FC<StateType> = ({contacts, deleteContactTC, editContactDataTC, ShowErrorTC, error}) => {

    const deleteContact = useCallback((id: number) => {
        deleteContactTC(id)
    }, [deleteContactTC])

    const history = useHistory()
    const editContact = useCallback((data: IContact) => {
        const result = editContactDataTC(data)

        result.then(result => {
            if (result) {
                history.push('/contacts')
            }
        })
    }, [editContactDataTC, history])

    const param = useParams<{ [key: string]: string }>()
    const contact = contacts?.find(contact => contact.id === +param.id)

    if (!contact) {
        ShowErrorTC({message: 'User wasn`t found'})
        return <Redirect to='/contacts'/>
    }
    return <Edit contact={contact} deleteContact={deleteContact} editContact={editContact} error={error}/>
}

const mapState = (state: StoreType) => ({
    contacts: state.profile.profile?.contacts,
    error: state.app.error
})

const mapDispatch = {
    deleteContactTC,
    editContactDataTC,
    ShowErrorTC
}

interface IDispatch {
    deleteContactTC: (id: number) => void
    editContactDataTC: (data: IContact) => Promise<boolean>
    ShowErrorTC: (err: IError, time?: number) => void
}

type StateType = ReturnType<typeof mapState> & IDispatch

export default compose<ComponentType>(
    connect(mapState, mapDispatch),
    withAuthRedirect
)(EditContainer)