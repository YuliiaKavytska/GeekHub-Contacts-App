import React, {useCallback} from "react"
import {Favorite} from "./ContactsType"
import {IContact} from "../../types/types"
import Contact from "./Contact"

interface IState {
    favorites: Array<IContact>
    toggleFavoriteUser: (id: number, event: boolean) => void
}

const FavoriteContacts: React.FC<IState> = ({favorites, toggleFavoriteUser}) => {

    const deleteFromFavorite = useCallback((id: number) => {
        toggleFavoriteUser(id, false)
    }, [toggleFavoriteUser])

    return <>
        {favorites.length > 0 && <Favorite/>}
        {favorites.map(contact => <Contact key={contact.id} contact={contact}
                                           toggleFavoriteUser={deleteFromFavorite}/>)}
    </>
}

export default FavoriteContacts