import { get } from "@ngard/tiny-get"
import { useMemo } from "react"
import { ResponsiveFunnel } from '@nivo/funnel'
import styles from "./style.module.scss"


const FunnelChart = ({ panel = {}, data = [] }) => {
  const chartAttributes = panel?.attributes?.["FUNNEL_CHART"] ?? {}

  const computedData = useMemo(() => {
    
    return (
      data?.map((row) => ({
        id: get(row, chartAttributes.label_field_slug, ""),
        label: get(row, chartAttributes.label_field_slug, ""),
        value: get(row, chartAttributes.value_field_slug, 0),
      })).sort((a, b) => b.value - a.value) ?? []
    )
  }, [data, chartAttributes.label_field_slug, chartAttributes.value_field_slug])

  if(!data?.length) return null

  return (
    <div className={styles.card} >
    <div className={styles.title}>{panel?.title}</div>
    <div className={styles.chartArea}>
    <ResponsiveFunnel
      data={computedData}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      valueFormat=">-.4s"
      colors={{ scheme: "spectral" }}
      borderWidth={20}
      labelColor={{
        from: "color",
        modifiers: [["darker", 3]],
      }}
      beforeSeparatorLength={100}
      beforeSeparatorOffset={20}
      afterSeparatorLength={100}
      afterSeparatorOffset={20}
      currentPartSizeExtension={10}
      currentBorderWidth={40}
      motionConfig="wobbly"
    />
    </div>
  </div>
  )
}

export default FunnelChart
