import '../assets/styles/nav.css'
export default function IMSLayout(props){

    return (
        <div className="d-flex h-100">
            <div id="nav" className="col-4 col-lg-3">
                {props.nav}
            </div>
            <div id="content" className="col-8 col-lg-9">
                {props.content}
            </div>
        </div>
    )

}