# Hướng dẫn PWA cho TripBudget

Ngày cập nhật: 16/10/2026. Manifest, icon PNG và nút cài đã có trong mã nguồn. Phần service worker/offline phía dưới là hướng dẫn cho giai đoạn tiếp theo.

## Hiện trạng đã kiểm tra

- Next.js App Router, Next 16.3.0; cấu hình hiện chỉ bọc plugin next-intl.
- Đã có giao diện responsive, bottom navigation, safe-area, favicon và apple icon.
- Đã có `src/app/manifest.ts`, icon `public/pwa/icon-192.png`, `icon-512.png` và `icon-maskable-512.png`. Script `scripts/generate-pwa-icons.mjs` xuất từ `src/app/icon.svg` bằng Sharp, giữ gradient/máy bay nhưng bỏ bo góc trong ảnh cài đặt. PNG có nền kín, không alpha; bản maskable có vùng an toàn riêng. URL trong manifest có `?v=2` để tránh dùng ảnh cũ trong cache trình duyệt.
- `src/app/apple-icon.png` là PNG 180×180 nền kín, được Next.js tự liên kết bằng file convention. `metadata.appleWebApp.title` đặt tên mặc định iOS là Trip Plan; Android có name/short_name trong manifest. Đây là tên đề xuất, website không có API khóa việc người dùng sửa tên trong giao diện thêm vào màn hình chính.
- Middleware đã cho phép tải `/manifest.webmanifest` khi chưa đăng nhập. Chưa thêm service worker, đăng ký service worker hay trang offline; khi bổ sung cần cho phép các tài nguyên đó đi qua middleware.
- `AppInstallListener` nằm trong root layout, giữ sự kiện cài ở một store dùng chung. `AppInstallButton` là icon tải xuống cùng hàng VNI/ENG và dark/light trong AppPreferences, có tooltip và aria-label VI/EN, dùng được trên login/register và menu tài khoản. Chrome/Edge có lời mời thì hiện nút, iOS có hướng dẫn thủ công, còn khi chưa hỗ trợ/chưa nhận lời mời thì ẩn. Nút cũng ẩn khi nhận `appinstalled` hoặc đang mở ở standalone.
- Chưa kiểm tra bản production hoặc cấu hình HTTPS của hosting.

## PWA giải quyết điều gì?

PWA (Progressive Web App) bổ sung khả năng của ứng dụng vào website: người dùng có thể cài ứng dụng trên thiết bị ở trình duyệt hỗ trợ, mở lại từ icon và dùng cửa sổ riêng. Đây vẫn là ứng dụng web dùng frontend và backend hiện có.

Ba phần cần phân biệt:

| Phần | Trách nhiệm | Không tự cung cấp |
| --- | --- | --- |
| Manifest | Mô tả tên, icon, URL mở đầu, phạm vi và chế độ hiển thị | Dữ liệu offline |
| HTTPS | Tạo ngữ cảnh an toàn cho các khả năng web liên quan | Chính sách cache hoặc đồng bộ |
| Service worker | Xử lý các sự kiện như request, dùng cache/fallback theo logic đã viết | Tự giải quyết xung đột dữ liệu |

Khả năng cài đặt và khả năng offline là hai vấn đề riêng. Service worker không phải điều kiện bắt buộc cho mọi trường hợp cài PWA. Cách cài còn phụ thuộc trình duyệt và nền tảng. Xem [MDN về PWA có thể cài đặt](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).

## Hướng đề xuất cho dự án này

Bắt đầu bằng manifest + HTTPS để cài ứng dụng, sau đó bổ sung một service worker nhỏ chỉ phục vụ trang báo mất mạng. Lý do: TripBudget có đăng nhập, chấp nhận chính sách, chi tiêu và quyết toán. Cache nhầm dữ liệu có thể làm người dùng nhìn số dư cũ hoặc dữ liệu của phiên trước. Cần xác định rõ dữ liệu nào được lưu trước khi mở rộng offline.

| Hướng | Ưu điểm | Nhược điểm / khi nên chọn |
| --- | --- | --- |
| Manifest + HTTPS | Ít thay đổi, tận dụng ứng dụng hiện tại | Vẫn cần mạng cho nghiệp vụ; phù hợp bước đầu |
| Thêm service worker nhỏ | Tự kiểm soát tài nguyên được cache; dễ đọc luồng | Tự quản lý vòng đời, cache version và cập nhật; phù hợp fallback đơn giản |
| Serwist | Có công cụ cho precache và các chiến lược cache | Thêm dependency/cấu hình build; vẫn phải tự thiết kế chính sách dữ liệu riêng tư |
| Ứng dụng mobile riêng | Có thể thiết kế sâu cho thiết bị và hệ điều hành | Thêm luồng build/phát hành, tích hợp đăng nhập và bảo trì giao diện |

