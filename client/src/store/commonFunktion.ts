import {IContact, methodsTypes} from "../types/types"

export const createFormData = (data: IContact<string | File>) => {
    let formData = new FormData();
    for (let key in data) {
        if (data.hasOwnProperty(key) && typeof data[key] !== 'string' && key !== 'avatar') {
            formData.append(key, JSON.stringify(data[key]))
        } else {
            formData.append(key, data[key])
        }
    }
    return formData
}

export const ajax = (url: string, method: methodsTypes, body = {}): Promise<any> => {
    let settings: ISettings = {
        method,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
        }
    }
    if (Object.keys(body).length > 0) {
        settings["body"] = JSON.stringify(body)
    }
    return fetch(url, settings)
}

interface ISettings {
    [key: string]: string | object

    headers: { [key: string]: string }
    method: methodsTypes
}