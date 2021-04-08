import React from 'react'

interface IState {
    title: string
}

const HelloCard: React.FC<IState> = ({title}) => {
    return <div>
        <h2 className="display-4">Hello! This is {title}.</h2>
        <p className="lead">This is a simple contacts APP. Authorize or create an account to use all possibility</p>
        <hr className="my-4"/>
    </div>
}

export default HelloCard