import axios from "axios";
import { useCallback, useState } from "react";

const useDownloader = () => {
  const [loader, setLoader] = useState(false);

  const download = useCallback(({ link, fileName }) => {
    return new Promise(async (resolve, reject) => {
      setLoader(true);
      try {
        const res = await axios.get(link, {
          responseType: "blob",
        });

        const imageObjectURL = URL.createObjectURL(res.data);

        const linkObject = document.createElement("a");
        linkObject.href = imageObjectURL;
        linkObject.setAttribute("download", fileName);
        document.body.appendChild(linkObject);
        resolve();
        linkObject.click();
      } catch (error) {
        reject();
      } finally {
        setLoader(false);
      }
    });
  }, []);

  return { download, loader };
};

export default useDownloader;
