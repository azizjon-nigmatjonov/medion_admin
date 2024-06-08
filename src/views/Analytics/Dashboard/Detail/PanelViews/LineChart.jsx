import { ResponsiveLine } from "@nivo/line"
import { useMemo } from "react"
import styles from "./style.module.scss"

const LineChart = ({ panel = {}, data = [] }) => {

  const chartAttributes = panel?.attributes?.['LINE_CHART'] ?? {}


  const computedLineChartData = useMemo(() => {
    if(!data[0]?.data) return []


    return data?.map(row => ({
      ...row,
      data: row?.data.sort((a, b) => a.x - b.x)
    }))

  }, [data])


  return (
    <div className={styles.card}>
      <div className={styles.title}>{panel?.title}</div>
      <div className={styles.chartArea}>
        <ResponsiveLine
          data={computedLineChartData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "transportation",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "count",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          {...chartAttributes}
        />
      </div>
    </div>
  )
}

export default LineChart
