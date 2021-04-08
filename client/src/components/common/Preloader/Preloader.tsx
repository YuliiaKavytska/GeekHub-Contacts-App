import React from 'react';
import style from './Preloader.module.css';

const Preloader: React.FC = () => {
    return <div className={'d-flex justify-content-center align-items-center ' + style.min_height}>
        <div className={"spinner-border text-primary " + style.size} role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>
}

export default Preloader