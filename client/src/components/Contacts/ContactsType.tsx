import React from "react"
import StarIcon from "../common/StarIcon"
import UsersIcon from "../common/UsersIcon"

export const Favorite: React.FC = () => {
    return <li className="media list-group-item list-group-item-warning">
        <StarIcon size={24} margin='mr-3'/>Favorite contacts
    </li>
}

export const AllContacts: React.FC = () => {
    return <li className="list-group-item list-group-item-primary">
        <UsersIcon/>All contacts
    </li>
}