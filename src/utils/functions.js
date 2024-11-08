export const getToken = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    console.log(auth?.result?.token)
    return auth?.result?.token;
}