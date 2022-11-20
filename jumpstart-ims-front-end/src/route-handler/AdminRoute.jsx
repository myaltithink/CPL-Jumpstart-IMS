import AuthService from "../service/AuthService";

export default function AdminRoute(props){
    if(!props.user.authenticated){
        return window.location.href = "/";
    }

    async function isAdmin() {
        const isAdmin = await(await AuthService.isAdmin()).data;
        if (!isAdmin) {
            return window.location.href = "/permission-denied";
        }
    }

    isAdmin();

    return props.component;
}