import { Triangle } from "react-loader-spinner";

export default function Loading(){
    return (
        <div className="d-flex justify-content-center">
            <div>
                <div className="d-flex justify-content-center">
                    <Triangle
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="triangle-loading"
                        wrapperStyle={{}}
                        wrapperClassName=""
                        visible={true}
                        />
                </div>
                    <h4>Loading...</h4>
            </div>
        </div>
    )
}