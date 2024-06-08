import useCustomActionsQuery from "../../../../queries/hooks/useCustomActionsQuery";
import ActionButton from "./ActionButton";

const FormCustomActionButton = ({ tableSlug, id, control }) => {
  const { data: { custom_events: customEvents = [] } = {} } =
    useCustomActionsQuery({
      tableSlug,
      queryPayload: { hasId: !!id },
      queryParams: {
        enabled: !!id,
      },
    });

  return (
    <>
      {customEvents?.map((event) =>
        event?.action_permission &&
        event?.action_permission?.permission === true ? (
          <ActionButton
            control={control}
            key={event.id}
            event={event}
            id={id}
          />
        ) : (
          ""
        )
      )}
    </>
  );
};

export default FormCustomActionButton;
