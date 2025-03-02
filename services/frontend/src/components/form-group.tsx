import React from 'react'
import { ErrorMessage } from "@/types/error-message"
import FormError from "./form-error"

interface InputChildren {
    name: string
}

export default function FormGroup({labelName, error, children}: {labelName: string, error?: ErrorMessage, children: React.ReactNode}){
    // Could get input name dynamically from children
    let inputName = "";
    React.Children.toArray(children).every(function(child, _) {
        if(!React.isValidElement<InputChildren>(child))
            return true;

        const inputChild: React.ReactElement<InputChildren> = child;
        if(child.props.name === undefined)
            return true;
        
        inputName = inputChild.props.name;
        return false;
    });

    const hasError = error?.items && error.items[inputName] != undefined && error.items[inputName].length > 0;
    const items = error?.items && hasError ? error.items[inputName] : undefined;

    return (
        <div className={`form-group ${hasError ? "form-error" : ""}`}>
            <label htmlFor={inputName}>{labelName}</label>
            { children }
            { hasError ? (<FormError errors={items}></FormError>): <></>}
        </div>
    )
}