import { Close, FilterAlt } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import TableOrderingButton from "../../../../components/TableOrderingButton";
import useFilters from "../../../../hooks/useFilters";
import NewFilterModal from "./NewFilterModal";

const FastFilterButton = ({ view, fieldsMap }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { tableSlug } = useParams();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { filters, clearFilters, clearOrders } = useFilters(tableSlug, view.id);

  const selectedFiltersNumber = useMemo(() => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== "order" && value) count++;
    });
    return count;
  }, [filters]);

  const selectedOrdersNumber = useMemo(() => {
    const orders = filters.order ?? {};
    return Object.values(orders)?.filter((el) => el)?.length;
  }, [filters]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      <RectangleIconButton
        color="white"
        size={!!selectedFiltersNumber ? "long" : ""}
        onClick={(e) => setAnchorEl(e.target)}
      >
        <FilterAlt
          style={{ marginTop: 5 }}
          color={!!selectedFiltersNumber ? "primary" : ""}
        />
        {!!selectedFiltersNumber && (
          <>
            <strong>
              <Typography variant="inherit" color="primary">
                {selectedFiltersNumber}
              </Typography>
            </strong>

            <Close
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
            />
          </>
        )}
      </RectangleIconButton>

      {!!selectedOrdersNumber && (
        <RectangleIconButton color="white" size="long">
          <TableOrderingButton />
          <strong>
            <Typography variant="inherit" color="primary">
              {selectedOrdersNumber}
            </Typography>
          </strong>
          <Close
            onClick={(e) => {
              e.stopPropagation();
              clearOrders();
            }}
          />
        </RectangleIconButton>
      )}
      <NewFilterModal
        view={view}
        fieldsMap={fieldsMap}
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
        handleClose={handleClose}
      />
    </div>
  );
};

export default FastFilterButton;
