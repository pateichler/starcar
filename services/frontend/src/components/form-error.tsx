export default function FormError({errors}: {errors?: string[]}){
    if(errors && errors.length > 0)
        return <span className="error">{errors.join(",")}</span>
    
    return <></>
}