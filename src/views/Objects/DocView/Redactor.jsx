import { CKEditor } from "@ckeditor/ckeditor5-react";
import "./redactorOverriders.scss";
import Editor from "ckeditor5-custom-build";
import { forwardRef, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useMemo } from "react";
import uploadPlugin from "./UploadAdapter";
import usePaperSize from "../../../hooks/usePaperSize";

const Redactor = forwardRef(
  ({ control, fields, selectedPaperSizeIndex }, ref) => {
    const { selectedPaperSize } = usePaperSize(selectedPaperSizeIndex);

    const value = useWatch({
      control,
      name: "html",
    });

    const computedFields = useMemo(() => {
      return (
        fields?.map((field) => ({
          label: field.label,
          value: `{ ${field.label} }`,
        })) ?? []
      );
    }, [fields]);
    
    useEffect(() => {
      const editor = ref.current;
      if (!editor) return;

      editor.editing.view.change((writer) => {
        writer.setStyle(
          "width",
          selectedPaperSize.width + "pt",
          editor.editing.view.document.getRoot()
        );
      });
    }, [selectedPaperSize, ref]);
    return (
      <>
        <div className="ck-editor">
          <CKEditor
            editor={Editor}
            config={{
              variables: {
                list: computedFields,
              },
              extraPlugins: [uploadPlugin],
              width: 100,
            }}
            data={value ?? ""}
            onReady={(editor) => {
              editor.ui
                .getEditableElement()
                .parentElement.insertBefore(
                  editor.ui.view.toolbar.element,
                  editor.ui.getEditableElement()
                );
              const wrapper = document.createElement("div");
              wrapper.classList.add("ck-editor__editable-container");
              editor.ui.getEditableElement().parentNode.appendChild(wrapper);
              editor.ui.getEditableElement().style.opacity = 0.5;
              editor.ui.getEditableElement().style.backgroundColor = "red";

              editor.editing.view.change((writer) => {
                writer.setStyle(
                  "width",
                  selectedPaperSize.width + "pt",
                  editor.editing.view.document.getRoot()
                );
              });
              // editor.ui.getEditableElement().style.width = `${selectedPaperSize.width}pt`\

              wrapper.appendChild(editor.ui.getEditableElement());
              ref.current = editor;
            }}
            onError={(error, { willEditorRestart }) => {
              // If the editor is restarted, the toolbar element will be created once again.
              // The `onReady` callback will be called again and the new toolbar will be added.
              // This is why you need to remove the older toolbar.
              if (willEditorRestart) {
                ref.current.ui.view.toolbar.element.remove();
              }
            }}
          ></CKEditor>
        </div>
      </>
    );
  }
);

export default Redactor;
