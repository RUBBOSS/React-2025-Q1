import { useState, useEffect, useRef } from 'react';

const Anchor = ({
  downloadUrl,
  fileName,
  onReset,
}: {
  downloadUrl: string | null;
  fileName: string;
  onReset: () => void;
}) => {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (downloadUrl && anchorRef.current) {
      anchorRef.current.click();
      URL.revokeObjectURL(downloadUrl);
      onReset();
    }
  }, [downloadUrl, onReset]);
  return downloadUrl ? (
    <a
      ref={anchorRef}
      href={downloadUrl}
      download={fileName}
      style={{ display: 'none' }}
    >
      download
    </a>
  ) : null;
};

const useDownloadFile = () => {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const triggerDownload = (
    content: string,
    name: string,
    type = 'text/csv;charset=utf-8;'
  ) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setFileName(name);
  };

  const AnchorWrapper = () => (
    <Anchor
      downloadUrl={downloadUrl}
      fileName={fileName}
      onReset={() => setDownloadUrl(null)}
    />
  );

  return { triggerDownload, Anchor: AnchorWrapper };
};

export default useDownloadFile;
