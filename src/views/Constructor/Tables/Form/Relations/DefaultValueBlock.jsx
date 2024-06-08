import {useMemo} from "react";
import {useParams} from "react-router-dom";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import styles from "./style.module.scss";
import HFSwitch from "../../../../../components/FormElements/HFSwitch";
import FRow from "../../../../../components/FormElements/FRow";

const DefaultValueBlock = ({control, watch, columnsList}) => {
    const {slug} = useParams();
    const relation = watch();

    const relatedTableSlug =
        relation?.table_from === slug ? relation?.table_to : relation?.table_from;

    const computedRelation = useMemo(
        () => ({
            id: `${relatedTableSlug ?? ""}#${relation.id ?? ""}`,
            label: relation?.title,
            slug: "default_values",
            attributes: {
                view_fields: relation?.view_fields
                    ?.map((fieldId) =>
                        columnsList?.find((column) => column.id === fieldId)
                    )
                    .filter((el) => el),
                default_values: null,
            },
            relation_type: relation.type,
        }),
        [relation, relatedTableSlug, columnsList]
    );

    if (!relation.table_to || !relation.table_from) return null;
    return (
        <>
            <div className={styles.settingsBlockHeader}>
                <h2>Default value</h2>
            </div>

            <div className="p-2">
                <FormElementGenerator
                    disabled={false}
                    field={computedRelation}
                    control={control}
                />
                <div className={'table-filter-cell'}>
                    <FRow label="Свой ID">
                        <HFSwitch control={control} name="is_user_id_default" required/>
                    </FRow>

                    <FRow label="JWT object ID">
                        <HFSwitch control={control} name="object_id_from_jwt" required/>
                    </FRow>
                </div>
            </div>
        </>
    );
};

export default DefaultValueBlock;
