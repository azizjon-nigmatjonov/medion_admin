import { Delete, Edit } from "@mui/icons-material"
import { useMutation, useQuery } from "react-query"
import { useLocation, useNavigate } from "react-router-dom"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import DeleteWrapperModal from "../../../../../components/DeleteWrapperModal"
import panelService from "../../../../../services/analytics/panelService"
import request from "../../../../../utils/request"
import PanelViews from "../PanelViews"
import styles from "./style.module.scss"

const Panel = ({
  panel = {},
  layoutIsEditable,
  variablesValue = {},
  refetch,
}) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  // const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useQuery(
    ["GET_DATA_BY_QUERY", panel.query, variablesValue],
    () => {
      // const computedData = variablesValue

      // if (panel.has_pagination) {
      //   computedData.offset = (currentPage - 1) * 10
      //   computedData.limit = 10
      // }

      return request.post("/query", {
        data: variablesValue,
        query: panel.query,
      })
    }
  )

  const { mutate: deletePanel, isLoading: deleteLoading } = useMutation(
    () => {
      return panelService.delete(panel.id)
    },
    {
      onSuccess: () => {
        refetch()
      },
    }
  )

  const navigateToEditPage = (e) => {
    navigate(`${pathname}/panel/${panel.id}`)
  }

  return (
    <div className={styles.panel}>
      {layoutIsEditable && (
        <div className={styles.editableBlock}>
          {/* <div>{panel.title}</div> */}

          <div className={styles.btnsBlock}>
            <RectangleIconButton
              className={styles.editButton}
              onClick={navigateToEditPage}
            >
              <Edit color="primary" />
            </RectangleIconButton>

            <DeleteWrapperModal onDelete={deletePanel}>
              <RectangleIconButton
                className={styles.editButton}
                onClick={navigateToEditPage}
                loader={deleteLoading}
                color="error"
              >
                <Delete color="error" />
              </RectangleIconButton>
            </DeleteWrapperModal>
          </div>
        </div>
      )}

      {/* <div style={{ flex: 1, overflow: "hidden", padding: 10, paddingTop: 0 }}> */}
      <PanelViews panel={panel} data={data} isLoading={isLoading} />
      {/* </div> */}
    </div>
  )
}

export default Panel
