import React, {ComponentType, Suspense} from 'react'
import Preloader from "../common/Preloader/Preloader"

export const withSuspense = (Component: ComponentType) => {

    const lazyComponent: React.FC = (props) => {
        return <Suspense fallback={<Preloader/>}>
            <Component {...props} />
        </Suspense>
    }
    return lazyComponent
}