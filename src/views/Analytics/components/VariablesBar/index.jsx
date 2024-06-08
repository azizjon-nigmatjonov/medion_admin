import styles from "./style.module.scss"
import Variable from "./Variable"

const VariablesBar = ({
  variables = [],
  variablesValue = {},
  setVariablesValue = () => {},
}) => {
  const onChange = (slug, value) => {
    setVariablesValue((prev) => ({
      ...prev,
      [slug]: value,
    }))
  }

  return (
    <div className={styles.bar}>
      {variables?.map((variable) => (
        <Variable
          key={variable.id}
          variable={variable}
          value={variablesValue[variable.slug]}
          onChange={(e) => onChange(variable.slug, e.target.value)}
        />
      ))}

      {/* <div className={styles.variable}>
        <div className={styles.label}>datasource</div>

        <div className={styles.value}>
          <CSelect disabledHelperText />
        </div>
      </div> */}
    </div>
  )
}

export default VariablesBar
