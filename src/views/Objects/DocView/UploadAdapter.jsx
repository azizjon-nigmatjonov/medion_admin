import fileService from "../../../services/fileService";

function uploadAdapter(loader) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        const body = new FormData();
        loader.file.then((file) => {
          body.append("file", file);

          fileService
            .upload(body)
            .then((res) => {
              resolve({
                default:
                  import.meta.env.VITE_CDN_BASE_URL + "medion/" + res.filename,
              });
            })
            .catch((err) => reject(err));
        });
      });
    },
  };
}

function uploadPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return uploadAdapter(loader);
  };
}

export default uploadPlugin;
