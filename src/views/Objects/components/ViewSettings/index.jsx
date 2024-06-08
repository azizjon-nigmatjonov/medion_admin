import { Close } from "@mui/icons-material";
import { Card, IconButton } from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import RingLoaderWithWrapper from "../../../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import constructorObjectService from "../../../../services/constructorObjectService";
import styles from "./style.module.scss";
import ViewForm from "./ViewForm";
import ViewsList from "./ViewsList";

const ViewSettings = ({ closeModal, setIsChanged, viewData, typeNewView }) => {
  const { tableSlug, appId } = useParams();
  const [selectedView, setSelectedView] = useState(viewData);

  const closeForm = () => setSelectedView(null);
  const {
    data: { views, columns, relationColumns } = {
      views: [],
      columns: [],
      relationColumns: [],
    },
    isLoading,
    refetch: refetchViews,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS_AT_VIEW_SETTINGS", { tableSlug }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { limit: 10, offset: 0, with_relations: true, app_id: appId },
      });
    },
    {
      select: ({ data }) => {
        return {
          views: data?.views ?? [],
          columns: data?.fields ?? [],
          relationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.cardTitle}>View settings</div>
        <IconButton className={styles.closeButton} onClick={closeModal}>
          <Close className={styles.closeIcon} />
        </IconButton>
      </div>

      {isLoading ? (
        <RingLoaderWithWrapper />
      ) : (
        <div className={styles.body}>
          {/* <ViewsList
            views={views}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          /> */}

          {selectedView && (
            <ViewForm
              initialValues={selectedView}
              typeNewView={typeNewView}
              closeForm={closeForm}
              refetchViews={refetchViews}
              closeModal={closeModal}
              setIsChanged={setIsChanged}
              columns={columns}
              relationColumns={relationColumns}
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default ViewSettings;
