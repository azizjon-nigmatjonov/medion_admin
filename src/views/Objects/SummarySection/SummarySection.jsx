import FormElementGenerator from "../../../components/ElementGenerators/FormElementGenerator";
import styles from "./style.module.scss";
import ValueGenerator from "./ValueGenerator.jsx";

const SummarySection = ({ control, computedSummary }) => {
  const fields = computedSummary?.fields ?? [];
  return (
    <div className={styles.summarySection}>
      {fields?.map((field, fieldIndex) => (
        <div className={styles.field_summary}>
          <div className={styles.field_summary_item}>
            <span>
              {field?.slug !== "photo" && field?.slug !== "passport_photo"
                ? field?.label
                : ""}
            </span>
            <p>
              <ValueGenerator field={field} control={control} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummarySection;
