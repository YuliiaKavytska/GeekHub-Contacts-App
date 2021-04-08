import React, {useCallback} from "react"
import {FieldProps, getIn} from "formik"
import cn from "classnames"
import {defineOperator} from "../defineOperator"

type IState = FieldProps & {
    push: () => void
    remove: () => void
    length: number
    phone: string
    i: number
}

export const PhoneField: React.FC<IState> = ({field, form, push, remove, length, phone, i}) => {

    const {errors, values, touched} = form
    const name = field.name
    const errorMessage = getIn(errors, name)
    const operator = defineOperator(phone)

    const removeCurrentPhone = useCallback(() => remove(), [remove])
    const addPhone = useCallback(() => push(), [push])

    const isValid = values.phones[i].number && !errorMessage
    const isInvalid = (values.phones[i].number || touched.phones) && errorMessage

    return <div className="form-row">
        <div className="col-md-12 mb-3">
            <div className="input-group">
                <img src={operator} width="39" height="39" className="rounded float-left mr-3" alt=""/>
                <input {...field} placeholder='+380930000000'
                       className={cn("form-control", {'is-valid': isValid}, {'is-invalid': isInvalid})}
                />
                <div className="input-group-append">
                    {length > 1 &&
                    <button className="btn btn-danger" onClick={removeCurrentPhone} type="button">Delete</button>}
                    <button className="btn btn-success" onClick={addPhone} type="button">Add phone</button>
                </div>
                <div className={cn({'valid-feedback': isValid}, {'invalid-feedback': isInvalid})}>
                    {isInvalid || (values.phones[i].number && 'Looks good!')}
                </div>
            </div>
        </div>
    </div>
}

export default PhoneField