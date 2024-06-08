import { ResponsiveBar } from "@nivo/bar";
import styles from "./style.module.scss";

const BarChart = ({ panel = {}, data = [] }) => {
  const chartAttributes = panel?.attributes?.["BAR_CHART"] ?? {};
  return (
    <div className={styles.card}>
      <div className={styles.title}>{panel?.title}</div>
      <div className={styles.chartArea}>
        <ResponsiveBar
          data={data}
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          colorBy="indexValue"
          // defs={[
          //   {
          //     id: "dots",
          //     type: "patternDots",
          //     background: "inherit",
          //     color: "#38bcb2",
          //     size: 4,
          //     padding: 1,
          //     stagger: true,
          //   },
          //   {
          //     id: "lines",
          //     type: "patternLines",
          //     background: "inherit",
          //     color: "#eed312",
          //     rotation: -45,
          //     lineWidth: 6,
          //     spacing: 10,
          //   },
          // ]}
          // fill={[
          //   {
          //     match: {
          //       id: "fries",
          //     },
          //     id: "dots",
          //   },
          //   {
          //     match: {
          //       id: "sandwich",
          //     },
          //     id: "lines",
          //   },
          // ]}
          // borderColor={{
          //   from: "color",
          //   modifiers: [["darker", 1.6]],
          // }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 0,
            tickRotation: 0,
            legend: "country",
            legendPosition: "",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 0,
            tickRotation: 0,
            legend: "food",
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          role="application"
          ariaLabel="Nivo bar chart demo"
          // barAriaLabel={function (e) {
          //   return e.id + ": " + e.formattedValue + " in country: " + e.indexValue
          // }}
          {...chartAttributes}
        />
      </div>
    </div>
  );
};

export default BarChart;
