/** @jsxImportSource @emotion/react */
import { FC, Fragment, useEffect, useState } from "react";
import { FaTimesCircle } from "react-icons/fa";

import * as styles from "./FileViewer.styles";

interface Props {
  fileURL: string;
  close: () => void;
}

const FileViewer: FC<Props> = ({ fileURL, close }) => {
  const [isLoading, updateIsLoading] = useState(false);
  const [error, updateError] = useState("");
  const [data, updateData] = useState("");

  useEffect(() => {
    fetchFileContent(fileURL);
  }, [fileURL]);

  const fetchFileContent = async (link: string) => {
    updateIsLoading(true);
    const result = await fetch(link);
    if (result.status === 200) {
      updateData(await (await result.blob()).text());
    } else if (result.status === 404) {
      updateError("File not found.");
    } else {
      updateError("Error occurred. Try again later.");
    }
    updateIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) return <span>Loading...</span>;
    if (error) return <span>{error}</span>;
    if (!fileURL) return <span>No file was provided.</span>;
    return <code css={styles.fileContent}>{data}</code>;
  };

  return (
    <Fragment>
      <div css={styles.overlay} onClick={close} />
      <div css={styles.modalWrapper}>
        <FaTimesCircle size="24" css={styles.closeButton} onClick={close} />
        {renderContent()}
      </div>
    </Fragment>
  );
};

export { FileViewer };