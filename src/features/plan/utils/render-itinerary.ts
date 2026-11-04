import { formatCurrency, formatDate } from '@/base/utils';
import type { PlanDay, TripPlanOverview } from '../types';

const IMAGE_WIDTH = 1080;
const MIN_IMAGE_HEIGHT = 1350;
const MAX_IMAGE_HEIGHT = 16000;
const PAGE_PADDING = 64;
const FIRST_LINE_TOP = 90;
const LINE_HEIGHT_RATIO = 1.45;
const COVER_TIMEOUT_MS = 20_000;

export interface ExportColors {
  background: string;
  foreground: string;
  accent: string;
  overlay: string;
  gradient: string;
}

interface TextStyle {
  fontSize?: number;
  bold?: boolean;
  highlighted?: boolean;
}

interface TextLine {
  text: string;
  top: number;
  fontSize: number;
  bold: boolean;
  highlighted: boolean;
}

interface RenderItineraryDayOptions {
  plan: TripPlanOverview;
  day: PlanDay;
  cover: HTMLImageElement | null;
  colors: ExportColors;
  locale: string;
  fontFamily: string;
  labels: {
    day: string;
    empty: string;
    cost: string;
  };
}

export const wrapText = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) => {
  const lines: string[] = [];

  for (const paragraph of text.split('\n')) {
    let currentLine = '';

    for (const word of paragraph.split(/\s+/u)) {
      const nextLine = currentLine ? `${currentLine} ${word}` : word;
      const fitsOnCurrentLine = context.measureText(nextLine).width <= maxWidth;

      if (fitsOnCurrentLine) {
        currentLine = nextLine;
        continue;
      }

      if (currentLine) lines.push(currentLine);
      currentLine = '';

      for (const character of word) {
        const nextPart = currentLine + character;
        const exceedsWidth = context.measureText(nextPart).width > maxWidth;

        if (currentLine && exceedsWidth) {
          lines.push(currentLine);
          currentLine = '';
        }
        currentLine += character;
      }
    }

    lines.push(currentLine);
  }

  return lines;
};

export const loadCover = (
  url: string,
  signal: AbortSignal,
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';

    const timeoutId = window.setTimeout(() => {
      finishLoading(new Error('COVER'));
    }, COVER_TIMEOUT_MS);

    const finishLoading = (error?: Error) => {
      window.clearTimeout(timeoutId);
      signal.removeEventListener('abort', cancelLoading);
      image.onload = null;
      image.onerror = null;

      if (error) {
        image.src = '';
        reject(error);
        return;
      }

      resolve(image);
    };

    const cancelLoading = () => {
      finishLoading(new DOMException('Aborted', 'AbortError'));
    };

    image.onload = () => finishLoading();
    image.onerror = () => finishLoading(new Error('COVER'));

    if (signal.aborted) {
      cancelLoading();
      return;
    }

    signal.addEventListener('abort', cancelLoading, { once: true });
    image.src = url;
  });
};

const prepareDayText = (
  context: CanvasRenderingContext2D,
  { plan, day, locale, fontFamily, labels }: RenderItineraryDayOptions,
) => {
  const lines: TextLine[] = [];
  const contentWidth = IMAGE_WIDTH - PAGE_PADDING * 2;
  let nextLineTop = FIRST_LINE_TOP;

  const addText = (text: string, style: TextStyle = {}) => {
    const { fontSize = 30, bold = false, highlighted = false } = style;
    const fontWeight = bold ? 700 : 400;
    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    for (const wrappedLine of wrapText(context, text, contentWidth)) {
      lines.push({
        text: wrappedLine,
        top: nextLineTop,
        fontSize,
        bold,
        highlighted,
      });
      nextLineTop += Math.ceil(fontSize * LINE_HEIGHT_RATIO);
    }
  };

  addText(plan.tripName, { fontSize: 54, bold: true });
  if (plan.destination) addText(plan.destination);
  nextLineTop += 24;

  addText(labels.day, { fontSize: 38, highlighted: true, bold: true });
  if (day.planDate)
    addText(formatDate(day.planDate, 'DD/MM/YYYY'), { fontSize: 28 });
  if (day.title) addText(day.title, { fontSize: 32, bold: true });
  if (day.note) addText(day.note, { fontSize: 28 });
  nextLineTop += 32;

  if (day.activities.length === 0) addText(labels.empty);

  for (const activity of day.activities) {
    const startTime = activity.startTime?.slice(0, 5);
    const endTime = activity.endTime?.slice(0, 5);
    const timeRange = [startTime, endTime].filter(Boolean).join(' – ');
    const estimatedCost = formatCurrency(
      activity.estimatedCost,
      plan.baseCurrency,
      locale,
    );

    if (timeRange) addText(timeRange, { highlighted: true, bold: true });
    addText(activity.title, { fontSize: 36, bold: true });
    if (activity.location) addText(activity.location, { fontSize: 28 });
    addText(`${labels.cost}: ${estimatedCost}`, {
      fontSize: 26,
      highlighted: true,
    });
    if (activity.note) addText(activity.note, { fontSize: 28 });
    nextLineTop += 36;
  }

  return { lines, contentBottom: nextLineTop };
};

