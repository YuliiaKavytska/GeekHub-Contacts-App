import React from "react"
import {Field, FieldProps} from "formik"
import cn from "classnames"

interface IState {
    name: string
    type?: string
    placeholder: string
}

const FormField: React.FC<IState> = ({name, type = 'text', placeholder}) => {

    const nameField = name.charAt(0).toUpperCase() + name.slice(1)

    return <div className="form-row">
        <div className="col-md-12 mb-3">
            <label htmlFor={name}>{nameField}</label>
            <Field name={name}>
                {({form, field, meta}: FieldProps) => {
                    const isInvalid = (form.values[name] || form.touched[name]) && meta.error
                    const isValid = form.values[name] && !meta.error
                    return <>
                        <input {...field} type={type} id={name} placeholder={placeholder}
                               className={cn("form-control",
                                   {'is-valid': isValid},
                                   {'is-invalid': isInvalid})}
                        />
                        <div className={cn({'valid-feedback': isValid}, {'invalid-feedback': isInvalid})}>
                            {isInvalid || (form.values[name] && 'Looks good!')}
                        </div>
                    </>
                }}
            </Field>
        </div>
    </div>
}

export default FormField