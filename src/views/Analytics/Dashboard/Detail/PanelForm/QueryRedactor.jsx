import { CopyAll, PlayArrow, Segment } from "@mui/icons-material"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import styles from "./style.module.scss"
// import ReactPrismEditor from "react-prism-editor"
import Editor from "@monaco-editor/react"
import { Tooltip } from "@mui/material"
import { Controller } from "react-hook-form"
import { useQueryClient } from "react-query"

const QueryRedactor = ({ form }) => {

  const queryClient = useQueryClient()

  const updateTable = () => {
    const id = form.getValues('id')
    queryClient.refetchQueries(["GET_DATA_BY_QUERY_IN_PREVIEW", { panelID: id }])
  }

  return (
    <div className={styles.redactorPanel}>
      <div className={styles.redactor}>
        <Controller
          control={form.control}
          name={"query"}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Editor
              height="200px"
              defaultLanguage="sql"
              value={value}
              fontSize={20}
              onChange={onChange}
              options={{
                fontSize: 16,
                fontWeight: 500,
                minimap: { enabled: false },
                overviewRulerLanes: 0,
                overviewRulerBorder: false,
                scrollbar: {
                  vertical: "hidden",
                },
              }}
            />
          )}
        />
      </div>
      <div className={styles.toolbar}>
        <Tooltip title="Update table" placement="left">
          <RectangleIconButton onClick={updateTable} >
            <PlayArrow color="primary" />
          </RectangleIconButton>
        </Tooltip>
        <Tooltip title="Copy" placement="left">
          <RectangleIconButton>
            <CopyAll color="primary" />
          </RectangleIconButton>
        </Tooltip>
        <RectangleIconButton>
          <Segment color="primary" />
        </RectangleIconButton>
      </div>
    </div>
  )
}

export default QueryRedactor
