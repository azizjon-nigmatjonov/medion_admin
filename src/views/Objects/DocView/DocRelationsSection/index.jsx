import { useQuery } from "react-query";
import constructorViewRelationService from "../../../../services/constructorViewRelationService";
import RelationSection from "../../RelationSection";
import styles from "./style.module.scss";

const DocRelationsSection = () => {
  // ========GET TEMPLATE RELATIONS LIST===========
  const { data: templateRelations = [] } = useQuery(
    ["GET_TEMPLATE_VIEW_RELATIONS_LSIT"],
    () => {
      return constructorViewRelationService.getList({
        table_slug: "template",
      });
    },
    {
      select: ({ relations }) => {
        const result =
          relations?.map((el) => ({
            ...el,
            ...el.relation,
          })) ?? [];

        return result.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === "template"
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }));
      },
    }
  );

  return (
    <div style={{ flex: 1 }}>
      <RelationSection
        relations={templateRelations}
        tableSlug="template"
        id="none"
      />
    </div>
  );
};

export default DocRelationsSection;
