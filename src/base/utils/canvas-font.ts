export const loadCanvasFont = async (body: HTMLElement = document.body) => {
  const fontFamily = getComputedStyle(body).fontFamily;

  // Ví dụ: 'Comfortaa, "Comfortaa Fallback", sans-serif' → 'Comfortaa'.
  // Tên font có dấu phẩy trong dấu ngoặc kép vẫn được giữ nguyên.
  const firstFamily = fontFamily.match(/^("[^"]+"|'[^']+'|[^,]+)/u);
  const primaryFontFamily = firstFamily?.[0].trim();
  if (!primaryFontFamily) throw new Error('FONT');

  const normalFont = `400 30px ${primaryFontFamily}`;
  const boldFont = `700 36px ${primaryFontFamily}`;
  const vietnameseSample = 'Lịch trình chuyến đi';

  try {
    // Chỉ chờ font chính; font dự phòng local có thể không có trên thiết bị.
    await Promise.all([
      document.fonts.load(normalFont, vietnameseSample),
      document.fonts.load(boldFont, vietnameseSample),
    ]);
    await document.fonts.ready;
  } catch {
    throw new Error('FONT');
  }

  // Canvas vẫn nhận toàn bộ danh sách để có thể dùng fallback cho ký tự đặc biệt.
  return fontFamily;
};