// Bước 2: phủ ảnh bìa kín khung, hoặc dùng gradient nếu chuyến chưa có bìa.
const drawBackground = (
  context: CanvasRenderingContext2D,
  height: number,
  cover: HTMLImageElement | null,
  colors: ExportColors,
) => {
  context.fillStyle = colors.background;
  context.fillRect(0, 0, IMAGE_WIDTH, height);

  if (cover) {
    const scale = Math.max(
      IMAGE_WIDTH / cover.naturalWidth,
      height / cover.naturalHeight,
    );
    const coverWidth = cover.naturalWidth * scale;
    const coverHeight = cover.naturalHeight * scale;
    const coverLeft = (IMAGE_WIDTH - coverWidth) / 2;
    const coverTop = (height - coverHeight) / 2;
    context.drawImage(cover, coverLeft, coverTop, coverWidth, coverHeight);
  } else {
    const gradient = context.createLinearGradient(0, 0, IMAGE_WIDTH, height);
    gradient.addColorStop(0, colors.background);
    gradient.addColorStop(1, colors.gradient);
    context.fillStyle = gradient;
    context.fillRect(0, 0, IMAGE_WIDTH, height);
  }

  // Phủ tối để chữ luôn dễ đọc; trả lại độ trong suốt trước khi vẽ chữ.
  context.globalAlpha = 0.8;
  context.fillStyle = colors.overlay;
  context.fillRect(0, 0, IMAGE_WIDTH, height);
  context.globalAlpha = 1;
};

const drawText = (
  context: CanvasRenderingContext2D,
  lines: TextLine[],
  fontFamily: string,
  colors: ExportColors,
) => {
  context.textBaseline = 'top';

  for (const line of lines) {
    const fontWeight = line.bold ? 700 : 400;
    context.font = `${fontWeight} ${line.fontSize}px ${fontFamily}`;
    context.fillStyle = line.highlighted ? colors.accent : colors.foreground;
    context.fillText(line.text, PAGE_PADDING, line.top);
  }
};

const createPngBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('CANVAS'));
        return;
      }
      resolve(blob);
    }, 'image/png');
  });
};

export const renderItineraryDay = async (
  options: RenderItineraryDayOptions,
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  canvas.width = IMAGE_WIDTH;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('CANVAS');

  try {
    const { lines, contentBottom } = prepareDayText(context, options);
    const height = Math.max(MIN_IMAGE_HEIGHT, contentBottom + PAGE_PADDING);

    // Không cắt nội dung nếu vượt giới hạn an toàn của Canvas trên điện thoại.
    if (height > MAX_IMAGE_HEIGHT) throw new Error('TOO_LONG');
    canvas.height = height;

    drawBackground(context, height, options.cover, options.colors);
    drawText(context, lines, options.fontFamily, options.colors);
    return await createPngBlob(canvas);
  } finally {
    // Chỉ giải phóng Canvas sau khi trình duyệt đã tạo xong PNG.
    canvas.width = 0;
    canvas.height = 0;
  }
};
