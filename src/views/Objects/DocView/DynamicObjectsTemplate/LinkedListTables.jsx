import { Autocomplete, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import FRow from "../../../../components/FormElements/FRow";
import useDebounce from "../../../../hooks/useDebounce";
import constructorObjectService from "../../../../services/constructorObjectService";
import constructorRelationService from "../../../../services/constructorRelationService";
import styles from "./style.module.scss";
import ClearIcon from "@mui/icons-material/Clear";

function LinkedListTables({
  selectedOutputTable,
  setSelectedOutputTable,
  selectedOutputObject,
  setSelectedOutputObject,
  templates,
  selectedTemplate,
  selectedLinkedObject,
  setSelectedLinkedObject,
  setSelectedObject,
  selectedObject,
  setCustomTitle,
  customTitle,
}) {
  const { tableSlug } = useParams();
  const { state } = useLocation();

  const outputTableSlug = selectedOutputTable?.split("#")?.[1];
  const subttitleFieldSlug = selectedOutputTable?.split("#")?.[2];
  const requestSlugId = `${outputTableSlug}_id`;
  const [debouncedValue, setDebouncedValue] = useState("");
  const [debouncedObjectValue, setdebouncedObjectValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [objectValue, setObjectValue] = useState("");

  const getSelectTedTemplate = templates.find((item) => {
    return item?.guid === selectedTemplate?.guid;
  });

  const selectTableSlug = selectedLinkedObject ? selectedLinkedObject?.split("#")?.[1] : tableSlug;

  // ==========GET RELATION TABLE SLUG========
  const { data: computedRelationValue = [] } = useQuery(
    ["GET_RELATION_OBJECT_LIST", tableSlug, getSelectTedTemplate],
    () => {
      return constructorRelationService.getList({
        table_slug: "file",
        relation_table_slug: "file",
      });
    },
    {
      select: (res) => {
        const relations = res?.relations.filter((item) => {
          return item?.type === "Many2One" && item?.table_from?.slug === "file";
        });
        const computedValue = relations.map((item) => ({
          label: item?.title,
          value: `${item?.id}#${item?.table_to?.slug}#${item?.table_to?.subtitle_field_slug ?? ""}`,
        }));
        const result =
          computedValue &&
          computedValue?.find((item) => {
            return item?.value.split("#")?.[1] === getSelectTedTemplate?.output_object;
          });
        return {
          computedValue,
          result,
        };
      },
      onSuccess: ({ result }) => {
        setSelectedOutputTable(result?.value ?? "");
      },
    }
  );

  // ==========GET LINKED OBJECT LIST=========
  const { data: computedRelations = [] } = useQuery(
    ["GET_RELATION_OBJECTS", tableSlug, getSelectTedTemplate],
    () => {
      return constructorRelationService.getList({
        table_slug: tableSlug,
        relation_table_slug: tableSlug,
      });
    },
    {
      select: (res) => {
        const relations = res?.relations;
        const defaultValue = res?.relations?.find((item) => {
          return item?.table_to?.slug === tableSlug;
        });
        const computedRelations = res?.relations
          .filter((item) => {
            return item?.table_to?.slug === tableSlug;
          })
          .map((el) => ({
            label: el?.table_from?.label,
            value: `${el?.table_from?.id}#${el?.table_from?.slug}`,
          }));

        const arr = [
          ...computedRelations,
          {
            label: defaultValue?.table_to?.label,
            value: `${defaultValue?.table_to?.id}#${defaultValue?.table_to?.slug}`,
          },
        ];

        const linkedDefault = arr?.find((item) => {
          return item?.value?.split("#")?.[1] === tableSlug;
        });
        const result = computedRelations?.find((item) => {
          return item?.value?.split("#")?.[1] === getSelectTedTemplate?.linked_object;
        });

        return {
          arr,
          relations,
          result,
          linkedDefault,
        };
      },
      onSuccess: ({ result, linkedDefault }) => {
        setSelectedLinkedObject(linkedDefault?.value ?? result?.value);
      },
    }
  );

  // =====COMPUTE SUBTITLE FIELD SLUG FOR LINKED OBJECT ==========
  const getSubtitleFieldSlug = useMemo(() => {
    const getObject = computedRelations.relations?.find((item) => {
      return item?.table_from?.slug === selectTableSlug || item?.table_to?.slug === selectTableSlug;
    });

    if (getObject?.table_from?.slug === selectTableSlug) {
      return getObject?.table_from?.subtitle_field_slug;
    } else if (getObject?.table_to?.slug === selectTableSlug) {
      return getObject?.table_to?.subtitle_field_slug;
    }
  }, [selectTableSlug, computedRelations?.relations]);

  // ========LINKED OBJECT LIST TABLE VIEW===========
  const { data: computedLinkedObjects = [] } = useQuery(
    ["GET_OBJECT_LIST_TABLE", selectTableSlug, state, debouncedObjectValue],
    () => {
      // if (state === undefined) return null;
      return constructorObjectService.getList(selectTableSlug, {
        data: {
          view_fields: [getSubtitleFieldSlug],
          search: debouncedObjectValue.trim(),
          additional_request: {
            additional_field: ["guid"],
            additional_values: [state?.objectId],
          },
          limit: 10,
          offset: 0,
        },
      });
    },
    {
      select: (res) => {
        const linkedObject = res?.data?.response;
        const computeFilter = res?.data?.response.map((item) => ({
          label: item?.[getSubtitleFieldSlug] ?? "",
          value: item?.guid,
        }));
        const selectedLinkedObjects = res?.data?.response.find((item) => item?.guid === selectedObject?.value);

        const defaultValue = computeFilter?.find((item) => {
          return state ? item?.value === state?.objectId : "";
        });

        return {
          computeFilter,
          defaultValue,
          linkedObject,
          selectedLinkedObjects,
        };
      },
      onSuccess: ({ defaultValue }) => {
        setSelectedObject(defaultValue ? defaultValue : selectedObject);
      },
    }
  );

  // =========GET OUTPUT OBJECT LIST==========
  const { data: computedObject = [] } = useQuery(
    ["GET_OBJECT_LIST", outputTableSlug, computedLinkedObjects, debouncedValue],
    () => {
      if (outputTableSlug === undefined) return null;
      return constructorObjectService.getList(outputTableSlug, {
        data: {
          view_fields: [subttitleFieldSlug],
          search: debouncedValue.trim(),
          [requestSlugId]: computedLinkedObjects?.selectedLinkedObjects?.[requestSlugId],
          limit: 10,
          offset: 0,
        },
      });
    },
    {
      select: (res) => {
        const computedObject = res?.data?.response.map((item) => ({
          label: item?.[selectedOutputTable?.split("#")?.[2]] ? item?.[selectedOutputTable?.split("#")?.[2]] : item?.name,
          value: `${item?.guid}#${res?.table_slug}`,
        }));
        const val = computedLinkedObjects?.linkedObject?.[0]?.[`${selectedOutputTable?.split("#")?.[1]}_id_data`];

        const arr = [...computedObject, { label: val?.[subttitleFieldSlug] ?? "", value: val?.guid ?? "" }];

        const defaultValue = computedObject?.find((item) => {
          return item?.value;
        });

        return {
          computedObject,
          arr,
          defaultValue,
        };
      },
      onSuccess: ({ defaultValue }) => {
        setSelectedOutputObject(defaultValue ?? selectedOutputObject);
      },
    }
  );

  // ==========LINKED TABLE===========
  const handleTableChange = (event) => {
    setSelectedLinkedObject(event.target.value);
  };

  // ==========OUTPUT TABLE==========
  const handleChange = (event) => {
    setSelectedOutputTable(event.target.value);
  };

  // =========OUTPUT OBJECT==========
  const handleChangeObject = (event) => {
    setSelectedOutputObject(event);
  };

  // =======LINKED OBJECT=============
  const handleLinkedObject = (event) => {
    setSelectedObject(event);
  };

  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);
  const inputObjectHandler = useDebounce((val) => setdebouncedObjectValue(val), 1000);

  const setDefaultValue = () => {
    computedLinkedObjects?.defaultValue && setSelectedObject(computedLinkedObjects?.defaultValue ? computedLinkedObjects?.defaultValue : selectedObject);
  };

  useEffect(() => {
    setDefaultValue();
  }, [computedLinkedObjects?.defaultValue]);

  const selectedObjectServiceName = useMemo(() => {
    const object = computedLinkedObjects?.linkedObject?.find((item) => item?.guid === selectedObject?.value);
    return object?.services_id_data?.name ?? "";
  }, [selectedObject, computedLinkedObjects?.linkedObject]);

  useEffect(() => {
    if (selectedObject?.value) {
      setCustomTitle(selectedObjectServiceName);
    }
  }, [selectedObject, computedLinkedObjects?.linkedObject]);

  return (
    <div className={styles.docListTables}>
      <FRow label={"Linked Table"}>
        <Select
          fullWidth
          id="demo-simple-select"
          value={selectedLinkedObject ?? ""}
          onChange={handleTableChange}
          size="small"
          endAdornment={
            selectedLinkedObject && (
              <IconButton onClick={() => setSelectedLinkedObject(null)}>
                <ClearIcon />
              </IconButton>
            )
          }
        >
          {computedRelations?.arr?.map((item) => (
            <MenuItem value={item?.value}>{item?.label}</MenuItem>
          ))}
        </Select>
      </FRow>
      <FRow label={"Output Table"}>
        <Select fullWidth id="demo-simple-select" value={selectedOutputTable} onChange={handleChange} size="small">
          {computedRelationValue?.computedValue?.map((item) => (
            <MenuItem value={item?.value}>{item?.label}</MenuItem>
          ))}
        </Select>
      </FRow>
      {selectedOutputTable ? (
        <FRow label={"Output Object"}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label"></InputLabel>
            <Autocomplete
              inputValue={inputValue}
              options={computedObject?.arr ?? []}
              value={selectedOutputObject ?? ""}
              getOptionLabel={(option) => option.label ?? ""}
              renderInput={(params) => <TextField {...params} size="small" />}
              onChange={(event, newValue) => {
                handleChangeObject(newValue);
              }}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
                // inputChangeHandler(newInputValue);
              }}
            />
          </FormControl>
        </FRow>
      ) : (
        ""
      )}

      <FRow label={"Linked Object"}>
        <FormControl fullWidth>
          <Autocomplete
            id="attributes"
            options={computedLinkedObjects?.computeFilter ?? []}
            value={selectedObject ?? ""}
            inputValue={objectValue}
            freeSolo
            onChange={(e, values) => {
              handleLinkedObject(values);
            }}
            getOptionLabel={(option) => option.label ?? ""}
            disablePortal
            blurOnSelect
            openOnFocus
            onInputChange={(event, newInputValue, reason) => {
              setObjectValue(newInputValue);
              inputObjectHandler(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                InputProps={{
                  ...params.InputProps,
                }}
              />
            )}
          ></Autocomplete>
        </FormControl>
      </FRow>

      <FRow label={"Название"}>
        <FormControl fullWidth>
          <TextField
            size="small"
            value={customTitle ?? ""}
            onChange={(e) => {
              setCustomTitle(e.target.value);
            }}
          />
        </FormControl>
      </FRow>
    </div>
  );
}

export default LinkedListTables;
