import { Analytics, Edit, Save, Settings } from "@mui/icons-material"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import Header from "../../../../components/Header"
import GridLayout, { WidthProvider } from "react-grid-layout"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Panel from "./Panel"
import { useMutation, useQuery } from "react-query"
import dashboardService from "../../../../services/analytics/dashboardService"
import { useState } from "react"
import PageFallback from "../../../../components/PageFallback"
import { useMemo } from "react"
import CreatePanelButton from "./Panel/CreatePanelButton"
import { useRef } from "react"
import request from "../../../../utils/request"
import VariablesBar from "../../components/VariablesBar"
import Grid from "../../components/Grid"

const ResponsiveGridLayout = WidthProvider(GridLayout)

const DashboardDetailPage = () => {
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [layout, setLayout] = useState([])
  const [layoutIsEditable, setLayoutIsEditable] = useState(false)
  const [variabesValue, setVariablesValue] = useState({})
  const intermediateLayout = useRef()

  const navigateToSettingsPage = () => {
    navigate(`${pathname}/settings/main`)
  }

  const { data, isLoading, refetch } = useQuery(
    ["GET_DASHBOARD_DATA", id],
    () => {
      return dashboardService.getById(id)
    },
    {
      onSuccess: ({ panels = [] }) => {
        const computedLayout =
          panels.map((panel) => ({
            i: panel.id,
            x: panel?.coordinates[0],
            y: panel?.coordinates[1],
            w: panel?.coordinates[2],
            h: panel?.coordinates[3],
          })) ?? []

        setLayout(computedLayout)
      },
    }
  )

  const computedLayout = useMemo(() => {
    if (!layoutIsEditable) return layout

    let lastRowElement = { y: 0, h: 0, w: 0, x: 0 }

    layout.forEach((element) => {
      if (
        element.y + element.h + element.x + element.w >
        lastRowElement.y +
          lastRowElement.h +
          lastRowElement.x +
          lastRowElement.w
      ) {
        lastRowElement = element
      }
    })

    const createPanel = {
      i: "CREATE",
      x:
        lastRowElement.x + lastRowElement.w + 9 > 36
          ? 0
          : lastRowElement.x + lastRowElement.w,
      y: 0,
      w: 9,
      h: 10,
      isDraggable: false,
      isResizable: false,
    }

    return [...layout, createPanel]
  }, [layout, layoutIsEditable])

  const { mutate, isLoading: btnLoading } = useMutation(
    () => {
      const data = intermediateLayout.current?.map((el) => ({
        id: el.i,
        coordinates: [el.x, el.y, el.w, el.h],
      }))

      return request.post("/analytics/panel/updateCoordinates", {
        panel_coordinates: data,
      })
    },
    {
      onSuccess: () => {
        setLayout(intermediateLayout.current)
        setLayoutIsEditable(false)
      },
    }
  )

  const switchLayoutEditable = () => {
    if (!layoutIsEditable) return setLayoutIsEditable(true)
    mutate()
  }

  return (
    <div>
      <Header
        title={data?.name}
        backButtonLink={"/analytics/dashboard"}
        extra={
          <>
            <RectangleIconButton>
              <Analytics />
            </RectangleIconButton>
            <RectangleIconButton
              loader={btnLoading}
              onClick={switchLayoutEditable}
            >
              {layoutIsEditable ? <Save color="primary" /> : <Edit />}
            </RectangleIconButton>
            <RectangleIconButton onClick={navigateToSettingsPage}>
              <Settings />
            </RectangleIconButton>
          </>
        }
      />

      <VariablesBar
        variables={data?.variables}
        variablesValue={variabesValue}
        setVariablesValue={setVariablesValue}
      />

      <div style={{ padding: "5px" }}>
        <Grid layoutIsEditable={layoutIsEditable} >
          {isLoading ? (
            <PageFallback />
          ) : (
            <ResponsiveGridLayout
              className="layout"
              layout={computedLayout}
              containerPadding={[0, 0]}
              margin={[0, 0]}
              cols={36}
              onLayoutChange={(layout) => {
                intermediateLayout.current = layout?.filter(
                  (item) => item.i !== "CREATE"
                )
              }}
              compactType={null}
              isResizable={layoutIsEditable}
              isDraggable={layoutIsEditable}
            >
              {data?.panels?.map((panel) => (
                <div key={panel.id} style={{ padding: "5px" }}>
                  <Panel
                    panel={panel}
                    layoutIsEditable={layoutIsEditable}
                    variablesValue={variabesValue}
                    refetch={refetch}
                  />
                </div>
              ))}

              {layoutIsEditable && (
                <div key="CREATE" style={{ padding: "5px" }} >
                  <CreatePanelButton />
                </div>
              )}
            </ResponsiveGridLayout>
          )}
        </Grid>
      </div>
    </div>
  )
}

export default DashboardDetailPage
