import {format} from "date-fns"
import MultiselectCellColoredElement from "../../../components/ElementGenerators/MultiselectCellColoredElement"
import {dateValidFormat} from "../../../utils/dateValidFormat"
import {getRelationFieldTableCellLabel} from "../../../utils/getRelationFieldLabel"
import styles from "./style.module.scss"

const InfoBlock = ({viewFields, data, isSingleLine}) => {

    if (isSingleLine)
        return (
            <div className={`${styles.infoBlock} ${styles.singleLine}`}>
                {data.calendar?.elementFromTime ? format(data.calendar?.elementFromTime, "HH:mm") : ""} - {" "}
                {data.patients_id_data?.name + data.patients_id_data?.second_name}
                {/*{viewFields?.map((field) => (*/}
                {/*    <>*/}
                {/*        {field.type === "LOOKUP"*/}
                {/*            ? getRelationFieldTableCellLabel(*/}
                {/*                field,*/}
                {/*                data,*/}
                {/*                field._slug + "_data"*/}
                {/*            )*/}
                {/*            : field.type === "DATE_TIME"*/}
                {/*                ? dateValidFormat(data[field.slug], "dd.MM.yyyy HH:mm")*/}
                {/*                : data[field.slug]}*/}
                {/*    </>*/}
                {/*))}*/}
            </div>
        )

    return (
        <div className={`${styles.infoBlock}`}>
            <div>
                {dateValidFormat(data.calendar?.elementFromTime, "HH:mm")}-{" "}
                {dateValidFormat(data.calendar?.elementToTime, " HH:mm")}
            </div>

            {viewFields?.map((field) => (
                <p>
                    {field.type === "LOOKUP" ? (
                        getRelationFieldTableCellLabel(field, data, field.slug + "_data")
                    ) : field.type === "DATE_TIME" ? (
                        dateValidFormat(data[field.slug], "dd.MM.yyyy HH:mm")
                    ) : field.type === "MULTISELECT" ? (
                        <MultiselectCellColoredElement
                            style={{padding: "2px 5px", marginBottom: 4}}
                            value={data[field.slug]}
                            field={field}
                        />
                    ) : (
                        data[field.slug]
                    )}
                </p>
            ))}
        </div>
    )
}

export default InfoBlock
