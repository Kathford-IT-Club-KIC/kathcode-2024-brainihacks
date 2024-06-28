export const validateReg = (formData) => {
    let errors = {};
    if (!formData.firstName) errors.firstName = "First Name is required";
    if (!formData.lastName) errors.lastName = "Last Name is required";
    if (!formData.username) errors.username = "Username is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (formData.password.length < 8) errors.password = "Password must be at least 8 characters long";
    return errors;
  };
  
  export const validateLogin = (formData) => {
    let errors = {};
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };
  