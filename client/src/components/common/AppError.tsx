import React from 'react';

interface iState {
    message: string
}

const AppError: React.FC<iState> = ({message}) => {
    return <div className="alert alert-danger mt-3" role="alert">
        {message}
    </div>
}

export default AppError