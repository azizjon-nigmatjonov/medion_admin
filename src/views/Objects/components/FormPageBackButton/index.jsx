import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../../components/BackButton";
import useTabRouter from "../../../../hooks/useTabRouter";
import { useQueryClient } from "react-query";
import { fetchConstructorTableListAction } from "../../../../store/constructorTable/constructorTable.thunk";

const FormPageBackButton = () => {
  const { deleteTab } = useTabRouter();
  const dispatch = useDispatch();
  const { appId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isUserId = useSelector((state) => state?.auth?.userId);
  const { tableSlug } = useParams();

  const clickHandler = () => {
    deleteTab(pathname);
    navigate(-1);
    // if (appId) {
    //   dispatch(fetchConstructorTableListAction(appId));
    // }
  };

  return <BackButton className="ml-1" onClick={clickHandler} />;
};

export default FormPageBackButton;