Next.js có hỗ trợ manifest trực tiếp và hướng dẫn mở rộng offline với Serwist. Khi chọn Serwist, kiểm tra bản tương thích với Next.js và bundler thực tế của dự án; không sao chép cấu hình webpack vào Turbopack mà chưa kiểm chứng. Xem [hướng dẫn Next.js](https://nextjs.org/docs/app/guides/progressive-web-apps).

## Bước 1 — Manifest và icon

File `src/app/manifest.ts` hiện đã có. Ví dụ dưới đây mô tả cấu hình đang dùng, tên thống nhất với metadata:

```ts
import type { MetadataRoute } from 'next';

const manifest = (): MetadataRoute.Manifest => ({
  id: '/',
  name: 'Trip Plan',
  short_name: 'Trip Plan',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#FFFFFF',
  theme_color: '#1E3A8A',
  icons: [
    { src: '/pwa/icon-192.png?v=2', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/pwa/icon-512.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/pwa/icon-maskable-512.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
});

export default manifest;
```

- `MetadataRoute.Manifest` kiểm tra kiểu dữ liệu theo API Next.js.
- `id` giữ định danh ứng dụng ổn định; `start_url` là nơi mở từ icon. Chọn `/` để middleware hiện tại đưa người dùng đến login hoặc overview.
- `scope` là phạm vi điều hướng của ứng dụng đã cài; **không phải** quyền truy cập hay phạm vi service worker.
- `standalone` đề nghị mở cửa sổ ứng dụng riêng; không biến website thành ứng dụng native.
- Hai màu mô tả giao diện khi khởi động; không thay thế MUI theme hay tự đồng bộ dark mode.
- Các PNG **đã được xuất từ SVG hiện có** bằng `node scripts/generate-pwa-icons.mjs`. Bản thường có kích thước 192×192 và 512×512, bản maskable 512×512, Apple 180×180. Nền gradient phủ kín ảnh; hệ điều hành áp dụng hình ngoài của icon. Bản maskable thu nhỏ logo để nằm trong đường tròn an toàn bán kính 40% chiều rộng. Đây là tài nguyên riêng, không gộp purpose any/maskable.
- Lỗi cũ: SVG đã bo góc, Apple PNG giữ góc trong suốt và PNG manifest có nền trắng ở góc. Khi launcher thêm mask/nền có thể xuất hiện lớp viền phụ. Sửa bằng nền kín và maskable, không cố ép hình icon của hệ điều hành. Sau khi triển khai bản mới, xóa biểu tượng/PWA cũ và thêm lại để kiểm tra; bản đã cài có thể giữ icon cũ.

Next.js xử lý file convention và đưa manifest vào metadata. Xem [API manifest của Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest).

## Bước 2 — Cho phép tải tài nguyên PWA khi chưa đăng nhập

Trong `src/middleware.ts`, ngay sau khi lấy `pathname`, đã có allowlist chính xác cho manifest:

```ts
if (pathname === '/manifest.webmanifest') {
  return NextResponse.next();
}
```

Khi triển khai bước offline, bổ sung `/sw.js`, `/offline/vi.html`, `/offline/en.html` vào allowlist này. Không mở toàn bộ route ứng dụng. Icon PNG đã thuộc nhóm được matcher hiện tại loại trừ.

Tại sao cần: manifest phải là manifest JSON và script phải là JavaScript. Một phản hồi HTML của trang login, kể cả HTTP 200 sau redirect, không đáp ứng yêu cầu đó.

## Bước 3 — HTTPS và trải nghiệm cài đặt

Triển khai trên domain HTTPS. `localhost` có ngoại lệ phục vụ phát triển; truy cập điện thoại qua địa chỉ LAN bằng HTTP không tương đương `localhost`.

Đầu tiên kiểm tra khả năng cài từ menu trình duyệt. Nếu thêm nút cài trong ứng dụng, dùng `AppButton`, chuỗi từ `messages/vi.json` và `messages/en.json`:

- Với trình duyệt hỗ trợ `beforeinstallprompt`: lưu sự kiện, chỉ hiện nút khi có thể thực hiện; gọi prompt từ thao tác bấm của người dùng.
- Với iOS: cung cấp hướng dẫn Share → Add to Home Screen phù hợp trình duyệt hỗ trợ, thay vì nút bấm không có tác dụng.
- Ẩn lời mời trong chế độ standalone. Không ép cài để tiếp tục sử dụng website.

`beforeinstallprompt` không được hỗ trợ đồng đều. Xem [MDN về nút cài PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt).

## Bước 4 — Offline fallback có giới hạn

Đây là bước bổ sung sau khi cài ứng dụng hoạt động. Đề xuất các file:

```text
public/sw.js
public/offline/vi.html
public/offline/en.html
src/base/components/pwa/AppServiceWorker.tsx
```

`AppServiceWorker` là Client Component nhỏ, đăng ký `/sw.js` trong effect ở production và xử lý lỗi đăng ký. Root layout vẫn có thể là Server Component. Không bật cache worker trong development để tránh nhầm mã cũ khi sửa giao diện.

Trang offline nên là HTML tự chứa CSS cần thiết, không cần gọi BFF hoặc đi qua `UserProvider`/`PolicyAcceptanceGate`. Tạo nội dung VI/EN từ cùng nguồn bản dịch của dự án; worker chọn theo locale và có ngôn ngữ mặc định khi không biết locale. Không đặt trang offline phụ thuộc vào shell đang yêu cầu `/auth/me`.

Luồng dự kiến:

```text
Lần mở online → tải Next.js → đăng ký worker
Worker install → lưu hai trang offline công khai
Worker activate → dọn cache cũ thuộc riêng TripBudget

Mở một trang → thử mạng
  Thành công → dùng phản hồi thật, kể cả phản hồi lỗi HTTP
  Request điều hướng thất bại do mạng → trả trang offline đã lưu

Gọi /api/* → đi mạng như hiện tại → BFF → Identity/Core
```

Chỉ fallback cho request GET điều hướng cùng origin (`request.mode === 'navigate'`). Không trả HTML offline cho API, file JavaScript, ảnh hoặc React Server Component request. Không cache phản hồi `/api/*`, HTML có dữ liệu người dùng, token, hoặc tự xếp hàng thao tác thêm chi phí/quyết toán ở giai đoạn này.

Trang offline thông báo tính năng hiện cần kết nối và có nút thử lại. Mất mạng trong một trang đang mở phải được thể hiện bằng trạng thái lỗi của request; navigation fallback không tự tạo thông báo cho mọi lỗi API.

Dùng cache name có prefix/version riêng, chỉ xóa cache của chính worker. Cấu hình `/sw.js` trả đúng MIME JavaScript và yêu cầu revalidation (`Cache-Control: no-cache`). Cần chính sách cập nhật để worker mới không tự reload làm mất form đang nhập. Lần truy cập đầu tiên khi chưa từng tải online không thể dựa vào cache chưa tồn tại. Xem [vòng đời và hoạt động offline của service worker](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation).

## Bước 5 — Nếu cần xem/sửa chuyến đi khi mất mạng

Đây là bài toán đồng bộ dữ liệu riêng: lưu snapshot theo user/trip, thời điểm cập nhật, xóa khi đăng xuất/đổi tài khoản và giới hạn dữ liệu lưu trên thiết bị. Ghi offline cần hàng đợi, khóa chống trùng (idempotency key), kiểm tra quyền khi gửi lại và cách giải quyết chỉnh sửa đồng thời. IndexedDB hoặc thư viện cache không tự quyết định các quy tắc nghiệp vụ đó.

Ví dụ: người dùng bấm thêm chi phí hai lần khi mạng chập chờn. Nếu chỉ retry POST mà backend không chống trùng, nhóm có thể bị tính hai khoản. Vì vậy nên làm khả năng đọc offline trước, rồi mới cân nhắc ghi offline.

## Bước 6 — Kiểm chứng sau triển khai

Chạy các lệnh có thật của dự án:

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run start
```

Kiểm tra thủ công trên bản production (không phải các bước đã chạy trong lần rà soát này):

1. DevTools → Application → Manifest: tên và icon đúng, tài nguyên không redirect sang login ở cửa sổ chưa đăng nhập.
2. Cài/mở từ icon: vào login khi chưa đăng nhập, vào overview khi phiên hợp lệ; VI/EN và light/dark vẫn hoạt động.
3. Khi đã triển khai worker: scope đúng, tải `/sw.js` nhận JavaScript, trạng thái worker activated; trang đang mở được kiểm soát sau khi worker tiếp quản hoặc sau lần tải lại.
4. Đã mở online rồi chuyển offline và reload: hiện fallback. Không có API riêng tư hay HTML của tài khoản trong Cache Storage do worker tạo.
5. Mạng trở lại: thử lại tải dữ liệu thật; không báo lưu thành công cho thao tác thất bại.
6. Đăng xuất và đổi tài khoản: không hiện dữ liệu tài khoản trước. Phát hành phiên bản mới: không mất form đang nhập hoặc giữ cache cũ vô thời hạn.
7. Kiểm tra Android và iOS thật: cài đặt, bàn phím, safe-area và xoay màn hình. Build thành công chưa chứng minh những trải nghiệm này đúng.
