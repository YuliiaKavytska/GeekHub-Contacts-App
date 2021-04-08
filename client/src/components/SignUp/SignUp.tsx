import React, {useCallback} from 'react'
import {NavLink, Redirect} from "react-router-dom"
import AppError from "../common/AppError"
import {StoreType} from "../../store"
import {RegisterTC} from "../../store/app-reducer"
import {IRegisterData} from "../../types/types"
import {connect} from "react-redux"
import HelloCard from "../common/HelloCard"
import {Form, Formik} from 'formik'
import * as yup from 'yup'
import FormField from "../common/FormFields/FormField"

const SignUp: React.FC<StateType> = ({error, RegisterTC, isAuth}) => {

    const SignupSchema = yup.object({
        name: yup.string()
            .min(3)
            .matches(/^[a-zа-щієїґюьяыёъ\s]+$/i, 'Field should contain only characters')
            .required('Name is requires'),
        email: yup.string().trim().email('Invalid email').required('Login is required'),
        password: yup.string()
            .trim()
            .min(8)
            .max(50)
            .matches(/\d+/, 'Password should include one number')
            .matches(/[a-zа-щієїґюьяыёъ]+/, 'Password should include one lowercase later')
            .matches(/[A-ZА-ЩІЄЇҐЮЬЯЫЁЪ]+/, 'Password should include one uppercase later')
            .required('Password is required')
    })

    const onSubmit = useCallback((values) => {
        RegisterTC(values)
    }, [RegisterTC])

    const initialValues = {name: '', email: '', password: ''}

    if (isAuth) return <Redirect to='/contacts'/>

    return <div className="mt-4">
        <HelloCard title='Sign Up'/>
        {error && <AppError message={error.message}/>}
        <Formik initialValues={initialValues}
                validationSchema={SignupSchema}
                onSubmit={onSubmit}>
            <Form className='py-3'>
                <FormField name='name' placeholder='Name'/>
                <FormField name='email' placeholder='name@example.com'/>
                <FormField name='password' type='password' placeholder='Example123'/>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </Form>
        </Formik>
        <hr/>
        <NavLink to='/login' className="dropdown-item">Have an account? Log in</NavLink>
    </div>
}

const mapState = (state: StoreType) => ({
    error: state.app.error,
    isAuth: state.app.isAuth
})

const dispatchState = {
    RegisterTC
}

interface IDispatch {
    RegisterTC: (data: IRegisterData) => void
}

type StateType = ReturnType<typeof mapState> & IDispatch

export default connect(mapState, dispatchState)(SignUp)