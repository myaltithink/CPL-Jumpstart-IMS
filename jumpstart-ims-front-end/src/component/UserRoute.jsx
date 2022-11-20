export default function UserRoute(props){
    if(!props.user.authenticated){
        window.location.href = "/";
        return
    }
    return props.component;
}


