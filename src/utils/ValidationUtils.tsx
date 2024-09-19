export const validateName = (name : string) =>{
    if(name == ''){
        return {msg : 'Please enter full name', result: false}
    }

    if(name?.length <=3){
        return {msg : 'The name must be at least 3 characters long', result: false}
    }
    return{msg : "Passed local test", result:true}
}

export const validateEmail = (email : string) =>{
    if(email == ''){
        return {msg : 'Please enter email', result: false}
    }
    if(email != ""){
        // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        const regex = /^[\w\.-]+@[a-zA-Z\d-]+\.[a-zA-Z]{2,}$/; 
        return {msg : 'Please enter valid email address', result: regex.test(email)}
    }

    return{msg : "Passed local test", result:true}
    
}

export const validatePasswordLength = (password : string) =>{
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return regex.test(password)
}

export const validatePasswordEntry = (
    password : string,
    // name : string,
    email : string,
    passwordRule : boolean
) =>{
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if(password === ''){
        return {msg : 'Please enter password', result: false}
    }
    if(passwordRule){
        if(!passwordRegex.test(password)){
            return {msg : 'Please enter corect password', result: false}
        }
    }
  
    // if(!validatePasswordLength(password)){
    //     return {msg : 'Password length must be 8 to 20 characters', result: false}
    // }
    // // if(name && password.toLowerCase().includes(name.toLowerCase())){
    // //     return{msg : "Must not contain user's name", result:false}
    // // }
    // if(email && password.toLowerCase().includes(email.split('@')[0])){
    //     return{msg : "Must not contain user's name", result:false}
    // }

    return{msg : "Passed local test", result:true}
}

export const validateConfirmPasswordEntry = (
    password : string,
    // name : string,
    email : string
) =>{
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if(password === ''){
        return {msg : 'Please enter confirm password', result: false}
    }
    if(!passwordRegex.test(password)){
        return {msg : 'Please enter corect password', result: false}
    }
    // if(name && password.toLowerCase().includes(name.toLowerCase())){
    //     return{msg : "Must not contain user's name", result:false}
    // }
    if(email && password.toLowerCase().includes(email.split('@')[0])){
        return{msg : "Must not contain user's name", result:false}
    }

    return{msg : "Passed local test", result:true}
}

export const PasswordMatch = (password : string, confirmPassword : string)=>{
    if(password !== confirmPassword){
        return{msg : "Password should be equal to confirm password", result:false}
    }
    return{msg : "Passed local test", result:true} 
}