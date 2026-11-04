const DOWNLOAD_URL_LIFETIME_MS = 60_000;

export const downloadBlob = (blob: Blob, filename: string) => {
  // Tạo địa chỉ tạm cho tệp đang nằm trong bộ nhớ của trình duyệt.
  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.download = filename;
  downloadLink.click();

  // Chờ trình duyệt bắt đầu tải trước khi thu hồi địa chỉ tạm.
  window.setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, DOWNLOAD_URL_LIFETIME_MS);
};
