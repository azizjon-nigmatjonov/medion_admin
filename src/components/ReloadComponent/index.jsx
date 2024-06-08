import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const ReloadPage = ({}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const url = location.state.redirectUrl.replace('reload:', '')
    useEffect(() => {
        navigate(url);
    }, [])
}

export default ReloadPage
