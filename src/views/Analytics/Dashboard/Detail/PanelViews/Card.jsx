import { get } from "@ngard/tiny-get"
import styles from "./style.module.scss"

const Card = ({ panel = {}, data = [] }) => {
  const chartAttributes = panel?.attributes?.["CARD"] ?? {}

  const computedValue = get(data[0], chartAttributes.value_field_slug, "")

  return (
    <div
      className={styles.card}
      style={{
        backgroundColor: chartAttributes.background_color,
      }}
    >
      <div
        className={styles.title}
        style={{
          fontSize: chartAttributes.label_font_size,
          color: chartAttributes.label_color,
        }}
      >
        {panel?.title}
      </div>
      <div
        className={styles.cardValue}
        style={{
          fontSize: chartAttributes.value_font_size,
          color: chartAttributes.value_color,
        }}
      >
        {computedValue}
      </div>
    </div>
  )
}

export default Card
