import React, {useCallback} from 'react'
import {NavLink} from "react-router-dom"
import anonim from "../../assets/image/anonim.png"
import EditingIcon from '../common/EditingIcon'
import PhoneIcon from '../common/PhoneIcon'
import StarIcon from "../common/StarIcon"
import {IContact} from "../../types/types"

interface IState {
    contact: IContact
    toggleFavoriteUser: (id: number) => void
}

const Contact: React.FC<IState> = ({contact, toggleFavoriteUser}) => {

    const changeFavoriteStatus = useCallback(() => {
        toggleFavoriteUser(contact.id)
    }, [toggleFavoriteUser, contact.id])

    return <li className="media list-group-item list-group-item-action d-flex align-items-center">
        <NavLink to={'/show/' + contact.id} className="d-flex mr-auto">
            <div className='overflow-hidden mr-4 size_show'>
                <img src={contact.avatar || anonim} className="rounded float-left mr-3" alt=""/>
            </div>
        </NavLink>
        <div className="media-body mr-auto">
            <NavLink to={'/show/' + contact.id} className="d-flex mr-auto">
                <h5 className="mt-0 mb-1">{contact.name}</h5>
            </NavLink>
            {contact.phones.map(phone =>
                <a key={phone.id} className="d-block" href={"tel:" + phone.number}>{phone.number}</a>
            )}
        </div>
        <div className="btn-group" role="group" aria-label="Basic example">
            <a href={"tel:" + contact.phones[0].number} className='btn btn-success'>
                <PhoneIcon/> Call
            </a>
            <button className='btn btn-warning' onClick={changeFavoriteStatus}>
                <StarIcon size={18}/>
            </button>
            <NavLink to={'/edit/' + contact.id} type='button' className='btn btn-danger'>
                <EditingIcon/>Edit
            </NavLink>
        </div>
    </li>
}

export default Contact