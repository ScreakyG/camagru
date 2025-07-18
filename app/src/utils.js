// Afficher la reponse d'un call API.
export function printAPIResponse(routeAPI, response) {
    console.log("Response from " + routeAPI + " : ", response);
}

// Recuperer les valeurs du formulaires de register.
export function getFormValues(form) {
    if (!form)
    {
        console.warn("Could not getFormValues because form is undefined/null");
        return (null);
    }

    let formData = new FormData(form);
    const formValues = Object.fromEntries(formData);

    return (formValues);
}
