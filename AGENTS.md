# Vi Vu — Codex Project Context and Working Instructions

> Copy the entire contents of this file into Codex when starting or continuing work on the Trip Plan project.

## Important

Call me is "Ăm chã húi",
Skip smoke test

## Quy tắc UI hiện hành — tổng hợp yêu cầu người dùng (13/11/2026)

Đọc mục này trước mọi thay đổi UI. Đây là bản tổng hợp lựa chọn mới nhất; nếu ghi chú tiến độ cũ bên dưới mâu thuẫn thì dùng mục này. Chỉ dẫn mới hơn của người dùng luôn được ưu tiên. Ảnh tham khảo là đề xuất để đánh giá, không phải yêu cầu sao chép 100%. Phân biệt quy tắc toàn ứng dụng với bố cục người dùng chỉ đồng ý **thử** trong một phạm vi.

### 1. Tinh chỉnh cùng sản phẩm, giữ nền tảng

- Hướng thiết kế: tinh tế, tối giản, thân thiện, hiện đại; lấy cảm hứng từ Apple HIG/Liquid Glass, không mô phỏng nguyên giao diện Apple hay tái thiết kế/đổi thương hiệu.
- Giữ khoảng 90% nhận diện và cấu trúc hiện tại: palette/primary, font, light/dark mode, icon, spacing token, breakpoint, điều hướng và workflow. Chỉ chỉnh điểm có lợi ích cụ thể; component đã phù hợp thì giữ nguyên.
- Refactor UI không được đổi backend, API, phép tính, quyền, routing hoặc state nghiệp vụ. Không bỏ thông tin/thao tác cần thiết, thêm hero/section trang trí hay cài thư viện không cần thiết.
- Đọc code/theme/component thực tế trước khi sửa; nêu vấn đề, lựa chọn và đánh đổi ngắn gọn bằng tiếng Việt. Không tự mở rộng một mẫu đã thử sang toàn sản phẩm.

### 2. Bo góc và hình dạng phải theo project

- Dùng token `--app-radius-*` trong `src/app/globals.css`, không tự đặt hệ góc khác hay rải số radius tùy ý ở feature.

| Token | Giá trị hiện tại | Mục đích |
| --- | --- | --- |
| detail | 4px | Chi tiết biểu đồ nhỏ |
| badge | 6px | Nhãn/trạng thái nhỏ |
| small | 8px | Item/vùng tương tác nhỏ |
| control | 12px | Nút, input, select |
| card | 20px | Card, bảng, popover |
| panel | 24px | Banner/khối lớn |
| dialog | 28px | Modal, góc trên bottom sheet |
| pill | 999px | Capsule được thiết kế có chủ đích, dock/progress |

- Góc mềm, nhất quán theo kích thước và vai trò; khối con dùng tỷ lệ phù hợp với khối ngoài. Không bo quá mức hoặc ép mọi nút/bộ lọc thành viên thuốc. Filter kế thừa hình dạng component chung.
- Avatar/marker tròn dùng 50%; fullscreen và mép sheet sát đáy dùng 0. Giữ ngoại lệ có lý do thay vì thay hàng loạt.
- Squircle/continuous corners chỉ là progressive enhancement ở bề mặt phù hợp qua `@supports`; có border-radius dự phòng. Không dùng mask/clip làm mất focus, ảnh hay nội dung; không coi CSS là bản render native chính xác của Apple.

### 3. Kính nhẹ, nội dung rõ

- Mức đã chọn: **kính nhẹ, tinh tế**. Dùng helper `src/base/theme/surfaces.ts` cho navigation, menu/dropdown, popover, dialog và lớp nổi phù hợp.
- Card nội dung/timeline mặc định nền đặc từ theme. Quy tắc này thay thế thử nghiệm card nền trong ở lượt trước. Không áp blur/kính lên mọi card hoặc mỗi item của danh sách dài.
- Dùng nền/viền/highlight/bóng nhẹ từ palette hiện có. Không thêm màu neon, accent ngẫu nhiên hoặc gradient trang trí tràn lan. Nút primary giữ gradient đã chọn: `linear-gradient(135deg, ${palette.primary.main}, ${palette.primary.light})` ở normal/hover/active; disabled có màu theme riêng.
- Có fallback nền đặc khi không hỗ trợ blur, giảm trong suốt hoặc tăng tương phản. Dialog fullscreen nền đặc. Đánh giá chữ/số tiền trên ảnh và ở cả sáng/tối; độ đọc luôn ưu tiên hơn hiệu ứng.
- Ảnh bìa làm nền chỉ dùng tại nơi đã được người dùng yêu cầu thử; phải có lớp phủ đủ rõ, màu dự phòng và tên/thông tin đọc được. Không biến mọi card thành ảnh nền.

### 4. Component, spacing và tương tác

- Ưu tiên sửa/reuse component trong `src/base/`, không dựng bản sao ở từng màn. Dùng `AppCard`, `AppButton`, `AppSectionHeader`, `AppActionMenu`, `AppFilterChipGroup`, `AppEmptyState` và theme hiện có; giữ API component.
- Container sở hữu gap/padding. Ưu tiên Flexbox; không thêm margin/negative margin, position absolute/relative hoặc Grid để vá căn lề. Không cộng padding card và header nhiều lớp gây thụt lề.
- Header và bộ lọc cùng cấp căn cùng lề trang. Mỗi khu vực phải có title rõ, kể cả khi rỗng; dùng `AppSectionHeader`, không để chỉ còn khung mà người dùng không biết đó là phần gì.
- Không thêm description/subtitle mặc định. Đã bỏ description dưới “Chuyến đi của tôi”; chỉ thêm giải thích khi người dùng yêu cầu hoặc cần cho thao tác.
- Phân cấp hành động rõ: xác nhận/lưu/xuất bản là primary; chỉnh sửa/quay lại là secondary hoặc text theo vai trò. Không để hành động phụ vô tình nhận primary mặc định như nút Chỉnh sửa ở preview xuất bản.
- Icon phải hợp nghĩa, dùng thư viện hiện tại; nút chỉ có icon cần accessible label và tooltip khi phù hợp. Icon chỉnh ngân sách dùng Tune, cả trước/sau đặt ngân sách.
- Vùng chạm thao tác icon tối thiểu 44px. Kích thước nền nhìn thấy có thể nhỏ hơn vùng chạm: menu ba chấm trên card trip hiện nền 28px nhưng hit target 44px. Giữ focus bàn phím rõ; không lồng nút trong nút, không để mở menu kích hoạt mở card.
- Hover/focus/active/disabled/loading phải phân biệt, không đổi validation hoặc callback. Input error/disabled không nhận viền hover primary; helper/error text dễ đọc và wrap.
- Motion nhẹ, thường 150–250ms; helper `interactionTransition` hiện 180ms, tôn trọng prefers-reduced-motion. Không animate kích thước gây layout shift; hover trang trí chỉ dành thiết bị có chuột khi phù hợp.
- Giữ responsive và mật độ dữ liệu hợp lý. Chữ dài phải được xử lý, tránh tràn. Nội dung UI mới có VI/EN; ngày dùng helper calendar-safe, tiền dùng formatter chung. Không tạo số liệu minh họa thay dữ liệu thật.

### 5. Lựa chọn cụ thể cần giữ

- **Activity:** giữ phần ảnh; placeholder upload thông thường là thumbnail/icon ảnh trung tính, không phải chân dung. Avatar tài khoản vẫn là avatar. Giữ cách chọn ảnh, pending và quyền hiện có.
- Không khôi phục bố cục activity gom giờ/danh mục lên đầu đã bị người dùng yêu cầu revert. Danh mục ở dòng trên, trạng thái ở dòng dưới; dùng chip chung, chữ 12px, min-height 24px, gap 4px, không để mỗi card wrap khác nhau theo độ dài nhãn.
- **Ngày:** tab một dòng `T7, 07/11`, `CN, 08/11` (EN `Sat, 07/11`); giữ fallback Ngày N. Nền xanh nhạt cho tab chọn mới là đề xuất đã bàn, chưa phải yêu cầu triển khai toàn bộ tab; không tự đổi màu theo ghi nhớ đề xuất.
- **Chia tiền:** bộ lọc Tất cả / Đang có nợ / Chờ nhận tiền nằm ngoài card dữ liệu, căn cùng lề Ai trả cho ai; chỉ lọc chi tiết thành viên. Giữ header Ai trả cho ai, Chi tiết từng người, Các khoản đã trả, gồm trạng thái rỗng. Giữ thông tin từng hàng và hành động trả/xóa theo quyền.
- **Chi tiết khoản chi:** dùng AppFinanceRow compact riêng cho payer/danh sách chia: tên và email cùng cột trái, số tiền cùng tỷ lệ/trạng thái bên phải; email không nằm dưới toàn bộ cụm tiền. Giữ đủ thông tin, wrap dữ liệu dài, dùng card nền đặc và token radius project. Không suy ra settled từ payer hoặc thay phép chia.
- **Ngân sách:** tạm ẩn disclosure “Xem ngân sách từng nhóm chi” và nội dung của nó bằng cờ hiện có; giữ code để bật lại. Không ẩn chart hay sửa dữ liệu ngân sách ngoài yêu cầu.
- **Thử nghiệm timeline mobile:** trục số dịch trái 6px, card rộng thêm 8px qua biến rail/gap 16px/10px; từ sm giữ 28px/8px. Số vẫn 28px, ảnh/lề phải/bo góc giữ nguyên; connector phải cùng trục. Không suy rộng thành giảm lề mọi trang.
- **Thử nghiệm trip mobile hiện tại:** dùng ảnh bìa làm nền với lớp phủ tối, chữ trắng và fallback primary.dark, chiều cao tối thiểu 120px có thể giãn theo chữ. Card bấm mở; bỏ nút “>” riêng; menu “⋮” góc trên phải, nền 28px/hit target 44px. Giữ metadata, active state và quyền chủ chuyến; desktop giữ hiện tại. Lựa chọn này thay bản thumbnail trái và cột chevron đã thử trước đó. Không cam kết 3 trip luôn vừa một màn hình khi chưa đo viewport thực.

### 6. Kiểm chứng và báo cáo

- Sửa hẹp, giữ thay đổi sẵn có của người dùng; không dùng broad global CSS override hoặc `!important` để ép style. Không đổi dependency hay abstract thêm nhiều lớp cho chỉnh sửa nhỏ.
- Chạy lint/type-check và kiểm tra phù hợp thay đổi; báo rõ file sửa, những gì đã kiểm chứng và phần chưa kiểm chứng. Không nhận đã xác minh chức năng end-to-end, responsive, độ tương phản hay thị giác nếu chỉ chạy kiểm tra code.
- Tiếp tục bỏ smoke/browser test theo yêu cầu hiện tại. Nếu chưa có kiểm tra ảnh trước/sau/thiết bị thì nói rõ; chỉ thực hiện kiểm tra trực quan khi người dùng yêu cầu thay đổi phạm vi kiểm chứng đó.
- Chi tiết triển khai/lịch sử: `docs/ui-materials.vi.md`, `docs/ui-refinement.vi.md`. Các bố cục đang thử không tự trở thành quy tắc áp dụng toàn app.

## Required reasoning and review — read every session

Read this AGENTS.md at the start of every session working in this repository. Before each coding task, re-read the sections relevant to that task rather than relying only on previous summaries. For each implementation/design decision, explicitly cover these user requirements in Vietnamese:

1. Explain the core problem.
2. Explain advantages and disadvantages.
3. Explain why the approach is selected and why relevant alternatives are not.
4. Describe viable alternative approaches.
5. Critically evaluate the request and reference images; do not automatically agree or implement every suggestion. Explain tradeoffs, then implement the authorized scoped improvement using judgment. Ask only when a material ambiguity cannot be resolved.

For mobile homepages, prioritize the current task and concise summaries. Avoid duplicating whole itinerary/expense screens, decorative introductions or large hero sections that bury useful content. Keep secondary details reachable via links or disclosures. Community templates belong on Home/library; the planner prioritizes the user's itinerary (confirmed 2026-10-27).

## 1. Your role

You are the engineering partner for **Vi Vu**, a travel planning and shared-budget application. Work incrementally, inspect the repository before changing code, preserve existing user work, and explain every implementation clearly for a developer who is new to some of the technologies involved.

Do not assume that code discussed in a previous conversation has already been created. Always inspect the actual repository first and distinguish between:

- code that exists in the repository;
- code that was only proposed;
- code that still needs to be implemented.

When asked to implement something, complete the requested scope, verify it safely, and report exactly what changed.

## 2. Communication requirements

Respond in **Vietnamese**, unless the user explicitly requests another language.

# <<<<<<< Updated upstream

UI copy preference (2026-10-30): avoid adding descriptions/subtitles by default. Use concise titles and existing shared components; add explanatory text only when the user asks or it is essential to complete an action. Notification empty states use AppEmptyState with a title/icon and no description. Do not show explanatory connection-status paragraphs in the notification inbox; retain actionable error/retry feedback.

Treat the user's UI opinions and reference images as proposals to evaluate, not final design decisions. Explain suitability and tradeoffs before expanding a visual pattern across the product. An explicit implementation request authorizes that scoped implementation, not an automatic project-wide rollout. Fix concrete color/layout defects within the requested review; report remaining design recommendations separately. Do not present a suggested style as approved.

> > > > > > > Stashed changes
> > > > > > > Every technical answer must explain:

1. The concept or component is what.
2. Why it is needed.
3. Why the selected approach is suitable for this project.
4. What each important block or line of code does.
5. How data flows through the implementation.
6. Advantages, disadvantages, and relevant alternatives.
7. How to test and recognize success or failure.

Do not only paste code. Explain immediately near the relevant code. Use beginner-friendly language without hiding important technical details.

For each proposed approach, explain the underlying problem, why this project benefits,
the end-to-end flow, and the advantages and disadvantages against relevant alternatives.
Distinguish installed/coded capabilities from a proposed implementation guide.

Preserve the user's chosen primary button gradient:
`linear-gradient(135deg, ${palette.primary.main}, ${palette.primary.light})`.
The design skill's no-gradient house rule does not override this project preference.
Keep the gradient for normal, hover and active states; disabled states use their own
theme colors. Review readability and interaction separately from stylistic preferences.

When diagnosing a bug:

1. Identify the actual error message.
2. Explain the root cause.
3. Show the minimal correction.
4. Explain why the correction works.
5. Give commands or requests to verify it.

Do not introduce a large number of abstractions at once. Build one clear layer at a time.

## 3. Repository and services

The project is intended to be a monorepo similar to:

```text
trip-budget/
├── docker-compose.yml
├── tripbudget-identity/   # NestJS identity/authentication service
├── tripbudget-core/       # Spring Boot core/trip service
└── tripbudget-web/        # Next.js customer-facing frontend
```

Before modifying anything, inspect the actual folder names and project files. Do not recreate files that already exist.

### Service responsibilities

| Service               | Responsibility                                                            |
| --------------------- | ------------------------------------------------------------------------- |
| `tripbudget-identity` | Users, registration, login, JWT creation, refresh, logout, Redis sessions |
| `tripbudget-core`     | Trips, trip members, permissions, trip business rules                     |
| `tripbudget-web`      | Customer-facing UI, SSR-first rendering, Next.js BFF                      |
| PostgreSQL            | Persistent relational data                                                |
| Redis                 | Authentication session state and refresh-session control                  |

## 4. Database decisions

The services currently share the same PostgreSQL database, named approximately `trip_budget`, but use separate schemas:

```text
public
└── users

trip_core
├── trips
└── trip_members
```

### `public.users`

Important fields:

```text
id, email, password, name, avatar_url, status,
created_at, updated_at
```

User statuses:

```text
ACTIVE, INACTIVE, BLOCKED
```

### `trip_core.trips`

Important fields:

```text
id, owner_id, name, destination, description,
start_date, end_date, base_currency, status,
version, created_at, updated_at
```

Trip statuses currently include:

```text
DRAFT, PLANNING, CONFIRMED, IN_PROGRESS,
COMPLETED, ARCHIVED, CANCELLED
```

The user has also discussed soft deletion using a `DELETED` status. Before implementing delete behavior, inspect the current enum and database constraint. If `DELETED` is not present in both, add it through a proper database migration rather than only changing Java code.

### `trip_core.trip_members`

Important fields:

```text
id, trip_id, user_id, role, status,
joined_at, created_at, updated_at
```

Member roles:

```text
OWNER, EDITOR, MEMBER, VIEWER
```

Member statuses:

```text
INVITED, ACTIVE, LEFT, REMOVED
```

`trip_members.trip_id` has a foreign key to `trip_core.trips.id` with `ON DELETE CASCADE`.

At the time of discussion, `owner_id` and `user_id` did not have database foreign keys to `public.users`, because user ownership belongs to the identity service boundary. Do not add cross-service foreign keys without explicitly discussing the coupling tradeoff with the user.

## 5. Authentication architecture

Authentication is owned by NestJS.

Expected flow:

```text
register → login → me → refresh → logout
```

JWTs are created by NestJS and validated by Spring Boot. Both services must use compatible JWT configuration:

- same algorithm;
- same signing secret when using HMAC;
- compatible claims;
- secret length of at least 256 bits for HS256.

Important JWT claims:

```text
sub = user ID
sid = authentication session ID
```

### Redis session model

Redis is used to make JWT authentication stateful enough to revoke sessions.

Expected conceptual keys:

```text
auth:session:{sessionId}
auth:user-sessions:{userId}
```

Their purposes are different:

- `auth:session:{sid}` stores or represents one login session.
- `auth:user-sessions:{userId}` indexes all session IDs belonging to one user.
- The user-session index enables `logoutAll` without scanning all Redis keys.

Do not describe `auth:user-sessions` as being “higher” in a technical hierarchy. It is an index/grouping key pointing to multiple sessions.

### Token storage direction

The intended frontend architecture is a Next.js BFF:

```text
Browser → Next.js BFF → NestJS Identity / Spring Boot Core
```

Preferred security direction:

- Do not store access or refresh tokens in `localStorage`.
- Prefer `HttpOnly`, `Secure` in production, and appropriate `SameSite` cookies.
- Browser JavaScript should not need direct access to refresh tokens.
- Next.js BFF should forward authenticated calls to backend services.
- Refresh and logout should be handled through BFF endpoints.

Cookie deletion must use the same relevant cookie attributes used when setting it, especially `path`. For example, a cookie set with `path: '/api/auth'` must be cleared for that same path; otherwise the browser can retain the original cookie.

Before implementing BFF token forwarding, inspect the exact NestJS login response and `Set-Cookie` behavior. Do not guess the payload shape or parse complex cookies with brittle string splitting.

### Password hashing

If bcrypt is used, do not add and store a separate manual salt unless there is a specific requirement. bcrypt generates a random salt and embeds it in the resulting hash. Explain this whenever the user asks why no `salt` column or field exists.

## 6. Spring Boot core service

The Spring Boot service validates access JWTs issued by NestJS and protects trip APIs.

Previously discussed or implemented layers include:

```text
controller → service → repository → database
```

Trip and TripMember entities, enums, and repositories have been created at some point, but inspect the repository before assuming their current state.

### Spring Data repositories

Repository methods may use derived-query names such as:

```java
findByTrip_IdAndUserId(...)
existsByTrip_IdAndUserIdAndStatus(...)
findAllByTrip_IdAndStatus(...)
```

Explain that Spring Data parses property paths from method names and generates repository implementations at runtime. Nested paths such as `Trip_Id` traverse the entity relationship `trip.id`.

For complex queries, use `@Query` with JPQL or native SQL only when justified. For pagination, accept `Pageable` and return `Page<T>`, then map to a project `PageResponse<T>`.

### Service style

The user has chosen to use concrete Spring services directly:

```java
@Service
public class TripService { ... }
```

Do not introduce a service interface plus implementation automatically. Only add an interface when there is a concrete benefit, such as multiple implementations, a stable module boundary, or a testing/architecture requirement.

### Entity behavior

The agreed style allows entities to expose behavior methods that protect their own invariants, for example:

```java
TripEntity.createDraft(...)
trip.updateDetails(...)
trip.markDeleted(...)
```

Why:

- entity fields can remain protected from arbitrary invalid mutation;
- a newly created trip can always start in `DRAFT`;
- state transitions can be centralized;
- setters do not expose every state change to every caller.

Repositories are for persistence/querying, not for mutating the in-memory fields of an entity. The service coordinates the use case and calls entity behavior, then persists through the repository.

Do not put cross-aggregate orchestration inside `TripEntity`. For example, creating a trip, creating its owner membership, and creating invitation memberships belongs in `TripService` within one transaction. `TripMemberEntity.createOwner(...)` and `createInvitation(...)` may protect the rules of individual member objects.

### API response convention

Successful APIs should follow a consistent envelope such as:

```json
{
  "status": 201,
  "message": "Trip created successfully",
  "data": {}
}
```

The controller must put the complete `ApiResponse<T>` in the response body:

```java
return ResponseEntity
    .status(HttpStatus.CREATED)
    .body(ApiResponse.success(
        HttpStatus.CREATED,
        "Trip created successfully",
        response
    ));
```

Do not call `.data()` if the desired response includes `status`, `message`, and `data`; `.data()` extracts only the inner payload.

Errors should be normalized through a `GlobalExceptionHandler` rather than repeated try/catch blocks in controllers.

### User Authentication & Current User Injection Convention (@CurrentUser)

The core Spring Boot service validates JWT access tokens issued by the Identity service. To obtain the authenticated user inside controllers in a clean, type-safe, and secure manner, the application uses a custom meta-annotation:

- **Annotation**: `com.tripbudget.tripbudget_core.common.annotations.CurrentUser`
- **DTO**: `com.tripbudget.tripbudget_core.common.dtos.CurrentUserDto` (Java Record: `Long id, String sessionId`)

#### Implementation details:

`@CurrentUser` is defined using Spring Security's `@AuthenticationPrincipal` with a SpEL constructor expression:

```java
@Target({ElementType.PARAMETER, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal(
    expression = "new com.tripbudget.tripbudget_core.common.dtos.CurrentUserDto(#this)"
)
public @interface CurrentUser {}
```

SpEL `#this` refers to the authenticated `Jwt` object validated by Spring Security. The constructor `CurrentUserDto(Jwt jwt)` automatically parses `jwt.getSubject()` into `Long id` and extracts `jwt.getClaimAsString("sid")` into `String sessionId`.

#### Mandatory Controller Conventions:

1. **Standard Parameter Injection**: Always declare `@CurrentUser CurrentUserDto user` as a method parameter in controller endpoints requiring authentication.
2. **Explicit Extraction**: Explicitly declare `Long currentUserId = user.id();` at the beginning of the controller method. This improves debugging clarity and maintains consistency across all controllers.
3. **Strict Security Prohibitions**:
   - **NEVER** accept `userId` from the request body, URL query parameters, or route path variables to identify the caller. Doing so causes critical Insecure Direct Object Reference (IDOR) security vulnerabilities.
   - **NEVER** manually parse `Jwt` claims or call `jwt.getSubject()` inside controller logic.
4. **Context Passing**: Pass `currentUserId` as the first argument or contextual identifier to the service layer (e.g. `tripService.createTrip(currentUserId, ...)` or `expenseService.createExpense(currentUserId, tripId, ...)`).
5. **Reference Standard**: Reference `TripController.java` (`com.tripbudget.tripbudget_core.trip.controllers.TripController`) and `ExpenseController.java` (`com.tripbudget.tripbudget_core.expense.controllers.ExpenseController`) as the canonical standard for all controllers.

#### Mandatory Service Layer Authorization Conventions:

1. The service layer must always receive `Long currentUserId`.
2. The service layer is strictly responsible for verifying that `currentUserId` has valid permissions on the requested resource before performing any read or write operations:
   - For trip-scoped actions, verify active membership:
     ```java
     boolean isMember = tripMemberRepository.existsByTrip_IdAndUserIdAndStatus(
         tripId, currentUserId, TripMemberStatus.ACTIVE
     );
     if (!isMember) {
         throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to this trip");
     }
     ```
   - Alternatively, use a reusable private helper like `getActiveMemberTrip(tripId, currentUserId)` or `validateMembership(tripId, currentUserId)` which validates both trip existence (throwing `404 NOT_FOUND` if deleted or absent) and active membership (throwing `403 FORBIDDEN` if unauthorized).

### Trip Member Management & Permissions Convention

The `tripbudget-core` service manages trip participants using `TripMemberEntity`:

- **Member Roles (`TripMemberRole`)**:
  - `OWNER`: Creator or principal manager of the trip. Has full control over settings, invites, role assignments, and member removals.
  - `EDITOR`: Can invite other members (as `MEMBER`/`VIEWER`), add/update/delete expenses and configure budgets.
  - `MEMBER`: Regular participant who can view expenses and participate in expense splitting (`splits`). Can leave the trip.
  - `VIEWER`: Read-only participant.

- **Member Statuses (`TripMemberStatus`)**:
  - `ACTIVE`: Active participant who has access to the trip and appears in `/my-trips`.
  - `INVITED`: Invited participant awaiting acceptance.
  - `LEFT`: Member who voluntarily departed the trip (soft-deleted).
  - `REMOVED`: Member removed by the trip owner (soft-deleted).

#### Cross-Service User Lookup Without Foreign Keys:

To respect the database decision (Section 4, lines 140-142) preserving service isolation, `tripbudget-core` defines a read-only entity:

```java
@Entity
@Table(schema = "public", name = "users")
@Immutable
public class UserEntity { ... }
```

- No database Foreign Key DDL is created between `trip_core.trip_members` and `public.users`.
- `UserRepository` enables finding users by email for invitations (`findByEmail`) and batch-loading user profiles (`findAllByIdIn`) to populate member names, emails, and avatars in `TripMemberResponse`.

#### Trip Member Controller & BFF Endpoints:

- `GET /api/trip/{id}/members`: List all active members of the trip.
- `POST /api/trip/{id}/members`: Invite/add a member by email (`InviteMemberRequest`).
- `PUT /api/trip/{id}/members/{memberId}`: Update member role (`UpdateMemberRoleRequest`, Owner only).
- `DELETE /api/trip/{id}/members/{memberId}`: Remove a member (Owner only; Owner cannot be removed).
- `POST /api/trip/{id}/members/leave`: Non-owner member voluntarily departs the trip.

## 7. Frontend technology and UI rules

Frontend stack:

- Next.js App Router;
- TypeScript;
- MUI;
- Emotion/MUI Next.js integration;
- Axios for API requests;
- a shared/custom Axios client instead of creating Axios configuration inside each feature;
- shared reusable hooks for common asynchronous request behavior;
- no TailwindCSS;
- manual form validation initially (do not require Zod);
- customer-facing travel application, not an admin/CRM interface.

### SSR-first rule

Keep `page.tsx`, layouts, and static presentation components as Server Components whenever possible.

Only add `'use client'` at the smallest interactive boundary that needs:

- `useState`, `useEffect`, or other client hooks;
- event handlers;
- browser APIs;
- interactive MUI state.

Important distinction:

- Client hooks such as `useLogin` do not run during SSR.
- SSR renders the initial page.
- Hydration enables interaction afterward.
- A Login form must be interactive, so it should be a small Client Component inside a Server-rendered page.

Preferred Login composition:

```text
app/login/page.tsx             # Server Component, metadata
LoginPageView.tsx              # Server Component, page layout
LoginBrandPanel.tsx            # Server Component, static visual
LoginForm.tsx                  # Client Component, state/events
useLogin.ts                    # Client hook
app/api/auth/login/route.ts    # Next.js BFF endpoint
```

Do not claim that Axios or a custom hook makes a page SSR. SSR is determined by component boundaries and where data is fetched/rendered.

### Axios and shared API client

The user explicitly wants Axios for API calls. Build one or more shared Axios instances instead of importing raw `axios` and repeating configuration in every feature.

A reasonable structure is:

```text
src/
├── base/
│   ├── api/
│   │   ├── axios-client.ts
│   │   ├── axios-server.ts       # only if a separate server-only client is justified
│   │   ├── api-error.ts
│   │   └── types.ts
│   └── hooks/
│       └── use-api-request.ts
└── features/
    └── auth/
        ├── api/
        │   └── auth-api.ts
        └── hooks/
            └── use-login.ts
```

Follow the repository's actual aliases and folder conventions. Do not create duplicate `base`, `shared`, and `common` layers for the same purpose.

The browser-facing Axios client should normally call the Next.js BFF using same-origin relative URLs:

```ts
import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Explain every option:

- `baseURL: '/api'` sends browser requests to the Next.js BFF on the same origin.
- `withCredentials: true` allows relevant cookies to accompany requests; it does not make HttpOnly cookies readable by JavaScript.
- `timeout` prevents requests from waiting forever.
- default JSON headers are appropriate for JSON endpoints, but do not force them for file uploads using `FormData`.

Do not place private backend URLs or secrets in `NEXT_PUBLIC_*` variables. NestJS and Spring Boot internal base URLs belong in server-only environment variables and are read by BFF route handlers/server code.

Do not automatically attach `Authorization` from `localStorage`. The selected direction is BFF plus HttpOnly cookies. If the BFF stores the access token in an HttpOnly cookie, BFF server code reads it and adds the Bearer header when calling Spring Boot.

Interceptors may be used for cross-cutting behavior, but keep them narrow:

- normalize a known API error shape;
- optionally attach non-secret common headers;
- coordinate a refresh request only after the refresh contract is defined;
- avoid redirects or React UI calls deep inside the Axios layer unless deliberately designed.

Do not implement refresh with a naive interceptor that can recurse forever. If refresh is added, guard against:

- calling refresh for the refresh endpoint itself;
- retrying the same request more than once;
- multiple simultaneous 401 responses causing multiple refresh calls;
- replaying a request after refresh/logout has failed.

Axios in a Client Component does not make the initial page SSR. Keep the same component boundary:

```text
Server page/layout → server/static components → client form → shared hook → Axios → Next.js BFF
```

For server-side data fetching, prefer direct server-only calls from Server Components or a server-only API module. Do not import a browser Axios instance that uses `baseURL: '/api'` into a Server Component because a relative URL has no browser origin on the server. If Axios is used server-side, create a separate server-only client with a validated absolute internal URL and explicitly forward required request cookies/headers.

### Debounce for live API inputs — required for future work

- Before adding or changing a search/autocomplete/live-validation input, check whether typing triggers API calls or expensive work. For continuous text input, use the shared `useDebouncedValue` exported from `@/base/hooks`, default 300ms. Keep the displayed input state immediate and debounce the query value, not the input itself.
- Do not introduce feature-local debounce timers or add a second debounce to a flow that already uses the shared hook. Choose a different delay only for a concrete requirement and explain it.
- Debounce belongs at the live-input/query boundary. Explicit actions (Apply/Enter, Save, dropdown/chip selection, sorting, pagination, clear/reset) should remain immediate; do not debounce all form fields or every request globally.
- Query keys must include the settled term and other request parameters (for example locale). Pause stale requests during debounce, hide results for another term, and use the existing query cancellation/version guards so late responses cannot overwrite the current search. Cancel timers/requests on unmount; honor minimum input lengths required by the API.
- `useQueryGet.isStale` indicates retained data belongs to a different query key; existing `data` retention is preserved for other consumers. Errors are exposed only for their query key. Search consumers should handle request failure without an indefinite loading indicator.
- Server autocomplete should not apply an additional client text filter that removes backend-ranked or accent-insensitive matches. Preserve a stable selected option while results change so MUI does not reset a user's input.
- Verify rapid typing, clear/reset, errors, out-of-order responses and unmount. Current unit coverage: `node tests/query-debounce.test.mjs`. Skip smoke test remains in effect.

### Shared hooks

The user wants reusable custom hooks. Separate a generic async-request hook from feature-specific hooks:

```text
useApiRequest<TData, TArgs>  # generic loading/error lifecycle
useLogin()                   # authentication-specific behavior
useTrips()                   # trip-specific behavior, if later needed
```

The generic hook may own:

- `loading` state;
- normalized error state;
- execution of a supplied async function;
- clearing/resetting errors;
- protection from stale updates or repeated submissions when appropriate.

The generic hook should not know:

- Login URLs;
- Trip DTOs;
- where to redirect after Login;
- business-specific success messages;
- JWT or Redis details.

Feature-specific endpoints, query/mutation keys, request parameter mapping and request orchestration belong in `src/features/<feature>/hooks/`, composed from the existing base hooks. Components call those feature hooks and own UI state/presentation/navigation; do not configure `useQueryGet`/`useMutationPost`/`useMutationRequest` or call Axios directly in feature components. Generic UI hooks remain allowed. Even a request currently used by one component should follow this established project boundary. Existing legacy violations are audit findings, not examples to copy.

Feature hooks compose the generic hook and own feature behavior. For example, `useLogin` may call `authApi.login`, then refresh navigation or redirect after success.

Do not create one universal hook that attempts to handle every GET, POST, pagination, mutation, toast, refresh, and redirect behavior. Start with the smallest reusable behavior proven by at least two use cases, or keep the first implementation feature-specific and extract common behavior when duplication appears.

Hooks require `'use client'` and run after hydration. They are not a replacement for server-side fetching. Data needed for the initial SEO/user-visible render should be fetched in Server Components or server-only modules when appropriate.

### Layout constraints

The user explicitly prefers Flexbox and does not want UI layout built with:

- `position: relative`;
- `position: absolute`;
- unnecessary CSS Grid.
- layout spacing created with margins such as `margin`, `marginTop`, `marginBottom`, `marginLeft`, `marginRight`, or MUI shorthands `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my`.

Prioritize:

```tsx
display: 'flex'
flexDirection
alignItems
justifyContent
gap / Stack spacing
flexGrow
flexShrink
flexBasis
minWidth: 0
minHeight: 0
```

Use CSS Grid only after explaining why a genuinely two-dimensional layout needs it and obtaining agreement.

### Spacing rule: container owns spacing

Do not use margins on individual UI children to create visual distance. The parent Flexbox/Stack must own spacing through:

```tsx
gap
rowGap
columnGap
<Stack spacing={...}>
```

Preferred:

```tsx
<Stack spacing={2}>
  <Typography>Title</Typography>
  <AppTextField label="Email" />
  <AppButton>Login</AppButton>
</Stack>
```

Do not write:

```tsx
<Typography sx={{ mb: 2 }}>Title</Typography>
<AppTextField sx={{ mb: 2 }} label="Email" />
<AppButton sx={{ mt: 1 }}>Login</AppButton>
```

For a Flexbox built with `Box`, use:

```tsx
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }}
>
  {children}
</Box>
```

The rule distinguishes **internal spacing** from **spacing between siblings**:

- Use `padding`, `px`, `py`, `pt`, `pb`, `pl`, and `pr` for space between a container's border and its contents.
- Use `gap` or `Stack spacing` for space between sibling elements.
- Do not use child margins to position siblings.

If one region must consume the remaining space or push another region to the end, use Flexbox sizing instead of `margin: auto`:

```tsx
<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  <Header />

  <Box sx={{ flexGrow: 1, minHeight: 0 }}>
    <Content />
  </Box>

  <Footer />
</Box>
```

Do not solve that layout with:

```tsx
<Footer sx={{ mt: 'auto' }} />
```

For wrapping rows, use Flexbox gap:

```tsx
<Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1.5,
  }}
>
  {items}
</Box>
```

This rule applies to new feature/layout code and project wrapper components. Browser/MUI reset styles such as `body: { margin: 0 }`, or internal MUI component styles already recorded in the current theme, are not layout techniques for spacing siblings. Do not silently rewrite the supplied theme; if strict removal of an internal MUI margin such as `MuiFormHelperText.marginTop` is desired, propose that theme change separately.

### Quy Chuẩn Kiến Trúc Layout & Phân Cấp Spacing Trang (Page Layout & Spacing Architecture Standard)

Để loại bỏ hoàn toàn tình trạng các component con phải tự đo đạc, tự thêm padding/margin cục bộ (`px: 3`, `mb: 1.5`, `mt: 0.5`...) dẫn đến xô lệch lề và vỡ bố cục giao diện khi ghép nối từ Header đến Body, toàn bộ Frontend tuân thủ nghiêm ngặt **Kiến trúc Phân Cấp Spacing 4 Tầng**:

1. **Tầng 1 — Page Shell / Container (`AppPageContainer`)**:
   - Duy nhất component này sở hữu lề trong của trang (`p: { xs: 2, md: 3 }`), màu nền trang (`bgcolor: 'action.hover'`), và `minHeight: '100%'`.
   - `AppPageContainer` điều phối khoảng cách giữa các khối lớn cấp cao (Header, Tabs, Banners, Cards, Tables, Timeline) thông qua `gap: 3` (24px).
   - Mọi trang trong ứng dụng (`/overview`, `/trips`, `/expenses`, `/settlement`, `/plan`...) **bắt buộc bọc nội dung bằng `AppPageContainer`**.

2. **Tầng 2 — Page Header (`AppPageHeader`)**:
   - Mọi trang phải sử dụng `AppPageHeader` chuẩn hóa (hoặc tuân thủ 100% cấu trúc của nó): Icon, Title (`h1`, `fontSize: { xs: '24px', sm: '28px' }`, `fontWeight: 800`), Badge/Pill ngữ cảnh, Subtitle/Metadata, và cụm nút thao tác (`actions`) căn phải responsive.
   - Tuyệt đối không thêm `pb: 1` hay margin đáy cục bộ làm méo mó khoảng cách giữa Header và các khối bên dưới.

3. **Tầng 3 — Các Khối Nội Dung (Page Content Blocks / Sections)**:
   - Mọi component là con trực tiếp của `AppPageContainer` (Header, Tabs, Cards, Tables, Banners, Timeline...) **bắt buộc phải có `width: '100%'`**, **KHÔNG có outer margin** (`m: 0`), và **KHÔNG có outer padding** (`p: 0`, `px: 0`).
   - Mép trái của mọi khối con luôn bắt đầu thẳng hàng tuyệt đối tại `x = 0` (được căn chuẩn bởi padding của `AppPageContainer`).

4. **Tầng 4 — Nội dung bên trong Khối (Internal Card / Component Content)**:
   - Các khối dạng Card (`AppCard`, Paper, Table container) sở hữu **internal padding** (`p: { xs: 2, md: 3 }` hoặc `p: 2.5`), nhưng viền ngoài của Card luôn khít mép `x = 0` của container.
   - Tuyệt đối cấm component con tự ý thêm `px`, `py` hoặc `mb` ở thẻ root để "bù trừ" hay "căn chỉnh" với phần tử khác.

5. **Quy tắc Bố Cục Dạng Cột Phức Tạp / Timeline**:
   - Trong các bố cục dạng timeline hoặc nhiều cột ngang, cột bên trái (như cột hiển thị thời gian) phải có kích thước đủ rộng (ví dụ `width: { xs: '95px', sm: '110px' }`, `flexShrink: 0`) để chữ không bị tràn (`overflow`) ra ngoài lề trái của container, gây cắt qua vạch chuẩn lề trang.
   - Danh sách timeline (`DayTimelineList`) sử dụng `<Stack spacing={2}>` để điều phối khoảng cách giữa các thẻ; các thẻ con (`ActivityTimelineCard`) tuyệt đối không mang `mb: 1.5` hay `px: 3`.

### CSS unit rule: prefer pixels, not `em` or `rem`

For explicit design measurements in frontend code, use `px` instead of `em` or `rem`.

Preferred:

```tsx
sx={{
  fontSize: '16px',
  letterSpacing: '-1px',
  borderRadius: '12px',
  minHeight: '50px',
}}
```

Do not introduce:

```tsx
sx={{
  fontSize: '1rem',
  letterSpacing: '-0.03em',
  borderRadius: '0.75rem',
}}
```

This does not mean every CSS value must be a pixel value. Use the unit that represents the actual layout relationship:

- `px` for explicit font sizes, icon sizes, borders, radii, fixed widths/heights, and custom visual spacing;
- `%` for a size relative to the containing block;
- `dvh`/`svh` for viewport height when appropriate;
- MUI breakpoints for responsive changes;
- `flexGrow`, `flexShrink`, and `flexBasis` for distributing available Flexbox space;
- unitless values for properties such as `fontWeight`, `lineHeight`, and opacity when appropriate.

MUI system spacing numbers remain allowed:

```tsx
<Stack spacing={2} />

<Box sx={{ gap: 2, px: 3, py: 2 }} />
```

Those numbers are resolved through `theme.spacing` (commonly `2 → 16px`, `3 → 24px`). They are design-system tokens and are not `em`/`rem` units. When an exact value outside the spacing scale is required, write an explicit pixel string such as `gap: '14px'`.

Do not replace responsive/flexible sizing with arbitrary fixed pixels merely to satisfy this rule. For example, `width: '100%'` and `minHeight: '100dvh'` remain correct because they describe relationships that pixels cannot safely express.

Avoid Next.js `<Image fill>` when it would require positioned parents. For decorative/static panels, a CSS `backgroundImage` can preserve the no-positioning rule. For semantic images, use explicit responsive image dimensions without absolute positioning.

### MUI component usage

Use `Box` for:

- application/page shells;
- semantic layout elements (`main`, `aside`, `nav`, `section`);
- width, height, overflow, background, and complex Flexbox behavior.

Use `Stack` for:

- one-dimensional groups;
- form fields;
- titles and descriptions;
- action buttons;
- consistent spacing between children without child margins.

Remember:

- `display: flex` makes an element a flex container for its children.
- `flexGrow`, `flexShrink`, and `flexBasis` control the current element as a flex item inside its parent.
- They are different responsibilities and can exist on the same element.

For a fixed sidebar and expanding main content:

```tsx
// Sidebar
{
  width: 240,
  flexShrink: 0,
}

// Main
{
  minWidth: 0,
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
}
```

For a vertical sidebar with a scrollable menu:

```tsx
// Aside
{
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

// Menu region
{
  minHeight: 0,
  flexGrow: 1,
  overflowY: 'auto',
}
```

### Theme and design system

There is or should be a shared MUI theme under a path similar to:

```text
src/theme/app-theme.ts
```

The current application theme is based on this palette and must supersede earlier green/teal examples:

```text
primary.main         #1E3A8A
primary.light        #0EA5E9
primary.dark         #172554
primary.contrastText #FFFFFF
secondary.main       #F59E0B
secondary.light      #FCD34D
secondary.dark       #F97316
success.main         #16A34A
success.light        #DCFCE7
success.dark         #166534
error.main           #DC2626
error.light          #FEE2E2
error.dark           #991B1B
background.default   rgb(30, 58, 138)
background.paper     #FFFFFF
text.primary         #0F172A
text.secondary       #475569
divider              rgba(30, 58, 138, 0.12)
```

The current complete theme reference below is normalized to the later project rule that explicit typography measurements use pixels instead of `em`/`rem`:

```tsx
'use client';

import { createTheme } from '@mui/material/styles';

const appTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#1E3A8A',
      light: '#0EA5E9',
      dark: '#172554',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#F97316',
      contrastText: '#1F2937',
    },
    success: {
      main: '#16A34A',
      light: '#DCFCE7',
      dark: '#166534',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DC2626',
      light: '#FEE2E2',
      dark: '#991B1B',
      contrastText: '#FFFFFF',
    },
    background: {
      default: 'rgb(30, 58, 138)',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: 'rgba(30, 58, 138, 0.12)',
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: 'var(--font-body)',
    h1: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      letterSpacing: '-1.5px',
    },
    h2: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      letterSpacing: '-1.25px',
    },
    h3: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '-1px',
    },
    h4: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '-0.75px',
    },
    h5: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
    },
    h6: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
    },
    button: {
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { minHeight: '100%' },
        body: { minHeight: '100%', margin: 0 },
        '*': { boxSizing: 'border-box' },
        a: { color: 'inherit', textDecoration: 'none' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 44,
          paddingInline: 20,
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 700,
        },
        sizeLarge: {
          minHeight: 50,
          fontSize: '16px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 50,
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1E3A8A',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1.5,
          },
        },
        input: { padding: '14px 16px' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { marginLeft: 4, marginTop: 6 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(30, 58, 138, 0.10)',
          boxShadow: '0 24px 70px rgba(15, 23, 42, 0.10)',
        },
      },
    },
  },
});

export default appTheme;
```

Do not silently change this palette. If visual accessibility or contrast is a concern, point it out and propose a specific change before modifying the established theme.

Use theme tokens instead of repeating raw colors:

```tsx
bgcolor: 'primary.light';
color: 'primary.dark';
borderColor: 'divider';
```

Inside an `sx` callback:

```tsx
sx={(theme) => ({
  color: theme.palette.primary.main,
})}
```

The theme controls design tokens and global component defaults. Project wrapper components control reusable project-specific APIs and behavior.

### Shared UI components

The project is building shared components similar to:

```text
AppButton
AppTextField
AppTextArea
AppCard
```

Recommended responsibility split:

| Layer             | Responsibility                                             |
| ----------------- | ---------------------------------------------------------- |
| MUI theme         | Global colors, typography, radius, default component style |
| `AppButton`       | Semantic intent, loading behavior, consistent project API  |
| `AppTextField`    | Shared input defaults                                      |
| `AppTextArea`     | Multiline defaults                                         |
| `AppCard`         | Reusable card variants                                     |
| Feature component | Business-specific content and layout                       |

Avoid placing a new `ThemeProvider`/`ConfigProvider` inside every component instance. Use one root MUI provider and read tokens from the shared theme.

### Reuse existing components before creating UI

Before implementing any UI element, search the repository for an existing project component that already provides the same responsibility. If a suitable component exists, use it instead of rebuilding the behavior with raw MUI components, `Box`, HTML, or duplicated styles.

For example:

- use `AppLinearProgress` instead of manually composing a progress track and bar with nested `Box` components;
- use `AppButton` instead of styling a raw MUI `Button` for an existing project intent;
- use `AppTextField`, `AppTextArea`, `AppCard`, and `AppToast` when their existing APIs satisfy the feature requirement.

Before creating a new shared component or feature-local replacement:

1. Inspect `src/base/components/ui` and the relevant feature component folders.
2. Read the existing component API and implementation, not only its filename.
3. Reuse the component when its responsibility matches the requirement.
4. Extend the existing component narrowly when the missing behavior is reusable and does not break current consumers.
5. Create a new component only when the responsibility is genuinely different; explain why the existing component is unsuitable.

Do not keep two components that represent the same UI responsibility under different names. A small feature component remains appropriate when it composes existing primitives into a distinct business concept, such as a trip summary metric; it must not duplicate an existing shared primitive.

For custom Button variants, prefer a project prop such as:

```ts
type AppButtonIntent = 'primary' | 'secondary' | 'success' | 'danger' | 'text';
```

Using `intent` avoids conflicting with MUI's built-in `color` and `variant` props. If custom semantics replace those props, use `Omit<ButtonProps, 'color' | 'variant'>` deliberately and explain the tradeoff.

### Component organization

Do not put the entire Login page or complex feature views in one file. A reasonable feature-first structure is:

```text
src/
├── app/
├── base/
│   └── components/
│       └── ui/
├── features/
│   └── auth/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       └── types/
└── theme/
```

Follow the actual repository structure if it differs. Do not move files merely to match this example unless the user asks for a refactor.

### Quy tắc 1 Component / 1 File (Single Responsibility per File)

Tuyệt đối **không định nghĩa nhiều components trong cùng 1 file** (ví dụ: không khai báo các helper components, sub-views, modal hosts, metric cards, hoặc danh sách phụ bên trong file component chính như `AppShell.tsx`, `Overview.tsx`, `Login.tsx`).

- Mỗi component phải nằm trong một file riêng biệt có tên tương ứng với component đó (`PascalCase.tsx`).
- Cấu trúc thư mục phải phân cấp rõ ràng: component cha import các component con từ các file độc lập hoặc thư mục con tương ứng (ví dụ: `src/features/trip/components/overview/ActiveTripBanner.tsx`, `CategoryList.tsx`, `RecentExpenseList.tsx`, `TripSummaryMetric.tsx`, `EmptyTripState.tsx`).
- Tách riêng các Host/Wrapper component (ví dụ: `CreateTripHost.tsx` tách khỏi `AppShell.tsx`).
- Giúp code rõ ràng, giảm độ phức tạp của từng file, dễ bảo trì, dễ viết unit test và tái sử dụng độc lập.

### Quy tắc Khai Báo Component Dạng Const Arrow Function & Export Default (Arrow Function Component Convention)

Toàn bộ React component (bao gồm cả Pages, Layouts, Features, và Base Components) **bắt buộc phải được khai báo dưới dạng `const` arrow function** và đặt câu lệnh `export default ComponentName;` ở dòng cuối cùng của file.

- **Nghiêm cấm**: Tuyệt đối không sử dụng cú pháp `export default function ComponentName() { ... }` hoặc anonymous export default `export default () => { ... }`.
- **Cú pháp chuẩn bắt buộc**:

  ```tsx
  interface MyComponentProps {
    title: string;
  }

  const MyComponent = ({ title }: MyComponentProps) => {
    return (
      <Box>
        <Typography>{title}</Typography>
      </Box>
    );
  };

  export default MyComponent;
  ```

- **Lý do**:
  1. Đồng nhất 100% phong cách viết component xuyên suốt dự án.
  2. Tách biệt rõ ràng phần định nghĩa component và phần export, giúp code nhất quán và tránh hoisting không mong muốn.
  3. Dễ dàng gán kiểu (như `React.FC`) hoặc định nghĩa generic types khi cần mở rộng.
  4. Hỗ trợ hiển thị tên Component rõ ràng trong React DevTools và stack traces khi debug.

### Quy tắc Sử dụng Palette Theme Cho Màu Sắc & Trạng Thái (Theme-First Palette Tokenization)

Nghiêm cấm **hardcode mã màu hex tĩnh** (`#15803D`, `#3B82F6`, `#F97316`...) trực tiếp vào component, badges, status chips, hoặc styles.

- **Luôn bám theo Theme Palette**: Mọi màu sắc cho trạng thái (status chip, indicator, border, background mờ) phải được lấy từ Theme Palette thông qua hàm theme callback trong `sx`:
  ```tsx
  bgcolor: (theme) => {
    const palette = theme.vars?.palette ?? theme.palette;
    return palette.success.main;
  };
  ```
- **Phân loại Variant chuẩn**: Sử dụng hệ thống variant ngữ nghĩa chuẩn (`success`, `primary`, `secondary`, `error`, `neutral`/`action`, `warning`, `info`) ánh xạ tương ứng vào theme tokens để đảm bảo giao diện luôn hiển thị đồng bộ và tương thích 100% với cả Light Mode lẫn Dark Mode.

### Quy tắc Tập Trung Helpers & Utilities Chung (`src/base/utils/`)

Mọi hàm xử lý logic chung, định dạng dữ liệu (date, currency, number, string) phải được đặt tập trung trong thư mục `src/base/utils/` và export qua `src/base/utils/index.ts`.

- **Không viết hàm format cục bộ**: Tuyệt đối không tự viết các hàm format riêng lẻ (như `formatDateRange`, `formatCurrency`...) bên trong các file component.
- **Có tham số mặc định rõ ràng**: Các hàm tiện ích phải thiết kế linh hoạt với giá trị mặc định chuẩn dự án (ví dụ: `formatDate(date, format = 'DD-MM-YYYY')`, `formatDateRange(start, end, format = 'DD-MM-YYYY', separator = ' – ')`).
- Giúp dễ bảo trì, tái sử dụng trên toàn bộ codebase và dễ dàng viết unit test độc lập.

### Quy tắc Thiết Kế Base-First & Tối Đa Hóa Tái Sử Dụng (Base-First & Reusability Rule)

Trước khi tạo bất kỳ UI component, dialog, menu thao tác, hay logic xử lý nào ở tầng Feature, luôn xem xét: _"Cái này có thể trừu tượng hóa thành Base để dùng lại được không?"_.

- **Đưa vào `src/base/`**: Bất kỳ pattern nào có tính chất lặp lại hoặc có thể tái sử dụng trong tương lai (như `AppConfirmDialog`, `AppDialog`, `AppActionMenu`, popup scaffolds, helper format, custom hooks chung...) **bắt buộc phải đưa vào `src/base/`** (`src/base/components/ui/`, `src/base/hooks/`, `src/base/utils/`) và export tập trung qua `index.ts`.
- **Tuyệt đối không viết rời rạc**: Nghiêm cấm viết lặp lại cùng một cấu trúc (scaffold) ở nhiều feature khác nhau (ví dụ: không tự dựng lại modal với `DialogTitle`, `DialogContent`, `DialogActions`, icon cảnh báo và nút Hủy/Xác nhận ở nhiều nơi; thay vào đó tạo `AppConfirmDialog` ở base và các feature chỉ việc truyền props).
- **Tầng Feature chỉ làm nghiệp vụ**: Các file trong `src/features/` chỉ tập trung kết nối API và truyền dữ liệu/callback vào Base Components.

### Quy tắc Duy Trì & Cập Nhật Tài Liệu Markdown Liên Tục (Continuous Markdown Synchronization)

Mỗi khi có bất kỳ thay đổi cần thiết nào về:

1. Kiến trúc hệ thống hoặc luồng dữ liệu (BFF, Gateway, Backend APIs, Cookies, Token).
2. Quy tắc lập trình mới, quy ước đặt tên hoặc cấu trúc thư mục được thống nhất với người dùng.
3. Tiến độ dự án (các bước đã hoàn thành và các task tiếp theo).

**Bắt buộc phải cập nhật ngay vào tài liệu markdown (`AGENTS.md`, `walkthrough.md`)**:

- Giúp lưu giữ ngữ cảnh đầy đủ, không bị quên hoặc vi phạm quy tắc khi chuyển giao qua các phiên làm việc tiếp theo.
- Luôn đọc lại file markdown trước khi bắt tay vào triển khai bất kỳ module mới nào.

### Quy tắc Chuẩn Hóa Đa Ngôn Ngữ VNI / ENG (Internationalization & Localization Standard)

Dự án sử dụng thư viện `next-intl` để hỗ trợ đa ngôn ngữ đầy đủ với hai tùy chọn chính: **VNI** (`vi` - Tiếng Việt) và **ENG** (`en` - Tiếng Anh). Nút chuyển đổi ngôn ngữ nằm tại TopBar (`AppPreferences.tsx`) và lưu trữ locale qua cookie `trip-budget-locale`.

**Nghiêm cấm tuyệt đối việc hardcode text hiển thị (UI strings) trực tiếp trong file mã nguồn**:

1. **Không có ngoại lệ**: Toàn bộ chuỗi văn bản người dùng nhìn thấy (tiêu đề trang, nhãn nút, label/placeholder input, options dropdown, cột bảng dữ liệu, text phân trang, thông báo toast, lỗi validation, tên danh mục, chip trạng thái...) **bắt buộc phải lấy từ từ điển thông qua hook `useTranslations`**.
2. **Đồng bộ 1:1 giữa hai từ điển**: Mọi key mới được định nghĩa phải tồn tại đồng thời ở cả hai file:
   - `messages/vi.json` (Bản địa hóa tiếng Việt - VNI)
   - `messages/en.json` (Bản địa hóa tiếng Anh - ENG)
3. **Quy ước đặt namespace và key**:
   - Phân cấp namespace theo domain/tính năng rõ ràng: `preferences`, `topBar`, `sidebar`, `trip`, `myTrips`, `expense`, `profile`, `validation`...
   - Tên key đặt theo kiểu `camelCase` mô tả đúng ngữ nghĩa (ví dụ: `pageTitle`, `addExpense`, `deleteConfirm`, `totalBudgetLabel`).
4. **Cách sử dụng chuẩn trong component**:

   ```tsx
   import { useTranslations } from 'next-intl';

   export default function MyComponent() {
     const t = useTranslations('expense');
     return <Typography>{t('pageTitle')}</Typography>;
   }
   ```

5. **Tham số hóa chuỗi linh hoạt**: Đối với các thông báo chứa dữ liệu động (số tiền, tên đối tượng, phân trang), sử dụng interpolation cú pháp `{variable}`:
   - Trong JSON: `"deleteConfirm": "Bạn có chắc chắn muốn xóa {title} trị giá {amount}?"`
   - Trong component: `t('deleteConfirm', { title: item.title, amount: formatCurrency(...) })`
6. **Định dạng tiền tệ và ngày tháng**: Luôn truyền đơn vị tiền tệ (`currency`) hoặc định dạng chuẩn qua `formatCurrency(amount, currency)` và `formatDate(date, 'DD/MM/YYYY')` từ `src/base/utils/`.

## 8. Current frontend direction

The static Login UI has been developed or discussed with:

- a travel illustration/brand panel;
- email and password inputs;
- password visibility toggle;
- remember-me checkbox;
- forgot-password link;
- submit button;
- register link;
- responsive MUI layout.

The next authentication implementation should be incremental:

1. Inspect current Login component and shared UI components.
2. Split static/server and interactive/client boundaries if needed.
3. Add manual validation with field-specific errors.
4. Add the shared Axios base/client and normalized API error type.
5. Add a typed BFF Login route.
6. Connect a feature `useLogin` hook, composing a shared request hook only when the abstraction is justified.
7. Store tokens securely using the agreed HttpOnly-cookie design.
8. Add authenticated BFF calls to Spring Boot.
9. Add refresh handling.
10. Add logout and route protection (configured via `src/middleware.ts` to redirect unauthenticated users to `/login` and authenticated users to `/overview`).
11. Test browser cookies, Redis keys, refresh rotation, and revoked sessions.

Axios is the selected request library, but do not jump straight to a refresh interceptor before the BFF cookie contract and refresh behavior are defined.

### Route protection and Middleware

Route protection is implemented at the Edge/Server level using Next.js Middleware (`src/middleware.ts`):

- **Protected routes**: All standard application paths (`/`, `/overview`, `/expenses`, `/settlement`, `/scan`, `/ai`, `/demo`, etc.) require authentication.
- **Public routes**: `/login` (and `/register`, `/forgot-password` when added).
- **Unauthenticated access**: Any request to a protected route without valid auth cookies (`access_token`, `refresh_token`, `auth_token`, `session_token`) is immediately redirected to `/login`.
- **Authenticated access**: A request to `/login` from an already authenticated user is redirected to `/overview`.
- **Root path (`/`)**: Redirects to `/overview` if authenticated, or `/login` if unauthenticated.
- **Static assets & APIs**: Excluded from redirection via the middleware `matcher`.

## 9. Manual validation direction

The user chose manual validation for now instead of requiring Zod.

Validation should:

- normalize email using `trim()` and usually lowercase it;
- show individual field errors;
- prevent submit when invalid;
- clear or update a field error when the user corrects that field;
- disable repeated submits while loading;
- distinguish validation errors from server/API errors;
- preserve accessibility through labels, helper text, and focus behavior.

Do not rely only on HTML `required` if the project needs consistent custom messages.

## 10. Git safety

The repository previously experienced confusion involving:

- a Git repository nested inside another repository;
- an embedded `tripbudget-identity` Git repository;
- branch names `master` versus `main`;
- remote history being different from local history;
- generated `target/` files appearing in Git status;
- source files being lost during merge/repository restructuring.

Before Git mutations:

1. Run `git status`.
2. Confirm repository root with `git rev-parse --show-toplevel`.
3. Inspect branches and remotes.
4. Check for nested `.git` directories when relevant.
5. Do not force-push, delete `.git`, reset, or remove files without explicit confirmation.
6. Preserve unrelated changes.
7. Ensure generated folders such as Java `target/` and Next.js `.next/` are ignored.

Do not recommend `--force` casually. If remote replacement is explicitly desired, explain `--force-with-lease`, its risk, and verify the exact branch first.

### Multi-Repository Workspace & VS Code "Accept All" Handling

The root folder `/home/hanbiro/lou` contains two independent Git repositories:

1. `trip-budget` (Backend Monorepo)
2. `trip-budget-web` (Frontend Next.js App)

**When clicking "Accept All" or "Stage All" in VS Code**:

- VS Code prompts with a QuickPick dropdown: `Choose a repository: [trip-budget] or [trip-budget-web]`.
- **Action**: Pick the first repository (`trip-budget`), and then if prompted or for remaining changes, accept `trip-budget-web`.
- **CAUTION**: Do NOT hit `Escape`, cancel, or click "Refresh" while the prompt is active, as cancelling mid-write truncates `.git/index` to 0 bytes (`fatal: .git/index: index file smaller than expected`).
- **One-click recovery / Stage**:
  - Run `/home/hanbiro/lou/fix-git.sh` or VS Code Task `Git: Fix Corrupted Index`.
  - To stage both simultaneously: Run VS Code Task `Git: Stage All (Both Repos)` or `git -C trip-budget add -A && git -C trip-budget-web add -A`.

## 11. Implementation workflow for every task

Follow this sequence:

### Step 1 — Inspect

- Read relevant files.
- Check framework/package versions.
- Find existing conventions.
- Check Git status before edits.

### Step 2 — Explain the plan

Briefly state:

- what will be changed;
- why;
- which files are affected;
- what will not be changed.

### Step 3 — Implement narrowly

- Reuse existing components and theme tokens.
- Keep Server Components by default.
- Add client boundaries only where necessary.
- Avoid premature abstractions.
- Do not overwrite unrelated user code.

### Step 4 — Verify

Use relevant checks, for example:

```bash
npm run lint
npm run build
npm run test
./mvnw test
./mvnw spring-boot:run
```

Only run commands that exist in the inspected project. If a command fails because of an existing unrelated issue, explain that precisely.

For authentication, test the actual flow:

```text
register → login → protected endpoint → refresh → protected endpoint → logout
```

Also verify:

- cookies in browser DevTools;
- cookie path/domain/SameSite/Secure behavior;
- Redis session key existence and TTL;
- refresh rotation behavior;
- old refresh/session rejection after logout;
- Spring Boot accepts a valid NestJS access JWT;
- Spring Boot rejects expired, malformed, or revoked sessions.

### Step 5 — Report

State:

- files changed;
- behavior implemented;
- verification performed;
- remaining limitations;
- the single most logical next step.

## 12. Rules for code explanations

When providing code, explain important constructs such as:

- `'use client'` and client boundaries;
- `ReactNode`;
- destructuring and rest props;
- `Omit`, union types, and generics;
- `sx`, theme callbacks, and breakpoint objects;
- `Box` versus `Stack`;
- flex container versus flex item;
- `minWidth: 0` and `minHeight: 0` in Flexbox;
- `Pageable`, `Page<T>`, repository derived queries;
- `@Transactional` boundaries;
- entity behavior versus repository persistence;
- JWT claims and Redis session lookups;
- HttpOnly cookie behavior and why browser JavaScript cannot read it.

Do not say a pattern is “best practice” without explaining the concrete benefit for this project.

## 13. First action when this prompt is used

Start by asking for or inspecting the actual repository/project path. Then provide a short state report:

```text
- What currently exists
- What differs from this context
- What is incomplete
- Recommended immediate next step
```

If the user has already supplied a specific task, do not block on a broad questionnaire. Inspect the relevant files and proceed within that task's scope.

## 14. Current project progress & next tasks

### Completed steps:

1. Giao diện Login với validation thủ công đầy đủ (email regex, password presence, focus & field errors).
2. Shared Axios browser client (`src/base/api/axios-client.ts`), normalized error types (`src/base/api/api-error.ts`, `types.ts`), và reusable mutation hooks (`src/base/hooks/use-mutation-post.ts`, `use-query-get.ts`).
3. Next.js BFF Login Route Handler (`src/app/api/auth/login/route.ts`) tích hợp với NestJS Identity Service (`POST /api/auth/login`), thiết lập HttpOnly cookies (`access_token`, `refresh_token`) an toàn.
4. Hook `useLogin` (`src/features/auth/hooks/useLogin.ts`) kết nối với Login form và xử lý redirect về `/overview` khi thành công.
5. Edge Route Protection với Next.js Middleware (`src/middleware.ts`) kiểm tra HttpOnly cookies (`access_token`, `refresh_token`,...).
6. Next.js BFF Trip Route Handlers (`src/app/api/trip/my-trips/route.ts`, `src/app/api/trip/create/route.ts`) gắn `access_token` từ cookie gọi sang Spring Boot `TripController` (`GET /api/trip/my-trips`, `POST /api/trip/create`).
7. Tích hợp Trip Context (`TripContext.tsx`), custom hooks (`useMyTrips`, `useCreateTrip`), popup tạo chuyến đi (`CreateTripDialog`), tự động nhận diện và hiển thị chuyến đi đang diễn ra (`IN_PROGRESS`), hỗ trợ dropdown chuyển đổi chuyến đi và nút tạo mới ở Sidebar & TopBar.
8. Trang danh sách toàn bộ chuyến đi "My Trips" (`/trips`) hiển thị dưới dạng bảng dữ liệu có phân trang (`PageResponse<Trip>`), tích hợp menu Sidebar "Chuyến đi", tuân thủ nghiêm ngặt quy tắc "1 Component / 1 File" (`src/features/trip/components/my-trips/`).
9. Next.js BFF Logout Route Handler (`src/app/api/auth/logout/route.ts`) tích hợp với NestJS Identity (`POST /api/auth/logout`), hủy session Redis, xóa sạch HttpOnly cookies (`access_token`, `refresh_token`), và hook `useLogout` tự động điều hướng về `/login`.
10. Menu người dùng tại `SidebarUser` (`SidebarUserMenu.tsx`) tích hợp Popup Profile (`ProfileDialog.tsx`) xem & chỉnh sửa thông tin cá nhân (Họ tên, Email, SĐT, Role, Bio, Avatar) tái sử dụng toàn bộ UI primitives có sẵn (`AppTextField`, `AppTextArea`, `AppButton`, `AppToast`).
11. NestJS Identity Service (`tripbudget-identity`) đã cập nhật trả về đầy đủ thông tin User (`id`, `email`, `name`, `avatarUrl`, loại trừ `password` và `status`) tại endpoint `POST /api/auth/login` và bổ sung endpoint `GET /api/auth/me` để lấy thông tin profile người dùng hiện tại qua token.
12. Tích hợp User Profile toàn cục (`UserContext.tsx`, `useCurrentUser.ts`, helper `getUserInitials`), tự động fetch thông tin người dùng từ BFF `GET /api/auth/me`, hiển thị tên thật, email thật, avatar initials trên `SidebarUser` và form `ProfileDialog`.
13. Xây dựng bộ Base UI Primitives dùng chung (`AppConfirmDialog`, `AppDialog`, `AppActionMenu`, `AppLoadingOverlay`) theo quy tắc **Base-First & Reusability**. Hoàn thiện **Module Quản Lý Chuyến Đi** tích hợp với Spring Boot `TripController`: BFF routes (`GET /api/trip/[id]`, `PUT /api/trip/[id]`, `PUT /api/trip/delete/[id]`), gộp các mutation hooks (`useCreateTrip`, `useUpdateTrip`, `useDeleteTrip`) tập trung trong file [`useTripMutation.ts`](file:///home/hanbiro/lou/trip-budget-web/src/features/trip/hooks/useTripMutation.ts), hook chi tiết `useTripDetail`, popup chỉnh sửa (`EditTripDialog.tsx`, `EditTripForm.tsx`), popup xác nhận xóa (`DeleteTripDialog.tsx`), và menu thao tác dòng (`TripTableRow.tsx`, `TripTable.tsx`, `MyTrips.tsx`).
14. Triển khai hoàn chỉnh **Cơ chế Tự Động Làm Mới Token (Silent Token Refresh)**:
    - Đồng bộ thời hạn: `accessToken` (15 phút), cookie `access_token` (15 phút), `refreshToken` và Redis Session (30 ngày), cookie `refresh_token` (30 ngày).
    - Cập nhật NestJS Identity: `signOptions: { expiresIn: '15m' }`, `refreshTtlSeconds: 30 ngày`, Token Rotation tự động cấp secret mới và cập nhật hash trong Redis.
    - Next.js BFF: Route Handler `POST /api/auth/refresh/route.ts` nhận refresh cookie, kết nối NestJS và set lại cặp cookies mới trên trình duyệt.
    - Axios Client (`src/base/api/axios-client.ts`): Bổ sung 401 Response Interceptor với cơ chế hàng đợi bất đồng bộ (`failedQueue`) xử lý request đồng thời, tự động refresh ngầm và retry request cũ liền mạch, xóa cookie điều hướng về `/login` nếu phiên hết hạn.

15. Triển khai hoàn chỉnh **Module Quản lý Chi tiêu & Ngân sách (Expenses & Budgeting - `/expenses`)** xuyên suốt toàn bộ hệ thống:
    - **Spring Boot BaseEntity & Flyway Migration (`tripbudget-core`)**:
      - Tạo `BaseEntity.java` (`@MappedSuperclass` với `id`, `isDel`, `createdAt`, `updatedAt`, `@PrePersist`, `@PreUpdate`, `markDeleted()`, `restore()`), refactor `TripEntity` và `TripMemberEntity` dùng chung.
      - Tạo `V2__create_expenses_and_budgets.sql` (bổ sung `is_del` cho trips & trip_members; tạo `budgets`, `category_budgets`, `expenses`, `expense_splits`).
    - **Backend Spring Boot 3 (`com.tripbudget.tripbudget_core.expense`)**:
      - Entities kế thừa `BaseEntity`: `BudgetEntity`, `CategoryBudgetEntity`, `ExpenseEntity`, `ExpenseSplitEntity`.
      - Enums: `ExpenseCategory`, `SplitType`, `ExpenseStatus`.
      - Repositories: `ExpenseRepository`, `ExpenseSplitRepository`, `BudgetRepository`.
      - Services: `ExpenseService` (thuật toán chia tiền EQUAL/EXACT/PERCENTAGE/SHARE, tự động bù số dư lẻ vào Payer, kiểm tra thành viên), `BudgetService` (tính toán hạn mức, chi tiêu thực tế, % tiêu hao, breakdown theo danh mục).
      - Controller: `ExpenseController` (`/trip/{tripId}/expenses`, `/trip/{tripId}/expenses/summary`, `/trip/{tripId}/expenses/{expenseId}`, `/trip/{tripId}/budget`).
      - Build thành công (`mvn compile -o` -> BUILD SUCCESS).
    - **Next.js BFF Handlers (`src/app/api/trip/[id]/`)**:
      - `expenses/route.ts` (GET phân trang & POST tạo khoản chi).
      - `expenses/summary/route.ts` (GET báo cáo ngân sách).
      - `expenses/[expenseId]/route.ts` (GET, PUT, DELETE khoản chi).
      - `budget/route.ts` (POST thiết lập ngân sách tổng & danh mục).
    - **Base UI Primitives & Utilities (`src/base/`)**:
      - `currency.ts`: `formatCurrency`, `formatNumber`, `formatNumberInput` (định dạng số tiền tự động chèn dấu phẩy hàng nghìn kiểu `1,000,000`), `parseNumberInput` (phân tích chuỗi số có dấu phẩy thành raw number).
      - `AppNumberInput.tsx`: Component input nhập số chuẩn hóa, tự động format hiển thị kiểu `1,000,000` theo thời gian thực (realtime typing), bảo toàn vị trí con trỏ (cursor tracking), hỗ trợ phím Backspace thông minh, tích hợp `currencySuffix` (`VND`, `USD`) tại endAdornment, trả về `rawString` và `numericValue` cho form cha để ngăn chặn lỗi `NaN`.
      - `AppSelect.tsx`: Dropdown chọn chuẩn hoá hỗ trợ icons.
      - `AppCategoryChip.tsx`: Chip danh mục với màu sắc và icon trực quan.
      - `AppCard.tsx`: Bổ sung prop `layout?: 'default' | 'row'` (mặc định `'default'`), dùng `display: 'block'` thay vì ép cứng lưới 5 cột, loại bỏ tình trạng vỡ layout khi chứa nhiều phần tử con.
    - **Feature Expense Frontend (`src/features/expense/`)**:
      - Custom Hooks: `useTripExpenses`, `useTripBudgetSummary`, `useExpenseMutation` (`useCreateExpense`, `useUpdateExpense`, `useDeleteExpense`, `useSetBudget`).
      - Components tuân thủ nghiêm ngặt **1 Component / 1 File** và quy tắc layout (`AGENTS.md`):
        - Container owns spacing: Loại bỏ toàn bộ `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` trên các phần tử con; mọi khoảng cách do `<Stack spacing={...}>` hoặc `gap` cha quản lý.
        - Flexbox over CSS Grid: Chuyển toàn bộ CSS Grid sang Flexbox (`display: 'flex'`, `flexWrap: 'wrap'`, `flex: 1`, `minWidth: 0`), không dùng `position: relative/absolute`.
        - Explicit pixel units: Chuẩn hoá `px` (font chữ `14px`, `12px`, `24px`, bo góc `16px`, `12px`, `20px`), đồng bộ toàn bộ icon sang `*RoundedIcon`.
        - Đồng bộ thiết kế với `MyTrips.tsx` & `TripTable.tsx`: Nền trang `action.hover`, khung bảng bo viền `borderRadius: '16px'`, `border: 1`, `borderColor: 'divider'`, `TableHead` nền xám nhẹ `action.hover` chữ in hoa bold 12px, cell padding `py: 2`, và Skeleton loading rows.
        - Chi tiết các components:
          - `BudgetMetricsCards.tsx` (3 thẻ metric: Tổng ngân sách, Đã chi, Số dư còn lại; bố cục top/bottom cân đối với `contentSx`, chống gãy chữ nút bấm, Flexbox 3 cột responsive).
          - `BudgetProgressBar.tsx` (Thanh tiến độ cảnh báo ngân sách).
          - `CategorySpendingList.tsx` (Phân bổ chi tiêu theo từng danh mục dạng Flexbox wrap).
          - `ExpenseTable.tsx` & `ExpenseTableRow.tsx` (Bảng chi tiêu chi tiết tràn viền bo 16px, Skeleton rows khi loading, trạng thái rỗng căn giữa).
          - `AddExpenseDialog.tsx` & `AddExpenseForm.tsx` (Form thêm khoản chi dạng Flexbox 50/50, icons Rounded, không margin con).
          - `EditExpenseDialog.tsx` & `EditExpenseForm.tsx` (Form chỉnh sửa khoản chi Flexbox 50/50, icons Rounded).
          - `DeleteExpenseDialog.tsx` (Xác nhận xóa với Stack spacing).
          - `SetBudgetDialog.tsx` & `SetBudgetForm.tsx` (Form thiết lập hạn mức tổng và hạng mục dạng Flexbox wrap).
          - `ExpenseOverview.tsx` (Layout tổng quan chuẩn hoá Stack spacing, đồng bộ header với `MyTripsHeader`).
      - Trang `/expenses` render `ExpenseOverview`.
      - Kiểm thử hoàn toàn: `npx tsc --noEmit` -> 0 errors, `npm run lint` -> 0 errors, 0 warnings.
16. **Chuẩn hóa Đa Ngôn Ngữ VNI / ENG Toàn Diện Cho Module Expense (`/expenses`)**:
    - Bổ sung quy chuẩn bắt buộc i18n vào `AGENTS.md`: Cấm 100% hardcode text hiển thị, đồng bộ 1:1 giữa `messages/vi.json` và `messages/en.json`, dùng `useTranslations`.
    - Thêm trọn bộ namespace `"expense"` vào `messages/vi.json` và `messages/en.json` (tiêu đề trang, metrics KPI, tiến độ ngân sách, danh sách danh mục, bảng chi tiêu, menu hành động, phân trang, form thêm/sửa, dialog xóa/ngân sách, toast thông báo).
    - Cập nhật `AppCategoryChip.tsx`: Hỗ trợ dịch tên danh mục qua `useTranslations('expense.categories')`, đổi toàn bộ icon sang `*RoundedIcon`, chuẩn hoá `fontSize: '12px'`.
    - Chuyển đổi toàn bộ 10 components trong `src/features/expense/components/` sang `useTranslations('expense')`, hỗ trợ gạt tức thì giữa `VNI` và `ENG` trên TopBar.
17. **Chuẩn Hóa Quy Ước Lấy Người Dùng Đăng Nhập (`@CurrentUser` / `currentUserId`) Xuyên Suốt Backend Core**:
    - Chuẩn hóa kiến trúc tiêm người dùng: Sử dụng custom annotation `@CurrentUser CurrentUserDto user` (dựa trên `@AuthenticationPrincipal` với SpEL khởi tạo `CurrentUserDto` từ `Jwt` subject và `sid`).
    - Quy chuẩn hóa Controller: Tuyệt đối cấm nhận `userId` từ body/query/params để định danh; mọi endpoint đều tiêm `@CurrentUser CurrentUserDto user` và khai báo tường minh `Long currentUserId = user.id();` trước khi truyền xuống Service.
    - Đồng bộ `TripController` & `ExpenseController`: Dọn dẹp mã cũ và comment trong `TripController`, đồng bộ hóa toàn bộ 7 endpoints của `ExpenseController` theo mẫu chuẩn.
    - Quy chuẩn hóa Service: Nhận `currentUserId` và kiểm tra quyền hạn thành viên chuyến đi qua `existsByTrip_IdAndUserIdAndStatus` (`ACTIVE`), ném lỗi 403 Forbidden nếu không có quyền và 404 Not Found nếu chuyến đi không tồn tại/đã bị xóa mềm.
    - Ghi nhận đầy đủ vào Mục 6 của `AGENTS.md` làm tiêu chuẩn kỹ thuật bắt buộc cho toàn bộ dự án.
18. **Triển Khai Hoàn Chỉnh Module Quản Lý Thành Viên Chuyến Đi (Trip Members & Invitations)**:
    - **Backend Spring Boot Core (`tripbudget-core`)**:
      - Tạo Entity chỉ đọc `UserEntity` (`@Immutable`) ánh xạ bảng `public.users` (`id`, `email`, `name`, `avatar_url`, `status`) và `UserRepository` để tra cứu người dùng qua email và nạp danh sách profile mà không tạo quan hệ Foreign Key DDL xuyên service.
      - Nâng cấp domain methods cho `TripMemberEntity`: `addDirectMember`, `updateRole`, `updateStatus`, `remove`, `leave`, `reactivate`.
      - Mở rộng `TripMemberRepository` với các query lọc `isDel == false`.
      - DTOs: `InviteMemberRequest`, `UpdateMemberRoleRequest`, `TripMemberResponse`.
      - `TripMemberService`: Xác thực quyền hạn (`OWNER` có quyền đổi vai trò và xóa thành viên; `OWNER` và `EDITOR` có quyền mời; thành viên không phải owner có quyền tự rời nhóm `leaveTrip`).
      - `TripMemberController`: Tuân thủ chuẩn mực `@CurrentUser CurrentUserDto user` và `Long currentUserId = user.id();`.
    - **Next.js BFF Handlers (`src/app/api/trip/[id]/members/`)**:
      - `route.ts` (GET danh sách thành viên, POST mời thành viên mới).
      - `[memberId]/route.ts` (PUT cập nhật vai trò, DELETE xóa thành viên).
      - `leave/route.ts` (POST rời chuyến đi).
    - **Base & Feature Frontend Web (`src/features/trip/`)**:
      - Types: `member.types.ts` (`TripMember`, `TripMemberRole`, `TripMemberStatus`,...).
      - Custom Hooks: `useTripMembers`, `useInviteMember`, `useUpdateMemberRole`, `useRemoveMember`, `useLeaveTrip`.
      - Components (1 Component / 1 File, Flexbox, Không margin con):
        - `RoleBadge.tsx`: Chip vai trò màu sắc đặc trưng và icon Rounded.
        - `TripMemberRow.tsx`: Dòng từng thành viên với Avatar initials (`getUserInitials`), Email, Name, Role badge, và menu hành động `AppActionMenu`.
        - `TripMemberList.tsx`: Danh sách thành viên cuộn độc lập, Skeleton loading và Empty state.
        - `InviteMemberForm.tsx`: Form nhập email và chọn vai trò, validation email regex.
        - `EditMemberRoleDialog.tsx`: Dialog chọn vai trò mới cho thành viên.
        - `TripMembersDialog.tsx`: Hộp thoại quản lý tổng thể với đầy đủ toast và dialog xác nhận xóa/rời nhóm.
        - `TripMembersHost.tsx`: Host component toàn cục đặt trong `AppShell.tsx`.
    - **Tích Hợp Sâu Xuyên Suốt**:
      - `AppTopBar.tsx`: Nút "Mời thành viên" mở trực tiếp `TripMembersDialog` cho chuyến đi đang hoạt động.
      - `ActiveTripBanner.tsx`: Nút "Thành viên" mở popup quản lý thành viên.
      - `AddExpenseForm.tsx` & `AddExpenseDialog.tsx`: Tự động nạp danh sách `activeMembers` cho phép chọn "Người thanh toán" (`payerId`) thực tế trong chuyến đi.
    - **Bản địa hóa 100% VNI / ENG**:
      - Bổ sung trọn bộ từ điển `"members"` vào `messages/vi.json` và `messages/en.json`.
    - **Kiểm thử chất lượng**:
      - `mvn compile -q` -> 0 errors.
      - `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.
19. **Xây Dựng Base Component Dùng Chung `AppTable` Đa Năng (Server & Client Filtering/Sorting/Pagination) & Đồng Bộ Hoá i18n**:
    - **Kiến Trúc Base Table (`src/base/components/table/`)**:
      - `types.ts`: Định nghĩa `AppTableColumn<T>`, `ColumnFilterType` (`text`, `select`, `dateRange`, `numberRange`), `ColumnFilterOption`, `TableSortState`, `AppTableProps<T>`, hỗ trợ 2 chế độ `mode?: 'client' | 'server'`.
      - `AppColumnFilterPopover.tsx`: Popover lọc từng cột (text search có phím tắt Enter, dropdown đa lựa chọn với nút Chọn/Bỏ chọn tất cả).
      - `AppColumnHeader.tsx`: Header cột hỗ trợ click đổi chiều Sort (`asc` -> `desc` -> hủy sort), icon badge phễu lọc sáng khi có filter.
      - `AppTablePagination.tsx`: Phân trang đồng bộ giao diện toàn hệ thống với select rowsPerPage.
      - `AppTable.tsx`: Component bảng dữ liệu trung tâm, tự động hiển thị Active Filters Bar, Empty State, Skeleton rows khi loading. Khi `mode="server"` hoặc khi được truyền controlled state (`sort`, `filters`), bảng bỏ qua việc lọc/sắp xếp cục bộ và đẩy toàn bộ params lên trang cha.
    - **Đồng Bộ Hoá 100% Đa Ngôn Ngữ VNI / ENG (`messages/vi.json` & `messages/en.json`)**:
      - Thêm namespace `"table"` với 13 keys: `filterBy`, `filterPlaceholder`, `selectAll`, `deselectAll`, `apply`, `clearFilter`, `clearAll`, `filtering`, `noResultsFound`, `noData`, `sortBy`, `rowsPerPage`, `displayedRows`.
      - Thêm bản dịch trạng thái chuyến đi (`archived`, `cancelled`) và placeholders lọc trong `"myTrips"` và `"expense.table"`.
    - **Áp Dụng Cho Feature Chuyến Đi (`/trips`)**:
      - `useMyTrips`: Truyền `search`, `destination`, `currency`, `status`, `sortBy`, `sortDirection`.
      - BFF `GET /api/trip/my-trips`: Chuyển tiếp toàn bộ search params sang Spring Boot Core.
      - `TripTable.tsx` & `MyTrips.tsx`: Sử dụng `mode="server"` và quản lý state controlled sort/filter, tự động đưa trang về `0` khi filter/sort thay đổi.
    - **Áp Dụng Cho Feature Chi Tiêu (`/expenses`)**:
      - `useTripExpenses`: Truyền `search`, `title`, `category`, `payer`, `splitType`, `sortBy`, `sortDirection`.
      - BFF `GET /api/trip/[id]/expenses`: Chuyển tiếp toàn bộ search params sang Spring Boot Core.
      - `ExpenseTable.tsx` & `ExpenseOverview.tsx`: Sử dụng `mode="server"`, quản lý state controlled sort/filter, quốc tế hóa filter options danh mục (`categories.*`) và phương thức chia tiền (`splits.*`), reset trang về `0` khi điều kiện lọc thay đổi.
    - **Tuân Thủ Tuyệt Đối Bộ Quy Tắc Coding (`AGENTS.md`)**:
      - 1 Component / 1 File, explicit pixel units (`px`), không sử dụng child margins (`m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my`), màu sắc bám sát MUI theme palette.
      - Kiểm thử: `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

20. **Triển Khai Hoàn Chỉnh Server-Side Dynamic Filter, Search & Sort Tại Backend Spring Boot Core (`tripbudget-core`)**:
    - **Kiến trúc Spring Data JPA Specifications**:
      - Bổ sung `JpaSpecificationExecutor<TripEntity>` vào `TripRepository` và `JpaSpecificationExecutor<ExpenseEntity>` vào `ExpenseRepository`.
      - Xây dựng `TripSpecifications` và `ExpenseSpecifications` cung cấp các vị từ Criteria API an toàn (`root.get(...)`, `Subquery`, `cb.like`, `cb.or`, `cb.and`, `root.in(...)`).
    - **Chống SQL Injection & Lỗi Thuộc Tính (Whitelist Sorting)**:
      - Xây dựng `buildSort` kiểm soát nghiêm ngặt các trường cho phép sắp xếp (`name`, `destination`, `startDate`, `endDate`, `baseCurrency`, `status`, `id` cho Trips; `expenseDate`, `title`, `amount`, `category`, `splitType`, `id` cho Expenses), tự động chuyển đổi chiều `ASC`/`DESC` an toàn, ngăn chặn lỗi `PropertyReferenceException`.
    - **Triển khai Module Chuyến đi (`com.tripbudget.tripbudget_core.trip`)**:
      - DTO `TripFilterRequest` nhận: `search`, `name`, `destination`, `currency`, `status`, `sortBy`, `sortDirection`.
      - `TripSpecifications.hasActiveMember(currentUserId)`: Kiểm tra membership của người dùng bằng Criteria Subquery trên `TripMemberEntity` (`status = ACTIVE` và `isDel = false`), kết hợp loại trừ chuyến đi bị xóa mềm (`isDel = false` và `status != DELETED`).
      - `TripController.getMyTrips`: Cập nhật nhận các query params tùy chọn `@RequestParam(required = false)`, tạo `TripFilterRequest` và chuyển giao cho `tripService.getMyTrips`.
    - **Triển khai Module Khoản chi (`com.tripbudget.tripbudget_core.expense` & `user`)**:
      - `UserRepository`: Bổ sung truy vấn `findIdsByKeyword` tìm kiếm User ID theo tên hoặc email (`LOWER(name) LIKE ... OR LOWER(email) LIKE ...`).
      - DTO `ExpenseFilterRequest` nhận: `search`, `title`, `category`, `payer`, `splitType`, `sortBy`, `sortDirection`.
      - `ExpenseService.getTripExpenses`: Tra cứu danh sách User ID khớp với từ khóa `payer` hoặc giải mã HashID; tạo Criteria Predicate `payerId IN (:matchedPayerIds)` hoặc `cb.disjunction()` nếu không tìm thấy user nào khớp từ khóa.
      - `ExpenseController.getTripExpenses`: Cập nhật nhận các query params tùy chọn `@RequestParam(required = false)`, tạo `ExpenseFilterRequest` và chuyển giao cho `expenseService.getTripExpenses`.
    - **Bảo mật & Tính Tương Thích**:
      - Tuyệt đối tuân thủ `@CurrentUser CurrentUserDto user` và `Long currentUserId = user.id();`.
      - Hoàn toàn tương thích ngược: các endpoint vẫn hoạt động bình thường với giá trị mặc định khi không truyền tham số lọc.
    - **Kiểm thử chất lượng**:
      - `./mvnw test-compile -q -o` -> BUILD SUCCESS (0 errors).
      - `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

21. **Triển Khai Toàn Diện Module Quyết Toán & Trả Nợ (Debt Settlement & Balances - `/settlement`)**:
    - **Cơ sở dữ liệu & Migration**:
      - Tạo `tripbudget-core/src/main/resources/db/migration/V3__create_settlements.sql`: Tạo bảng `trip_core.settlements` lưu vết các khoản chuyển khoản/tiền mặt giữa các thành viên, kèm `is_del`, audit columns, và các indexes cần thiết (`idx_settlements_trip_id`, `idx_settlements_payer`, `idx_settlements_payee`, `idx_settlements_settled_at`).
    - **Backend Spring Boot Core (`tripbudget-core`)**:
      - Package: `com.tripbudget.tripbudget_core.settlement`.
      - Entity & Enum: `SettlementEntity` kế thừa `BaseEntity`, `PaymentMethod` (`CASH`, `BANK_TRANSFER`, `OTHER`).
      - DTOs: `CreateSettlementRequest`, `MemberBalanceResponse`, `SuggestedSettlementResponse`, `SettlementResponse`, `TripSettlementSummaryResponse`.
      - Thuật toán Tối Giản Nợ (Greedy Min-Cash-Flow Debt Simplification Algorithm):
        - Tính Net Balance của từng thành viên: $Net = \sum \text{Paid Expenses} + \sum \text{Settlements Given} - \sum \text{Owed Splits} - \sum \text{Settlements Received}$.
        - Phân loại thành nhóm con nợ (Debtors, $Net < 0$) và chủ nợ (Creditors, $Net > 0$).
        - Sử dụng thuật toán 2 con trỏ tham lam ghép cặp con nợ lớn nhất với chủ nợ lớn nhất để giảm số lần chuyển tiền xuống mức tối thiểu (tối đa $N-1$ giao dịch).
      - Xử lý Batch User Info: Truy vấn một lượt danh sách `public.users` bằng `UserRepository.findAllByIdIn`, ghép nối tên, email, avatar vào phản hồi.
      - Controller & Security: `SettlementController` (`GET /api/trip/{tripId}/settlement`, `POST /api/trip/{tripId}/settlement`, `DELETE /api/trip/{tripId}/settlement/{settlementId}`). Tuyệt đối lấy user từ `@CurrentUser CurrentUserDto user` -> `Long currentUserId = user.id();`.
    - **BFF & Frontend Next.js (`trip-budget-web`)**:
      - BFF Route Handlers: `src/app/api/trip/[id]/settlement/route.ts` và `src/app/api/trip/[id]/settlement/[settlementId]/route.ts`.
      - Feature Module (`src/features/settlement/`):
        - Types: `types/index.ts`.
        - Hooks: `useTripSettlement.ts` (`useTripSettlementSummary`, `useCreateSettlement`, `useDeleteSettlement`).
        - Components: `MyBalanceCard.tsx`, `SuggestedSettlementCard.tsx`, `SuggestedSettlementsList.tsx`, `MemberBalancesTable.tsx`, `SettlementHistoryTable.tsx`, `RecordSettlementForm.tsx`, `RecordSettlementDialog.tsx`, `SettlementOverview.tsx`.
        - Page: `src/app/settlement/page.tsx` render `SettlementOverview`.
      - **Quy tắc i18n 100% VNI / ENG Tuyệt Đối**:
        - `messages/vi.json` và `messages/en.json` đồng bộ 1:1 namespace `"settlement"`.
        - Toàn bộ thông báo lỗi (validation errors: `payerRequired`, `payeeRequired`, `samePerson`, `invalidAmount`), thông báo toast, placeholders, văn bản fallback đều phải lấy qua `useTranslations`, cấm tuyệt đối hardcode bất kỳ chuỗi tiếng Việt/tiếng Anh nào trong code logic hay JSX.
    - **Tuân thủ quy tắc kiến trúc & UI**:
      - 1 Component / 1 File, Flexbox trên CSS Grid, đơn vị pixel rõ ràng (`px`), không sử dụng child margins (`m`, `mt`, `mb`...), sử dụng theme tokens.
      - Kiểm thử:
        - Backend: `./mvnw test-compile -q -o` -> BUILD SUCCESS (0 errors).
        - Frontend: `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

22. **Chuẩn Hóa Toàn Bộ Khai Báo React Components & Hooks Sang Const Arrow Function & Export Default**:
    - **Quy chuẩn bắt buộc**: Toàn bộ React components (Pages, Layouts, Features, Base UI Primitives, Tables) và custom hooks trong dự án bắt buộc được khai báo theo mẫu `const ComponentName = (props: Props) => { ... }; export default ComponentName;` ở cuối file. Tuyệt đối nghiêm cấm dùng `export default function` hoặc `export default async function`.
    - **Cập nhật tài liệu**: Bổ sung chi tiết quy tắc "Quy tắc Khai Báo Component Dạng Const Arrow Function & Export Default" vào Mục 7 của `AGENTS.md` làm tiêu chuẩn kỹ thuật bắt buộc cho mọi yêu cầu phát triển tiếp theo.
    - **Refactor Toàn Bộ 100% Source Code (92 Files)**:
      - App Router (`src/app/`): `layout.tsx`, `ai/page.tsx`, `demo/page.tsx`, `expenses/page.tsx`, `overview/page.tsx`, `scan/page.tsx`, `settlement/page.tsx`, `trips/page.tsx`.
      - Base Layout & Sidebar (`src/base/components/layout/`): `AppShell`, `AppSidebar`, `AppTopBar`, `CreateTripHost`, `GlobalLoadingHost`, `TripMembersHost`, `SidebarBrand`, `SidebarMenu`, `SidebarTripCard`, `SidebarUser`, `SidebarUserMenu`.
      - Base Table & Primitives (`src/base/components/table/` & `ui/`): `AppTable`, `AppColumnHeader`, `AppColumnFilterPopover`, `AppTablePagination`, `AppButton`, `AppCard`, `AppDialog`, `AppConfirmDialog`, `AppNumberInput`, `AppSelect`, `AppTextField`, `AppTextArea`, `AppToast`, `AppLoadingOverlay`, `AppCategoryChip`, `AppActionMenu`, `AppLinearProgress`.
      - Base Hooks & Providers: `useQueryGet`, `useMutationPost`, `useMutationPut`, `useMutationDelete`, `useMutationRequest`, `AppThemeProvider`.
      - Feature Chuyến Đi (`src/features/trip/`): Toàn bộ components quản lý chuyến đi (`MyTrips`, `TripTable`, `TripTableRow`, `TripStatusChip`, `TripMembersDialog`, `ActiveTripBanner`, `Overview`...), và hooks `useMyTrips`, `useTripDetail`, `useTripMutation`.
      - Feature Chi Tiêu (`src/features/expense/`): Toàn bộ components ngân sách (`BudgetMetricsCards`, `ExpenseTable`, `AddExpenseDialog`, `ExpenseOverview`...), và hooks `useTripExpenses`, `useTripBudgetSummary`, `useExpenseMutation`.
      - Feature Quyết Toán (`src/features/settlement/`): Toàn bộ components quyết toán (`MyBalanceCard`, `SuggestedSettlementCard`, `MemberBalancesTable`, `SettlementHistoryTable`, `RecordSettlementDialog`, `SettlementOverview`...).
      - Feature User & Auth: `ProfileDialog`, `ProfileForm`, `useCurrentUser`, `useLogin`, `useLogout`.
    - **Kiểm thử chất lượng**: `npx tsc --noEmit` -> 0 errors, `npm run lint` -> 0 errors, 0 warnings. Không còn bất kỳ file nào tồn tại cú pháp cũ `export default function`.

23. **Đồng Bộ Dữ Liệu Chuyến Đi Realtime & Tự Động Tính Tổng Ngân Sách Dự Kiến (Realtime Trip Sync & Auto Budget Calculation)**:
    - **Vấn đề 1 — Tạo Trip Tự Động Reset List Không Cần Reload Trình Duyệt**:
      - _Nguyên nhân_: `CreateTripDialog` chỉ gọi `refetchTrips()` trên instance nội bộ của `TripProvider`, trong khi trang danh sách chuyến đi (`MyTrips.tsx`) sở hữu instance `useMyTrips` độc lập nên không nhận được trigger cập nhật, buộc người dùng phải reload trang mới thấy chuyến đi mới.
      - _Giải pháp_: Bổ sung cơ chế Pub/Sub qua `subscribeTrips` và sự kiện đột biến `TripMutationEvent` (`created`, `updated`, `deleted`, `general`) trong `TripContext`. Khi tạo mới trip thành công, sự kiện `'created'` được phát ra; `MyTrips` tự động đưa trang về `page 0`, xóa bộ lọc (`filters = {}`), hủy sort (`sort = null`) và kích hoạt `refetch()` ngay lập tức để chuyến đi mới nhất lập tức xuất hiện ở đầu bảng mà không cần reload.
      - Đồng thời nâng `size: 100` cho `TripProvider` để sidebar và dropdown chuyển đổi chuyến đi luôn có đầy đủ danh sách.
    - **Vấn đề 2 — Tự Động Tính Tổng Ngân Sách Dự Kiến (`expected`) Khi Nhập Từng Danh Mục**:
      - _Hiện trạng & Yêu cầu_: Ô "Tổng ngân sách dự kiến" (`totalBudget`) trước đó bị tách rời với các ô hạn mức danh mục, yêu cầu nhập thủ công hoặc nhấn nút đồng bộ chỉ khi có cảnh báo. Người dùng muốn khi nhập tiền vào từng danh mục, hệ thống sẽ tự động cộng dồn vào ô tổng ngân sách dự kiến nhưng vẫn cho phép sửa tay tự do ô này.
      - _Giải pháp_: Xây dựng handler `handleCategoryChange` trong `SetBudgetForm.tsx`. Khi người dùng gõ hạn mức ở bất kỳ danh mục nào (`categoryLimits`), hàm tự động tính tổng lũy kế các danh mục và set trực tiếp vào `totalBudget`. Đồng thời giữ nguyên ô `AppNumberInput` của `totalBudget` để người dùng có thể tùy ý điều chỉnh thêm bớt (ví dụ thêm khoản dự phòng rủi ro), thanh tiến độ và các trạng thái phân bổ (`exactAllocated`, `remainingUnallocated`, `isOverAllocated`) cập nhật tức thời theo thời gian thực.
    - **Kiểm thử chất lượng**:
      - `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

24. **Triển Khai Hoàn Chỉnh Backend Module Lập Kế Hoạch & Lịch Trình Chuyến Đi (Trip Itinerary & Planning - Spring Boot Core)**:
    - **Cơ sở dữ liệu & Flyway Migrations (`tripbudget-core`)**:
      - `V3__create_settlements.sql`: Tạo bảng `trip_core.settlements` lưu vết các khoản quyết toán, chuyển tiền giữa các thành viên.
      - `V4__create_trip_plans.sql`:
        - `trip_core.plan_days`: Quản lý các ngày trong chuyến đi (`id`, `trip_id`, `day_number`, `plan_date`, `title`, `note`, `is_del`, timestamps). Ràng buộc duy nhất `uq_plan_days_trip_day (trip_id, day_number)`.
        - `trip_core.plan_activities`: Hoạt động chi tiết trong ngày (`id`, `day_id`, `trip_id`, `title`, `start_time`, `end_time`, `location`, `category`, `estimated_cost`, `status`, `order_index`, `note`, `expense_id`, `is_del`, timestamps).
        - `trip_core.plan_checklists`: Danh mục hành lý & công việc cần chuẩn bị (`id`, `trip_id`, `title`, `category`, `is_completed`, `assignee_id`, `is_del`, timestamps).
    - **Domain Entities & Enums (`com.tripbudget.tripbudget_core.plan`)**:
      - Entities kế thừa `BaseEntity`: `PlanDayEntity`, `PlanActivityEntity`, `PlanChecklistEntity`.
      - Enums: `ActivityCategory` (`FOOD_BEVERAGE`, `TRANSPORTATION`, `SIGHTSEEING`, `ACCOMMODATION`, `SHOPPING`, `ENTERTAINMENT`, `OTHER`), `ActivityStatus` (`PLANNED`, `IN_PROGRESS`, `COMPLETED`, `SKIPPED`), `ChecklistCategory` (`DOCUMENTS`, `CLOTHING`, `ELECTRONICS`, `MEDICAL`, `TASKS`, `OTHER`).
    - **Repositories & DTOs**:
      - Repositories: `PlanDayRepository`, `PlanActivityRepository`, `PlanChecklistRepository`.
      - Requests: `CreatePlanDayRequest`, `UpdatePlanDayRequest`, `CreateActivityRequest`, `UpdateActivityRequest`, `UpdateActivityStatusRequest`, `CreateChecklistRequest`, `UpdateChecklistRequest`.
      - Responses: `PlanDayResponse`, `PlanActivityResponse`, `PlanChecklistResponse`, `TripPlanOverviewResponse`.
    - **Service & Business Logic (`PlanService`)**:
      - Tự động sinh ngày lịch trình (`autoGenerateDays`): Khi người dùng vào xem kế hoạch một chuyến đi lần đầu, hệ thống tự động sinh các `PlanDay` tương ứng từ `startDate` đến `endDate` của chuyến đi (ví dụ 3 ngày: Ngày 1, Ngày 2, Ngày 3).
      - Quản lý hoạt động: Thêm, sửa, đổi trạng thái (`COMPLETED`/`SKIPPED`), đổi thứ tự, liên kết `expenseId` nếu đã chi tiền.
      - Quản lý checklist: Thêm đồ dùng/việc cần làm, toggle trạng thái hoàn thành, gán thành viên phụ trách (batch-lookup user info từ `UserRepository`).
    - **Controller & REST Endpoints (`PlanController`)**:
      - Đường dẫn gốc: `/trip/{tripId}/plan`.
      - Bảo mật: 100% tuân thủ tiêm `@CurrentUser CurrentUserDto user` $\rightarrow$ `Long currentUserId = user.id();` và mã hóa ID qua `HashidsService`.
      - 13 REST Endpoints đầy đủ:
        - `GET /trip/{tripId}/plan`: Lấy tổng quan lịch trình (các ngày, hoạt động và checklists).
        - `POST /trip/{tripId}/plan/days`: Thêm ngày.
        - `PUT /trip/{tripId}/plan/days/{dayId}`: Sửa thông tin ngày.
        - `DELETE /trip/{tripId}/plan/days/{dayId}`: Xóa ngày (kèm xóa các hoạt động).
        - `POST /trip/{tripId}/plan/days/{dayId}/activities`: Thêm hoạt động vào ngày.
        - `PUT /trip/{tripId}/plan/activities/{activityId}`: Sửa hoạt động (hỗ trợ chuyển ngày).
        - `PATCH /trip/{tripId}/plan/activities/{activityId}/status`: Cập nhật trạng thái hoạt động.
        - `DELETE /trip/{tripId}/plan/activities/{activityId}`: Xóa hoạt động.
        - `GET /trip/{tripId}/plan/checklists`: Lấy danh sách việc chuẩn bị.
        - `POST /trip/{tripId}/plan/checklists`: Thêm mục cần chuẩn bị.
        - `PUT /trip/{tripId}/plan/checklists/{checklistId}`: Sửa mục checklist.
        - `PATCH /trip/{tripId}/plan/checklists/{checklistId}/toggle`: Đánh dấu xong/chưa xong.
        - `DELETE /trip/{tripId}/plan/checklists/{checklistId}`: Xóa mục checklist.
    - **Kiểm thử chất lượng**:
      - `mvn compile -q -o` -> BUILD SUCCESS (0 errors).
      - `mvn test-compile -q -o` -> BUILD SUCCESS (0 errors).

25. **Triển Khai Hoàn Chỉnh Frontend Next.js Cho Module Kế Hoạch & Lịch Trình Chuyến Đi (Trip Itinerary & Planning - `/plan`)**:
    - **Next.js BFF Handlers (`src/app/api/trip/[id]/plan/`)**:
      - `route.ts`: GET overview, POST ngày mới.
      - `days/[dayId]/route.ts`: PUT sửa ngày, DELETE xóa ngày.
      - `days/[dayId]/activities/route.ts`: POST thêm hoạt động.
      - `activities/[activityId]/route.ts`: PUT sửa hoạt động, DELETE xóa hoạt động.
      - `activities/[activityId]/status/route.ts`: PATCH & PUT cập nhật trạng thái hoạt động.
      - `checklists/route.ts`: GET, POST checklist.
      - `checklists/[checklistId]/route.ts`: PUT sửa, DELETE checklist.
      - `checklists/[checklistId]/toggle/route.ts`: PATCH & PUT toggle checklist.
    - **Feature Plan Frontend (`src/features/plan/`)**:
      - Types: `types/index.ts` ánh xạ 1:1 với DTOs của Spring Boot Core (`PlanActivity`, `PlanDay`, `PlanChecklist`, `TripPlanOverview`...).
      - Custom Hooks: `useTripPlan.ts` (lấy dữ liệu lịch trình tổng quan), `usePlanMutation.ts` (các mutation hooks cho hoạt động, ngày và checklist).
      - Components (1 Component / 1 File, const arrow function & export default, container owns spacing, explicit px units):
        - `PlanHeader.tsx`: Header trang hiển thị tên chuyến đi, địa điểm, các metrics (ngày, hoạt động, hoàn thành, chi phí dự kiến) và 2 nút "Chuẩn bị hành lý" & "Thêm hoạt động".
        - `PlanDayTabs.tsx`: Tabs chuyển đổi ngày ngang (Ngày 1, Ngày 2...) kèm badge đếm số hoạt động và format ngày `DD/MM/YYYY`.
        - `PlanEmptyState.tsx`: Trạng thái rỗng trực quan khi một ngày chưa có hoạt động nào.
        - `ActivityTimelineCard.tsx`: Thẻ hoạt động timeline hiển thị thời gian, node tròn timeline, chips danh mục & trạng thái, chi phí dự tính, menu thao tác (Đổi trạng thái, Ghi nhận thành chi tiêu, Sửa, Xóa).
        - `DayTimelineList.tsx`: Danh sách hoạt động được sắp xếp tự động theo trình tự thời gian.
        - `AddActivityForm.tsx` & `AddActivityDialog.tsx`: Dialog & form thêm hoạt động với validation và `AppNumberInput` định dạng tiền tệ realtime.
        - `EditActivityForm.tsx` & `EditActivityDialog.tsx`: Dialog & form sửa hoạt động với dữ liệu pre-filled.
        - `DeleteActivityDialog.tsx`: Hộp thoại xác nhận xóa hoạt động dựa trên `AppConfirmDialog`.
        - `ChecklistRow.tsx`, `AddChecklistForm.tsx`, `ChecklistDialog.tsx`: Quản lý danh mục hành lý & đồ dùng cần chuẩn bị trước chuyến đi với thanh tiến độ hoàn thành realtime.
        - `PlanOverview.tsx`: Component tổng quan điều phối toàn bộ state, derived active day (chuẩn React 19 không gây cascading render), dialogs và toast thông báo.
        - Trang App Router: `src/app/plan/page.tsx` render `PlanOverview`.
    - **Quốc tế hóa 100% VNI / ENG & Sidebar Menu**:
      - Đồng bộ 1:1 namespace `"plan"` trong `messages/vi.json` và `messages/en.json`.
      - Bổ sung `'plan'` vào `SidebarMessageKey` (`types.ts`) và cấu hình menu Sidebar `/plan` với icon `CalendarMonthOutlinedIcon`.
    - **Kiểm thử chất lượng**:
      - `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.
      - `mvn test-compile -q -o` -> BUILD SUCCESS (0 errors).

26. **Chuyển Đổi Phông Chữ Toàn Bộ Ứng Dụng Sang "Comfortaa" & Tối Ưu Hiển Thị Chi Phí Ngày Trên Tabs (`/plan`)**:
    - **Font "Comfortaa" (Google Fonts)**:
      - Cấu hình tại `src/app/layout.tsx`: Nạp `Comfortaa` từ `next/font/google` với các subsets `['latin', 'latin-ext', 'vietnamese']`, thiết lập CSS variable `--font-comfortaa`, `display: 'swap'`.
      - Cấu hình CSS Variables tại `src/app/globals.css`: Gán `--font-display`, `--font-body`, `--font-sans` sang Comfortaa; thêm alias tương thích ngược `--font-outfit`, `--font-dm-serif-display` sang Comfortaa.
      - Tối ưu MUI Typography tại `src/base/theme/theme.ts`: Sử dụng `fontFamily: "var(--font-body)"` cho body, buttons và `MuiCssBaseline`; `var(--font-display)` cho `h1` - `h6` với letterSpacing phù hợp nét tròn của Comfortaa (`-0.5px` đến `0px`). Giữ nguyên font mono cho các bảng số liệu tài chính.
    - **Tối Ưu Tabs Ngày & Đồng Bộ Padding Timeline (`/plan`)**:
      - `PlanDayTabs.tsx`: Luôn hiển thị tổng chi phí dự kiến (kể cả khi không có hoạt động hoặc chi phí bằng 0 sẽ hiển thị `0 ₫`), đặt `minHeight: 74` và `minHeight: 16` cho hàng ngày tháng để toàn bộ các tab luôn có kích thước và chiều cao đồng đều 100%.
      - `ActivityTimelineCard.tsx`: Chuẩn hóa padding thẻ hoạt động thành `p: { xs: 2, md: 3 }` đồng bộ hoàn hảo với padding tổng quan trang `PlanOverview` (`p: { xs: 2, md: 3 }`).
      - `DayTimelineList.tsx`: Loại bỏ `py: 1` dư thừa, để `gap: 3` của `PlanOverview` điều phối khoảng cách tự nhiên; không bọc card tổng kết dư thừa.
      - `PlanEmptyState.tsx`: Chuẩn hóa padding responsive `px: { xs: 2, md: 3 }, py: { xs: 6, md: 8 }`.
      - `PlanOverview.tsx`: Bổ sung `bgcolor: 'action.hover', minHeight: '100%'` đồng bộ thiết kế với toàn bộ các trang tổng quan (`Overview`, `Expenses`, `Settlement`, `My Trips`).
    - **Kiểm thử**: `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

27. **Chuẩn Hóa Toàn Diện Kiến Trúc Layout Frontend & Khắc Phục Triệt Để Lệch Căn Lề Timeline (Page Layout Architecture & Alignment Fix)**:
    - **Nguyên nhân cốt lõi phát hiện**:
      - `AppShell.tsx` để trống padding trên thẻ `<Box component="main">`, dẫn đến tình trạng các trang con phải tự định nghĩa padding, và các component con (Tabs, Timeline, Banners) phải tự ước chừng padding/margin cục bộ để bù trừ.
      - Tại `/plan`, chuỗi thời gian `"07:00 – 08:00"` (101px độ rộng) bị gói trong hộp 85px căn phải (`alignItems: 'flex-end'`), gây tràn lề trái 16px vượt ra ngoài lề trang, cắt ngang vạch chuẩn xanh.
    - **Base Layout Primitives (`src/base/components/layout/`)**:
      - `AppPageContainer.tsx`: Đóng vai trò duy nhất sở hữu lề trong của trang (`p: { xs: 2, md: 3 }`), màu nền (`bgcolor: 'action.hover'`), chiều cao (`minHeight: '100%'`), và điều phối khoảng cách giữa các khối lớn bằng `gap: 3` (24px).
      - `AppPageHeader.tsx`: Header trang chuẩn hóa toàn diện (Icon, Title `h1` 800, Badge/Pill ngữ cảnh, Subtitle/Metadata, và cụm Actions căn phải).
    - **Khắc phục Lệch Timeline (`src/features/plan/`)**:
      - `ActivityTimelineCard.tsx`: Gỡ bỏ hoàn toàn `px: 3` và `mb: 1.5`, mở rộng cột thời gian lên `width: { xs: '95px', sm: '110px' }` (chứa vừa vặn 101px text, chấm dứt hoàn toàn hiện tượng tràn lề trái).
      - `DayTimelineList.tsx`: Sử dụng `<Stack spacing={2}>` điều phối khoảng cách giữa các thẻ hoạt động.
      - `PlanHeader.tsx` & `PlanDayTabs.tsx`: Gỡ bỏ các `pb: 1`, `pb: 0.5` cục bộ. Mọi khối con (`PlanHeader`, `PlanDayTabs`, `DayTimelineList`) đều bắt đầu chuẩn xác tại `x = 0` thẳng tắp theo vạch chuẩn.
      - `PlanOverview.tsx`: Sử dụng `AppPageContainer`.
    - **Đồng Bộ Hoá Toàn Bộ Các Trang Còn Lại**:
      - Chuyển đổi `Overview.tsx`, `MyTrips.tsx`, `MyTripsHeader.tsx`, `ExpenseOverview.tsx`, `SettlementOverview.tsx`, `TripFeaturePlaceholder.tsx` sang sử dụng `AppPageContainer` và `AppPageHeader`.
      - Xóa toàn bộ child margins (`mt: 0.5`, `mb: 1.5`) và padding cục bộ.
    - **Kiểm thử chất lượng**:
      - `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

28. **Khắc Phục Lỗi Hiển Thị Tiêu Đề & Icon Trên TopBar Khi Vào Trang Lập Kế Hoạch (`/plan`)**:
    - **Nguyên nhân phát hiện**:
      - `PAGE_MESSAGE_KEYS` trong `AppTopBar.tsx` bị thiếu khai báo mapping cho route `'/plan'`. Khi người dùng truy cập `/plan`, hàm `matchedPath` trả về `undefined`, kích hoạt giá trị fallback mặc định là `'overview'`.
      - Tiêu đề bị gán cứng thành "Tổng quan" / "Overview", đồng thời icon bị hardcode cố định là `HomeRoundedIcon` cho toàn bộ các trang.
    - **Giải pháp**:
      - Thêm `'/plan': 'plan'` vào `PAGE_MESSAGE_KEYS`.
      - Tạo từ điển icon động `PAGE_ICONS`: ánh xạ tương ứng icon cho từng trang (`HomeRoundedIcon` cho Overview, `CalendarMonthRoundedIcon` cho Plan, `FlightTakeoffRoundedIcon` cho Trips, `SavingsRoundedIcon` cho Expenses, `HandshakeRoundedIcon` cho Settlement, `DocumentScannerRoundedIcon` cho Scan, `SmartToyRoundedIcon` cho AI).
    - **Kiểm thử chất lượng**:
      - `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

29. **Thiết Lập Mặc Định Khi Chuyển Hoạt Động Thành Khoản Chi & Thống Nhất Danh Mục Dùng Chung (`Expense` & `Plan`)**:
    - **Yêu cầu & Mục tiêu**:
      - Khi bấm "Chuyển thành khoản chi" từ một hoạt động trong kế hoạch (`PlanActivity`), hộp thoại thêm chi tiêu (`AddExpenseDialog`) tự động điền sẵn các trường: tiêu đề (`title`), số tiền (`amount`), danh mục (`category`), ngày phát sinh (`expenseDate`).
      - Các giá trị này chỉ là mặc định ban đầu (initial defaults); người dùng hoàn toàn có thể chỉnh sửa tự do trước khi tạo.
      - Thống nhất 100% bộ danh mục (`category`) dùng chung giữa phân hệ Kế hoạch (`Plan`) và Chi tiêu (`Expense`).
    - **Triển khai kiến trúc Base Category Constants (`src/base/constants/`)**:
      - `category.constants.tsx`: Định nghĩa kiểu dữ liệu `TripCategory` (7 danh mục: `FOOD_BEVERAGE`, `ACCOMMODATION`, `TRANSPORTATION`, `SIGHTSEEING`, `SHOPPING`, `ENTERTAINMENT`, `OTHER`), danh sách `TRIP_CATEGORIES`, bảng màu/biểu tượng `CATEGORY_CONFIG`, và hàm tạo danh sách lựa chọn dropdown `getCategorySelectOptions(tCat)`.
      - Export tập trung qua `src/base/constants/index.ts`.
    - **Đồng bộ Types & Components**:
      - `ExpenseCategory` và `ActivityCategory` cùng alias sang `TripCategory`.
      - `AddExpenseDialog.tsx` & `AddExpenseForm.tsx`: Bổ sung prop `initialData?: AddExpenseInitialData` để khởi tạo state mặc định cho `title`, `amount`, `category`, `expenseDate`. Người dùng tự do nhập/sửa trên form. Sử dụng `key` động trên form để remount sạch sẽ khi mở hoạt động mới.
      - `PlanOverview.tsx`: Truyền `initialData` lấy từ `activity.title`, `activity.estimatedCost`, `activity.category`, và `day.planDate`. Đồng thời bảo toàn toàn bộ dữ liệu của hoạt động trong API `PUT /trip/{tripId}/plan/activities/{id}` khi gắn `expenseId`.
      - `AppCategoryChip.tsx`: Sử dụng trực tiếp `TripCategory` và `CATEGORY_CONFIG`.
      - `ActivityTimelineCard.tsx`: Thay thế chip đơn giản bằng `AppCategoryChip` đồng bộ màu sắc và icon với chi tiêu.
      - `EditExpenseForm.tsx`, `AddActivityForm.tsx`, `EditActivityForm.tsx`, `SetBudgetForm.tsx`: Đồng bộ sử dụng `getCategorySelectOptions` và `TRIP_CATEGORIES`.
      - `messages/vi.json` & `messages/en.json`: Đồng bộ nhãn dịch của `plan.categories` khớp 100% với `expense.categories`.
    - **Kiểm thử chất lượng**:
      - `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.
      - `mvn test-compile -q -o` -> BUILD SUCCESS.

30. **Khắc Phục Lỗi Hoạt Động Vẫn Hiển Thị 'PAID' Sau Khi Xóa Khoản Chi Tiêu Liên Kết (Expense Deletion Activity Unlinking & Self-Healing Sync)**:
    - **Nguyên nhân phát hiện**:
      - Khi xóa một khoản chi (`DELETE /trip/{tripId}/expenses/{expenseId}`), phương thức `ExpenseService.deleteExpense` trước đây chỉ thực hiện đánh dấu xóa trên entity `ExpenseEntity` (`isDel = true`, `status = DELETED`), nhưng hoàn toàn không cập nhật trường `expense_id` trên các hoạt động trong kế hoạch (`PlanActivityEntity`) đang liên kết với khoản chi đó.
      - Do đó, `activity.expenseId` vẫn giữ nguyên giá trị ID cũ trong cơ sở dữ liệu.
      - Khi người dùng quay lại trang Lập kế hoạch (`/plan`), API `GET /trip/{tripId}/plan` vẫn trả về chuỗi `expenseId`. Trên giao diện, điều kiện `{activity.expenseId && <Chip label={t('spentChip')} />}` tiếp tục render chip "Đã chi" / "PAID", đồng thời menu 3 chấm ẩn đi tùy chọn "Chuyển thành khoản chi".
    - **Giải pháp xử lý 2 tầng (Immediate Unlink + Self-Healing Check)**:
      - **Tầng 1 (Immediate Unlink tại `ExpenseService.deleteExpense`)**:
        - Inject `PlanActivityRepository` vào `ExpenseService`.
        - Khi xóa khoản chi, truy vấn toàn bộ các hoạt động có `expenseId` tương ứng (`findAllByExpenseIdAndIsDelFalse`).
        - Xóa liên kết (`activity.setExpenseId(null)`). Nếu hoạt động đang ở trạng thái `COMPLETED` do chuyển đổi từ chi tiêu, tự động hoàn tác về trạng thái `PLANNED` (`activity.updateStatus(ActivityStatus.PLANNED)`), sau đó lưu vào DB.
      - **Tầng 2 (Self-Healing tại `PlanService.getTripPlanOverview`)**:
        - Inject `ExpenseRepository` vào `PlanService`.
        - Khi tải tổng quan kế hoạch chuyến đi, thu thập toàn bộ `expenseId` của các hoạt động trong chuyến đi và truy vấn các khoản chi còn active (`!isDel && status != DELETED`).
        - Nếu phát hiện bất kỳ hoạt động nào trỏ tới một `expenseId` không còn tồn tại hoặc đã bị xóa trước đó, hệ thống tự động dọn sạch `act.setExpenseId(null)`, khôi phục `status = PLANNED` và lưu vào DB (tự phục hồi dữ liệu cũ đã bị lỗi).
    - **Kiểm thử chất lượng**:
      - `mvn test-compile -q -o` -> BUILD SUCCESS (0 errors).
      - `npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

31. **Chuẩn Hóa Toàn Diện Cơ Chế Validation Form 2 Lớp (Backend & Frontend) Cho Các Trường Bắt Buộc (Required Fields)**:
    - **Nguyên nhân phát hiện**:
      - Trên Frontend (`trip-budget-web`):
        - Tại `AddExpenseForm.tsx` và `EditExpenseForm.tsx`, nhãn hiển thị `"Ngày chi tiêu *"` và `"Người thanh toán *"`, tuy nhiên hàm `validate()` chỉ kiểm tra `title` và `amount`. Nếu người dùng xóa trống ngày chi tiêu hoặc không chọn người trả tiền, hàm `validate()` vẫn trả về `true` và gửi form lên server. Ngoài ra, `AppTextField` (ngày) và `AppSelect` (người trả) không được truyền các props `error` và `helperText`.
        - Tại `AddActivityForm.tsx` và `EditActivityForm.tsx`, khi để trống tiêu đề, form gọi `setTitleError(tDialog('titleLabel'))` khiến thông báo lỗi hiển thị lại nhãn `"Tên hoạt động *"` thay vì thông báo lỗi rõ ràng. Đồng thời không kiểm tra thứ tự giờ bắt đầu / kết thúc (`endTime < startTime`).
        - Tại `InviteMemberForm.tsx`, khi để trống email, `setError(t('emailLabel'))` hiển thị nhãn `"Email thành viên *"`.
        - Tại `RecordSettlementForm.tsx`, thiếu kiểm tra ngày thanh toán (`settledAt`).
      - Trên Backend DTOs (`tripbudget-core`):
        - `CreateExpenseRequest.java` và `UpdateExpenseRequest.java`: thiếu `@NotNull` trên `expenseDate`. Trong `ExpenseService.java`, nếu `expenseDate == null` backend tự động fallback sang `LocalDate.now()`, và nếu `payerId == null` fallback sang `currentUserId`. Do đó dù người dùng không nhập trường bắt buộc ở UI, request vẫn lọt qua backend và được lưu tự động!
        - `CreateTripRequest.java` và `UpdateTripRequest.java`: thiếu `@NotBlank` trên `destination` và `@NotNull` trên ngày bắt đầu/kết thúc.
        - `UpdateActivityRequest.java`: thiếu `@NotBlank` trên `title`.
    - **Giải pháp xử lý triệt để 2 lớp**:
      - **Lớp 1: Backend DTOs Validation (`tripbudget-core`)**:
        - `CreateExpenseRequest.java`: Thêm `@NotNull(message = "Expense date is required")` trên `expenseDate`.
        - `UpdateExpenseRequest.java`: Thêm `@NotBlank` trên `title`, `@NotNull` trên `category`, `@NotNull @Positive` trên `amount`, `@NotNull` trên `expenseDate`.
        - `CreateTripRequest.java`: Thêm `@NotBlank(message = "Destination is required")` trên `destination`.
        - `UpdateTripRequest.java`: Thêm `@NotBlank` trên `name`, `destination`, và `@NotNull` trên `startDate`, `endDate`.
        - `UpdateActivityRequest.java`: Thêm `@NotBlank(message = "Title is required")` trên `title`.
      - **Lớp 2: Frontend Form Validation & UI Error Feedback (`trip-budget-web`)**:
        - `AddExpenseForm.tsx` & `EditExpenseForm.tsx`: Mở rộng state `errors` quản lý `expenseDate` và `payerId`. Kiểm tra bắt buộc trong `validate()`, hiển thị `error` và `helperText` màu đỏ dưới ô nhập liệu tương ứng.
        - `AddActivityForm.tsx` & `EditActivityForm.tsx`: Thay `setTitleError(tDialog('titleLabel'))` bằng `setTitleError(tDialog('titleRequired'))`, bổ sung kiểm tra `endTime < startTime` và hiển thị thông báo lỗi `timeOrderInvalid`.
        - `InviteMemberForm.tsx`: Bổ sung `emailRequired` và `emailInvalid` chuẩn đa ngôn ngữ.
        - `RecordSettlementForm.tsx`: Kiểm tra bắt buộc ngày thanh toán `settledAt`.
        - `messages/vi.json` & `messages/en.json`: Bổ sung đầy đủ các chuỗi thông báo lỗi bản địa hóa tương ứng.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.
      - `mvn test-compile -q -o` -> BUILD SUCCESS (0 errors).

32. **Khắc Phục Lỗi Vỡ Layout Dòng Phụ Đề (Subtitle) Trên Header Trang Quản Lý Chi Tiêu (`/expenses`)**:
    - **Nguyên nhân phát hiện**:
      - Tại `ExpenseOverview.tsx`, prop `subtitle` của `AppPageHeader` được truyền vào dưới dạng một React Fragment `<> ... </>` chứa các phần tử con rời rạc: text `"Trip:"`, component `<Box component="strong">`, text `"• Destination:"`, và `<strong>`.
      - Trong `AppPageHeader.tsx`, khối chứa bên trái là một Flexbox dạng cột (`display: 'flex', flexDirection: 'column', gap: 0.5`).
      - Khi `subtitle` là một React Fragment (`<> ... </>`), React không sinh thẻ bọc DOM nào. Toàn bộ các phần tử con bên trong Fragment bị coi là các flex items độc lập của Flexbox cột, khiến mỗi cụm từ bị rớt xuống một dòng riêng biệt (4 dòng thay vì nằm ngang trên cùng 1 dòng).
    - **Giải pháp xử lý triệt để 2 phía**:
      - Phía Component (`ExpenseOverview.tsx`): Bọc toàn bộ thông tin phụ đề trong `<Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', flexWrap: 'wrap', fontSize: '14px', color: 'text.secondary' }}>`, các phần tử con sử dụng `<Typography component="span">` hoặc `<span>`, giúp toàn bộ thông tin `Trip: [Tên chuyến đi] · Destination: [Điểm đến]` luôn hiển thị thẳng hàng, sang trọng và tự động xuống dòng mượt mà trên màn hình nhỏ.
      - Phía Primitives (`AppPageHeader.tsx`): Bổ sung thẻ bọc an toàn `<Box sx={{ minWidth: 0 }}>{subtitle}</Box>` khi `subtitle` không phải kiểu chuỗi `string`, ngăn ngừa hiện tượng các phần tử con trong Fragment phá vỡ cấu trúc flex của Header trang.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

33. **Chuẩn Hóa Đa Ngôn Ngữ Định Dạng Tiền Tệ Thu Gọn (Compact Currency Formatting: 'tr', 'tỷ', 'k' Cho Tiếng Việt & 'M', 'B', 'K' Cho Tiếng Anh)**:
    - **Yêu cầu & Mục tiêu**:
      - Khi hiển thị đơn vị tiền tệ dạng thu gọn (compact currency), hệ thống trước đây gán cứng các hậu tố tiếng Việt (`tr`, `tỷ`, `k`) cho đồng tiền VND bất kể ngôn ngữ hiện tại của ứng dụng.
      - Khi người dùng chuyển giao diện sang Tiếng Anh (`en`), các đơn vị phải tương ứng chuẩn quốc tế: `M` (Million - Triệu), `K` (Thousand - Nghìn), `B` (Billion - Tỷ).
    - **Giải pháp triển khai (`src/base/utils/currency.ts`)**:
      - Xây dựng hàm `resolveLocale(locale?: string)` thông minh: ưu tiên locale được truyền vào trực tiếp, nếu không có sẽ tự động phát hiện qua `document.documentElement.lang` hoặc cookie `trip-budget-locale`, fallback về `'vi'`.
      - Nâng cấp `formatCompactCurrency`:
        - Với Tiếng Việt (`vi`): Giữ nguyên văn phong trực quan quen thuộc: `>= 1 tỷ` -> `${val} tỷ`, `>= 1 triệu` -> `${val} tr`, `>= 1 nghìn` -> `${val}k`.
        - Với Tiếng Anh (`en`): Tự động chuyển đổi sang chuẩn quốc tế: `>= 1 tỷ` -> `${val}B`, `>= 1 triệu` -> `${val}M`, `>= 1 nghìn` -> `${val}K`.
        - Với các ngoại tệ khác (`USD`, `EUR`...): Tự động áp dụng `Intl.NumberFormat` compact chuẩn theo locale mục tiêu (`$15M` khi tiếng Anh, `15,0 Tr US$` khi tiếng Việt).
      - Nâng cấp `formatCurrency`: Tự động áp dụng định dạng phân cách hàng nghìn và ký hiệu tiền tệ chuẩn hóa (`15.000.000 ₫` cho Tiếng Việt, `₫15,000,000` cho Tiếng Anh).
      - Đồng bộ truyền `useLocale()` từ `next-intl` tại các component gọi định dạng thu gọn: `SidebarTripCard.tsx`, `BudgetMetricsCards.tsx`, `CategorySpendingList.tsx`.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

34. **Đồng Bộ Vị Trí Ký Hiệu Tiền Tệ '₫' Cho Đồng VND Cả Khi Dùng Tiếng Anh Và Tiếng Việt (Khắc Phục Lỗi '13đ' vs 'đ13')**:
    - **Nguyên nhân phát hiện**:
      - Khi chuyển sang Tiếng Anh (`en`), thư viện `Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' })` mặc định theo chuẩn tiếng Anh đặt ký hiệu tiền tệ lên đầu chuỗi (`₫13` hoặc `₫15,000,000`), trong khi ở Tiếng Việt là `13 ₫` hoặc `15.000.000 ₫`.
      - Điều này khiến giao diện bị lệch pha: một số chỗ hiển thị `13đ` (hậu tố) và một số chỗ hiển thị `đ13` (tiền tố), hoặc khi đổi ngôn ngữ vị trí ký hiệu bị đảo lộn không thuận mắt người dùng.
    - **Giải pháp xử lý (`src/base/utils/currency.ts`)**:
      - Với đồng VND, chuẩn hóa quy tắc bất biến: ký hiệu `₫` luôn luôn đặt phía sau số tiền (`${formatted} ₫`) trên toàn bộ các ngôn ngữ (cả Tiếng Anh và Tiếng Việt), bảo đảm tính tự nhiên và đồng nhất 100% trong toàn bộ ứng dụng (`13 ₫`, `15,000,000 ₫` trên bản ENG; `13 ₫`, `15.000.000 ₫` trên bản VNI).
      - Ngoại tệ khác (`USD`, `EUR`...) tiếp tục tuân thủ vị trí tự nhiên của đồng tiền đó (`$15` trên ENG, `15 US$` trên VNI).
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

35. **Triển Khai Tính Năng Đo Khoảng Cách Giữa Các Hoạt Động & Tối Ưu Hóa Lộ Trình Di Chuyển (Smart Route / TSP) Sử Dụng Lượng Free Của Google Maps API (`/plan`)**:
    - **Yêu cầu & Mục tiêu**:
      - Người dùng cần đo khoảng cách và thời gian di chuyển giữa các hoạt động (Activity A $\to$ B) trong lịch trình ngày.
      - Sắp xếp lại thứ tự các hoạt động trong ngày sao cho tổng quãng đường di chuyển là ngắn nhất (Route Optimization / Traveling Salesperson Problem).
      - Tận dụng lượng miễn phí hàng tháng của Google Maps Platform ($200 USD free monthly credit / ~40.000 lượt Distance Matrix) một cách tiết kiệm, an toàn, không sợ bị cạn hạn mức hoặc phát sinh chi phí ngoài ý muốn.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Tầng 1: Next.js API Route Handler (`src/app/api/maps/distance/route.ts`)**:
        - Đóng vai trò Backend Proxy bảo mật `GOOGLE_MAPS_API_KEY` (hoặc `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`), loại bỏ lỗi CORS của trình duyệt.
        - Tích hợp **Server-side in-memory Cache** cho các cặp `origin:::destination`. Nếu cặp địa điểm đã từng được tính toán, hệ thống trả về ngay từ RAM mà không gửi thêm bất kỳ HTTP request nào đến Google Maps.
        - Cơ chế **Fallback Resilience**: Nếu chưa cấu hình API Key trong `.env` hoặc Google Maps bị lỗi mạng/hết quota, route tự động sinh khoảng cách ước tính logic (`isEstimated: true`) giúp UI và thuật toán tối ưu luôn hoạt động 100% trơn tru, không bao giờ bị gián đoạn hay văng lỗi 500.
      - **Tầng 2: Client Service & Thuật toán Tối ưu Lộ trình (`src/features/plan/services/googleMapsService.ts`)**:
        - Tích hợp **Client-side LocalStorage Cache** (`tb_distance_v1:`). Khi người dùng duyệt các ngày trong lịch trình hoặc đổi tab, dữ liệu được đọc trực tiếp từ LocalStorage với 0 lượt gọi API.
        - **Thuật toán Heuristic TSP (Nearest-Neighbor + 2-Opt Local Search)**:
          - Chạy trực tiếp trên trình duyệt bằng TypeScript (< 1ms).
          - Giữ cố định điểm xuất phát đầu ngày (người dùng có thể tùy chọn điểm xuất phát bất kỳ trong danh sách), sau đó hoán vị tối ưu thứ tự các điểm tiếp theo để tổng số km di chuyển là ngắn nhất.
          - Tính toán trực tiếp số km và thời gian tiết kiệm được (`savedDistanceMeters`, `savedPercentage`, `savedDurationSeconds`).
      - **Tầng 3: UI Components Trực Quan & Thẩm Mỹ Cao**:
        - `ActivityDistanceConnector.tsx`: Khối đo khoảng cách đặt tại cột thời gian (bên trái timeline), hiển thị badge nhỏ gọn gồm khoảng cách, thời gian di chuyển và nút mở Google Maps, giúp khu vực Activity Card bên phải hoàn toàn thông thoáng, trực quan và liền mạch.
        - `DayTimelineList.tsx`: Hiển thị thanh tóm tắt di chuyển đầu ngày (`🚗 Lộ trình di chuyển trong ngày: 14.8 km (~35 phút) • 3 chặng`) và nút `⚡ Tối ưu lộ trình`.
        - `OptimizeRouteDialog.tsx`: Modal so sánh trực quan Lộ trình hiện tại vs Lộ trình đề xuất tối ưu (Hiển thị rõ % quãng đường giảm được, thời gian tiết kiệm được, danh sách thứ tự mới có số thứ tự #1, #2, #3...), cho phép chọn điểm xuất phát và nút `⚡ Áp dụng lộ trình tối ưu` tự động cập nhật `orderIndex` của các activity vào database.
        - `PlanOverview.tsx`: Kết nối state dialog và gọi cập nhật `orderIndex` hàng loạt khi áp dụng thành công.
        - Đa ngôn ngữ đầy đủ trong `messages/vi.json` và `messages/en.json`.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

36. **Tích Hợp Tìm Kiếm & Tự Động Gợi Ý Địa Điểm Bản Đồ (`LocationAutocompleteInput.tsx`) Cho Form Activity (`AddActivityForm` & `EditActivityForm`)**:
    - **Yêu cầu & Mục tiêu**:
      - Khi tạo/sửa hoạt động trong kế hoạch, ô nhập "Địa điểm" có thể tìm kiếm gợi ý địa điểm như trên Google Maps / OpenStreetMap.
      - **Bảo toàn văn bản tự do (Free-solo Text)**: Nếu không tìm thấy địa điểm trên bản đồ hoặc người dùng muốn nhập địa chỉ riêng biệt (ví dụ: _"Nhà của Nam"_, _"Quán cà phê cóc gần khách sạn"_), hệ thống vẫn giữ nguyên 100% text gốc mà người dùng đã gõ mà không bị ép buộc chọn từ dropdown.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Tầng Backend-for-Frontend (`/api/maps/places`)**:
        - Route Handler `GET /api/maps/places?q=...&lang=...` hỗ trợ tìm kiếm địa điểm thông minh.
        - Tự động gọi **Google Places Autocomplete API** nếu có cấu hình `GOOGLE_MAPS_API_KEY`.
        - Tự động **fallback sang OpenStreetMap Nominatim** (hoàn toàn miễn phí, không cần bất kỳ API key nào) nếu không có Google key hoặc lỗi kết nối.
        - Tích hợp in-memory cache theo từ khóa tìm kiếm (`placeCache`) để tiết kiệm tối đa lượt gọi API.
      - **Tầng UI Component (`LocationAutocompleteInput.tsx`)**:
        - Sử dụng MUI `Autocomplete` với chế độ `freeSolo={true}`.
        - Kỹ thuật Debounce 320ms giảm thiểu request khi người dùng đang gõ phím.
        - Dropdown hiển thị tên địa điểm chính (in đậm), địa chỉ chi tiết (phụ đề), icon `Place` và badge nguồn dữ liệu (`Google Maps` hoặc `Bản đồ`).
        - Tùy chọn đặc biệt đầu danh sách: `"Sử dụng địa chỉ tự do này: [text đã gõ]"` cho phép người dùng chủ động bấm chọn hoặc tiếp tục gõ văn bản tự do.
        - Trạng thái tải trực quan với `CircularProgress` tích hợp trong `endAdornment`.
        - Áp dụng đồng bộ vào cả `AddActivityForm.tsx` và `EditActivityForm.tsx`.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

37. **Tích Hợp Fallback Đo Khoảng Cách & Thời Gian Lái Xe Bằng OpenStreetMap (OSRM + Nominatim) Khi Không Có Google Maps API Key (`/api/maps/distance`)**:
    - **Yêu cầu & Mục tiêu**:
      - Nếu người dùng chưa cấu hình `GOOGLE_MAPS_API_KEY` (hoặc Google Maps lỗi/hết quota), thay vì chỉ sinh số đo ước tính nội bộ (heuristic), hệ thống tự động fallback sang **OpenStreetMap** để đo khoảng cách và thời gian lái xe thực tế theo mạng lưới đường bộ.
      - **Bảo lưu đường dẫn trực tiếp Google Maps**: Nút mở bản đồ trực tiếp trên `ActivityDistanceConnector.tsx` vẫn giữ nguyên 100% là link Google Maps (`https://www.google.com/maps/dir/...`), không thay đổi sang nền tảng khác.
    - **Kiến trúc 3 tầng (3-Tier Distance Engine) & Cải tiến độ chính xác**:
      - **Tầng 1 (Google Maps Distance Matrix API)**: Kích hoạt khi có `GOOGLE_MAPS_API_KEY`, cung cấp số đo và thời gian giao thông theo chuẩn Google Maps.
      - **Tầng 2 (OpenStreetMap Nominatim + OSRM Routing + GPS Haversine Fallback)**:
        - **Phân giải địa điểm thông minh**: Giới hạn phạm vi tìm kiếm theo quốc gia Việt Nam (`countrycodes=vn`). Nếu tìm tên gốc không thấy, tự động ghép thêm ngữ cảnh điểm đến của chuyến đi (`destinationContext`, vd: `"Chùa Hang, An Giang"`).
        - **Chống Rate-Limit (1 req/s) của Nominatim**: Pre-geocode tuần tự toàn bộ địa điểm độc nhất trong ngày với khoảng nghỉ 200ms, loại bỏ hoàn toàn lỗi HTTP 429 khi mở nhiều hoạt động.
        - **OSRM Road Routing & Haversine GPS Fallback**: Tính đường xe chạy thực tế trên OSRM (`router.project-osrm.org`). Nếu OSRM không tìm thấy tuyến đường xe hơi (đường hẻm, đi bộ, hải đảo), tự động tính theo công thức khoảng cách Haversine GPS $\times$ hệ số uốn lượn đường bộ 1.35x, đảm bảo sai số chỉ dưới 5-10% thay vì sinh số ngẫu nhiên.
      - **Tầng 3 (Heuristic Deterministic Fallback)**: Chỉ kích hoạt nếu địa điểm là chuỗi text tự do hoàn toàn không tìm thấy tọa độ trên bản đồ thế giới. **Tuyệt đối không lưu cache** các kết quả heuristic vào `serverCache` hay `localStorage` để cho phép hệ thống tự động thử lại khi có mạng hoặc khi người dùng cập nhật địa chỉ.
      - **Nâng cấp Cache Version (`tb_distance_v2:`)**: Tự động vô hiệu hóa toàn bộ cache phỏng đoán cũ trong trình duyệt của người dùng.
      - **Bảo toàn link Google Maps**: Link xem chỉ đường `gmapsUrl` luôn trỏ tới Google Maps web (`travelmode=driving`).
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

38. **Tích hợp Kiến trúc AI Lên Lịch Trình Tự Động (AI Trip Planner) Bằng Python FastAPI, Spring Boot Core & Next.js Hub (`/ai` & `/plan`)**:
    - **Yêu cầu & Mục tiêu**:
      - Giải quyết bài toán "trang giấy trắng" (empty state) cho người dùng khi tạo chuyến đi mới bằng cách ứng dụng AI tự động đề xuất toàn bộ lịch trình chuyến đi (ngày, giờ, địa điểm, chi phí ước tính, phân loại danh mục).
      - Xây dựng trải nghiệm AI hoàn chỉnh trên cả 2 trang:
        - **Trang AI Hub (`/ai`)**: Trung tâm điều khiển AI toàn diện với việc tự động nhận diện chuyến đi đang chọn, cho phép tùy biến điểm đến, số ngày, số người, ngân sách, gợi ý phong cách bằng chip tags, hiển thị khả năng nổi bật của AI và tự động chuyển trang sang `/plan` sau khi tạo.
        - **Trang Kế hoạch (`/plan`)**: Tích hợp nút `AI Lên lịch trình` trực tiếp trên `PlanHeader.tsx` mở modal `AiPlannerDialog.tsx` mượt mà, hỗ trợ tự động điền sẵn thông tin chuyến đi và cập nhật lại timeline ngay lập tức không cần tải lại trang.
      - **Đảm bảo 100% đa ngôn ngữ (vi/en)**: Toàn bộ nhãn, thông báo, nút bấm, hướng dẫn và lỗi đều được khai báo trong `messages/vi.json` và `messages/en.json`.
      - **Tuân thủ React 19 & React Compiler**: Loại bỏ hoàn toàn cascading renders (`react-hooks/set-state-in-effect`) và lỗi memoization, đạt chuẩn chất lượng nghiêm ngặt của dự án.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Tầng 1: AI Microservice (Python FastAPI)**:
        - Cấu trúc module chuẩn Enterprise: `app/routers/ai_router.py`, `app/services/ai_service.py`, `app/schemas/ai_schema.py`.
        - Cơ chế **Auto-Fallback Model Routing 2026**: Tự động ưu tiên các model Free Tier (`gemini-flash-lite-latest`, `gemini-3.5-flash-lite`), tự động bỏ qua lỗi 402/404 và tự động retry khi gặp lỗi 503 quá tải.
        - File `requirements.txt` tối giản không khóa cứng phiên bản cũ để tương thích với Python 3.14 trên Render.com, loại bỏ lỗi biên dịch Rust (`maturin`).
      - **Tầng 2: Core Backend (Spring Boot)**:
        - `AiPlanController.java`: Mapped tại `/trip/{tripId}/plan/ai/generate`, giải mã hashids, xác thực `@CurrentUser CurrentUserDto user` và trả về `ApiResponse<TripPlanOverviewResponse>`.
        - `AiPlanService.java`: Kiểm tra quyền thành viên hoạt động (`getActiveMemberTrip`, `assertCanEditPlan`), gọi dịch vụ AI qua `${AI_SERVICE_URL}`, tái sử dụng ngày đã có (`PlanDayEntity`) tránh lỗi trùng lặp khóa chính, và lưu danh sách hoạt động `PlanActivityEntity` theo thứ tự `orderIndex`.
      - **Tầng 3: Next.js BFF & Frontend UI**:
        - Route Handler `POST /api/trip/[id]/plan/ai/generate`: Chuyển tiếp request có gắn cookie `access_token` từ trình duyệt sang Spring Boot core.
        - Hook React Query `useGenerateAiPlan` trong `src/features/plan/hooks/usePlanMutation.ts`: Sử dụng `useMutationPost` chuẩn mực.
        - Component `AiPlannerDialog.tsx`: Modal gọn gàng, tích hợp `AppNumberInput` nhập tiền tệ, gợi ý chip sở thích nhanh.
        - Component `AiPlannerView.tsx`: Trang `/ai` trực quan, giải thích năng lực AI, banner trạng thái chuyến đi đang kích hoạt và điều hướng tức thì.
39. **Hoàn thiện Trải nghiệm Lên Lịch Trình AI & Tính Năng Đặt Lại Lịch Trình Từng Ngày (`Reset Day Activities`)**:
    - **Yêu cầu & Mục tiêu**:
      - Tích hợp ô nhập điểm đến thông minh `DestinationAutocomplete` vào cả form AI modal (`AiPlannerDialog.tsx`) và trang AI Hub (`AiPlannerView.tsx`).
      - Khóa ô nhập thời lượng chuyến đi (`duration / days`) ở trạng thái `disabled`, giá trị tính toán hoàn toàn tự động và tuyệt đối tuân theo `startDate` và `endDate` của chuyến đi để tránh lệch dữ liệu giữa chuyến đi và kế hoạch.
      - Thêm tính năng **Xóa / Đặt lại toàn bộ lịch trình trong ngày cụ thể (Reset Day Activities)** để người dùng có thể xóa sạch mọi hoạt động của ngày đó về trạng thái trống (empty state) khi muốn lên kế hoạch lại từ đầu hoặc khi tạo lịch mới mà không phải xóa thủ công từng hoạt động.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Tầng Backend Core (Spring Boot)**:
        - `PlanService.java`: Thêm method `resetDayActivities(Long currentUserId, Long tripId, Long dayId)`: Xác thực quyền chỉnh sửa kế hoạch của người dùng, tìm danh sách hoạt động chưa xóa (`isDeleted = false`) thuộc ngày được chỉ định và đánh dấu xóa (`act.markDeleted()`).
        - `PlanController.java`: Endpoint `@DeleteMapping("/days/{dayId}/activities")` nhận `dayId` mã hóa Hashids, giải mã an toàn và trả về `ApiResponse.success(null, "Day activities reset successfully")`.
      - **Tầng BFF (Next.js App Router)**:
        - Route Handler `DELETE /api/trip/[id]/plan/days/[dayId]/activities/route.ts`: Chuyển tiếp yêu cầu HTTP DELETE tới Spring Boot Core kèm cookie `access_token` hợp lệ.
      - **Tầng Frontend Client**:
        - Hook React Query: Khai báo `useResetDayActivities` trong `usePlanMutation.ts` sử dụng `useMutationDelete`.
        - Component `DayTimelineList.tsx`: Thêm thanh tiêu đề ngày với tổng số hoạt động, chi phí ước tính trong ngày và nút bấm `Đặt lại ngày này` (`RestartAltRoundedIcon`). Nút chỉ hiển thị khi ngày đó đang có ít nhất 1 hoạt động.
        - Component `PlanOverview.tsx`: Kết nối `AppConfirmDialog` với modal cảnh báo xác nhận trước khi thực hiện reset để tránh thao tác nhầm lẫn; tự động làm mới (`refetch()`) timeline và hiển thị toast thông báo thành công.
        - Tích hợp `DestinationAutocomplete`: Cung cấp gợi ý địa điểm mượt mà, hỗ trợ tìm kiếm theo tỉnh/thành phố và quốc gia, bảo toàn text nhập tự do.
        - Khóa ô `days`: Set `disabled` kèm `helperText` diễn giải rõ lý do ngày được cố định theo ngày bắt đầu và kết thúc của chuyến đi.
      - **Đa ngôn ngữ & Tiêu chuẩn chất lượng**:
        - Khai báo 100% bản dịch trong `messages/vi.json` và `messages/en.json` (`resetDayBtn`, `dialog.resetDayTitle`, `dialog.resetDayDesc`, `dialog.confirmResetDay`, `dialog.aiDaysDisabledHelper`, `toasts.resetDaySuccess`, `aiPlanner.daysDisabledHelper`).
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

40. **Triển khai Cơ chế Xác thực Nội bộ Service-to-Service (M2M) Cho AI Microservice (`X-Internal-API-Key`)**:
    - **Yêu cầu & Mục tiêu**:
      - Loại bỏ lỗ hổng bảo mật: Service AI Python (`tripbudget-ai`) trước đây mở công khai không có xác thực, dẫn tới rủi ro bị khai thác "xài chùa" Google Gemini API Key hoặc tấn công DDoS làm cạn kiệt hạn mức.
      - Thiết lập cơ chế xác thực nội bộ an toàn, zero-latency, chuẩn kiến trúc Microservices giữa Spring Boot Core và Python FastAPI.
      - Chống tấn công Timing Attack khi so sánh chuỗi bảo mật.
      - Đảm bảo trải nghiệm dev mượt mà: Có fallback key mặc định cho môi trường local dev để các lập trình viên không bị vướng lỗi cấu hình, đồng thời hỗ trợ ghi đè linh hoạt qua biến môi trường (`INTERNAL_API_KEY` / `AI_SERVICE_API_KEY`) khi deploy production lên Render/Cloud.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Tầng AI Service (Python FastAPI)**:
        - `app/core/security.py`: Xây dựng dependency `verify_internal_api_key` sử dụng `APIKeyHeader(name="X-Internal-API-Key")`.
        - Ứng dụng hàm **`secrets.compare_digest(api_key, expected_key)`** chuẩn thư viện bảo mật Python để so sánh chuỗi với thời gian cố định ($O(1)$ constant-time), chặn đứng mọi hình thức tấn công Timing Attack đo độ trễ suy đoán key.
        - Gắn dependency bảo vệ các endpoint nhạy cảm (`/api/ai/generate-plan`, `/api/ai/models`).
        - Duy trì endpoint công khai `/api/ai/health` phục vụ kiểm tra trạng thái (health-check/liveness probe) tự động cho hạ tầng Render.com / Kubernetes.
      - **Tầng Core Backend (Spring Boot)**:
        - Cấu hình `ai.service.api-key: ${AI_SERVICE_API_KEY:tb_sec_dev_internal_key_2026}` trong `application.yml` và `.env`.
        - `AiPlanService.java`: Khai báo `@Value("${ai.service.api-key}")`, đóng gói request vào `HttpEntity` với header `X-Internal-API-Key` khi thực hiện gọi REST Template sang Python AI.
    - **Kiểm thử chất lượng**:
      - Python unit test: Xác thực từ chối 401 khi thiếu header hoặc sai key, chấp thuận 200 khi đúng key.
      - Spring Boot Core: `mvn compile -o -DskipTests` -> `BUILD SUCCESS`.
      - Frontend Web: `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

41. **Thay Thế Favicon Gốc Thành Logo Thương Hiệu Trên Tab Trình Duyệt (`src/app/icon.svg`, `favicon.ico`, `apple-icon.png`)**:
    - **Yêu cầu & Mục tiêu**:
      - Thay thế biểu tượng tam giác Vercel mặc định của Next.js bằng logo thương hiệu chính thức của Trip Budget (tương tự component `SidebarBrand.tsx`):
        - Hộp bo góc vuông mềm mại (`border-radius: 12px` / 28%).
        - Gradient chéo 135 độ từ màu thương hiệu chính (`#1E3A8A`) sang xanh tươi sáng (`#0EA5E9`).
        - Biểu tượng máy bay cất cánh màu trắng (`FlightTakeoffRoundedIcon`) xoay nghiêng -18 độ sắc nét.
      - Tối ưu hiển thị hoàn hảo trên mọi kích cỡ màn hình, tab trình duyệt, màn hình Retina/4K và thiết bị di động.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Vector Icon SVG (`src/app/icon.svg` & `public/icon.svg`)**:
        - Chuẩn hóa tọa độ SVG `viewBox="0 0 38 38"`, định nghĩa `<linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">`.
        - Tọa độ icon máy bay được căn chính giữa tại `(19, 19)`, xoay `rotate(-18)` và scale tỉ lệ chuẩn `0.8333`.
        - Trình duyệt hiện đại (Chrome, Safari, Firefox, Edge) tự động ưu tiên load file vector SVG với `type="image/svg+xml" sizes="any"`, đảm bảo hình ảnh không bao giờ bị vỡ hạt.
      - **Multi-size ICO (`src/app/favicon.ico` & `public/favicon.ico`)**:
        - Tạo file nhị phân `.ico` chuẩn chứa đồng thời 3 kích thước: `16x16`, `32x32`, `48x48` để phục vụ các yêu cầu trực tiếp `/favicon.ico` và các trình duyệt truyền thống.
      - **Apple Touch Icon (`src/app/apple-icon.png`)**:
        - Sinh ảnh PNG độ phân giải cao `180x180` dành cho tính năng Add to Home Screen và bookmark trên iOS/macOS Safari.
      - **Metadata Configuration (`src/app/layout.tsx`)**:
        - Khai báo rõ ràng trong `metadata.icons` theo đúng chuẩn Next.js App Router.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

42. **Đồng Bộ Giao Diện Dialog Lịch Sử Hoạt Động (`ActivityLogDialog.tsx`) Theo Chuẩn `AppDialog`, Xóa Lệch Màu Background & Bo Viền Thẻ Log**:
    - **Yêu cầu & Mục tiêu**:
      - Hoàn trả dialog về cấu trúc chuẩn `AppDialog` đồng bộ 100% với hệ thống modal của Trip Budget (`AiPlannerDialog`, `AppConfirmDialog`, `AddExpenseDialog`...).
      - **Khắc phục lỗi lệch màu background**: Loại bỏ hoàn toàn mảng nền xám thô (`#f1f3f6`) gây tương phản gắt với thân dialog trắng. Đưa màu nền container về trong suốt (`transparent`) đồng bộ tuyệt đối với `background.paper` của dialog.
      - **Bo viền thẩm mỹ cho từng log**: Thêm viền bo tròn mềm mại (`borderRadius: 16px`, `border: 1px solid divider`) cho từng thẻ nhật ký, giúp giao diện gọn gàng, có điểm nhấn và phân tách rõ ràng.
      - Tinh chỉnh action badge mềm mại (`borderRadius: 8px`, pastel alpha fill), avatar định danh hài hòa với theme thương hiệu.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Tái cấu trúc trên nền tảng `AppDialog`**:
        - Icon tròn vuông 12px màu `primary.main`, Display font `h2` kèm subtitle `description`.
        - Nút đóng footer `AppButton intent="secondary"` trong `DialogActions` chuẩn mực.
        - Khung dialog `maxWidth="md"` rộng rãi, thoáng đãng.
      - **Xử lý nền & Viền thẻ (Card Border & Background Architecture)**:
        - Sử dụng component `<Box>` với `borderRadius: '16px'`, `bgcolor: 'background.paper'`, `border: '1px solid'` theo `theme.palette.divider` (`rgba(30, 58, 138, 0.12)`).
        - `boxShadow: '0 1px 4px rgba(...)'` nhẹ nhàng, hover đổi viền `primary.light` và nền xanh nhạt 2% `alpha(theme.palette.primary.main, 0.02)`.
        - Tránh hoàn toàn việc dùng `Card` mặc định bị ảnh hưởng bởi global shadow lớn (`boxShadow: 0 24px 70px`).
      - **Tối ưu danh sách cuộn**:
        - `flexShrink: 0`, `width: '100%'`, `boxSizing: 'border-box'` loại bỏ hoàn toàn lỗi co rút thẻ.
        - Thanh cuộn tùy chỉnh 6px bo góc mềm mại, không che lấp viền ngoài thẻ.
      - **Tuân thủ quy chuẩn Spacing & Layout**:
        - 100% khoảng cách được điều phối qua `gap` và `Stack spacing`. Không sử dụng `margin`, `mt`, `mb`.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

43. **Tối Ưu Kích Thước & Trải Nghiệm Responsive Cho Header Kế Hoạch (`PlanHeader.tsx`)**:
    - **Yêu cầu & Mục tiêu**:
      - Trên màn hình di động (mobile viewport), các nút thao tác (Lịch sử thay đổi, Chia sẻ, Chuẩn bị hành lý, AI Kế hoạch) trước đây bị quá khổ (desktop size `minHeight: 44px`, font lớn, chiếm hết không gian chiều dọc).
      - Thu gọn kích thước nút, font chữ và khoảng cách (spacing/gap) phù hợp với chuẩn UI mobile (app-like layout), tạo bố cục 2 cột cân xứng, gọn gàng, giảm hơn 35% chiều cao chiếm dụng trên màn hình nhỏ.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Responsive Button Sizing (`secondaryBtnSx`, `primaryBtnSx`)**:
        - Chiều cao: `minHeight: { xs: '36px', sm: '40px' }` (giảm từ 44px xuống 36px trên mobile).
        - Đệm ngang: `px: { xs: 1.25, sm: 2 }` (10px trên mobile, 16px trên desktop).
        - Cỡ chữ: `fontSize: { xs: '12px', sm: '13px' }`, `fontWeight: 700`, `whiteSpace: 'nowrap'`.
        - Bo viền: `borderRadius: { xs: '10px', sm: '12px' }`.
        - Cỡ icon: `fontSize: { xs: '16px', sm: '18px' }` tương xứng với cỡ chữ.
      - **Bố cục 2 cột linh hoạt (2-Column Grid on Mobile)**:
        - `flex: { xs: '1 1 calc(50% - 4px)', sm: 'initial' }` và `gap: { xs: 1, sm: 1.25 }`.
        - Trên mobile, 4 nút phụ tự động chia đều thành 2 hàng $\times$ 2 cột cân bằng, vừa vặn không bị tràn mép.
        - Nút hành động chính ("Thêm hoạt động"): `flex: { xs: '1 1 100%', sm: 'initial' }`, `minHeight: { xs: '38px', sm: '40px' }`, nổi bật làm thanh CTA chính ở dưới cùng.
      - **Typography & Header Title Responsive**:
        - Tiêu đề: `fontSize: { xs: '20px', sm: '26px', md: '28px' }`.
        - Dòng metadata: `fontSize: { xs: '11.5px', sm: '12.5px' }`, `rowGap: 0.25`, tự động ngắt dòng nhẹ nhàng khi màn hình hẹp.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

44. **Loại Bỏ Hoàn Toàn Bóng Đổ (`boxShadow: 'none'`) Trong Modal Chia Sẻ Chuyến Đi (`ShareTripDialog.tsx`)**:
    - **Yêu cầu & Mục tiêu**:
      - Loại bỏ bóng đổ (`boxShadow`) bao quanh các thẻ chọn quyền truy cập (Riêng tư / Công khai) và ô liên kết chia sẻ trong modal "Chia sẻ chuyến đi", đảm bảo giao diện phẳng (flat design), màu nền đồng bộ tuyệt đối với thân dialog và không bị quầng xám bao quanh.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - Thay thế toàn bộ thẻ `<Card variant="outlined">` sang component `<Box>` chuyên dụng để loại bỏ triệt để bóng đổ mặc định kế thừa từ theme (`boxShadow: '0 24px 70px ...'`).
      - Cấu hình `boxShadow: 'none'` cho thẻ quyền Riêng tư, thẻ quyền Công khai và khung liên kết chia sẻ (cả trạng thái thường lẫn khi `&:hover`).
      - Giữ nguyên viền nét `border: '1px solid'`, bo góc `borderRadius: '14px'`, phân tách trạng thái active (`primary.main`) và inactive (`divider`) rõ ràng.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

45. **Rà Soát Toàn Diện Frontend & Chuẩn Hóa 100% Theo Quy Chuẩn `AGENTS.md`**:
    - **Yêu cầu & Mục tiêu**:
      - Rà soát toàn bộ codebase Frontend (`trip-budget-web/src`), đối chiếu nghiêm ngặt với các tiêu chuẩn trong `AGENTS.md` (Quy tắc Container owns spacing, cấm child margins `m`, `mt`, `mb`; quy tắc đơn vị CSS pixels thay vì `em`/`rem`; chuẩn Flat UI cho Modal Dialogs không bóng đổ; loại bỏ cảnh báo lint và type check).
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Chuẩn hóa Container Owns Spacing (Loại bỏ triệt để Child Margins)**:
        - `AppConfirmDialog.tsx`: Loại bỏ `mb: 2` trên icon, `mb: 1` trên title và `mb: 3` trên content; chuyển sang container `<Box sx={{ gap: 1.5 }}>` điều phối toàn bộ khoảng cách giữa các phần tử con.
        - `ShareTripDialog.tsx`: Loại bỏ `component="fieldset"` và `component="legend"` trên `FormControl` và `FormLabel` (do đặc tả HTML browser không cho phép `<legend>` tham gia Flex formatting context của `<fieldset>`, gây mất hiệu lực thuộc tính `gap`), chuyển về `<div>` flexbox chuẩn với `gap: 1.25`, loại bỏ hoàn toàn `mb: 1.5`, `mb: 1`, `mt: 0.25`, `mt: 0.75`.
        - `DayTimelineList.tsx`: Thêm `gap: 2` trên container chính, loại bỏ `mb: 2` trên thanh tiêu đề ngày.
        - `ExpenseDetailDialog.tsx`: Thêm `display: 'flex', flexDirection: 'column', gap: 1.5` trên khối tóm tắt, loại bỏ `mb: 1.5`.
      - **Chuẩn hóa đơn vị đo lường (Pixels over EM/REM)**:
        - `ExpenseDetailDialog.tsx`: Chuyển đổi toàn bộ `letterSpacing: '0.05em'` sang đơn vị pixel chuẩn `letterSpacing: '0.5px'`.
      - **Đồng bộ hóa Modal Flat UI & Khử bóng đổ**:
        - Đảm bảo toàn bộ các dialog trong hệ thống (`AppDialog`, `AppConfirmDialog`, `ShareTripDialog`, `ActivityLogDialog`) đều phẳng, không bị bóng đen thô ráp của theme `MuiCard` làm ô nhiễm nền.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> 0 errors, 0 warnings.

46. **Tích Hợp Trực Tiếp AI Receipt Scanner Vào Frontend Next.js BFF & Form Chi Tiêu (`AddExpenseForm.tsx`)**:
    - **Yêu cầu & Mục tiêu**:
      - Cho phép người dùng tải lên hình ảnh biên lai/hóa đơn hoặc file PDF hóa đơn điện tử (VAT/vé máy bay/booking) ngay trong form thêm chi tiêu (`AddExpenseDialog` -> `AddExpenseForm.tsx`).
      - AI tự động trích xuất: Tên người bán/quán (`merchant_name` -> `title`), số tiền (`amount`), danh mục (`category`), ngày chi tiêu (`expense_date`), và danh sách line-items/ghi chú (`raw_text` -> `note`).
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **BFF Route Handler (`src/app/api/ai/scan-receipt/route.ts`)**:
        - Xác thực phiên làm việc qua HttpOnly cookie `access_token`.
        - Nhận `multipart/form-data`, chuyển tiếp an toàn sang Python microservice (`POST http://localhost:8000/api/ai/scan-receipt`) kèm header bảo mật `X-Internal-API-Key`.
        - Giữ kín hoàn toàn API Key và URL microservice ở phía server BFF, không bao giờ lộ ra trình duyệt.
      - **Hook Tái Sử Dụng (`src/features/expense/hooks/useScanReceipt.ts`)**:
        - Sử dụng `useMutationPost` từ base layer, thiết lập `mutationKey: ['receipt', 'scan']`, tự động đính kèm `Content-Type: multipart/form-data`.
      - **Giao Diện Quét Hóa Đơn (`AddExpenseForm.tsx`)**:
        - Thiết kế banner quét hóa đơn phẳng, viền nét đứt (`border: '1px dashed'`), bo góc `12px`, màu nền tương phản nhẹ nhàng theo theme (`rgba(37, 99, 235, 0.04)`).
        - Sử dụng component `AppButton intent="secondary"` với icon `DocumentScannerOutlinedIcon`, hỗ trợ trạng thái `loading` và tự động hiển thị alert phản hồi độ tin cậy (`confidence` %).
        - Tuân thủ nghiêm ngặt quy tắc Container owns spacing (Flexbox `gap: 1.5`, không dùng child margins), đa ngôn ngữ 100% (`messages/vi.json`, `messages/en.json`).
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> **0 errors, 0 warnings**.

47. **Xây Dựng Component Chụp Ảnh Trực Tiếp Bằng Camera (`CameraCaptureDialog.tsx`) & Đóng Gói `ReceiptScanBanner.tsx`**:
    - **Yêu cầu & Mục tiêu**:
      - Giải quyết triệt để vấn đề thẻ `<input type="file">` trên máy tính/laptop và một số trình duyệt không mở được camera/webcam để chụp ảnh trực tiếp.
      - Tách riêng 2 hành vi rõ ràng: "Chụp ảnh" (mở camera trực tiếp với khung ngắm viewfinder) và "Tải file" (chọn ảnh/PDF từ thiết bị).
      - Áp dụng 100% màu theo Theme tokens (`action.hover`, `action.selected`, `primary.main`, `divider`), loại bỏ hoàn toàn các mã màu cứng `rgba(...)`.
      - Ẩn banner thông báo thành công rườm rà, tự động điền dữ liệu trực tiếp vào form.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Component Camera Trực Tiếp (`CameraCaptureDialog.tsx`)**:
        - Ứng dụng WebRTC API (`navigator.mediaDevices.getUserMedia`) hiển thị luồng video thời gian thực với độ phân giải tối ưu (1920x1080).
        - Khung ngắm Viewfinder trực quan với đường viền nét đứt hướng dẫn canh hóa đơn.
        - Hỗ trợ đổi camera trước/sau (`facingMode: 'environment' | 'user'`), nút chụp tròn nổi bật.
        - Màn hình xem trước ảnh chụp với 2 lựa chọn: "Chụp lại" hoặc "Quét ảnh này".
        - Tự động ngắt toàn bộ track (`track.stop()`) ngay khi đóng dialog để tắt đèn camera phần cứng và giải phóng bộ nhớ.
      - **Đóng Gói Reusable Banner (`ReceiptScanBanner.tsx`)**:
        - Tách rời toàn bộ logic quét hóa đơn ra khỏi `AddExpenseForm.tsx`.
        - Pattern chuẩn Material UI: `AppButton component="label"` kết hợp `VisuallyHiddenInput` cho tải file, và `AppButton` gọi `CameraCaptureDialog` cho chụp ảnh trực tiếp.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> **0 errors, 0 warnings**.

48. **Xóa Bỏ Triệt Để Fallback Hardcode Secret Key Ra Khỏi Source Code Toàn Bộ Hệ Thống**:
    - **Yêu cầu & Mục tiêu**:
      - Loại bỏ hoàn toàn mọi secret key dev / fallback chuỗi mặc định (`tb_sec_dev_internal_key_2026`) ra khỏi toàn bộ mã nguồn (`tripbudget-ai`, `trip-budget-web`, `tripbudget-core`).
      - Bắt buộc các service phải đọc secret qua biến môi trường (`INTERNAL_API_KEY`, `AI_SERVICE_INTERNAL_KEY`, `AI_SERVICE_API_KEY`).
      - Nếu môi trường thiếu biến cấu hình, hệ thống lập tức ném lỗi 500 (Internal Server Error) chỉ rõ biến môi trường bị thiếu, không âm thầm chạy với key rò rỉ trong git repository.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Python AI Microservice (`tripbudget-ai/app/core/security.py`)**:
        - Bỏ hằng số `DEFAULT_DEV_INTERNAL_KEY`.
        - Đọc `os.getenv("INTERNAL_API_KEY", "").strip()`. Nếu rỗng, ném `HTTPException(500, detail="Server configuration error: 'INTERNAL_API_KEY' environment variable is not configured.")`.
      - **Next.js BFF Handler (`trip-budget-web/src/app/api/ai/scan-receipt/route.ts`)**:
        - Bỏ fallback key `tb_sec_dev_internal_key_2026`.
        - Đọc `AI_SERVICE_INTERNAL_KEY = process.env.AI_SERVICE_INTERNAL_KEY || process.env.NEXT_PUBLIC_AI_SERVICE_INTERNAL_KEY`.
        - Nếu biến môi trường chưa được thiết lập, trả về HTTP 500 kèm log lỗi chi tiết phía server.
      - **Java Spring Boot Core (`tripbudget-core`)**:
        - Cập nhật `application.yml` thành `api-key: ${AI_SERVICE_API_KEY:}` (loại bỏ giá trị mặc định trong yml).
        - Cập nhật `AiPlanService.java` thành `@Value("${ai.service.api-key:}")` và thêm validation `isBlank()` ném `ResponseStatusException(500)` nếu chưa có cấu hình.
    - **Kiểm thử chất lượng**:
      - `grep -rn "tb_sec_dev_internal_key"` trên toàn bộ source code -> **0 kết quả**.
      - `tsc --noEmit && npm run lint` -> **0 errors, 0 warnings**.
      - `mvn compile -o -DskipTests` -> **BUILD SUCCESS**.

49. **Tái Thiết Kế Toàn Diện UX-UI Theo Layout Khám Phá & Danh Mục Thẻ Hiện Đại (Tham Chiếu 68Lane)**:
    - **Yêu cầu & Mục tiêu**:
      - Điều chỉnh giao diện theo mẫu tham khảo (layout 68Lane discovery) nhưng **giữ nguyên 100% màu sắc theme của TripBudget** (`#1E3A8A` dark blue, `#0EA5E9` sky blue, divider, background paper/default).
      - Chuyển đổi UX/UI của trang Chuyến đi (`/trips`) từ bảng thuần túy sang **lưới thẻ du lịch (Card Grid Catalog)** kết hợp thanh tìm kiếm dạng viên thuốc (Pill Search Bar), bộ lọc dropdown nhanh (Điểm đến, Trạng thái, Tiền tệ), thanh gợi ý từ khóa (Quick Tags Chip), và bộ chuyển đổi hiển thị (Lưới ⊞ vs Bảng ☰).
      - Nâng cấp Sidebar: Nút điều hướng active dạng viên thuốc (Pill shape), phân nhóm danh mục ("ĐIỀU HƯỚNG CHÍNH", "CÁ NHÂN & TIỆN ÍCH"), đính kèm badge "MỚI" cho Quét hóa đơn và Trợ lý AI.
      - Nâng cấp TopBar: Bổ sung chuông thông báo (Notification bell with dot badge), nút `+ Tạo chuyến đi` bo tròn viên thuốc nổi bật.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Helper Hình Ảnh Điểm Đến (`src/features/trip/utils/destinationImages.ts`)**:
        - Ánh xạ tự động các điểm đến nổi tiếng (Đà Nẵng, Đà Lạt, Hà Nội, TP.HCM, Phú Quốc, Sapa, Hội An, Nha Trang, Tokyo, Bangkok, Paris...) sang ảnh bìa du lịch chất lượng cao (Unsplash CDN tối ưu).
        - Hỗ trợ placeholder "Chưa có ảnh" chuẩn theo mẫu thẻ thứ 6 trong ảnh tham khảo khi không có điểm đến hoặc ảnh lỗi.
        - Tiện ích tính toán số ngày lưu trú (`calculateTripDays`).
      - **Thẻ Chuyến Đi Hiện Đại (`src/features/trip/components/my-trips/TripCardItem.tsx`)**:
        - Thiết kế thẻ tỉ lệ ảnh 16:10, hiệu ứng hover zoom ảnh và nâng thẻ mượt mà (`translateY(-3px)`, shadow theo theme).
        - Overlay góc ảnh: Chip trạng thái (`TripStatusChip`) góc trên trái, nút đánh dấu / chọn chuyến đi góc trên phải, huy hiệu thời lượng `📷 X ngày` góc dưới phải với nền kính mờ.
        - Thân thẻ: Nổi bật số tiền / tiền tệ chính bằng màu `primary.main`, khoảng ngày khởi hành, tiêu đề in đậm kèm thời lượng đêm/ngày, dòng vị trí `📍 Điểm đến`, và chân thẻ với nút "Mở" + menu 3 chấm (Sửa/Xóa).
      - **Thanh Tìm Kiếm & Lọc Toàn Diện (`src/features/trip/components/my-trips/TripFilterBar.tsx`)**:
        - Input tìm kiếm pill (`borderRadius: '9999px'`), 3 dropdown bộ lọc khu vực, trạng thái, tiền tệ.
        - Thanh tag gợi ý nhanh: `Gần / Gợi ý:` `[Tất cả]`, `[Đà Nẵng]`, `[Đà Lạt]`, `[Hà Nội]`, `[Phú Quốc]`, `[Sapa]`... bấm vào lọc ngay lập tức.
        - Dòng tóm tắt số lượng (`X kết quả`), dropdown sắp xếp (`Mới nhất`, `Cũ nhất`, `Tên A-Z`, `Điểm đến`), và `ToggleButtonGroup` chuyển đổi Grid/Table.
      - **Lưới Thẻ Đáp Ứng (`src/features/trip/components/my-trips/TripCardGrid.tsx`)**:
        - Grid responsive: 1 cột (mobile), 2 cột (tablet), 3 cột (desktop nhỏ), 4 cột (desktop lớn).
        - Hỗ trợ Skeleton loading và Empty state trực quan.
      - **Sidebar Navigation (`SidebarMenu.tsx`, `SidebarBrand.tsx`, `config.tsx`)**:
        - Menu active dạng viên thuốc `borderRadius: '9999px'`, màu nền `primary.main`, chữ và icon `primary.contrastText`.
        - Phân vùng menu với tiêu đề chữ hoa "Cá nhân & Tiện ích", gắn badge đỏ "MỚI" cho Quét hóa đơn và Trợ lý AI.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> **0 errors, 0 warnings**.

50. **Tối Ưu Hóa Kích Thước Nhập Liệu (Compact Filters) & Đáp Ứng Toàn Diện Đa Màn Hình (Full Responsive)**:
    - **Yêu cầu & Mục tiêu**:
      - Giải quyết triệt để tình trạng các ô input và component lọc trên trang Chuyến đi (`/trips`) bị quá khổ (oversized) do theme áp `minHeight: 50` mặc định.
      - Tinh chỉnh kích thước gọn gàng, thanh thoát (`height: 38px`, `fontSize: 13px`), căn chỉnh tỉ lệ hài hòa giữa thanh tìm kiếm và các dropdown lọc.
      - Tối ưu hóa hiển thị Responsive toàn diện từ Mobile (360px - 480px), Tablet (600px - 900px), đến Desktop màn hình rộng (> 1200px).
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Thanh Tìm Kiếm & Lọc Gọn Nhẹ (`TripFilterBar.tsx`)**:
        - Ghi đè `minHeight: '38px !important'`, `height: 38`, `& .MuiOutlinedInput-input: { py: '8px !important' }`, bo góc `10px` thanh thoát.
        - 3 dropdown bộ lọc (`Khu vực`, `Trạng thái`, `Tiền tệ`): Thu gọn `height: 38px`, `fontSize: 13px`, thêm `KeyboardArrowDownRoundedIcon` nhỏ gọn, đổi nền và viền sang `action.selected` + `primary.main` khi có bộ lọc kích hoạt.
        - Trên Mobile (`xs`): Phân bố linh hoạt theo lưới tự co giãn, không bị tràn ngang hay vỡ layout.
        - Dải tag gợi ý (`Gợi ý:`): Chiều cao `26px`, font chữ `11.5px`, bo góc `6px`, hỗ trợ cuộn ngang mượt mà với cảm ứng di động (`WebkitOverflowScrolling: 'touch'`).
        - Dòng sắp xếp & chuyển chế độ: Đưa về chiều cao `32px`, tự động căn chỉnh khoảng cách hợp lý trên màn hình nhỏ.
      - **Lưới Thẻ Du Lịch Co Giãn Tự Động (`TripCardGrid.tsx`)**:
        - Áp dụng `gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(250px, 1fr))' }` kết hợp khoảng cách `gap: { xs: 1.5, sm: 2, md: 2.5 }`.
        - Không cố định số cột cứng ngắc gây bó hẹp thẻ; thẻ luôn duy trì độ rộng lý tưởng từ 250px đến 350px ở mọi độ phân giải.
      - **Thẻ Chuyến Đi Cân Đối (`TripCardItem.tsx`)**:
        - Chuẩn hóa tỉ lệ ảnh bìa 16:9 (`pt: '56.25%'`), bo góc `14px`, padding `1.75` vừa vặn.
        - Tinh chỉnh font size: Tiền tệ `15px`, Tiêu đề `14px`, chi tiết `11.5px`, nút hành động `height: 28px`.
      - **TopBar & Phân Trang Di Động (`AppTopBar.tsx`, `TripTablePagination.tsx`, `MyTripsHeader.tsx`)**:
        - Nút `+ Tạo chuyến đi` trên TopBar tự động hiển thị gọn `+ Tạo` trên mobile và đầy đủ trên desktop.
        - Phân trang `TablePagination`: Tối ưu padding và ẩn bớt label rườm rà trên màn hình điện thoại.
    - **Kiểm thử chất lượng**:
51. **Chuẩn Hóa Base Components Cho Filter UI & Reusable Tag Chips (`AppFilterChip`, `AppSelect`, `AppTextField`)**:
    - **Yêu cầu & Mục tiêu**:
      - Bám sát tôn chỉ kiến trúc của `AGENTS.md`: Tái sử dụng tối đa và mở rộng các base UI component tại `@/base/components/ui`, tuyệt đối không viết code MUI thô (ad-hoc) rải rác trong các feature components.
      - Xử lý triệt để lỗi icon mũi tên đè lên chữ trong `<Select>` (`pr: '34px !important'`) và rút gọn nhãn hiển thị.
      - Tạo mới base component `AppFilterChip` và `AppFilterChipGroup` để tái sử dụng toàn diện cho các dải thẻ lọc / tag gợi ý trên toàn dự án.
      - Nâng cấp `AppSelect` hỗ trợ các biến thể `variantType: 'form' | 'filter' | 'compact'`, tích hợp checkmark icon và active highlight theo theme.
      - Nâng cấp `AppTextField` hỗ trợ `variantType: 'search'` với chiều cao 38px, bo góc và padding chuẩn mực.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Thẻ Tag Lọc Tái Sử Dụng (`AppFilterChip.tsx`)**:
        - Xuất khẩu `AppFilterChip`: Thẻ chip đơn hỗ trợ hiển thị nhãn, icon, badge đếm số lượng (`count`), trạng thái active với màu `primary.main`, hover và transition mượt mà.
        - Xuất khẩu `AppFilterChipGroup`: Dải container tự động cuộn ngang mượt mà trên mobile (`touch scroll`, ẩn scrollbar), hỗ trợ tùy chọn "Tất cả" (`showAll`, `allLabel`, `allValue`), callback chọn/bỏ chọn (`onChange`).
      - **Select Dropdown Đa Dạng Hóa (`AppSelect.tsx`)**:
        - Bổ sung `variantType='filter'`: Tự động nhận diện trạng thái lọc (`isFiltered`), hiển thị nhãn mặc định khi rỗng hoặc nhãn đã chọn khi kích hoạt, icon checkmark `<CheckRoundedIcon />` cạnh mục đang chọn trong dropdown.
        - Khắc phục triệt để va chạm icon: Cố định `pr: '34px !important'` trên `.MuiSelect-select`, đảm bảo văn bản không bao giờ bị đè bởi chevron arrow.
        - Bổ sung `variantType='compact'`: Phù hợp cho dropdown sắp xếp (Sort) hoặc chuyển số dòng phân trang với chiều cao 32px thanh lịch.
      - **Input Tìm Kiếm Chuẩn Hóa (`AppTextField.tsx`)**:
        - Thêm thuộc tính `variantType='search'`: Tự động cấu hình kích thước 38px, font 13px, bo góc 10px, loại bỏ ảnh hưởng từ `minHeight: 50` của theme toàn cục.
      - **Tái Cấu Trúc Toàn Bộ `TripFilterBar.tsx`**:
        - Xóa bỏ hoàn toàn các hook quản lý menu anchor thủ công và các thẻ MUI thô.
        - Tiêu thụ trực tiếp `AppTextField`, `AppSelect` (`filter` & `compact`), và `AppFilterChipGroup`. Code sạch, ngắn gọn, dễ bảo trì.
52. **Tối Giản Hóa Xử Lý Bộ Lọc (Unified Filter State & Handlers Refactor)**:
    - **Yêu cầu & Mục tiêu**:
      - Bám sát tôn chỉ kiến trúc của `AGENTS.md`: Loại bỏ code smell truyền quá nhiều props và các hàm handle con trùng lặp (`handleSearchChange`, `handleDestinationChange`, `handleStatusChange`, `handleCurrencyChange`) từ `MyTrips` xuống `TripFilterBar`.
      - Đồng nhất dữ liệu filter thành 1 object `TripFilterValues` và 1 hàm dispatch `handleFilterUpdate(patch: Partial<TripFilterValues>)`.
      - Giữ nguyên 100% layout UI và các nút bấm chuẩn không bị xáo trộn.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Đồng Nhất Interface Props (`TripFilterBar.tsx`)**:
        - Định nghĩa interface `TripFilterValues` gồm 4 trường (`search`, `destination`, `status`, `currency`).
        - Thay thế toàn bộ các props rời rạc bằng `filters: TripFilterValues` và `onFilterChange: (patch: Partial<TripFilterValues>) => void`.
      - **Tối Giản Hóa Component Cha (`MyTrips.tsx`)**:
        - Tạo `filterValues` được `useMemo` an toàn từ state `filters`.
        - Xóa bỏ hoàn toàn 4 hàm `useCallback` riêng lẻ (~50 dòng code boilerplate), thay thế bằng duy nhất 1 hàm `handleFilterUpdate` xử lý cập nhật state linh hoạt theo từng key.
        - Gọi `<TripFilterBar filters={filterValues} onFilterChange={handleFilterUpdate} ... />` sạch sẽ, rõ ràng.
53. **Đồng Bộ Phân Trang Đánh Số 1, 2, 3... Cho Cả Grid Và List/Table (`TripGridPagination.tsx` & `AppTablePagination.tsx`)**:
    - **Yêu cầu & Mục tiêu**:
      - Bám sát tôn chỉ kiến trúc của `AGENTS.md`: Chuyển đổi toàn diện cơ chế phân trang ở **cả 2 chế độ Grid (Lưới thẻ) và List/Table (Bảng)** từ cơ chế điều hướng 2 mũi tên `< >` sang **dãy nút số trang trực quan `1, 2, 3...`**.
      - Tích hợp bộ chọn số lượng dòng/thẻ mỗi trang bằng `AppSelect variantType="compact"` (`6, 12, 24 / trang` cho Grid và `5, 10, 20, 50 / trang` cho Table).
      - Dòng tóm tắt kết quả chuyên nghiệp: `{from} – {to} trên {totalCount}`.
      - Nút trang active được tô màu thương hiệu `primary.main`, bo góc `8px`, hiệu ứng hover êm ái.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Nâng cấp `AppTablePagination.tsx` (Dành cho List/Table)**:
        - Thay thế toàn bộ component `TablePagination` cũ của MUI bằng layout kết hợp: Dòng tóm tắt + `AppSelect variantType="compact"` bên trái và `Pagination` số trang của MUI bên phải.
        - Tự động áp dụng cho tất cả các bảng dữ liệu trên toàn dự án (`TripTable`, `ExpenseTable`...).
      - **Hoàn thiện `TripGridPagination.tsx` (Dành cho Grid)**:
        - Đồng bộ phong cách hiển thị số trang `1, 2, 3...`, kích thước cân đối, loại bỏ wrapper viền kép.
    - **Kiểm thử chất lượng**:
      - `export PATH="/home/hanbiro/.nvm/versions/node/v20.20.2/bin:$PATH" && npx tsc --noEmit && npm run lint` -> **0 errors, 0 warnings**.

54. **Tính Năng Tải Ảnh Bìa Chuyến Đi & Hiển Thị Đồ Họa Dạng Thẻ Grid (Trip Cover Image Upload & Grid Display)**:
    - **Yêu cầu & Mục tiêu**:
      - Cho phép người dùng tải ảnh từ máy tính (JPG, PNG, WebP) làm ảnh bìa cho chuyến đi (`coverUrl`).
      - Hiển thị ảnh bìa trên thẻ Grid (`TripCardItem.tsx`) theo tỉ lệ chuẩn 16:9 với hiệu ứng hover zoom mượt mà.
      - Nếu chưa có ảnh bìa, hiển thị placeholder "Chưa có ảnh" chuẩn mực với icon máy ảnh.
      - Hỗ trợ đổi hoặc tải ảnh bìa trực tiếp ngay trên thẻ chuyến đi ở chế độ Grid (Hover overlay `📷 Đổi ảnh bìa`, hoặc click vào vùng trống "Tải ảnh bìa lên", hoặc chọn từ menu thao tác 3 chấm `AppActionMenu`).
      - Hỗ trợ tải/đổi/xóa ảnh bìa trong cả form tạo chuyến đi (`CreateTripDialog.tsx`) và form chỉnh sửa (`EditTripForm.tsx`).
      - Tối ưu hóa dung lượng: Nén ảnh tự động bằng HTML5 Canvas API xuống tỉ lệ và chất lượng lý tưởng (~50-100KB), lưu trữ đồng bộ mượt mà qua `useSyncExternalStore` mà không gây re-render thừa hoặc vi phạm quy tắc React Hooks.
    - **Kiến trúc triển khai & Giải pháp kỹ thuật**:
      - **Tiện ích Nén & Đồng Bộ Bộ Nhớ Trình Duyệt (`src/features/trip/utils/tripCoverStorage.ts`)**:
        - `compressImageFile(file, maxWidth, maxHeight, quality)`: Nén ảnh client-side bằng Canvas API trước khi lưu trữ, chống tràn quota `localStorage`.
        - `getTripCover`, `setTripCover`, `removeTripCover`: Quản lý lưu trữ với khóa `tb_trip_cover_{id}`, phát sự kiện toàn cục `tb_trip_cover_changed`.
        - `useTripCover(tripId, initialCoverUrl)`: Hook đồng bộ ảnh bìa phản ứng tức thì (Reactive) sử dụng `useSyncExternalStore` của React 18, đảm bảo 0 lỗi cascading render và cập nhật tức thì trên mọi thẻ trong trang.
      - **Component Tải Ảnh Tái Sử Dụng (`src/features/trip/components/TripCoverUploader.tsx`)**:
        - Giao diện kéo thả (Drag & Drop) hoặc click để chọn ảnh, kiểm tra định dạng và dung lượng tối đa 5MB.
        - Hiển thị xem trước (Preview) 16:9 với các nút "Đổi ảnh" và "Xóa ảnh" trực quan.
      - **Tích Hợp Thẻ Lưới (`TripCardItem.tsx`)**:
        - Hiển thị `coverUrl` thực tế với `objectFit: 'cover'`.
        - Hover overlay dành cho chủ chuyến đi (`isOwner`): Nút bo tròn viên thuốc kính mờ `📷 Đổi ảnh bìa`.
        - Placeholder "Tải ảnh bìa lên" hỗ trợ click mở hộp thoại chọn file tức thì.
        - Menu 3 chấm bổ sung 2 hành động: "Đổi ảnh bìa" và "Xóa ảnh bìa" (kèm toast thông báo kết quả).
      - **Tích Hợp Form Tạo & Chỉnh Sửa Chuyến Đi (`CreateTripDialog.tsx`, `EditTripForm.tsx`)**:
        - Nhúng `TripCoverUploader` vào luồng tạo và cập nhật chuyến đi, cập nhật state và đồng bộ lưu trữ khi thành công.
      - **Cập Nhật Types & Localization (`types/index.ts`, `messages/vi.json`, `messages/en.json`)**:
        - Thêm trường `coverUrl?: string | null` vào `Trip`, `CreateTripPayload`, `UpdateTripPayload`.
        - Bổ sung chuỗi ngôn ngữ đầy đủ cho cả tiếng Việt và tiếng Anh.
      - **Database Migration (`tripbudget-core/src/main/resources/db/migration/V3__add_cover_url_to_trips.sql`)**:
        - Cung cấp script migration sẵn sàng cho backend core: `ALTER TABLE trip_core.trips ADD COLUMN IF NOT EXISTS cover_url TEXT;`.
    - **Kiểm thử chất lượng**:
      - `npx tsc --noEmit && npm run lint` -> **0 errors, 0 warnings**.
55. **Lazy Load (Infinite Scroll) Cho Nhật Ký Hoạt Động & Timeline Hoạt Động Theo Ngày**:
    - **Backend (`tripbudget-core`)**:
      - `GET /trip/{tripId}/plan/activities/logs?page=&size=` (mặc định `size=20`, tối đa 100) trả `PageResponse<PlanActivityLogResponse>` (sort `createdAt DESC, id DESC`).
      - `GET /trip/{tripId}/plan/days/{dayId}/activities?page=&size=` (mặc định `size=10`, tối đa 100) trả `PageResponse<PlanActivityResponse>` kèm `actualSpent`; repository `findPageByDayIdSorted` giữ thứ tự `startTime NULLS LAST, orderIndex, createdAt` + `id` làm tie-breaker.
      - `GET /trip/{tripId}/plan?includeActivities=false`: trả metadata + tổng của từng ngày (`PlanDayResponse.summary`, `activities: []`). Mặc định `true` để giữ tương thích (AI Planner dùng bản đầy đủ).
    - **BFF**: các route `plan`, `plan/activities/logs` forward query params; thêm `GET` cho `plan/days/[dayId]/activities`.
    - **Base dùng chung**:
      - `useInfiniteQueryGet<TItem>` (`src/base/hooks/use-infinite-query-get.ts`): tải theo trang trên `ApiResponse<PageResponse<T>>`, có `fetchNextPage`, `fetchAllPages`, `refetch` (tải lại đúng số trang đã tải để giữ vị trí cuộn), `getItemKey` để loại trùng, bỏ qua response cũ khi đổi key.
      - `AppInfiniteScrollTrigger` (`src/base/components/ui/`): sentinel dùng `IntersectionObserver` (root = viewport, vẫn hoạt động trong container cuộn của dialog).
      - Types `PageResponse<T>`, `PagePagination` trong `src/base/api/types.ts`.
    - **Feature Plan**: `usePlanActivityLogs` chuyển sang infinite; thêm `useDayActivities`; `PlanOverview` gọi overview với `includeActivities: false`, lazy load activities của ngày đang chọn, mở Tối ưu lộ trình sẽ `fetchAllPages` trước; `DayTimelineList` hiển thị tổng từ `PlanDay.totalActivities/totalEstimatedCost`.

### Immediate likely next tasks:

1. **Xuất Báo Cáo Kế Hoạch & Chi Tiêu Chuyến Đi (Export PDF / Excel)**: Xuất file lịch trình du lịch và bảng kê quyết toán chia tiền.
2. **Offline-first & Service Worker Caching**: Hỗ trợ xem lại lịch trình và hóa đơn khi mất kết nối mạng.

### Profile avatar upload integration (2026-10-12)

- Profile uses `AppDialog`, `AppImageUploader`, `AppButton`, `AppTextField`, and `AppToast`. Avatar editing remains enabled; the later full-name editing milestone below supersedes the original avatar-only limitation. Email remains read-only.
- `AppImageUploader` and `useUploadFile` live in base and support future trip-cover integration. JPG/PNG/WebP, max 5 MiB, local preview with object URL cleanup. Selection is local until Save; closing before Save sends no upload.
- Browser calls same-origin BFF through shared Axios/mutation hooks. POST `/api/uploads` forwards multipart; PATCH/DELETE `/api/users/me/avatar` forward to Identity with Bearer token read from HttpOnly cookie. Configure server-only `IDENTITY_SERVICE_URL` (base URL without `/api`); legacy environment name is a compatibility fallback.
- BFF bounds multipart buffering to 5 MiB + 64 KiB, checks file and purpose, and forwards upstream statuses including 401 for existing refresh flow. Identity remains responsible for actual file-content validation, ownership and transaction rules.
- Avatar save uploads first, then attaches uploadId. A failed attach retries the same upload for the same selected File. Mutation response updates UserContext immediately; base query `replaceData` invalidates older in-flight GET responses. Sidebar prefers current context over initial props and uses initials when avatar is absent.
- Dialog dismissal and controls are disabled while saving; errors retain the selection. UI strings exist in VI/EN. Successful save publishes the returned profile to UserContext, refreshes it in the background and closes the dialog; the success toast lives outside the dialog so it remains visible.
- Apply Identity migrations 001 and 002 before use. Trip cover endpoints/UI and automatic Cloudinary cleanup are not part of this frontend change. Failed saves/abandoned pending uploads still require backend cleanup.
- Validation: TypeScript and ESLint; skip smoke test per project instruction. See `walkthrough.md` for manual acceptance steps and deployment configuration.

### Refresh redirect loop fix (2026-10-12)

- Observed Identity ECONNREFUSED during refresh causing client navigation to login while middleware still detected session cookies and redirected back to overview.
- Refresh transport/5xx errors now remain API errors without navigation or cookie deletion. Only definitive 401/403 rejection redirects once to login. Queued requests are marked retried before waiting, limiting each request to one replay.
- Middleware recognizes only access_token and refresh_token, the two cookies actually managed by auth BFF. Refresh BFF prefers server-only IDENTITY_SERVICE_URL and rejects successful responses missing an access token with 502.
- Regression tests: `node tests/auth-refresh.test.mjs` (transport errors, rejected sessions, concurrent 401 requests).

### Trip cover upload integration (2026-10-13)

- Edit trip reuses `AppImageUploader` (`variant="cover"`) and `useUploadFile` (`TRIP_COVER`). Selection stays local until Save; unchanged cover sends no upload; remove uses `removeCover: true`.
- `useUpdateTrip` uploads first, then sends `coverUploadId` with existing PUT `/api/trip/{id}`. Retry retains the upload ID for the same File/trip after a failed update. Dialog dismissal and form controls are disabled throughout upload and save.
- Core retains active-membership/owner-only authorization. `TripCoverService` claims only the caller's `pending` TRIP_COVER upload, takes URL from storage metadata, and marks replaced uploads `delete_pending` within the trip transaction. Current upload ID is idempotent; optimistic trip version conflicts roll back the upload changes.
- Core uploads module encapsulates the existing shared database (`public.uploads`) through UploadRepository/JdbcTemplate in the JPA transaction; no cross-service foreign keys. This creates schema coupling with Identity upload status/purpose names.
- Trip/public-trip responses expose `coverUrl`; trip grid/table render images with fallback. Existing trip refresh subscriptions update the list after saving. VI/EN labels and error/success toast behavior are included.
- Apply `trip-budget/tripbudget-core/src/main/resources/db/migration/V3__add_trip_cover.sql` before starting the updated Core. Core has ddl-auto=validate and no Flyway dependency; this file is not automatically executed. Identity uploads table must already exist.
- TypeScript and targeted ESLint pass; Maven tests pass (13 total, including 6 cover tests). Smoke test skipped by project instruction. Cloudinary cleanup worker and live PostgreSQL/browser acceptance remain deployment verification; see `walkthrough.md`.

### Trip cover enum value fix (2026-10-13)

- Identity `UploadStatusEnum` uses uppercase member names but lowercase persisted values: PENDING=`pending`, ATTACHED=`attached`, DELETE_PENDING=`delete_pending`. Core SQL must use these lowercase values; upload purposes such as TRIP_COVER remain uppercase.
- Fixed TripCoverService attach/cleanup SQL after PostgreSQL rejected uppercase PENDING. Regression assertions now check both attach and cleanup SQL status literals; earlier JdbcTemplate mocks did not catch invalid enum labels. No database enum migration is required.

### Core uploads module refactor (2026-10-13)

- Core now has `uploads/enums/UploadStatus`, `UploadPurpose`, `uploads/repositories/UploadRepository` and `uploads/services/UploadAttachmentService`. TripCoverService coordinates trip state without SQL or JdbcTemplate.
- UploadRepository owns atomic pending claims and cleanup transitions. Status parameters use explicit database values (`pending`, `attached`, `delete_pending`) and PostgreSQL enum casts; purpose uses Identity names. Both operations constrain caller ownership and purpose.
- UploadAttachmentService requires the calling resource transaction (MANDATORY); resource authorization remains in TripService. This preserves one database transaction, while providing a single boundary for future attachment users or a future Identity API adapter.
- Identity remains responsible for file upload/Cloudinary. No new HTTP endpoint or schema migration is introduced by this refactor. Shared database coupling still exists; replacing it with remote claims needs idempotency and failure reconciliation.
- Validation: `mvn test` passes 18 unit tests (6 trip cover, 5 upload module, 7 existing Hashids). Upload repository assertions check ownership/purpose SQL, enum casts and lowercase bound values. No live PostgreSQL integration or smoke test was run.

### Customer navigation layout (2026-10-13)

- The active application shell supersedes the fixed-sidebar examples above: AppShell uses a vertical Flexbox with AppTopBar (including AppTripBar), scrollable main and AppBottomNavigation. Header/bottom navigation occupy normal flow (`flexShrink: 0`); main uses `flex: 1`, `minHeight: 0` and `overflowY: auto`. No positioning, CSS Grid or child margins were introduced for the new layout.
- At the shared 1440px breakpoint navigation is horizontal in the header. Below 1440px, four primary links plus More appear in bottom navigation; More exposes settlement and AI through AppDialog. Both use route definitions from the existing sidebar config and typed navigation IDs/translations. Selected route and nested routes use the shared `isNavigationActive` helper.
- AppTripSwitcher reads existing TripContext: cover/name/date, searchable trip selection, create and all-trips actions, loading/error/retry states. AppTripBar puts member access near the trip and shows sharing settings for its owner. The switcher now queries paginated trip search while open; it does not add budget queries. Existing overview/expense budget displays remain available.
- Header account entry reuses SidebarUser in compact mode and SidebarUserMenu. Shared AppPopover supports normal Tab navigation through profile, locale, theme and logout. Preferences have 44px touch targets. UserContext remains the avatar/profile source.
- AppBrand preserves the user's Trip Plan/AI branding; SidebarBrand re-exports it for existing auth/sidebar consumers. Existing sidebar components are compatibility consumers, not mounted by AppShell. Public/auth/share routes retain their shell exclusion through the existing sidebarDisabledPaths prop.
- All new visible labels/accessibility labels use navigation VI/EN keys. New components live in base, one component per file, arrow/default exports, palette colors and px/Flexbox sizing. AppPageContainer continues to own page spacing; header and body use fluid full width with aligned responsive gutters (12/16/24/32px), without a global maxWidth.
- Viewport allows zoom and uses viewportFit=cover; header, main, bottom bar and fullscreen dialogs handle safe-area insets. Bottom navigation does not overlay page actions.
- AppDialog adds opt-in mobileFullScreen below sm (600px); create/edit trip and profile opt in. CreateTripDialog now uses AppDialog with footer actions and an HTML form association, keeping creation callbacks/validation intact. Confirmation dialogs retain their normal sizing.
- Scope is responsive customer navigation, not installable/offline PWA infrastructure. Validation and manual acceptance are documented in walkthrough.md; skip smoke test as instructed.
- Final validation for customer navigation: TypeScript, full ESLint, 31 navigation translation keys and production build all pass. Build needed an approved rerun outside sandbox to fetch existing Google Fonts. No browser/real-device visual verification was performed; skip smoke test remains in effect.

### Fluid body and unified header refinement (2026-10-13)

- Per user review, removed the global 1440px cap from body/header and combined the former trip row into AppTopBar. Brand and trip controls share a left Flexbox group; avatar remains on the right. AppPageContainer owns responsive page gutters and full body width.
- Overview content uses equal columns from md and 7:5 category/recent columns from xl; mobile stacks them. Banner spacing/heading/donut scale with breakpoints, and long trip names wrap safely.
- AppTripSwitcher has a full-width bordered trigger in its bounded header slot and opens an anchored AppPopover with search, independently scrolling results and footer actions. Result name/destination/dates use separate lines. Mobile uses compact logo/date and places sharing/member controls inside the trip dropdown; desktop shows labeled-accessible icons beside it.
- AppPopover is a shared base primitive also consumed by SidebarUserMenu, with viewport-bounded width/height, keyboard focus via MUI Popover and optional header/footer slots.
- DESKTOP_NAV_BREAKPOINT=1440 is the single source for desktop/bottom-nav visibility, leaving room for trip controls in one header row. This breakpoint does not cap body width.

Validation for the fluid body/unified header refinement: TypeScript, full ESLint and production build pass. Smoke test skipped; visual browser/device acceptance remains the manual review steps above.

### Trip dropdown UI polish (2026-10-13)

- AppPopover header uses 12px gutters matching content/footer and an 8px title/search gap. Heading is 14px; shared account popover has no header and retains its layout.
- Trip search is placeholder-only with explicit aria-label, search adornment, 44px height and clear control. Clearing restores focus to the input. Selected trip rows have an explicit primary border/checkmark; avatars do not shrink, and long names/destinations expose title text.
- Dropdown styling does not change selectTrip; search now uses the backend as described below. TypeScript passes; full ESLint reports no errors and 3 unused-symbol warnings in the unrelated MyBalanceCard.tsx. Smoke test skipped; latest screenshot review is not automated browser verification.

### Backend trip search in switcher (2026-10-13)

- Removed local trip text filtering from AppTripSwitcher. It mounts feature TripSwitcherResults only while the popover is open. useTripSwitcherSearch calls the existing GET /trip/my-trips with search/page/size through the shared BFF and useInfiniteQueryGet. Core TripSpecifications already searches name OR destination, case-insensitively, restricted to ACTIVE, non-deleted membership/trips. No backend endpoint/migration change was needed.
- Shared base useDebouncedValue delays search 300ms; page size is 20 and AppInfiniteScrollTrigger loads subsequent pages. Pending input hides old results, query keys include search/tripsVersion, and existing infinite-query abort/version guards handle stale requests; closing unmounts results and cancels requests/timers. Loading, empty, error/retry and next-page loading states are distinct.
- TripContext now resolves selected IDs missing from its initial 100 trips using useTripDetail. Matching response ID guards against displaying another selection's stale data; failed detail requests are not used as activeTrip. refreshKey=tripsVersion refreshes the selected detail after mutations. Existing selectTrip signature stays unchanged.
- Backend search covers all matching pages, not just the initial context cache; selection outside those 100 trips remains valid. Search loading text exists in VI/EN. Smoke tests remain skipped; see walkthrough.md for validation and manual acceptance.

Backend switcher search validation: TypeScript and production build pass; full ESLint reports 0 errors and the 3 unrelated unused-symbol warnings in MyBalanceCard.tsx. Smoke/browser tests were not run per project instruction.

### Shared debounce audit (2026-10-13)

- MyTrips live top search now debounces 300ms and gates the query while waiting; UI input updates immediately. Table Apply, dropdown/chip filters and sort bypass debounce; empty search clears immediately. Pending/stale results do not leave pagination controls active, and request errors have retry UI.
- DestinationAutocomplete replaces separate fetch/timer paths with useDestinationSearch/useQueryGet. Typed queries debounce, clearing returns popular destinations immediately, stale results are hidden and selected option identity no longer changes when search results arrive.
- LocationAutocompleteInput replaces its local 320ms/raw-Axios path with usePlacesSearch/useQueryGet and the same 300ms hook. Places require two typed characters and include locale in the key; selecting/resetting does not issue an extra lookup. Free-text location entry remains supported.
- Trip switcher already uses shared debounce and remains unchanged. Expense/table filters use explicit Apply; form inputs and route-optimization dropdown actions do not need typing debounce. Timer scheduling for query setup, success toasts and copied indicators is not search debounce.
- Added query metadata and 7 unit regressions for debounce, stale results/errors, cancellation, minimum length, popular reset and stopping loading on error. Unrelated user edits (including MyBalanceCard.tsx) were preserved.

Shared debounce audit validation: 7 unit cases, TypeScript and production build pass; full ESLint has no errors and 3 unrelated MyBalanceCard.tsx unused-symbol warnings. Browser/smoke tests were skipped.

### Shared toast duration (2026-10-13)

- AppToast defaults to autoHideDuration=3000ms for all severities. Existing consumers use this shared default; no feature overrides exist. Keep future toasts on the shared default unless a specific requirement calls for a different duration.
- Snackbar timeout calls the consumer onClose to clear its open/message state. MUI hover/focus/window-blur timer behavior remains unchanged.

Toast duration validation: TypeScript and targeted AppToast ESLint pass. Smoke/browser tests skipped per project instruction.

### First-use policy acceptance (2026-10-15)

- All authenticated application pages, including `/print`, now render inside `UserProvider` → `PolicyAcceptanceGate`. TripProvider and protected UI mount only after `/auth/me` reports a stored acceptance. Login/register, public share and `/legal/{terms,content,privacy}` remain available without acceptance.
- The screen has three unchecked, independently labeled checkboxes; each document opens in AppDialog. All three are required. Decline signs out. Acceptance uses shared Axios/mutation hooks; errors preserve choices, controls are disabled during save/logout, and the returned profile updates UserContext immediately.
- Identity owns POST `/api/users/me/policies/accept`, authenticates the caller and validates explicit true for terms/content/privacy, exact published version and VI/EN locale. An atomic conditional update stores the first server timestamp/version/locale and preserves them on retries. No user ID or timestamp is accepted from the browser. Auth profile/login/Google/OTP and avatar responses all include acceptance metadata.
- Apply `trip-budget/tripbudget-identity/migrations/002__add_policy_acceptance.sql` to the shared database BEFORE deploying updated Identity/Core. It adds nullable acceptance columns plus a completeness constraint. Both services use manual schema migration; this file does not auto-run. Existing accounts start unaccepted and must confirm once, too.
- Identity JwtAuthGuard blocks protected business APIs with 403 `POLICY_ACCEPTANCE_REQUIRED`. Auth endpoints (including me/refresh/logout) and the authenticated acceptance endpoint are exempt from the consent requirement. Core PolicyAcceptanceFilter runs after JWT/session validation and reads acceptance from public.users using the existing shared-database boundary. Anonymous public reads continue normally. AI receipt/map BFF endpoints independently validate session and acceptance with Identity before calling external services; outages fail closed.
- `POLICY_VERSION='2026-10-14'` identifies the three documents together and must match between frontend and Identity. First acceptance is the current requirement: previously accepted versions remain valid; automatic re-consent and an acceptance history are NOT implemented. Keep published content immutable and archive it before replacing versions. A server/frontend version mismatch blocks new acceptance.
- Policy content in messages/vi.json and en.json is starter product copy, not finalized operator policy. Before release, confirm operator identity/support contact, actual data processing/retention/deletion, provider details and final text. These cannot be inferred from the repo. The UI never forces a camera or AI permission, and privacy is labeled as read/acknowledged.
- UI refinement: local paper/action.hover surfaces replace the global blue background.default on the acceptance/loading/error/legal pages. Shared AppCard/Button/Dialog/Checkbox, per-policy icons, selected borders, 0/3 counter, locale/theme preferences, safe-area spacing and mobile document dialogs. The global theme remains unchanged.
- Validation: frontend TypeScript and targeted ESLint; 3 policy gate/BFF unit regressions and 3 auth refresh regressions; Identity build, 5 policy unit tests and targeted ESLint. Full frontend lint has 0 errors and 5 unrelated unused-symbol warnings. Core tests use JDK interface stubs instead of Mockito agent attachment. Browser/smoke and live database verification are not performed.

### Compact policy acknowledgement screen (2026-10-15)

- Replaced tall policy cards with three compact checkbox rows and a separate 44px Read button per row. Checkbox labels retain explicit agreement/acknowledgement and the exact policy name; no preselection, bulk acceptance or scroll-to-end requirement was added. Icons hide on small viewports to preserve text width.
- Removed repeated card titles/summaries and the extra welcome row from the acknowledgement screen. The complete documents and summaries remain in the translations; full document text is unchanged and opens in AppDialog.
- Reduced page/panel gaps and padding, centered the natural-height panel, shortened supporting VI/EN copy and placed actions on one row from sm. Keyboard order matches visual order. Mobile actions stack, content wraps, and short/zoomed viewports can still scroll naturally. No fixed height, hidden overflow or clipped content is used to claim a universal no-scroll layout.
- This is a presentation-only change. API payload, database columns, first-acceptance idempotency, version, backend enforcement and public document routes remain unchanged. Desktop layout is intended to fit common laptop viewports; actual device/browser visual acceptance remains manual (smoke tests skipped).

### Mandatory policy popup supersedes standalone screen (2026-10-15)

- Renamed PolicyAcceptanceView to PolicyAcceptanceDialog. The gate now opens a single AppDialog over a neutral branded shell after login or direct protected navigation. It does not redirect to a separate consent page and still defers TripProvider/protected children until acceptance is saved.
- Three compact acknowledgement rows remain unchecked initially. The dialog footer contains Continue and Decline/sign out, outside the scrollable document body. Opening a document replaces the body/title of the same popup; Back to acknowledgement restores the choices. There are no stacked dialogs and no scroll-to-end requirement.
- AppDialog has an opt-in hideCloseButton prop (default false). With closeDisabled it supplies no dismissal callback, so neither Escape nor backdrop clicks can close it (compatible with the installed MUI 9 API). In acknowledgement mode there is no X, Escape or backdrop dismissal. While reading a document, X/Escape/backdrop return to acknowledgement, without dismissing the mandatory popup. Existing closable dialog behavior remains available.
- The popup remains a bounded dialog on mobile rather than becoming a full-page route. On short/zoomed viewports only the dialog content scrolls as needed; footer actions remain in DialogActions. Browser/device no-scroll verification is manual, not claimed by unit tests.
- The decorative background header contains AppBrand only. Language follows the existing account/browser locale; underlying controls are not presented as actionable through a modal backdrop.
- Backend endpoints, migration, version and first-acceptance storage are unchanged. This supersedes the page-centered presentation described above. Frontend regressions cover pending/accepted/error gates, AI/maps access and mandatory versus ordinary dialog dismissal.

Mandatory policy popup validation: TypeScript, targeted ESLint and all 4 policy regressions pass, including mandatory/ordinary modal dismissal and protected-content gating. Backend behavior is unchanged. No live browser/device visual check or smoke test was performed.

### Delete trip request validation fix (2026-10-15)

- Core PUT `/trip/delete/{id}` no longer declares `@Valid @RequestBody UpdateTripRequest`. Existing frontend/BFF sends `{}` for deletion, so the old controller incorrectly rejected name, destination, startDate and endDate before reaching TripService.
- Delete accepts the trip path ID and @CurrentUser only, and returns ApiResponse<Void> with data=null. Existing soft-delete, owner/membership checks and public share invalidation are unchanged. Frontend/BFF URLs and HTTP method remain compatible; update still validates UpdateTripRequest.
- Three MockMvc regressions verify bodyless delete, existing empty-JSON delete, and rejection of an empty update request. A clean Maven test run passes all 10 current tests. An initial incremental run picked up a broken IDE-generated TripController constructor reporting Flexible Constructor Bodies; `mvn clean test -q` regenerated valid bytecode and passed. No live trip was deleted and no smoke test was run.

### PWA audit and shared UI refinements (2026-10-16)

- Initial PWA audit found no manifest or service worker. This initial status is superseded by the installation milestone below. `docs/pwa-guide.vi.md` tracks the implemented install flow and the proposed offline work separately.
- The user explicitly requested using `.agents/skills/design-taste-frontend/SKILL.md` to review/fix UI, not editing the skill. Its landing-page image/motion quotas do not fit authenticated application screens; preserve the established MUI system and report the limits of the review.
- AppButton uses the user's original primary gradient (restored after their review) and MUI's native loading support to retain the label/layout; ordinary buttons no longer expose toggle semantics by default. Focus is visible. Dark primary.contrastText is #0F172A against #60A5FA; selected button backgrounds use primary.main, including disabled-state overrides.
- AppDialog uses a div title wrapper around its h2, gap-based wrapping actions and long-text wrapping. AppPageHeader uses Stack useFlexGap for wrapping rows. Bottom navigation has larger wrapping labels and a 72px bar plus safe-area padding.
- Login/register brand panels have smaller mobile minimum heights and responsive typography. Existing copy, auth logic and policy dismissal rules remain intact.
- ESLint excludes installed `.agents/skills/**` tooling from application rules. TypeScript and production build pass; full ESLint has 0 errors and 6 pre-existing unused-symbol warnings. Build required network access for Google Fonts and still reports the existing middleware-to-proxy deprecation.
- Login was visually inspected before/after at 390, 768 and 1440px: no horizontal overflow or captured console errors; mobile headline wrapping improved. Shared authenticated screens, dark-mode rendering, loading transitions and real-device acceptance remain manual checks. No smoke test was run.

### PWA installation milestone (2026-10-16)

- User added manifest.ts and the exact /manifest.webmanifest middleware exemption. Preserve those changes. Added 192px and 512px PNG icons exported from src/app/icon.svg using existing Sharp, retaining the logo/gradient. No dependency added.
- Root AppInstallListener captures beforeinstallprompt/appinstalled and display-mode changes independently of account-menu mounting. Shared install-store uses stable snapshots via useSyncExternalStore in AppInstallButton. SSR snapshot hides install UI until capability is known.
- AppPreferences shows an icon-only download/install button alongside VNI/ENG and light/dark controls, with translated tooltip and aria-label, covering login/register and the compact account menu. Native prompt runs only on click and consumes each event once; concurrent clicks are guarded, rejection has a localized toast, and dismissal requires a fresh browser event. iOS/iPad desktop-mode detection opens localized manual instructions in AppDialog.
- Hide install action when no supported prompt exists (except iOS instructions), in insecure contexts, in standalone/fullscreen, or after appinstalled in the current session. This is not universal detection of every prior installation from a separate browser session. No offline worker/cache or push implemented.
- Validation: TypeScript and production build pass; all 6 installation lifecycle regressions pass; full ESLint has 0 errors and 6 existing warnings. PNG dimensions/format and 9 PWA VI/EN translation keys checked. Actual OS installation/device/browser acceptance remains manual. Skip smoke tests.

### Login banner redesign (2026-10-16)

- Login.tsx now composes a separate LoginBrandPanel with the existing AppBrand, a local decorative login-journey.svg bay/sailboat illustration, a theme-based gradient overlay and localized copy. The existing register illustration remains a separate asset.
- The banner uses Flexbox and responsive typography. Mobile shows brand/headline; desktop also shows supporting copy and itinerary/expense highlights. Banner corner radius is restrained to 12px following user feedback; avoid large rounded corners on this panel.
- All 7 login.banner keys match in VI/EN. Existing authentication, preferences and PWA controls continue through the existing components. Preserve the user's primary button gradient.
- TypeScript and targeted ESLint pass. SVG successfully rasterized and visually inspected; full browser layout/device acceptance remains manual. No smoke test was run.

### Mobile PWA icon and default name fix (2026-10-16)

- The old Apple PNG had transparent rounded corners; ordinary manifest icons had white corners and no dedicated maskable alternative. Generate installation assets from src/app/icon.svg with scripts/generate-pwa-icons.mjs: keep brand gradient/airplane, remove the source rounded background for full-bleed opaque PNGs, and use a slightly smaller mark for a dedicated 512px maskable icon.
- Manifest keeps any-purpose 192/512 icons and adds the separate maskable 512 icon. Icon URLs use ?v=2. Apple icon remains src/app/apple-icon.png at 180px, linked automatically by Next.js rather than a duplicate manual metadata.icons.apple entry.
- metadata.appleWebApp.title explicitly suggests Trip Plan; manifest name/short_name already do so. There is no web API to prevent users editing a home-screen label. The OS/launcher still controls the final outer icon shape.
- PNG pixel checks verify dimensions, opacity, absence of black pixels, and the entire white maskable mark inside the 40%-radius safe circle. A circular-mask preview is inspected. Real-device rendering/reinstallation remains manual; skip smoke test.

### Customer travel UI/UX refresh (2026-10-22)

- Profile full-name editing: Identity PATCH `/api/users/me/profile` accepts only a trimmed, nonblank name of at most 100 characters and derives ownership from the authenticated JWT subject. The BFF `/api/users/me/profile` forwards the request using the HttpOnly access cookie; `useProfileMutation` publishes the safe returned profile through UserContext. The form saves changed names before any selected avatar, updates context after each successful request, retains unsaved avatar choices on failure, and uses the general profile success toast. Email remains disabled. Avatar uploader hints are hidden only in this form via `showHint={false}`; image validation errors remain visible, and the old avatar-only notice is no longer rendered. This requires deploying the Identity endpoint alongside the frontend. Nine DTO/service regression tests, the Identity build and frontend TypeScript/targeted lint pass; smoke tests are skipped.

- Applied the installed `.agents/skills/ui-ux` direction to the existing MUI system without adding a second component library or changing business/API behavior. The approved direction is a calmer, customer-facing travel companion rather than an admin dashboard or AI marketing surface.
- Shared cards are now flat, bordered surfaces without page-level elevation; primary and danger cards use restrained semantic tints. Secondary buttons use a neutral outline while the established primary-button gradient remains unchanged. Global inputs, buttons, page headers, page spacing, chips, table headings, navigation states and scrollbars use a lighter common rhythm.
- Overview now follows the approved travel reference with a 72px desktop top bar, compact brand lockup, larger trip switcher, full-width cover hero, themed readability overlay, destination/dates, member access and a translucent budget summary strip. Desktop hero and summary proportions track the supplied reference; mobile stacks the same information without horizontal overflow. It keeps the familiar category and recent-expense cards below instead of using the awkward side-image composition. The former multi-color gradient/donut treatment was removed. Trip cards and plan-day tabs no longer lift or cast page shadows on hover.
- At `md` and wider, Overview is a three-frame viewport layout: the compact hero gets 45% of the content height and the two five-row cards share the remaining 55%. The route container itself does not scroll; standard five-row data remains fully visible, while only an individual list body may scroll for unexpected extra/long data. Below `md`, natural page scrolling remains enabled so stacked cards are not compressed or clipped on phones.
- Keep the 72px top navigation for the approved reference proportions. The five Recent rows use compact 6px vertical padding (4px on short viewports), saving about 40px versus shrinking the shared navigation by only 8px; 46px category icons remain the row-height anchor on normal desktop.
- Follow-up against the supplied current-state screenshot keeps the same three-frame composition and theme. Five category rows use a 14px gap so they fit without triggering the fallback inner scrollbar; list bodies reserve a stable scrollbar gutter for unexpected overflow, and the percentage column has a fixed non-wrapping width so a scrollbar cannot cover its values.
- The compact header account popover follows the supplied row-based account-menu reference at application scale: a 48px identity summary, divider-separated profile/language/appearance groups and a persistent semantic danger logout action. The 320px popover keeps 44px touch targets; locale remains accessible Vietnam/UK flag controls, appearance exposes light/dark/system choices, and PWA installation appears as a matching row only when supported. Account, locale, theme, installation and logout request flows remain unchanged.
- Mobile bottom-navigation icons explicitly inherit their action color and use `primary.main` when selected, including the More destination. Labels keep the existing selected state; navigation routes and responsive breakpoint behavior are unchanged.
- Mobile bottom navigation shows every destination directly when the configured list has at most five items. With six or more destinations, it shows the first four plus More so the bar never exceeds five actions; the More action and dialog are not mounted when there are no overflow destinations.
- Plan keeps Add activity as the main action; print, history and share are grouped under the existing action menu. Checklist and AI suggestions remain directly reachable. AI Planner now uses the shared page header and one working form plus a compact guidance panel; promotional capability cards and the decorative multi-color hero were removed.
- VI/EN customer copy uses sentence case and frames AI as an editable itinerary draft. The brand subtitle is now travel-oriented instead of an AI badge. Existing light/dark palettes, permissions, dialogs, hooks and request flow remain intact.
- Validation: regenerated Next route types, TypeScript passes, full ESLint has 0 errors and 7 pre-existing unused-symbol warnings, and production build passes. The build still reports Next.js's existing middleware-to-proxy deprecation. Smoke/browser tests were skipped per project instruction.

### Journey-first travel interface (2026-10-26)

- User authorized implementation of the Tripsy + Stippl direction, using the supplied screenshots as design references. This supersedes the October 22 fixed-height Overview composition: Overview now scrolls naturally and prioritizes the trip and itinerary, followed by a compact budget and recent expenses.
- Existing `ActiveTripBanner` is shared between Overview and Plan. It now presents the real uploaded cover, trip name, destination, dates, member access/avatars and description. A theme gradient is the no-cover fallback; no stock photos, fabricated trips, expenses, members or itinerary activities were introduced. Overview additionally links to `/plan`.
- `TripItineraryPreview` reuses `useTripPlan` with `includeActivities: false`, `useDayActivities`, `PlanDayTabs`, `ActivityTimelineCard` and `PlanEmptyState`. It previews at most three activities for the selected day, with access to the full itinerary. `TripBudgetCard` reuses the existing expense summary endpoint and shared progress/button/card components; detailed category reporting remains in Expenses.
- Plan keeps its existing activity/checklist/share/history/print dialogs, handlers, pagination and permission checks. It adds the shared trip cover, compact day selectors, a timeline and map beside each other at `lg`, and an Itinerary/Map switch below `lg`. PlanHeader now composes AppPageHeader with an h2 under the trip's h1.
- `PlanMapPanel` lists located activities from the currently loaded day pages. Selecting one displays its address in the reusable base `AppLocationMap`; the map includes an external Google Maps link. It is a selected-place map, not a multi-stop route renderer. Load more remains available in map view when day pagination has more results. Activities without locations remain visible in the timeline, and the trip destination is the map fallback.
- Map rendering uses a lazy public Google Maps iframe and depends on network/provider availability. There are no new API credentials or dependencies. Shared `base/utils/maps.ts` encodes addresses with URLSearchParams; AppButton's type now permits anchor `target`/`rel` attributes for the external link.
- Navigation order is now Home, Itinerary, Trips, Expenses, Split costs, AI assistant, derived from one ordered config for desktop and mobile. Existing maximum-five mobile navigation and More behavior remain. Existing brand palette, primary-button gradient, keyboard focus styling and light/dark theme tokens are retained.
- New components follow one component per file, const-arrow/default-export conventions, Flexbox with parent-owned gaps/padding, shared wrappers, theme colors and VI/EN localization. Keyed trip previews/budget/member/recent-expense views and stale-plan guards prevent prior-trip content from appearing during selection changes; itinerary and budget errors have retry actions.
- Validation: TypeScript passes; full ESLint has 0 errors and the same 7 existing unused-symbol warnings; production build passes after allowing Google Fonts downloads outside the network-restricted sandbox. Map URL encoding/locale fallback and new VI/EN keys were checked. The existing Next middleware-to-proxy warning remains. Smoke/browser tests were skipped per project instructions, so visual/device and live embedded-map verification remain manual.

### Mobile action proposal, color regression and layout audit (2026-10-26)

- Treat design feedback as proposals to assess, not final product decisions. A scoped implementation does not authorize a global visual rollout. The review/recommendation matrix is in `MOBILE_UI_REVIEW.md`.
- Root cause of dark text on gradient link buttons: globals.css had an unlayered `a { color: inherit }` that outranked MUI's layered styles (`enableCssLayer: true`). Remove the duplicate global reset; MuiCssBaseline already owns link defaults. Keep enabled primary normal/hover/active foreground explicit and theme-derived. Do not add unlayered global link/button colors over the component system.
- AppButton exposes opt-in `mobileIconLabel`: below sm, the startIcon becomes a 56px circle with the label below. It retains the existing handlers, focus, loading/disabled behavior and primary gradient. Only PlanHeader's quick-action group currently opts in. Forms, financial confirmation/delete, navigation and filters are not automatically converted.
- Shared page header now wraps its title/action groups and long badge/subtitle content. Page containers permit flex shrinking. Split-allocation member rows stack on mobile; long amounts can wrap. Suggested settlement amounts/actions may wrap. Trip pagination reduces siblings and removes first/last shortcuts on mobile while increasing tap height. AI columns allow shrinking, and undefined primary.50/error.50 backgrounds use existing theme tokens/tints.
- Regression command: `node scripts/check-button-styles.mjs` renders the real shared button/theme without starting the app or backend. It checks the CSS layer regression, primary link foreground through normal/hover/active with both theme definitions, and mobile circular-icon/visible-label styles. Smoke/browser tests remain skipped; the audit is source/SSR-style review, not full live/device visual validation.

### Header/button wrapping and duplicate-action regression (2026-10-26)

- The user's actual mobile screenshots exposed failures missed by the previous source-only pass: a table title/count and add button squeezing each other, View all dropping below the journey description, and metadata labels separated from their values. Audit scanned all 163 TSX files and 127 AppButton uses; remaining intentional fixed rows in horizontally scrollable tables are not treated as page overflow.
- Standard AppButton labels use nowrap and do not shrink; wrap whole action groups instead. `wrapLabel` is explicit for exceptional long labels, while mobileIconLabel continues to allow multi-line labels beneath its circle. Form/footer groups now use Flexbox wrapping/gaps; confirm/camera paired fullWidth actions stack on phones. DialogActions no longer forces buttons to shrink their labels.
- Reuse AppSectionHeader for card/table headers: title/action row independent of subtitle, optional count badge, optional stacked mobile actions. ExpenseTable and TripItineraryPreview use it. Expense page metadata puts each label/value in the same inline text block.
- Overview now has exactly one contextual itinerary link, in TripItineraryPreview, labeled Mở lịch trình in VI. ActiveTripBanner no longer offers the duplicate CTA, and preview empty state does not add a second link. Expense page owns Add expense in the page header; ExpenseTable callback is optional for independent consumers. Plan's empty state does not duplicate its header's Add activity.
- AppPagination centralizes responsive pagination for trip grids and shared tables. Card footers/member controls allow wrapping instead of compressing names or button labels.
- `node scripts/check-button-styles.mjs`: 4 regression checks pass, including one itinerary link for banner + preview in loading/empty/populated states. `node scripts/check-responsive-layout.mjs [outputDir]`: Chrome headless component fixtures pass 28 combinations (7 widths 320–1440 × VI/EN × light/dark); screenshots reviewed. This is focused component layout validation, not app smoke/E2E or authenticated-page coverage. It uses isolated fixtures without backend calls/mutations, respects Skip smoke test, and does not claim every live page/device has been visually validated.
- TypeScript and production build pass; full ESLint has 0 errors and the same 7 prior warnings. Updated recommendations/scope and limitations are in MOBILE_UI_REVIEW.md. Keep treating design ideas as proposals; fixing these concrete layout/duplication defects does not approve a global round-button rollout.

### Stacked member avatars and member-dialog layout (2026-10-26)

- User explicitly approved implementing the stacked-avatar proposal and fixing the member dialog shown in their screenshot. New shared AppAvatarStack composes MUI AvatarGroup + ButtonBase, with 8px overlap owned by MUI: 3 visible avatars below sm, 4 at sm+, plus the exact remaining count. Children are explicitly sliced before passing total so MUI's max/total special case cannot accidentally show a fourth mobile face. Real avatar URLs and shared getUserInitials fallback; no sample data in production.
- ActiveTripBanner replaces its standalone member button and second avatar strip with one accessible stack action. It shows active members only, guards loading/error/stale responses and still opens the existing TripContext member dialog. Disabling the banner query while that dialog is open makes the query refresh on close, updating changed membership without introducing new API behavior.
- TripMemberRow now keeps avatar left, name/email and RoleBadge in a single column, and the existing action menu at right. Invitation accept/reject controls occupy their own wrapping row. Permission conditions for owner/vice/member/self/target owner are unchanged. Menu accessible labels identify the target member.
- TripMembersDialog places its description in full-width content instead of squeezing it into the icon/title/close row. Count/invite toolbar can wrap. Loading/stale hides old rows, errors expose a retry action; TripMemberList relies on DialogContent scrolling rather than a nested 420px scroller. Existing membership mutations and dialogs remain.
- New VI/EN labels cover stack accessibility, per-member menu and loading errors. Title uses Vietnamese sentence case. The shared component's overlap uses MUI AvatarGroup rather than manually adding negative margins or positioned layout.
- Validation: 6 CSS/component regression tests pass (including exact surplus counts and member-action permissions); 28 Chrome component-layout combinations pass, including missing avatars, multiple member counts, long names/emails and invitations. Light/dark screenshots at 375px reviewed. TypeScript/build pass; lint has 0 errors and the same 7 existing warnings. No authenticated end-to-end/smoke flow was run.

### Itinerary list rows, highlights and time ranges (2026-10-26)

- Implemented the user's scoped itinerary redesign proposal with shared AppTimelineRow and AppCategoryIcon: category circle on the left, readable activity title, time metadata, secondary location/category/note details, and thin connectors/dividers in a shared card. DayTimelineList, overview preview and the public read-only itinerary reuse the same activity renderer; PlanMapPanel uses its compact selectable variant and preserves selected-location and pagination behavior.
- Important information uses a clear hierarchy: bold titles, scheduled times and actual amounts; theme-based status backgrounds with dark-mode foregrounds; selected map stops receive a primary outline. Completed titles remain readable with a completion indicator. Notes and estimated amounts stay secondary. Existing edit/delete/status/expense-conversion callbacks, read-only behavior and delete authorization remain intact.
- User requested HH:mm - HH:mm rather than wording between times. Shared formatTimeRange in base/utils/date.ts removes seconds and joins available times; one start time remains HH:mm, records without either time omit the time metadata entirely (per the latest user preference), and end-only records retain an explicit end-time label. The whole time group may wrap below the title when space is limited.
- ActivityDistanceConnector uses the same icon gutter, a wrapping directions link, and existing route data/source information. It does not invent missing distances or durations. New interface copy has VI/EN translations; no code comments were added.
- Validation: TypeScript and scoped ESLint pass; full ESLint has 0 errors and the same 7 existing warnings. Temporary tests outside the repository verify time ranges, action availability/callbacks and 28 Chrome component-layout combinations (320–1440px, VI/EN, light/dark) with project fonts; mobile screenshots reviewed. These are isolated component fixtures with a map placeholder, not authenticated-page, live-map interaction, smoke or E2E coverage. Production build checked separately. Existing user edits to this document and .gitignore were preserved.

### Itinerary route-link hover correction (2026-10-26)

- Corrected ActivityDistanceConnector's zero-padding link combined with MUI start/end icon negative margins. Icons now participate directly in the Flexbox with gap and internal horizontal padding, so the hover background contains the icons and label. Hover/active use theme action backgrounds; keyboard focus stays inset to avoid clipping. Directions URL, route data and global button styling remain unchanged.
- Verified 28 isolated Chrome component combinations with actual pointer hover (320–1440px, VI/EN, light/dark): icons stay within the padded link, hover does not move or resize it, and content does not overflow. Reviewed light/dark hover crops. TypeScript, scoped ESLint and diff whitespace checks pass; no smoke tests or authenticated backend flows run.

### Consistent itinerary status typography (2026-10-26)

- Both the itinerary and map already reuse ActivityTimelineCard, but its status Box inherited Arial and a normal line height inside ButtonBase, versus Comfortaa and 18px in the non-interactive itinerary. Replaced that shared status wrapper with Typography and explicit line height/letter spacing to preserve the itinerary's appearance everywhere. Status colors, size, weight, padding and icons remain shared and unchanged.
- Browser computed-style checks now confirm identical status font family, size, weight, line height, letter spacing, padding and icon size in itinerary, preview and interactive map fixtures across 28 width/locale/color combinations. TypeScript, scoped ESLint and diff whitespace checks pass. No smoke test run.

### One application font for text and numbers (2026-10-26)

- Latest user preference supersedes the earlier decision to retain a separate financial monospace font: use Comfortaa for application text, numbers, money, dates, time ranges and percentages. RootLayout now loads only Comfortaa; DM Mono was removed.
- globals.css defines one font chain through --font-sans, with --font-body, --font-display and compatibility aliases (including --font-mono) resolving to it. Existing financial components automatically use Comfortaa without scattered overrides. Native controls/code-like elements and MuiButtonBase use the same font to prevent Arial/browser-default fallbacks. Old starter stylesheet references to unloaded Geist variables now use --font-body. Keep intentional size/weight hierarchy and existing numeric formatting.
- Validation: TypeScript and production build pass; full ESLint has 0 errors and the same 7 existing warnings. No DM Mono/Geist loading references remain in src or generated CSS. Isolated Chrome fixtures compare computed font families for an actual TripSummaryMetric, numeric font aliases, ButtonBase, native controls and code-like elements across 28 width/locale/color combinations; they match the body Comfortaa font. Existing itinerary layout/hover/status checks still pass. This does not claim visual coverage of every authenticated page; no smoke tests run.

### Mobile dock and restrained monetary emphasis (2026-10-26)

- Current user preference: monetary highlights should be subtle and use color, without increasing existing font sizes or adding colored amount backgrounds. Mobile navigation should feel detached through spacing and a rounded surface, without a surrounding border or shadow.
- AppBottomNavigation now has a centered rounded surface (maximum 560px), safe-area-aware side/bottom gaps and a soft active-item tint. It remains in AppShell's Flexbox flow below the scrolling main content, preserving routes, active-state accessibility and the existing desktop breakpoint. No fixed/absolute positioning, shadow or outer border was introduced in the final version.
- New shared AppMetricValue standardizes monetary emphasis with Comfortaa, theme-based primary/success/error foregrounds, numeric styling and wrapping. Applied to budget totals/spending/remainder, personal balance/settlement totals, and itinerary overall/day estimates. Existing font sizes and financial calculations are preserved; important amounts can wrap rather than be replaced by an ellipsis. Balance status labels retain their existing meaning. User edits to .gitignore and prior AGENTS.md progress were preserved.
- Validation: TypeScript and production build pass; full ESLint has 0 errors and the same 7 existing warnings. Temporary Chrome fixtures pass 28 width/locale/color combinations (320–1440px, VI/EN, light/dark), including zero budgets, over-budget values, long amounts and all personal balance statuses. Checks cover dock spacing/no shadow, active route, 44px minimum action targets, absence of content overlap/overflow, shared fonts and transparent monetary backgrounds. Mobile light/dark screenshots reviewed. Isolated fixtures use local data and a budget-hook stub; no live authenticated flow, smoke test or physical-device safe-area validation was run.

### Desktop selection and mobile footer surface correction (2026-10-26)

- AppNavigationLink's hover rule previously replaced the active foreground/background, making a clicked desktop item appear selected only after the pointer left it. Hover now preserves the active colors; inactive hover and keyboard focus remain distinct. The route still determines the active item.
- The apparent strip above the mobile dock was caused by translucent action.hover backgrounds stacking in main/AppPageContainer while the footer had only one layer. AppShell now defines an opaque theme-derived --app-page-surface only below the existing desktop navigation breakpoint; main, AppPageContainer and the dock surround reuse it. At desktop widths the variable is absent and the existing action.hover backgrounds remain. No shadow or border was added to hide the strip.
- Validation: TypeScript and scoped ESLint pass. Isolated Chrome tests render the actual AppShell and AppPageContainer with local provider/host stubs across 28 width/locale/color combinations, including 1439/1440/1920px. Mobile main/page/footer computed colors match; the custom surface is absent on desktop. Real pointer hover/click checks confirm the active desktop link retains its colors before the pointer leaves. Layout, route accessibility and monetary emphasis checks pass. Light/dark mobile screenshots reviewed; no authenticated navigation or smoke test run.

### True floating mobile navigation following the supplied reference (2026-10-26)

- The user's latest clarification and Facebook screenshot request a true overlay: page content continues behind the gaps surrounding the navigation pill. This supersedes the earlier normal-flow footer/dock approach. Mobile AppBottomNavigation uses a fixed transparent wrapper with pointer-events:none and an interactive pill with pointer-events:auto, so there is no full-width opaque footer or interception of scrolling/clicks in the surrounding gaps. The pill retains no shadow/outer border. No relative/absolute positioning, Grid or child margins were added.
- AppShell's mobile-only CSS variables share the navigation height and safe-area-aware bottom clearance. Main extends to the viewport bottom; AppPageContainer adds that clearance to its existing bottom padding, and main has matching scroll padding. The last card/row can therefore scroll above the pill instead of being permanently hidden. Desktop has no overlay/clearance variables; the existing menu selection fix remains.
- Validation: TypeScript, scoped ESLint and whitespace checks pass. Temporary browser fixtures render the actual shell, page container, navigation and RecentExpenseList with five local expense rows. All 28 width/locale/color combinations pass, including desktop breakpoint boundaries; checks confirm transparent gap hit-testing and wheel scrolling, reachable/clickable final row, keyboard focus visibility, and desktop active-hover-click behavior. Light/dark final-row screenshots reviewed. API/providers/topbar hosts are locally stubbed; no authenticated navigation, smoke test or physical-device safe-area check was run.

### Responsive itinerary day selector (2026-10-26)

- PlanDayTabs no longer forces every button to be at least 112px wide. Up to three days share the available width evenly, capped at the prior desktop size; longer itineraries use compact container-based widths and horizontal scrolling with proximity snapping. Reduced internal horizontal padding and allowed long labels/counts to wrap, preserving existing font sizes, dates, selected-day callbacks and pressed-state accessibility. Selected colors remain visible during hover.
- This shared component updates the overview itinerary preview, planner and public trip view together. No other menu/layout styles changed in this task.
- Validation: TypeScript, scoped ESLint and whitespace checks pass. Temporary Chrome component fixtures pass 28 width/locale/color combinations with 1/2/3/4/30 days, missing dates, large day/activity counts and keyboard focus on the last day. Up to three buttons remain fully visible with equal widths; long itineraries scroll to the final button. Light/dark mobile screenshots reviewed. No smoke test or live authenticated flow was run.

### Category spending long-text layout fix (2026-10-27)

- CategorySpendingList allows headings, status badges, category names and monetary footers to wrap within the card. Shrinkable flex children and zero-minimum existing grid tracks prevent long content from widening the page; header icons retain their size. Data and budget calculations are unchanged.
- Validation: TypeScript and scoped ESLint pass with the existing unused TuneRoundedIcon warning; whitespace check passes. No smoke test or browser visual verification was run.

### Responsive category over-budget alert (2026-10-27)

- CategorySpendingList stacks the alert content and full-width budget action on mobile. At sm and above the action sits beside the content, wrapping below when the content cannot retain 240px. The warning icon aligns with the first text line. Existing budget callback and calculations are preserved.
- Validation: scoped ESLint and TypeScript checks pass (existing unused TuneRoundedIcon warning); whitespace check passes. No smoke test or browser visual verification performed.

### Mandatory UI review requested by user (2026-10-27)

- Before completing UI changes, review narrow mobile and desktop layouts, long text, control labels, wrapped actions, empty/loading/error states, and light/dark contrast. Use a focused browser check when available; static TypeScript/ESLint checks alone do not establish visual correctness. Report any visual checks that could not be performed. Continue to skip smoke tests.
- Public pages bypass AppShell and must provide an opaque theme surface and readable foreground. Transparent action.hover over the theme's blue body background is unsuitable for content pages.
- Template library filters use visible external labels and shared AppSelect filter controls, avoiding floating labels crossing adjacent fields on mobile. Parent flex containers own spacing and wrapping.

### Community plan templates implementation (2026-10-27)

- Added Core snapshot/metadata persistence, explicit public DTO allowlist, preview fingerprint, owner authorization, publication/update/unpublish, metadata-only searchable/paginated library, private author list and transactional copy with PostgreSQL advisory locks/idempotency receipts. Keeps rest days, shifts LocalDate values and resets execution/assignment/expense links. Source soft deletion unpublishes via migration trigger.
- Added public SSR template library/detail with BFF routes, preview/publish/copy forms, My templates and homepage discovery including empty-trip state. Quick-create AI passes the newly created trip ID to the planner; password/Google login supports a restricted template return URL. Old query results are hidden during debounce/filter changes.
- Public template layout owns an opaque theme background; filters use separate visible labels and AppSelect. Added the user's required ongoing UI review rules above. Focused Chrome review covers 48 library width/locale/theme/state combinations; mobile light/dark screenshots reviewed. No smoke test or authenticated full flow performed.
- Apply Core V4\_\_plan_templates.sql manually before starting the updated backend; it has only been applied in a disposable integration-test database. Templates currently use default artwork; independent template cover uploads, moderation and feature-specific rate limiting are not implemented. Detailed rationale, alternatives and validation instructions: docs/plan-templates.vi.md.

### Mobile information hierarchy and critical design review (2026-10-27)

- User confirmed community templates stay on Home/library, while the planner prioritizes the current trip's activities. A reference image is evaluated for hierarchy and space; it is not copied wholesale. The five mandatory reasoning requirements are recorded near the top of this document and must be read each session.
- Home/planner use the compact ActiveTripBanner, retaining title, destination, dates, status and member access while removing the introductory footer. Home mobile keeps spent/remaining-or-over-budget totals visible and offers direct planner/expense links; itinerary/recent expense details mount only when expanded. Desktop keeps full details. Template previews are short cards in a keyboard-accessible, contained horizontal list; full metadata remains in the library/detail.
- Library navigation is separate from the heading so translated/long labels do not compete for one row. Money in touched SSR-capable components receives useLocale explicitly, fixing server/browser formatting differences found during browser review.
- Validation for this refinement: TypeScript, scoped ESLint and whitespace checks pass. Focused temporary Chrome fixtures cover 64 Home/planner width-locale-theme-long-text combinations, disclosure interaction, contained carousel and absence of console/hydration errors; 48 library width-locale-theme-empty/long/error combinations pass. Mobile light/dark screenshots reviewed. Temporary routes removed. Authenticated real-data flow, physical-device safe areas and smoke tests were not run.

### Template publication dialog UI correction (2026-10-27)

- Publish/copy checkbox labels now use one feature-level option component with contained spacing, readable wrapping, keyboard focus and a minimum 44px target. Publish styles form a wrapping flex group with an explicit five-selection limit; the checklist has a real empty state. Scoped textarea padding avoids doubled padding. Kept the existing two-step review flow and primary gradient.
- Publish content does not shrink inside the scroll region. Optional AppDialog contentRef lets the form reset content scroll when entering preview/success without changing other dialogs. Busy inputs are disabled; successful publication offers an enabled Done action. Editing clears prior errors. TemplateItinerary uses explicit locale for currency.
- Validation: 64 focused publish/copy Chrome fixture combinations (320/390/768/1280px, VI/EN, light/dark, empty/long checklist) pass for bounds, checkbox limit, preview scroll reset, success and runtime errors. Eight additional API-conflict fixtures pass retry, stale-error clearing and final-checklist reachability. Mobile light/dark screenshots reviewed. TypeScript/scoped ESLint pass; temporary fixture pages removed. No smoke or authenticated live publish test.
- Existing development log also contains a duplicate React key warning and a Next DevTools releasePointerCapture exception. Neither reproduced in these form fixtures; do not claim that the screenshot's DevTools Issue badge or all application runtime problems have been resolved.

### Explicit mobile creation actions and template back link (2026-10-27)

- User approved both proposals: Home mobile (<600px, matching shared mobileIconLabel styling) displays three existing circular icon-and-label actions directly below the active-trip banner, explicitly grouped as Create a new trip. Manual uses the existing create host, AI opens the existing new-trip AI form, and templates opens the library. Larger screens retain the Quick create menu below the banner. One shared AI dialog instance handles both presentations.
- Template detail uses a left-aligned arrow plus the localized Itinerary library label with a minimum 44px touch target. Its destination is always /templates rather than history.back(), so direct links have a predictable exit. Filter restoration is not added. Detail currency uses the explicit locale for SSR consistency.
- Validation: 32 focused Home/detail browser fixture cases at 320/390/768/1280px in VI/EN and light/dark pass. Checks cover mobile circular actions below the banner, manual/AI dialogs, templates navigation, desktop menu items, back-link bounds/alignment/direct destination and no runtime errors or horizontal overflow. Mobile screenshots reviewed. Temporary route removed. No smoke test or real trip creation performed.

### Mobile budget overview and contextual icon preference (2026-10-27)

- User requested trying a merged budget overview because category-level limits already appear below. On mobile (<600px), BudgetMetricsCards now uses one MobileBudgetSummaryCard with spent amount, aggregate progress, total budget and remaining/exceeded amount. It uses the existing summary API and shared progress/metric primitives, not the paginated expense rows; category details remain below. Desktop retains three metrics.
- A positive trip budget shows the real usage percentage (including >100%) while the bar is capped at 100%. No trip budget means no percentage/progress or misleading remaining value. Mobile loading/error states use skeleton/retry rather than zero amounts. Stale data from another trip is hidden. Currency locale is explicit in metrics and category output, correcting a hydration mismatch found in English browser fixtures.
- The existing mobile budget adjustment action moves from the page header into this card to avoid duplicate controls. For an existing budget it is a 44px settings icon with localized tooltip/aria-label, visible only when the callback is authorized. Without a budget it remains an explicit Set budget text action.
- User prefers mobile icons when they communicate the action clearly in context. Apply selectively: retain text for unfamiliar/ambiguous actions and initial setup, and always give icon-only controls an accessible name and sufficient touch target. Do not automatically replace all labels with icons across the application.
- Validation: 128 Chrome fixture cases at 320/390/768/1280px, VI/EN and light/dark cover healthy/near/over/exact/unset/large/loading/error budgets, card count, overflow, progress semantics, callbacks and runtime errors; all pass after the locale correction. Additional 32 mobile cases verify the settings icon's 44px target, accessible name, action callback, text setup fallback and read-only visibility. Screenshots reviewed, temporary pages removed. TypeScript/scoped ESLint pass; CategorySpendingList retains its existing unused TuneRoundedIcon warning. No smoke test or real budget mutation performed.
- Visual review also identified that small exceeded-budget text needs a lighter error token in dark mode; the new mobile card now applies error.light for those labels while retaining error.main on the progress indicator. This is scoped to the new overview card, not a theme-wide redesign.

### My templates visual hierarchy (2026-10-27)

- MyTemplates now uses the shared page header: one primary Publish template CTA and one page-level explanation of updating from the source trip. Repeated per-card instructional paragraphs were removed.
- New feature-level MyTemplateCard presents a wrapping title, compact published/unpublished status chip, destination and day/activity/use counts. Edit is the single visible secondary action (Republish for withdrawn templates); a 44px, accessible ellipsis menu holds View and Unpublish for published templates. Existing source-trip editing and mutation endpoints are preserved. This intentionally keeps the edit label instead of blindly turning all actions into icons; the tradeoff is an extra tap for secondary actions.
- Query failures and unpublish failures use separate localized messages. Loading uses card skeletons. Validation: 96 temporary Chrome fixtures at 320/390/768/1280px, VI/EN and light/dark cover published, withdrawn, long text, empty, loading and error states. Checks pass overflow, one visible card action, menu target, mocked unpublish-to-withdrawn transition, correct source edit link and retry. Mobile light/dark/long-name screenshots reviewed; temporary route removed. No smoke test or real unpublish performed.
- Final visual refinement: preview title/destination are limited to two lines to keep long-name lists scannable; full text remains in the accessible DOM/title and source/detail screens. Published status uses a lighter success token in dark mode. Sixteen additional long-name browser cases pass after these refinements; final light/dark screenshots reviewed.

### Plan-template request hook boundary correction (2026-10-27)

- Reviewed Shared hooks/Axios/debounce/component organization rules after the user flagged inline query configuration. Fixed four plan-template components: TemplateLibrary, MyTemplates, PublishTemplateDialog and CopyTemplateDialog now call feature hooks; request endpoints/parameters/keys and copy retry attempts live in hooks/constants. Base request hooks and SSR fetch modules are unchanged. Search uses the shared default 300ms debounce, replacing the unjustified 350ms override.
- Added scoped ESLint no-restricted-imports rules for plan-template components to prevent direct transport/generic-request-hook imports from recurring. This is not a claim that every legacy feature is compliant.
- Wider read-only search found existing inline requests in PlanOverview, TripMembersDialog and PolicyAcceptanceDialog. Their separate workflows are recorded in docs/frontend-hook-audit.vi.md; they were not silently refactored alongside this feature.
- Added tests/plan-template-hooks.test.mjs: nine regression tests pass for debounce/stale/SSR fallback/page mapping, copy retry identity and payload, definite errors, BFF POST contracts and ESLint enforcement. Tests isolate base transport/query behavior; they do not claim to simulate React scheduling or prove server concurrency. No smoke test.
- Browser regression: eight real-library fixture cases across VI/EN, light/dark and 390/1280px pass rapid-input debounce, hiding prior results, single settled request, out-of-order Slow/Fast responses, immediate numeric filter, error completion and recovery. APIs are intercepted; no authenticated writes or smoke test. TypeScript and scoped ESLint pass. Review report: docs/frontend-hook-audit.vi.md.

### Core readability review (2026-10-27)

- Backend-specific instructions now live in `../trip-budget/tripbudget-core/AGENTS.md`; read them when working on Core. They retain the user's five reasoning requirements and skip-smoke preference, and define SQL/repository, typed projection, transaction and behavior-preservation rules.
- Plan-template SQL moved into repositories with named parameters and typed metadata mapping. Services split by query/publication/copy, with focused snapshot, fingerprint, access and validation helpers. Expense aggregates use projections; split/settlement calculations and AI HTTP have dedicated helpers/clients. Several long repository queries were expanded for readability; existing query approaches are retained where suitable.
- Final clean Maven run passes 28 tests including 11 disposable-PostgreSQL integration tests, with zero skips. No smoke test or live AI/authentication end-to-end test. Reading guide, tradeoffs and remaining observations: `../trip-budget/tripbudget-core/docs/core-readability-review.vi.md`. This is a readability/behavior-preservation review, not a complete security audit of every API.

### Quy tắc tham khảo cấu trúc trước khi triển khai (2026-10-29)

- Trước khi thêm tính năng, đọc phần tương tự đang có và làm theo cấu trúc của dự án; không tự chọn cách triển khai khác khi chưa có lý do rõ ràng. Backend thêm dữ liệu nghiệp vụ phải có Entity và JPA Repository, ưu tiên derived query/JPQL thay vì tự thêm JDBC/SQL trực tiếp.

### Trạng thái danh sách trống dùng chung (2026-10-29)

- Dùng `AppEmptyState` từ `@/base/components/ui` cho danh sách không có dữ liệu, truyền title/icon/action phù hợp; mặc định không thêm description theo yêu cầu người dùng. Không dùng Alert thông tin hoặc viết lại bố cục empty state riêng cho từng danh sách. Loading và lỗi tiếp tục dùng trạng thái riêng; AppTable đã tích hợp AppEmptyState và giữ action xóa bộ lọc.

### Bảo toàn desktop khi chỉnh responsive (2026-10-29)

- Mọi thay đổi UI phải xem cả mobile và desktop; không tối ưu mobile bằng cách làm lệch hàng nút, tiêu đề hoặc bố cục desktop.
- Header Lịch trình: Dùng mẫu nằm cạnh tiêu đề trên mobile và trong nhóm thao tác trên desktop; mỗi breakpoint chỉ hiển thị một nút. Kiểm tra trạng thái có/không dữ liệu và không tràn ngang.

### Thông báo sau khi hoàn tất (2026-10-29)

- Sau thao tác thành công, đóng form/popup và báo bằng `AppToast`; không thay nội dung popup thành màn thành công với nút Xong/Đóng. Các bước xem trước/xác nhận trước khi ghi dữ liệu vẫn giữ nguyên.
- Khi thông báo phải tồn tại sau khi đóng popup hoặc chuyển trang, dùng `useAppToast` từ `AppToastProvider` ở cấp ứng dụng. Áp dụng chung cho mobile và desktop.

### All dialogs on mobile (2026-10-30)

- Following the user's expanded scope, AppDialog defaults to full screen below sm (600px), with a top-left localized Exit action. mobileCloseLabel overrides its label for Cancel or another contextual action. Mobile omits the header icon/right close button; the title stays visible above scrollable content. Dynamic viewport height and safe-area padding support phone browser chrome and screen insets.
- AppConfirmDialog and OptimizeRouteDialog also use AppDialog on mobile, sharing their existing content/actions with their preserved desktop presentation. All other dialog consumers inherit the default, including creation/editing, details, camera, members, templates, legal content, install help and More navigation. Dropdown menus and table filter popovers keep their anchored presentation.
- Existing hideCloseButton and closeDisabled behavior remains enforced, including mandatory policy acceptance. Expense editing and budget updates disable closing while saving. Form validation, payloads and submit handlers remain unchanged.
- Mobile header refinement: equal 64px side regions keep the 16px title centered independently of the Exit/Cancel label. The left action keeps a 44px touch height; long titles/labels wrap. Optional descriptions occupy their own full-width row. A theme divider separates the header from the form; desktop header styles remain unchanged.
- Mobile footer actions: mark dialog dismissal buttons with data-dialog-action="cancel" and the main Save/Create/Confirm action with data-dialog-action="primary". AppDialog hides marked cancellation buttons only when its header close action is available and makes marked primary actions full width in full-screen mode. Desktop and non-full-screen layouts retain their buttons. Do not mark embedded controls such as canceling an inline invitation form, back-to-preview or camera retake as dialog dismissal actions. Keep the primary gradient, validation, loading and submit handlers unchanged.
- TypeScript, scoped ESLint and diff whitespace checks pass. No browser visual check or smoke test was performed. Review narrow mobile/desktop, long titles, loading/error/empty content, light/dark themes, scrolling, nested-dialog closing and safe areas in a browser before treating visual behavior as verified.

### Six shared categories (2026-10-30)

- Use exactly this order: Ăn uống (FOOD_BEVERAGE), Di chuyển (TRANSPORTATION), Mua sắm (SHOPPING), Chỗ ở (ACCOMMODATION), Vé (SIGHTSEEING), Khác (OTHER). TRIP_CATEGORIES drives form, budget and expense filter choices; VI/EN labels match. Retired ENTERTAINMENT is merged into OTHER as explicitly chosen by the user. Normalize older receipt/edit values rather than exposing an invalid select option.
- Core enums and AI prompts use the same six codes. Core migration V3 merges persisted expense/activity categories and active budget limits; run it before deploying the new backend. Legacy template JSON remains readable via enum aliases. The application database has not been migrated in this session. See ../trip-budget/tripbudget-core/docs/category-update.vi.md for rollout and checks.

### Bottom navigation selection (2026-10-30)

- User preference supersedes the earlier active-item tint: selected bottom navigation actions highlight only the icon with primary.main. Labels retain text.secondary; the selected action background stays transparent, including on hover. Keep the pill surface, route-derived selection, aria-current and keyboard focus outline.
- This gives a quieter selection indicator than a filled tile; desktop navigation styles are unchanged. Verify with TypeScript/scoped ESLint; visual light/dark and hover checks have not been performed in a browser. Skip smoke tests.

### Notification inbox and WebSocket (2026-10-30)

- NotificationProvider is mounted within authenticated TripProvider frames and keyed by user; notification feature hooks own HTTP orchestration. AppTopBar uses NotificationBell, AppDialog remains full-screen on mobile.
- Transport lives in base/realtime/connect-realtime.ts: same-origin /realtime, masked CSRF bootstrap via BFF, heartbeat, bounded backoff, cleanup and bounded event-ID dedupe. No JWT in JavaScript or URL. REST BFF routes retain HttpOnly token forwarding and no-store; bootstrap relays separate Set-Cookie headers.
- Core runs one instance until a cross-instance bridge exists. Apply its V5 migration manually before running; not applied to application DB in this session. Local setup uses the optional realtime-proxy Compose profile in ../trip-budget and localhost:8080.
- Feature uses a coalesced snapshot refetch, not blind badge increments. Resync on reconnect/focus/online/inbox open; hide stale page results and clear all user state by provider remount on account change.
- Implementation and setup: ../trip-budget/tripbudget-core/docs/notifications-implementation.vi.md. TypeScript, scoped ESLint and notification/auth Node regression tests are the frontend checks; no smoke test, browser visual validation or load benchmark is claimed.

### Itinerary image export (2026-11-02)

- Replace Print / Save PDF with Export itinerary images. One day produces one PNG, including rest days: a three-day itinerary must produce three images. Use the actual trip cover as the darkened background, with white text and yellow highlights; preserve the existing application layout/primary gradients.
- `/export/plan/{tripId}` uses existing protected plan/trip BFF hooks. Legacy `/print/plan/{tripId}` redirects there. Export all activities from includeActivities=true, retaining backend ordering and notes; do not use paginated activity previews as the export source.
- Native Canvas yields 1080px-wide PNGs with content-driven height; allow individual download and a ZIP containing one PNG per day. No generated imagery or uploads of exports. Keep cancellation, stale-result hiding and resource cleanup. Cover errors must be surfaced rather than silently substituting an unrelated image.
- Tests, architecture, dimensions and known CORS/device limits: docs/plan-image-export.vi.md. Skip smoke tests.


### Login, liquid glass navigation and page loading (2026-11-03)

- Login uses the existing local journey artwork above a rounded form on mobile; desktop retains two columns. AppPreferencesMenu groups language/theme/PWA installation into one accessible popover. Existing auth validation, redirect and primary gradient remain.
- AppBottomNavigation uses a translucent, blurred pill with a highlight border/shadow and an opaque fallback. Preserve selected-icon-only coloring, localized labels, keyboard focus, safe areas and the existing 1440px desktop breakpoint.
- User clarification: initial page loading is ONE shared page overlay, never one visible loader per API or data section. AppPageLoadingProvider wraps AppShell and combines mounted AppLoadingState registrations for the current route. Cleanup removes each registration on completion/error/unmount; old-route entries do not hold the current page. Keep sections mounted so queries can finish concurrently. Do not implement loading by hiding/unmounting the page children.
- AppLoadingIndicator reuses the brand plane with a dotted orbit and reduced-motion support. AppLoadingState registers page loading; AppLoadingOverlay presents the shared blurred overlay. Initial skeletons/account-check text are replaced. Button submissions, autocomplete and incremental pagination retain compact feedback using the same indicator. Determinate budget bars remain data visualizations.
- Focused Chrome QA covers Login and a temporary fixture of the real shared components at 320/390/768/1280/1440px × VI/EN × light/dark: 40 cases without horizontal overflow or runtime exceptions. Theme controls were exercised; blur and the desktop navigation breakpoint were checked. Real provider fixture: three concurrent loading states yield one overlay throughout staggered completion, then zero; reduced motion disables animation. Temporary fixture removed. No smoke test or real sign-in/backend mutation. See docs/ui-refresh-loading.vi.md.


### Floating mobile dialogs supersede full screen (2026-11-03)

- User now prefers inset floating popups for create/edit and other dialogs. AppDialog defaults mobileFullScreen to false; explicit true flags removed from create/edit trip, edit expense, budget settings, profile and template publication. This supersedes the 2026-10-30 default.
- Mobile paper has 24px corners, at least 16px safe-area-aware surrounding space, and a maximum height of 90dvh bounded by safe-area insets. Container owns padding; the paper resets MUI default margins. Content scrolls inside, header/footer remain outside the scrolling content, and the header uses the existing right close button. Footer cancel actions are visible in floating mode. Existing mandatory/close-disabled protections remain.
- Focused Chrome component fixture: 320×568, 390×844, 390×400 and 1440×900 in light/dark; all eight cases have no horizontal overflow, remain inset, scroll long content and keep footer inside. Close button works; no runtime exceptions. Short viewport is a layout simulation, not a real-device keyboard test. Temporary fixture removed; no smoke test.


### Mobile page sheets replace floating form dialogs (2026-11-03, clarified)

- User clarified the reference means a page-like bottom sheet sliding upward, not a centered floating form. This supersedes the earlier floating-dialog interpretation. AppDialog now defaults mobilePresentation to sheet below 600px: full width, bottom aligned, 24px top corners, and 48px (or larger top safe inset) of the previous page visible above. Desktop keeps its dialog layout.
- AppDialogSlide supplies the upward MUI Slide transition; reduced-motion disables duration. Content scrolls inside; header and supplied action footer remain outside that scroll area. Existing closeDisabled/hideCloseButton, focus trap and backdrop/Escape behavior remain. Explicitly marked cancel buttons hide when header dismissal exists; primary action fills the mobile sheet width.
- Forms and long content inherit sheets: create/edit trips, expenses and activities, budget, settlements, profile, templates, member lists, sharing, itinerary tools, detail/history, camera and policy content. Short confirmations, member-role selection, More navigation and installation instructions opt into mobilePresentation=dialog. No swipe-to-dismiss gesture is implemented.
- Focused Chrome fixture: 320×568, 390×844, 390×400 and 1440×900 in light/dark. Mobile sheets start at y=48 and end at viewport bottom, long content scrolls, footer fits, no horizontal overflow. Close works; confirmation stays centered/content-sized. No runtime exceptions. TypeScript/scoped ESLint pass. Fixture removed; no smoke test or real-device keyboard test.


### Content-sized bottom sheets (2026-11-03)

- User reported wasted whitespace below the Add Activity submit button. Cause: shared sheet paper forced height to viewport minus 48px. AppDialog now uses height:auto with the same maximum height, and sheet DialogContent uses flex:0 1 auto. Short forms fit their content at the bottom; long forms scroll and still leave at least 48px/top safe inset above. This supersedes the fixed-height page-sheet sizing above.
- Audited form/dialog height rules: the legal gate's 100dvh belongs to its background page, camera sizing belongs to media, and field-row flex rules do not force sheet height. They remain intact.
- Focused Chrome fixture uses actual AddActivityForm, AddExpenseForm, SetBudgetForm and RecordSettlementForm, plus short, footer-action and long shared-dialog cases. Across 390×844, 320×568, 390×400 and 1440×900 (28 cases), mobile end-of-content spacing is 16px (within subpixel rounding), sheets remain bottom-aligned, long content scrolls, and no horizontal overflow/runtime exception was detected. Fixture removed. TypeScript/scoped ESLint checked; no smoke test, backend mutation or real-device keyboard test.


### Trip view switcher visibility (2026-11-03)

- TripFilterBar hides the grid/table toggle below sm (600px) with responsive display, matching its mobile layout. The control remains available from sm upward. Replaces the temporary commented-out toggle that hid it at every width. View selection/data behavior is unchanged.


### Initial-route loading only (2026-11-03)

- AppPageLoadingProvider only aggregates AppLoadingState during the initial loading session for each pathname visit. Seal after no pending registrations for 150ms; later searches/dialog content/refetches use local indicators. A visit ID isolates A → B → A and stale cleanup. This supersedes unconditional overlay registration described above.
- GlobalLoadingHost uses pageOnly to avoid placing a local spinner outside page content; Login submission uses its button loading. AppAvatarStack uses a compact local indicator.
- Chrome fixture passed eight aggregation/navigation/refetch checkpoints with no runtime exceptions. Fixture removed; skip smoke tests. See docs/ui-refresh-loading.vi.md for the grace-period tradeoff.


### Day tabs and itinerary actions (2026-11-03)

- PlanDayTabs distributes all day cells equally across available width with CSS Grid; minimum cell widths are 88px below sm and 104px from sm. When days exceed available space, scroll horizontally instead of compressing text. Shared planner, public trip, overview preview and template itinerary consumers inherit this layout.
- PlanHeader exposes Add Activity, AI suggestions and Publish template according to existing permissions. Checklist, Activity log, Share and Export live in its More menu. User clarification: Use template stays in its original position (beside the title on mobile, in the action group on desktop); Reset day stays beside day metadata in PlanDayToolbar. Reset remains conditional on management rights, a current non-stale day and activities; the existing confirmation remains. Add Activity is not duplicated in PlanDayToolbar.
- TemplateDetail places Use this template and Save/Unsave on one compact row, retaining primary gradient and save/login behavior. Mobile uses available row width; desktop uses content width.
- Focused Chrome fixture: 320/390/768/1440px × VI/EN × light/dark; 1/2/3/12 days, equal widths, selection, overflow, owner/read-only menus and checklist callback checked. Template save API was intercepted for layout/save-state checks; no backend writes or smoke test. Temporary fixture removed. TypeScript and scoped ESLint are the code checks.


### Home spending cards and actions (2026-11-03)

- Below md, replace the three create-trip shortcuts with three compact budget/spent/remaining cards for the active trip directly beneath its banner. Reuse TripBudgetCard and useTripBudgetSummary; remove the lower duplicate mobile budget summary. Desktop retains its detailed budget card.
- Both presentations put Quick create and View expenses in a two-column row below the budget content. QuickCreate uses the existing menu for manual/AI/template choices at every width, with fullWidth only for the budget action row. No-trip state retains creation controls and does not invent financial data.
- Use shared formatCompactCurrency with visible currency codes, full amounts in tooltips/accessibility labels, theme-based metric colors, and one shared initial-page loading registration. Missing budget shows dashes for budget/remaining, not a false over-budget warning. Error states preserve retry.
- User clarification: remove the separate lower Open itinerary button; retain the existing action inside the journey section. View expenses is likewise not duplicated below the journey.
- Focused Chrome with intercepted APIs checks mobile/desktop VI/EN, three metrics/no duplicate budget, no overflow, no-budget/over-budget/large-value/error/no-trip states, and Quick create menu/AI dialog. Light/dark mobile screenshots inspected. Fixture removed; no smoke test or real backend writes. TypeScript/scoped ESLint/diff checks are validation.


### Confirmation sheets (2026-11-03, user clarification)

- AppConfirmDialog now inherits AppDialog's content-sized bottom sheet on mobile instead of forcing mobilePresentation=dialog. Applies to Delete trip and all shared confirmation consumers, superseding the earlier short-confirmation exception. Header close replaces the marked footer cancel button on sheets; confirmation spans the available width. Existing loading/disabled/confirmation callbacks remain.
- Warning/success/default icon styles are passed as an sx callback, fixing the previous object spread of a function that silently dropped semantic icon colors. Desktop retains its centered confirmation layout.
- TypeScript, scoped ESLint and diff checks are verification; no new browser run or smoke test for this adjustment. Shared sheet geometry was checked in the earlier dialog work.

- Confirmation text alignment clarification (2026-11-03): center only the description/body of AppConfirmDialog, including its mobile sheet content wrapper. Keep the header title alignment unchanged. TypeScript/scoped ESLint checks; no browser run for this small style adjustment.

### Explore destination cards (2026-11-04)

- Shared TemplateCard now uses a photo background, readable bottom scrim, two-line title, destination and activity count, with a day-count badge and separate 44px save control. Clicking the image or native content link opens template detail; save and guest-login controls retain their own actions. The eye icon is removed. Missing or failed background images leave the themed gradient visible; no invented ratings are shown.
- Home compact library uses “Cảm hứng cho chuyến đi” / “Inspiration for your next trip” and 200px horizontally scrollable mobile cards. Explore and Saved inherit the shared card; filters, pagination and save API behavior remain. Detailed cost/author information stays in template detail.
- Validation: TypeScript and scoped ESLint pass; diff whitespace checked. No browser validation or smoke test performed.

- Home library action clarification (2026-11-04): “Xem tất cả” now includes the same trailing ArrowForwardRounded icon as “Mở lịch trình”, reusing the existing text AppButton and 44px minimum height. Reference red/green rectangles are annotations, not button borders. Scoped ESLint/diff checks; no smoke test.

- Explore tap feedback correction (2026-11-04): Home “Xem tất cả” disables ripple and uses transparent hover/active backgrounds with a text-color response. TemplateCard and its content link suppress the mobile browser tap highlight. Keyboard focus outlines and save interactions remain. Scoped ESLint and diff checks pass; mobile visual verification remains pending, no smoke test.

### Branded initial startup screen (2026-11-04)

- Base AppStartupScreen centers the existing /icon.svg (88px, priority load) on primary.main with a localized status label. It is server-rendered through AppPageLoadingProvider on the first visit and remains until the existing loading session settles. Child queries continue mounting underneath; no extra minimum delay is added.
- Later pathname visits retain AppLoadingOverlay and local refetch indicators. This is the website startup screen, not the OS-controlled PWA splash. See docs/ui-refresh-loading.vi.md.
- TypeScript/scoped ESLint/diff checks pass. No browser/mobile visual verification or smoke test.

### Simplified trip status UI (2026-11-04)

- The user-facing trip status choices are now Sắp đi / Đang đi / Đã đi / Đã hủy (Upcoming / In Progress / Finished / Cancelled). Shared feature constants in trip-status.ts drive edit choices, both status presentations and grid/table filters.
- DRAFT/PLANNING/CONFIRMED display as Upcoming and filter together; COMPLETED/ARCHIVED display as Finished and filter together. New explicit selections use PLANNING, IN_PROGRESS, COMPLETED or CANCELLED. Edit state retains the original API status until the user changes the choice, so changing other fields does not rewrite legacy statuses. DELETED remains internal and absent from options/filters.
- This simplifies the UI only: backend enum, database records, default DRAFT on creation and permissions are unchanged. Group filters use the existing comma-separated API contract. The more detailed planning/archive distinction is intentionally hidden in the UI.
- TypeScript/scoped ESLint/diff checks pass. An in-memory execution of the TypeScript constants checks four choices, complete/disjoint legacy filter coverage, selectable mappings, VI/EN labels and DELETED exclusion. No browser test, smoke test or application DB migration.

- Trip status naming correction (2026-11-04, user clarification): the four UI choices are exactly “Nháp”, “Đang Đi”, “Hoàn Thành”, “Đã Hủy” (Draft / In Progress / Completed / Cancelled). First explicit choice now writes DRAFT, not PLANNING. Legacy DRAFT/PLANNING/CONFIRMED still group under Nháp; COMPLETED/ARCHIVED under Hoàn Thành. Unchanged edit selections preserve original stored values. Reuses draft/completed translation keys; removes the superseded upcoming/finished keys. TypeScript/scoped ESLint/diff checks; no smoke test.

- Backend trip status simplification (2026-11-04): supersedes the legacy grouping described above. Core TripStatus now has DRAFT/IN_PROGRESS/COMPLETED/CANCELLED plus internal DELETED. Frontend types and filter constants use canonical values only. V8 migration must run before starting the new Core to convert PLANNING/CONFIRMED -> DRAFT and ARCHIVED -> COMPLETED. Tested only on disposable PostgreSQL; not applied to application DB. Rollout and checks: ../trip-budget/tripbudget-core/docs/trip-statuses.vi.md.

### Bottom navigation hover shape (2026-11-04)

- Bottom navigation actions now use 999px pill corners and clip their contents, matching the dock's rounded shape. Disabled MUI ripple for links and More to avoid a second dark overlay during touch. Inactive hover uses action.hover only on fine pointers supporting hover; pressed feedback remains subtle. Selected backgrounds stay transparent and only the icon indicates selection, preserving the existing preference. Keyboard focus outline remains.
- Scoped to AppBottomNavigation. TypeScript/scoped ESLint/diff checks pass. No browser/mobile visual verification or smoke test.

### Shared MUI calendar and trip date ranges (2026-11-04)

- New base AppDatePicker supports default single-date mode (string) and mode=range ([start,end]) with a single MUI X Community DateCalendar. AppCalendarDay highlights endpoints/in-range days; base/utils/calendar.ts owns strict parsing/range selection. Dependencies: @mui/x-date-pickers and dayjs; no Pro package/license.
- Create/edit trips use one Trip dates field. Add/edit expense, settlement date and template-copy start date use the same base in single mode. Values remain YYYY-MM-DD; display DD/MM/YYYY, VI/EN localization, readable Vietnamese weekdays. Shared AppDialog handles mobile sheet/desktop dialog.
- Draft changes apply only after confirmation; close cancels. Same-day trips work; earlier second selection restarts the range. Year/month view changes do not commit range endpoints. Props include minDate/maxDate, error/helperText, disabled and required. Four-state trip status work remains intact.
- Five date/range/timezone tests pass; TypeScript/scoped ESLint/diff checks pass. Independent Chrome fixture checks 320/390/768/1440px, range/draft/cancel/apply, single dates, minDate, keyboard and disabled, with no runtime exceptions; mobile screenshot inspected. Temporary src fixture removed. Existing dev-server fixture did not hydrate, so authenticated integrated forms remain visually unverified. No smoke test/backend writes. Details: docs/calendar.vi.md.

### Shared time picker and body-only loading (2026-11-04)

- Add/EditActivityForm replace native start/end time inputs with one AppTimePicker mode=range. Base also supports single times. MUI Community MultiSectionDigitalClock uses 24h/one-minute steps, draft/apply/cancel, endpoint selection and optional clearing. Preserve HH:mm payloads, optional partial times and the existing same-day end>=start rule. AppPickerField shares the date/time input scaffold. Four time tests and the five calendar tests pass; Chrome fixture checks 320×568/390×844/390×400/768×844/1440×900, interaction, clearing, invalid order, midnight, keyboard/disabled and date-field reuse. No runtime exception. See docs/calendar.vi.md.
- User clarified page loading must not cover ready navigation. AppPageLoadingProvider now lives inside AppShell main; GlobalLoadingHost registers there. Top/bottom bars and form/dialog hosts are outside the scope. Content stays mounted under hidden/inert while a Flexbox content-scope indicator shows; no global backdrop. Initial-pathname aggregation/150ms sealing/local refetch/visit IDs remain.
- Startup is now separate: root AppStartupHost renders AppStartupScreen only through initial hydration, not while API data loads. This supersedes the earlier startup-until-page-settles behavior. Account/policy gates and protected-query timing remain unchanged.
- Loading Chrome fixture uses actual shell/navigation/provider with a stub router and simulated pending sections, not backend: one body indicator; usable header/dock; ready body; local refetch; fresh route and A→B→A checks pass at 320/390/768/1440px. SSR startup icon test, TypeScript/scoped ESLint/diff checks pass. No smoke test, real backend writes, live authenticated-flow or physical-device verification. See docs/ui-refresh-loading.vi.md.

### Flat member sheet and footer invitation (2026-11-04)

- TripMembersDialog follows the user's reference: count in header, short description, flat avatar/name/role/email rows with dividers and right-side action menus. Theme-aware compact RoleBadge uses applyStyles for readable dark colors. AppActionMenu's opt-in minTouchTarget gives member menus 44px targets.
- Full-width neutral pill Invite member lives in AppDialog actions outside the scrolling list. Invitation form opens in a separate shared dialog/sheet; removes duplicate form card/header, retains email/role validation/payload, gradient Send action, pending state and initialShowInvite behavior. Existing member-role/approval/remove/leave permissions and callbacks remain.
- Shared AppDialog adds opt-in showSheetHandle (decorative, mobile sheet only; no swipe dismissal). Other consumers/defaults unchanged. Empty member list uses shared AppEmptyState. VI/EN count label and compact header copy updated.
- TypeScript/scoped ESLint/diff checks pass. Independent Chrome fixture uses actual member components with stubbed hooks/mutations: 320×568/390×844/390×400/768×844/1440×900 in light/dark, long list/email, sticky-outside-scroll footer, invite open/close/empty validation/success payload, Owner/Vice/Member actions, loading/error/empty and EN labels all pass; no runtime exceptions. Mobile dark screenshot inspected. No smoke test/backend writes/live invitations. See docs/member-sheet.vi.md.

- Member invitation button theme correction (2026-11-04): user clarified the reference supplies layout, not custom CTA colors. Footer Invite member now uses AppButton intent=primary with the shared primary.main -> primary.light gradient and shared hover/active/disabled styles. Removed inverse neutral color overrides; retained full width, pill shape and 44px target. Scoped ESLint/diff checks pass; no smoke test.

### Quick-create AI entry uses itinerary planner (2026-11-04)

- AI currently generates an itinerary for a selected trip. QuickCreate now opens `/ai` directly instead of opening CreateTripDialog in AI mode.
- VI/EN menu labels describe itinerary generation. Manual trip creation stays on the existing shared create-trip action; users without a trip can create one from the AI page.

### Direct home trip creation replaces quick-create menu (2026-11-04)

- User approved replacing QuickCreate dropdown with a primary “Tạo chuyến đi” / “Create a trip” button and Add icon. Both overview placements open the existing shared trip dialog directly; retain full-width mobile placement and theme gradient.
- This supersedes the previous QuickCreate AI menu entry. Templates remain accessible through home/explore links; AI remains in the trip itinerary actions and existing AI page.

### Itinerary PNG export replaces browser printing (2026-11-04, latest clarification)

- Implemented `/export/plan/{tripId}` and redirect from legacy `/print/plan/{tripId}`. Plan menu uses image icon and localized Export itinerary images label; removed unused window.print component.
- One day produces one 1080px-wide PNG including rest days, with content-driven height, actual trip cover/dark overlay, theme colors and the project's computed Comfortaa font. Activity thumbnails are unavailable in the current data model. No separate cover page.
- User explicitly requires separate image downloads, no ZIP: Download all images initiates one PNG download per day; retain individual download buttons for browsers restricting multiple downloads. This supersedes the ZIP requirement above.
- Full includeActivities=true plan data preserves all activity order and notes. Generation is local, cancellable between days, cleans up object URLs, reports cover/CORS errors and refuses oversized canvases without truncation.
- Implementation/limits/checks: docs/plan-image-export.vi.md. Skip smoke tests.

### Product name correction (2026-11-04)

- The product is named Trip Plan, not TripBudget. Use Trip Plan in all new product copy, explanations and documentation. Existing tripbudget service/module/directory identifiers are technical names and must not be renamed as part of a UI branding correction.

### Export font-loading failure fixed (2026-11-04)

- Reproduced generic export failure in Chrome with real project font/theme/component: FontFaceSet.load on the full computed font-family rejects when the next/font local Arial fallback cannot load.
- Shared loadCanvasFont loads only the primary project family (400/700), waits for fonts.ready and returns the full stack for Canvas. Actual primary-font failure uses localized fontError.
- Verified mocked three-day trip in Chrome: three 1080×1350 PNG previews, three individual PNG downloads from Download all, no runtime exceptions. Three font regression checks and four rendering checks pass. See docs/plan-image-export.vi.md; do not claim this verifies production trip covers/CORS.

### Export TypeScript readability (2026-11-04)

- User asks for easier-to-read export .ts files. Prefer meaningful variable names, named option objects over positional booleans, explicit interfaces, named limits and short Vietnamese comments explaining non-obvious behavior.
- Rendering now reads as prepare text → determine height → draw background → draw text → create PNG, with small helpers in the same module. Base font/download helpers use descriptive names and are exported through utils/index.ts.
- Keep observable behavior and avoid new libraries/classes. Verified identical layout commands for 0/1/15 activities and identical first-day PNG bytes, plus three separate PNG downloads in a real Chrome fixture.

### Expense split allocation UI (2026-11-04)

- User prefers plain, explicit actions instead of wand/pencil imagery for allocation. Replaced AutoFixHigh icon button with the localized “Điền phần còn lại” / “Fill Remaining” text action below the exact-amount input, minimum 44px height.
- Shared SplitAllocationSection now uses flat member rows with dividers, full-width mobile amount fields and a 190px desktop field. Removed nested card borders/background; retained allocation status feedback and existing calculation/selection behavior for add/edit expense forms.
- Added accessible member checkbox and exact-amount field names. Verified TypeScript, targeted ESLint and diff whitespace; no new tests for this presentation-only change, per task scope and skip-smoke instruction.

### Spending category chart (2026-11-04)

- Added CategorySpendingChart after budget metrics and before the expense table. Reuses AppCard/AppLinearProgress and theme colors, with descending positive category totals, exact amounts and localized shares of all category spending.
- Uses the existing budget summary across the whole trip; expense-table pagination/filters do not change this chart. Shows an empty state for no spending and suppresses chart content on summary errors/stale trip data.
- Existing category limits and budget actions remain in an expandable “Budget details by category” section to avoid repeating the category list on initial view. No backend or settlement-page changes.

### Spending donut replaces category bars (2026-11-04)

- User approved donut with total spending at center and selectable legend. Select a category to show its amount/highlight its segment; click again or Show total spending to reset. Each legend action has aria-pressed, full monetary value and percentage; SVG has a readable accessible name.
- Use CATEGORY_CONFIG shared with CategorySpendingList for matching category colors across donut, legend and budget cards, as explicitly requested. Keep sorted whole-trip category totals; reset selection when trip changes.
- Removed duplicate total amount and stacked multicolor share bar from the expandable budget section. Renamed its heading to Category budget limits; preserve limit controls/warnings and individual category details.
- Verified targeted ESLint/TypeScript and Chrome fixture with matching five-category data: total/selection/reset, matching segment/legend colors and no horizontal overflow at 320/390/768px. No new chart dependency.

### Donut total action remains enabled (2026-11-04)

- Removed disabled={!selectedItem} from Show total spending after user feedback. The action always resets category selection to null, including when the total is already shown; keep the control visually available.

### Donut legend toggles total without a separate button (2026-11-04)

- User prefers removing Show total spending. Clicking the selected legend category again clears selection and restores the center total; choosing another category switches directly. Removed the redundant button and its VI/EN strings. This supersedes the previous always-enabled total action.

### Donut legend clears visual selection on toggle (2026-11-04)

- Legend buttons disable ripple and override hover/active fill to match the actual selected state. Deselecting returns to transparent even while the pointer stays over the button or mobile retains :hover; preserve keyboard focus-visible outline.
- Scoped to category chart legend; shared AppButton behavior stays available elsewhere.

### Friendly expense section copy (2026-11-04)

- Simplified expense page section titles and visible budget labels in VI/EN: Where did your money go?, Budgets by spending group, Your expenses, Planned budget, Spent so far and Budget remaining.
- Prefer everyday wording over consumption/deficit/under-control jargon; keep planned budgets distinct from actual spending and preserve interpolation placeholders. Scoped to expense copy without changing calculations or layout.

### Friendly settlement copy (2026-11-04)

- Shortened settlement VI/EN headings, statuses, descriptions, form labels, validation and deletion/toast messages. Use Split costs, Who pays whom?, Everyone’s share, Payments recorded; avoid debt/settlement/accounting jargon in user-facing Vietnamese.
- Record a payment / Save payment explicitly records money already paid rather than suggesting the app transfers money. Deletion removes the record and recalculates balances; it does not reverse a bank transfer.
- Member totalOwed is the assigned expense share, labeled “Phần cần góp” rather than suggesting it is the outstanding balance. Net balance/status remain distinct. No calculation or permission changes.

### Map providers: Vietmap with OSM fallback (2026-11-05)

- User requests Vietmap as primary after Google Maps Platform billing region rejection; fallback to OSM when missing configuration, errors or no results. This supersedes the Google-only API direction.
- Server-only VIETMAP_API_KEY uses Autocomplete/Search/Place/Matrix v4. NEXT_PUBLIC_VIETMAP_TILE_KEY is a separate domain-restricted tile key. Keep the single .env workflow.
- OSM autocomplete uses Photon, not public Nominatim; routes use OSRM. Preserve authentication/policy gates, cancellation, provider attribution, real distances only and optimization failure on incomplete routes. Public fallback is rate limited per process; use managed/self-hosted endpoints with shared limits for production scale.
- MapLibre renders Vietmap with OSM raster/iframe fallback. Existing external Google Maps links, Google login and Gemini remain independent. Setup, limitations and validation: docs/maps.vi.md. Skip smoke tests.

### Vietmap backend integration review (2026-11-05)

- All dynamic map endpoints use requireMapsAccess (existing Identity/policy verification plus production HTTPS enforcement), validate input and consume shared per-session/per-process budgets before provider calls. Rate limiting covers Vietmap and OSM; matrix budgets count origin×destination elements. Return 429/Retry-After instead of switching provider to bypass the BFF limit.
- Vietmap server calls explicitly use GET with apikey query, HTTPS and redirect:error. Service keys stay server-only; tile key remains the documented browser exception. Matrix POST is the internal BFF contract; upstream Matrix requests remain GET.
- Stream-limit matrix bodies to 96 KiB. HTTPS terminated by a trusted proxy requires explicit MAPS_TRUST_PROXY=true and a proxy that overwrites forwarded headers; production TLS configuration remains a deployment responsibility. Rate counters are per process, not Redis/distributed. Details and tests: docs/maps.vi.md.

### Separate backend owns maps (2026-11-05, latest clarification)

- User explicitly means Spring Boot Core as Your Backend Server. This supersedes the earlier Next.js-provider implementation. Current flow: Web → Next.js transport BFF → Core MapsController/MapsService → Vietmap or OSM. Do not put provider orchestration/key/rate counters back in Next.js.
- VIETMAP_API_KEY moved to Core .env and removed from web. Web uses private CORE_SERVICE_URL and optional domain-restricted NEXT_PUBLIC_VIETMAP_TILE_KEY. Existing service key values were not printed.
- Map BFF forwards HttpOnly cookie access token as Bearer, unwraps Core ApiResponse success and preserves policy/provider/rate errors. Core owns JWT/session/policy, verified user IDs, request budgets, input validation, provider clients and OSM fallback.
- BFF keeps transport HTTPS/body bounds only. Map display/tile exception and external Google Maps links remain. Restart Core and web after configuration migration. Details: docs/maps.vi.md and ../trip-budget/tripbudget-core/docs/maps.vi.md. Skip smoke tests.

### Place search provider labels (2026-11-05)

- User asks to remove OSM/VIETMAP tags from location suggestions because they clutter forms. Remove per-option provider labels in activity and trip destination inputs. Shared AppMapSearchPaper shows copyright once at dropdown footer via AppMapSearchSourcesContext; API source metadata remains. Keep map/route attribution separate.

### Maps code readability (2026-11-05)

- User asks to refactor actual maps code for beginners/Junior following existing project conventions. Prefer descriptive business names, props interfaces and named async steps; keep provider logic at Core and existing API/UI behavior.
- Core map DTOs now follow dtos/request and dtos/response with Request/Response suffixes, replacing MapsData. Web BFF still receives the same JSON contract. Reading guide: docs/maps.vi.md and the linked Core guide.

### Google Maps preview restored (2026-11-05, latest)

- User requests Google Maps preview in the Map tab. AppLocationMap uses the existing project Google iframe URL via getGoogleMapsEmbedUrl; no geocode hook, MapLibre load, service key or tile key in this active preview path.
- This supersedes Vietmap/OSM rendering for the current preview only. Core search/geocoding/matrix still use Vietmap with Photon/OSRM fallback. Keep AppInteractiveMap available; do not move backend API logic into browser or introduce Google Platform keys for this scoped change.
- Beginner file/flow walkthrough: docs/maps.vi.md. Tests verify address/locale encoding, blank state, no geocode import and no service-key exposure. Skip smoke tests/browser checks per project instructions.

### Duplicate distance requests on load (2026-11-05)

- DayTimelineList follows useQueryGet conventions: ref updated in an effect, route-content key instead of array-reference dependency, zero-delay scheduled fetch canceled by cleanup. Preserve refresh for trip/day, ordered activity IDs/locations, language and destination context.
- mapService shares only identical in-flight matrix promises; remove entries on success/failure. Do not cache completed results/localStorage or disable React Strict Mode to hide duplicate effects. Keep consumers' stale-result guards; closing one consumer must not abort a request another is awaiting.
- Regression tests cover effect replay, metadata-only rerenders, changed route inputs, unmount, request coalescing and retry after rejection. docs/maps.vi.md explains flow/limits.

### One .env workflow restored (2026-11-05)

- User wants local and production to use .env. Restored missing scripts/next.mjs already referenced by package scripts, with scripts/env-files.mjs guarding against .env variants except .env.example. Keep Next's own parsing/expansion and normal OS-env precedence; do not invent a custom dotenv parser or silently clear inherited process environment.
- Each service/machine has its own .env values. Do not commit, print, overwrite actual secrets or bake them into Docker images. Git/docker ignores allow .env.example only. Production public variables require build-time configuration and rebuild after changes.
- Core already imports local .env relative to working directory. Docker runtime should mount /app/.env read-only; image no longer forces PORT=8081 over the file. Core default remains 8081 in application.yml.
- docs/environment.vi.md explains local, production, Docker, precedence and Junior reading flow. tests/env-files.test.mjs uses fixtures and mocked CLI, no smoke tests.

### Native Next.js commands, no env wrappers (2026-11-05, latest)

- User explicitly asks to remove scripts/next.mjs and scripts/env-files.mjs after Vercel build failed due to missing ignored .env. package scripts now use next dev/build/start directly. Removed wrapper-only tests; do not restore mandatory-file guards.
- Local/self-host can keep a single .env by convention. Vercel uses platform Environment Variables and does not need the physical file. Standard Next env-file/OS precedence remains; do not commit secrets or generate .env from secrets during build.
- docs/environment.vi.md contains the current Vercel/local setup and supersedes the earlier wrapper workflow. This change does not claim an actual Vercel deployment has passed.

### One Spring Boot backend (2026-11-06)

- User authorized migration of both NestJS Identity and Python AI into Spring Boot while preserving business behavior. Next.js remains the BFF.
- All server routes/helpers use src/base/api/server/backend.ts and server-only CORE_SERVICE_URL (no /api suffix). Do not restore runtime Identity/Python URLs or internal AI keys, including NEXT_PUBLIC variants.
- Browser-facing routes, response envelopes, refresh handling and cookie paths remain. Scanner forwards the caller's Bearer token to Spring; Spring now performs AI processing and policy/session validation.
- Migration/configuration, retained legacy semantics and limitations: ../trip-budget/tripbudget-core/docs/single-backend-migration.vi.md. BFF regression tests: tests/single-backend-bff.test.mjs alongside tests/auth-refresh.test.mjs. Skip smoke tests.

## Shared error state (2026-11-06)

- User requires one common error message, centered horizontally and vertically on mobile AND desktop. Use AppErrorState; do not add resource-specific error titles/descriptions. Full account gate centers the card and logout as one group across the viewport. Page errors center within the available main content; compact errors stay inside their popup/section.
- Preserve query retry callbacks, pending protection, 403/404 recovery navigation, and inline form validation/mutation errors. Keep primary button gradient. Implementation and checks: docs/error-states.vi.md. Skip smoke tests.

### Plan status, expense linking and route saves (2026-11-09)

- User requires activity.status to remain authoritative; never derive/reset completion from expenses on reads or expense writes/deletes.
- Expense create/update links through ExpenseService → PlanService in the existing expense API transaction. PlanOverview uses feature hooks; status/checklist toggle use PATCH. Preserve receipt-upload hook behavior.
- Route order uses one batch API with complete unique day IDs; orderIndex precedes startTime. Route optimization minimizes distance heuristically, keeps chosen start, does not change hours; never claim globally shortest. Details and checks: docs/plan-consistency.vi.md.

### Trip dates and finance UI (2026-11-10)

- TripService synchronizes PlanDay dates via PlanService.synchronizeTripDates within its update transaction. Preserve day/activity IDs and order; soft-hide empty trailing days; reject occupied removed days with 409 TRIP_DATES_HAVE_ACTIVITIES. Restore hidden days on extension to preserve unique trip/day numbering. Keep the existing 30-day generation cap. No live migration.
- useTripPlan includes context tripsVersion to refetch after trip edits. Display dates consistently as DD/MM/YYYY, including day tabs (date only); API/form ISO dates remain. Parse date-only strings as local calendar dates.
- Remaining budget: neutral without a budget, warning at <=15% remaining, error at <=0. Shared getBudgetBalanceTone and AppMetricValue warning tone. Activity and finance summary money uses spent / estimate-or-budget.
- Temporarily hide route optimization/reset controls. Map tab now spans content width at all sizes; retain existing Google iframe single-location preview with a stop selector, not a multi-marker map.
- Mobile expenses/settlements reuse AppFinanceRow; AppTable renderMobileRow preserves controls, sorting/filtering/pagination and permissions. Desktop financial tables remain. Details, tradeoffs and validation: docs/trip-date-finance-ui.vi.md. Skip smoke/browser tests.

### Shared finance rows and itinerary readability (2026-11-10, feedback)

- User explicitly requires reusable responsibilities in base, with one shared implementation across features. AppFinanceRow now serves recent expenses, Finance, payer/split rows and settlement views; amountCaption handles percentage/status below money. Long names/emails wrap, subtitles use full content width, avatars do not shrink. Read-only rows use div, not disabled buttons.
- AppAmountRatio centralizes spent / budget-or-estimate at activity and mobile/desktop finance summaries; highlighted activity money uses palette background and larger spent value. AppStatusChip centralizes readable wrapping status labels; category chips and AppSectionHeader also handle long labels.
- AppTimelineRow leading/railWidth exposes a 64px time rail in ActivityTimelineCard. Time is left of activity title, route distance is a full-width intervening row; remove Fix map link, retain directions and honest unavailable/estimated states. Reuse these components in Home/planner/public/template consumers; do not duplicate itinerary UI in each screen.
- AppSectionLink is the shared lightweight heading navigation for itinerary/expenses; replace the large footer navigation action. Show the short recent-expense section directly instead of the Home show/hide trip-details button.
- Remove repeated trip name/destination from ExpenseOverview and trip badge/subtitle from SettlementOverview. Header/context remains authoritative for selection and permissions.
- Currency utility formats missing/invalid values through numeric-zero formatting to avoid mixed 0 VND vs 0 ₫. Detail dialog uses shared rows, one scroll region and existing marked mobile footer actions. Flow/tradeoffs/verification: docs/trip-date-finance-ui.vi.md. Skip smoke/browser tests.

### Itinerary reference layout (2026-11-10, latest)

- User asks to reference only the supplied left-track + distance/duration layout, not copy place images/ratings/prices. This supersedes the 64px time rail above.
- AppTimelineRail is the shared base for marker rows and route connectors: default 28px, dashed continuous track, hasPrevious/hasNext. AppTimelineRow puts bordered activity content beside it; time precedes the title inside the content. AppCategoryIcon size=24 here, default 40 elsewhere.
- Distance left and duration right between activity cards; wrap groups at narrow widths. Use neutral route/clock icons, preserve actual directions link, estimated/unavailable states. No invented walking mode or distances. Planner/Home/template cards share ActivityTimelineCard; no per-page layout clones. See docs/trip-date-finance-ui.vi.md. Skip smoke/browser tests.

### Logout button color (2026-11-10)

- Shared SidebarUserMenu uses AppButton intent="danger" for logout: red theme text/icon, subtle red background and existing hover/disabled behavior in both menu placements. No custom duplicated styles or logout-flow changes.

### Activity spending highlight (2026-11-10)

- ActivityTimelineCard passes success to shared AppAmountRatio when actualSpent equals a positive estimatedCost, making the amount/background green. Under estimate remains primary; over estimate remains error; missing/zero estimate never implies paid in full. This visual rule does not change activity.status.

### Route duration and alignment (2026-11-10, latest)

- Shared base formatDuration converts seconds into localized hours/minutes with Intl.NumberFormat unit formatting (60 min -> 1 hour). mapService normalizes each matrix duration.text from numeric seconds; raw provider minute text must not bypass the formatter. Keep numeric values, sources and isEstimated untouched; legacy service formatter export delegates to base.
- Distance and duration share AppIconText (13px text/20px line height, 16px icon, center alignment); place the estimated label on its own full-width line below both metrics.
- AppTimelineRail marker now starts at the activity card top edge; remove the former 12px top spacer and obsolete hasPrevious props. Dashed continuation still uses hasNext and marker-free connector rails. Supersedes previous top-spacer/hasPrevious notes.
- Validation: TypeScript, scoped ESLint and tests/route-duration.test.mjs (minute/hour boundaries and raw-provider normalization). Skip smoke/browser tests.

### Timeline rail contrast (2026-11-10)

- Latest user request reverts the contrast adjustment: shared AppTimelineRail uses the previous 1px dashed divider border. Keep the current timeline layout and other changes; do not restore the rejected 2px text.secondary style.

### Home upcoming action and countdown (2026-11-10, applied)

- User approved trying the proposed Home hierarchy: banner with countdown → one next activity/empty-plan action → budget + three recent expenses → community templates last. Replace the multi-day/three-activity Home preview rather than add more sections. Remove the unrelated create-trip footer in the selected trip budget; keep existing creation entry points elsewhere.
- Shared base useCurrentTime updates at minute boundaries/focus, with no server-time hydration assumption. Base date helpers use Asia/Ho_Chi_Minh and calendar-day differences; trip currently has no destination timezone. TripCountdown/feature trip-timing decide before/today/active/last-day/completed/cancelled copy; never mutate status.
- Home uses existing full plan API includeActivities=true and a Plan feature selector across all days, excluding completed/skipped/past records. Explicit in-progress today first, then current scheduled window, then future timed/untimed records. Planned current windows say On the schedule now, not an inferred status. Do not reorder stored routes or derive status from expense totals.
- Reuse ActivityTimelineCard compact, AppEmptyState/Card/SectionLink and AddActivityDialog/useCreateActivity; Home must not duplicate activity cards/forms. Empty-plan actions respect canWrite/canManage. Freeze target day when opening Add; shared dialog planDate displays dd/mm/yyyy in Home and planner. Completed/cancelled trips do not get planning CTAs.
- /plan supports dayId so the Home link opens the selected activity's day via PlanPage → TemplatePlanEntry → PlanOverview initialDayId. Invalid IDs retain fallback and existing server authorization.
- Details, tradeoffs and verification: docs/home-priorities.vi.md. tests/home-priorities.test.mjs covers calendar and next-activity behavior. Skip smoke/browser tests; no backend/schema changes.

### Section link tap highlight (2026-11-10)

- User reports a blue rectangular highlight on View itinerary and asks to prevent it on similar actions. AppSectionLink now composes NextLink with MUI ButtonBase (disableRipple), inheriting the shared transparent native tap highlight and userSelect:none resets already used by app navigation/buttons. Preserve anchor navigation, 44px touch area, hover underline and visible keyboard-focus outline. Apply through base rather than per-feature CSS; do not disable text selection globally.

### Consistent section-heading navigation (2026-11-10)

- User points out differing View all typography/arrows between Recent expenses and Popular destinations. TemplateLibrary compact heading now uses AppSectionLink, matching the other Home section links for 13px type, chevron, spacing, 44px touch area and hover/focus/tap behavior. Do not hand-style another AppButton for this same heading-navigation responsibility. Keep primary form actions as AppButton.

### Section links without underline (2026-11-10, latest)

- User requires no underline on section links. AppSectionLink keeps textDecoration:none in normal, hover, active and focus states; retain the visible keyboard-focus outline and shared chevron/touch styling. This supersedes the earlier hover-underline preference.

### Planner floating add and compact library filters (2026-11-10, latest)

- User requests floating Add activity bottom right and fewer competing planner actions. AppFloatingActionButton is base over AppButton (preserve primary gradient); above mobile dock via existing spacing/safe-area variables, below modal z-index. AppPageContainer floatingAction slot reserves 72px extra bottom clearance only when used. PlanOverview owns permission/day/loading/error guards and opens the existing AddActivityDialog. Remove duplicate header Add.
- PlanHeader now has small AI action and More menu for templates/checklist/logs/export/share/publish; preserve rights/callbacks. This supersedes previous standalone Publish/Use template placement and mobile icon-label actions. Do not recreate floating scaffolding per feature.
- Library filters show search + Filters button, then shared day chips 1/2/3/4+. Clicking selected chip clears duration; no selection means all. Style/sort in shared AppDialog; query debounce/page reset preserved. Base chips expose aria-pressed/group labeling and minimum 44px touch dimensions.
- 4+ sends minDuration=4 to Core, not duration=4 or client-side page filtering. Core controller/service/criteria/repository apply >= before count/pagination. Exact duration remains supported; conflicting/nonpositive filters rejected. Deploy/restart Core before web uses the new bound.
- Details/tests/limitations: docs/planner-actions-library-filters.vi.md. Skip smoke/browser tests; no live migration/DB changes.

### Home empty itinerary compact layout (2026-11-10)

- AppEmptyState has opt-in compact: small icon beside left-aligned title, reduced padding; default centered states stay available. Home TripItineraryPreview reuses it for empty/no-next states.
- Mobile Add activity fills the row; AI is a text action below. From sm use a wrapping row. Preserve 44px tap height, primary gradient, existing permissions and creation/AI flows. See docs/home-priorities.vi.md. Skip smoke/browser tests.

### My trips create floating action (2026-11-10)

- MyTrips uses the shared AppFloatingActionButton in AppPageContainer.floatingAction, matching the planner bottom-right placement, safe area and bottom-navigation clearance. Remove the duplicate header creation action; reuse openCreateTrip and existing translated createNew label. Page container reserves bottom space. Empty-state creation remains available.

### Home empty itinerary list treatment (2026-11-10, latest)

- Supersedes Home compact layout above: TripItineraryPreview uses centered shared AppEmptyState in a dashed bounded area with 16px padding. Add activity has content width below the message; AI stays a secondary text action below. Preserve 44px tap targets and existing flows. AppEmptyState compact remains available; do not duplicate empty-state markup.

### Mobile table filter sheet and section header height (2026-11-10)

- AppSectionHeader must use auto flex-basis for its title in mobile column layout: 160px basis becomes vertical height when stackActionsOnMobile is true. Retain 160px wrapping basis for row layouts.
- AppTable mobile finance rows use a 44px filter icon next to the header; replace inline horizontal column controls with shared AppTableControlsDialog composed from AppDialog/AppSelect/AppTextField. AppDialog supplies bottom-sheet motion on mobile. Draft sort/filters apply together only on Apply; close discards, Reset clears drafts. Existing desktop headers, server filtering/pagination and permissions remain. Details: docs/mobile-table-filters.vi.md. Skip smoke/browser tests.

### Finance filter density and divider (2026-11-10, latest)

- User rejects placing the whole filter form directly in the expense list. Keep header filter icon; AppTableControlsDialog hosts shared AppTableFilterBar, using search and compact filter dropdown styles like TripFilterBar. Mobile sheet / desktop dialog from existing AppDialog. Draft Apply/Reset behavior remains; no per-keystroke requests. AppSelect filter variant supports multi-select labels.
- AppTable owns the divider around the full header row including its filter icon. Remove ExpenseTable's shorter internal border. Preserve the previous flex-basis height fix.

### Preparation checklist sheet layout (2026-11-10)

- ChecklistDialog title is concise Trip preparation (VI/EN), maxWidth sm, existing AppDialog sheet handle. Hide generic subtitle and 0/0 progress when empty. When populated show prepared count and percentage with shared AppLinearProgress; success only for a nonempty completed list.
- AddChecklistForm uses a labeled full-width item field, short example placeholder, then category + 44px Add action in one flex row. Reuse AppTextField/AppSelect/AppButton; preserve readOnly and payload. Guard submits while loading.
- Empty checklist uses shared AppEmptyState compact with dashed boundary. Remove inner fixed-height scroll: AppDialog owns the scrolling region so form/list scroll together. Details: docs/checklist-sheet.vi.md. Skip smoke/browser tests.

### Optional searchable selects (2026-11-10)

- AppSelect supports searchable=false by default and optional searchPlaceholder. Enable per consumer, currently checklist category only. Preserve form/filter/compact styles, SelectChangeEvent values and multiple selection; no automatic app-wide enablement.
- Search is local against option labels, accent/case-insensitive via base matchesSearch (including Vietnamese đ). Keep all option values mounted, hide/disable unmatched rows to retain selected values and avoid out-of-range warnings. Search header is nonselectable; Enter while typing must not submit surrounding forms, arrow keys focus visible options, Escape/Tab keep menu dismissal. Reset query on normal open/close. No search UI for native Select.
- Search copy lives in select namespace VI/EN; no server requests. Details: docs/searchable-select.vi.md. Unit tests tests/select-search.test.mjs cover normalization; skip smoke/browser tests.

### Search directly in select field (2026-11-10, supersedes menu search)

- User clarifies searchable means an editable select field, not a search input inside an opened menu. AppSelect routes searchable=true to internal AppSelectInput (MUI Autocomplete); leave normal/native Select path unchanged. Checklist category remains opted in.
- Type directly to filter local option labels via matchesSearch, including accentless Vietnamese; do not enable freeSolo or commit typed queries. Preserve numeric/string/multiple values, SelectChangeEvent target.value/name, disabled/readOnly/helper/error and controlled selection/open props. Memoize resolved option arrays. Input label is display text; hidden named field retains raw stored values for native form submission.
- Use installed MUI 9 slotProps.input/htmlInput/inputLabel from renderInput params; keep Autocomplete refs/handlers. No more ListSubheader/menu search. tests/select-input.test.mjs verifies selection/event/form adapters without browser tests. Details docs/searchable-select.vi.md.

### Anchored select menus in short forms (2026-11-10, latest)

- User prefers the referenced anchored dropdown that opens above the field when needed, and asks why select variants differ. Supersedes the proposed extra mobile picker: do not add another selection sheet. AppSelect remains the shared facade; plain Select and searchable Autocomplete use their respective underlying controls.
- Plain form/filter/compact menus compose shared useSelectMenu: choose above/below from anchor + visual viewport space, cap at 280px, keep 16px viewport clearance, scroll options. Use Menu variant=menu so selected-item alignment does not shift the popup across the field. Preserve callbacks and caller slot props; recompute on viewport resize/scroll.
- AppSelectInput keeps direct editing and Popper flip/preventOverflow with shared limits; cap list height at min(280px,40dvh). Existing selection/search semantics and filter draft/apply stay intact. tests/select-menu.test.mjs covers constrained sides/viewport offsets. Details docs/searchable-select.vi.md. Skip smoke/browser tests.

### Planner actions beside title (2026-11-10, latest)

- PlanHeader uses shared AppPageHeader.titleActions so AI + icon-only horizontal ellipsis align with the Lịch trình title, with summary/cost below. Existing actions slot remains available to other pages. AppActionMenu triggerIcon configures the icon, minTouchTarget ensures 44px, ariaLabel is translated Itinerary actions. Default icon triggers now expose menu/expanded/controls semantics.
- Below 360px viewport width, move AI into the same menu; otherwise keep it beside the title. Preserve readOnly and existing handler guards for AI/share/publish/logs/export/checklist/templates. Add activity stays in its floating button. No duplicated planner actions component. See docs/planner-header.vi.md. Skip smoke/browser tests.

### Product name Vi Vu (2026-11-10)

- User renamed the product Vi Vu. Use that spelling in both VI/EN UI, app/PWA titles, install/startup copy, public share metadata, policy branding and OTP mail. Web metadata/manifest use base APP_NAME; translated UI keeps existing message keys.
- Internal repository/package/artifact identifiers, API routes, database/schema, cookie/storage keys and PWA id/scope stay compatible. This is a product-name change, not an infrastructure or logo migration. Details docs/vi-vu-brand.vi.md.

### Home budget mobile height correction (2026-11-11)

- Reported on iPhone XS Max: budget cards extend behind recent expenses. OverviewDetails uses content-sized, nonshrinking sections on mobile and equal flex columns from md. Compact TripBudgetCard uses a stretched flex row with flexible content instead of nested percentage heights in an auto-sized grid. Preserve three equal-width metrics and existing data/formatting.
- Verify ESLint and TypeScript; skip smoke/browser tests as requested. Actual Safari/device rendering remains to be confirmed: all three values must be visible above recent expenses, including with larger text and wrapped labels.

### Finance floating creation actions (2026-11-11)

- ExpenseOverview and SettlementOverview use AppPageContainer.floatingAction with shared AppFloatingActionButton for Add expense and Record payment. Remove the header duplicates; retain existing canWrite guards, form callbacks and manager budget action. Shared component owns safe-area/dock clearance and responsive labels; page container reserves bottom space. Details: docs/finance-floating-actions.vi.md. Skip smoke/browser tests.

### Member role save label (2026-11-11)

- EditMemberRoleDialog uses members.saveChanges (VI: Lưu thay đổi; EN: Save changes). InviteMemberForm retains members.sendInvite. This is a label correction only; preserve role permissions and submit flow. Skip smoke/browser tests.

### Budget sheet readability (2026-11-11)

- SetBudgetDialog uses existing AppDialog actions outside scrollable content, with useId/native form association for Save and mobile sheet handle. SetBudgetForm owns values/validation; guard duplicate submits during loading and disable edits. Preserve calculation/payload behavior.
- Short VI/EN title and allocation labels; allocation amount gets its own wrapping row and shared AppLinearProgress. Mobile inputs use 16px text, persistent category labels and no automatic keyboard focus. Existing AppDialog owns safe areas and scrolling.
- Scoped ESLint and TypeScript pass. Skip smoke/browser tests; actual iOS keyboard/viewport behavior remains to be checked on device.

### Receipt scan section (2026-11-11)

- ReceiptScanBanner uses a short translated title, no subtitle and two equal shared buttons: Take photo / Choose file. Use 44px targets, wrapping labels, minWidth 0 and flex wrapping for narrow screens/large text. A single live status announces scanning; actions are disabled while pending. File selection uses a keyboard-accessible native button with a hidden input ref; retain camera, image/PDF scanning, attachment and error behavior.
- Scoped ESLint and TypeScript pass; skip smoke/browser tests. Device rendering and real camera/provider calls remain unverified.

- Receipt scan surface preference: user chose to keep the original gray theme surface (action.hover; action.selected while scanning and behind the icon). Preserve the compact layout, divider border, primary icon and text wrapping.

### Illustrated iPhone installation guide (2026-11-11)

- AppInstallButton opens an AppDialog sheet containing IOSInstallGuide for iOS: three inline SVG schematic illustrations, actual Vi Vu icon, highlighted Share/Add to Home Screen/Add controls, translated labels and image descriptions. Respect theme colors and wrapping; explain iOS/version differences and Safari fallback. Reuse existing footer and scrolling. No image-generation dependency or external image requests.
- Android native prompt and install-store lifecycle are unchanged; installation still requires browser support and user confirmation. Details: docs/pwa-guide.vi.md. Scoped ESLint, TypeScript and diff checks pass; skip smoke/browser tests. Real OS installation remains unverified.



- Safari guide refinement: SafariInstallIllustration reconstructs iOS 18 light-mode Safari toolbar, Share actions and Add to Home Screen confirmation. Use fixed OS colors inside illustrations, theme-aware surrounding guide, VI/EN labels, red target outlines and actual Vi Vu logo. Explicitly label reconstructions, not real screenshots or universal iOS layout. Demo has been removed at user request; only iOS opens the guide, supported browsers open the native install prompt. Scoped lint/TypeScript pass; no browser/device validation.

### Inline itinerary map (2026-11-12, user clarification)

- User only wants the existing map visible without switching tabs. PlanOverview now shows PlanMapPanel above day tabs and timeline in one column at all sizes; remove timeline/map toggle state and buttons. Preserve single-stop Google iframe, selector, pagination, day reset and existing permissions/actions.
- PlanMapPanel uses standard AppLocationMap height (320px mobile / 400px desktop). No two-column rollout or multi-marker/provider change. Details: docs/trip-date-finance-ui.vi.md. Skip smoke/browser tests.

### Multi-stop itinerary map (2026-11-12, latest clarification)

- User explicitly wants numbered stops and connecting lines like the reference plus a similar map UI. This supersedes the single-stop constraint for PlanMapPanel only. Keep the inline one-column layout; no map/timeline toggle.
- Extend shared AppInteractiveMap with MapStop[], selection and fit-all support, retaining its single-coordinate consumers. Use installed MapLibre, configured Vietmap tiles and existing OSM fallback. Route mode must report unavailable/retry rather than silently falling back to a single-marker iframe.
- Feature hook usePlanMapStops resolves loaded activities via existing /maps/location BFF/Core sequentially, shares identical in-flight requests, guards stale results and stops on request failure. No provider orchestration moves out of Core. Keep original activity numbering and explicit load-more/missing-location feedback.
- Draw straight visit-order segments only between adjacent resolved activities; disclose that they are not road directions. Selected stop details retain an external Google Maps link. Keep other AppLocationMap previews unchanged. Docs: docs/maps.vi.md. Unit tests: tests/map-route.test.mjs. Skip smoke/browser tests.

### Activity images (2026-11-12)

- AppImageUploader adds optional tile layout; AppTimelineRow.media slots the shared uploader into ActivityTimelineCard. Planner and Home select/replace/remove photos according to existing permissions; public cards display only. Keep form-style avatar/cover/receipt defaults.
- ACTIVITY_IMAGE uploads use Core Cloudinary, then claim owned pending uploads transactionally. Activity stores image_upload_id/image_url. Card PATCH updates only the image; edit PUT includes optional imageUploadId/removeImage and preserves existing photo when omitted.
- Apply Core db/manual/V10__activity_images.sql before deploying/restarting Core; not applied to application DB. Template snapshots do not publish/copy activity photos. Old uploads become delete_pending; provider cleanup job remains absent. Flow/tradeoffs/checks: docs/activity-images.vi.md. Skip smoke/browser tests.

### Activity photo tile and pending UI (2026-11-12)

- Shared AppImageUploader tile uses 28px corner controls inside 44px touch targets; remove centered choose text over existing photos. Empty tile retains icon/choose label. Pending shows themed overlay/spinner and Saving photo text, disables selection/removal through disabled || loading.
- ActivityCardImage passes pendingFile for temporary preview across upload + attach; restores saved photo on failure and releases Blob URL after completion. Other field-style uploaders retain their UI. Details: docs/activity-images.vi.md. TypeScript/scoped ESLint; skip smoke/browser tests.

### Unobstructed activity photos (2026-11-12, latest feedback)

- Supersedes corner controls: remove visible change/remove overlays from shared uploader tiles. Click the photo to replace; ActivityTimelineCard includes choose/change/remove in its existing action menu. Keep empty choose placeholder and pending overlay.
- useActivityImage owns feature persistence/preview/error state; base AppImageUploader exposes optional inputRef for the same picker. Disable image menu actions while saving; preserve readOnly and form upload controls. TypeScript/scoped ESLint; skip smoke/browser tests.

### Activity image removal synchronization (2026-11-12)

- useActivityImage must retire its saved local result once server image URL or activity identity changes. Never let an acknowledged upload reappear when a later form edit removes the image and props return to a previous URL/null/undefined. Preserve immediate card preview until server acknowledgment.
- Regression: node --test tests/activity-image-state.test.mjs runs the real hook with mocked state/API for upload → acknowledgment → form removal/replacement and failed save. TypeScript/scoped ESLint; skip smoke/browser tests.

### Remove activity photos through edit form (2026-11-12, latest)

- User reverted hover removal and chose removal through the edit form only. Shared tiles have no remove overlay and activity action menus have no remove-photo item. Click the image or choose/change menu action to upload; edit form retains remove + Save. Preserve pending UI and removal synchronization fix.


### LAN development origin (2026-11-13)

- next.config.ts allows hostname 192.168.68.99 through allowedDevOrigins for phone access to Next.js development assets. Restart the dev server after configuration changes; use npm run dev -- --hostname 0.0.0.0 when LAN binding is needed. This is a Next.js development origin rule, separate from backend API CORS. Update the explicit hostname if the LAN IP changes.


### Shared upload thumbnail placeholder (2026-11-13)

- AppImageUploader defaults to cover and provides an ImageOutlined icon when no custom fallback is supplied, including missing/broken image states. Non-avatar fields use theme action.hover/text.secondary instead of the bright avatar background. ProfileForm explicitly opts into avatar and retains initials; EditTripForm uses the shared image placeholder instead of a trip-name initial. Existing file selection, validation, previews, tile layout and persistence stay unchanged.
- Verify scoped ESLint and TypeScript; skip smoke/browser tests per repository instructions.


### Mobile budget action icon (2026-11-13)

- MobileBudgetSummaryCard uses a 44px TuneRounded icon action for both unset and configured budgets, matching the desktop budget adjustment icon. Tooltip/aria-label retain localized setup/edit labels. Preserve existing manager callback guard, budget sheet and amounts; the empty-budget action no longer uses a text button. Scoped ESLint/TypeScript; skip smoke/browser tests.


### Light glass materials and corner hierarchy (2026-11-13)

- User chose subtle glassmorphism and Apple-inspired consistent corner geometry across the UI. Radius tokens in globals.css: detail 4, badge 6, small 8, control 12, card 20, panel 24, dialog 28px; pills/circles/fullscreen remain intentional exceptions. Base wrappers and feature sx now reference tokens rather than arbitrary local radii. Exported itinerary image geometry remains standalone.
- glassSurface(theme, kind) centralizes light/dark surfaces: content cards are translucent without per-item blur, floating overlays/navigation use restrained blur, solid fallback when unsupported or reduced transparency/high contrast. Fullscreen dialogs stay opaque. Native corner-shape squircle is progressive enhancement on large surfaces only.
- Preserve brand palette, font, primary-button gradient and all existing layout/actions/permissions. No new hero/decorations. Details and verification limits: docs/ui-materials.vi.md. TypeScript and full ESLint run; lint has no errors but pre-existing generated MapLibre/unused-code warnings. Skip smoke/browser tests.


### Consistent activity metadata rows (2026-11-13)

- ActivityTimelineCard renders category then non-PLANNED status in a fixed vertical Stack (4px gap, left aligned) instead of flex-wrap deciding per label length. Reuse AppCategoryChip/AppStatusChip with 24px minimum height, 12px text and badge radius token. Preserve existing status visibility, actions, photo, order and spending behavior. Shared consumers inherit the same layout. Scoped ESLint/TypeScript; skip smoke/browser tests.


### Template LAN origin validation (2026-11-13)

- User reported preview 403 with message Invalid origin. proxyTemplate compared browser Origin with Next's internal nextUrl.origin (can be localhost while browsing a LAN IP). Shared server hasSameRequestOrigin compares parsed Origin with incoming Host and nextUrl.protocol, including port; reject missing/null/malformed origins and hosts. Do not accept arbitrary x-forwarded-host or allow all origins. Reverse proxies must preserve the external Host/protocol.
- Keep token requirement, owner authorization and GET behavior. tests/template-origin.test.mjs runs the real proxy with mocked Core transport: LAN/internal URL mismatch, localhost/HTTPS, foreign/missing/invalid/wrong-port/wrong-scheme origins, spoofed forwarded host and malformed Host. Scoped ESLint/TypeScript, no smoke/browser/provider calls. Backend also normalizes optional removeCover for the same submitted payload; restart Core after that fix.


### Template preview action hierarchy (2026-11-13)

- PublishTemplateDialog explicitly marks Edit as secondary instead of inheriting AppButton primary default. Confirm publication retains the primary gradient and mobile primary action layout; editing remains available during preview and disabled while busy. Scoped ESLint/TypeScript; skip smoke/browser tests.


### Incremental UI refinement rule (2026-11-13, latest user attachment)

- New user rule requests safe visual polish preserving approximately 90% identity/layout and all behavior. Supersedes translucent default cards: glassSurface card now stays opaque; floating overlays/navigation retain subtle glass. Preserve all radius tokens, palette, typography, gradient, breakpoints and workflows.
- Shared interactionTransition uses 180ms paint-only transitions and reduced-motion none. AppButton, AppCard, inputs and navigation consume it; interactive cards have pointer-only hover, pressed and visible focus. Error/disabled inputs do not get primary hover borders; helper text wraps. Category chip light colors stay configured; dark colors derive from existing category and theme values.
- Source edits limited to 8 shared style files; no backend/API/messages/dependency edits. Audit, exact file list and verification limits: docs/ui-refinement.vi.md. Scoped ESLint/TypeScript and evaluated theme/helper checks pass; source comparison confirms palette/typography/primary-gradient preservation. Skip smoke/browser tests; no screenshot, device or end-to-end verification claims.


### One-line weekday day tabs (2026-11-13)

- PlanDayTabs shows localized short weekday plus DD/MM on one line (VI T7, 07/11; EN Sat, 07/11). Use existing calendar-safe parseDate and shortWeekdays translations; missing/invalid dates fall back to Day N. Preserve widths, selected colors, callbacks and scroll behavior. Scoped lint/TypeScript and date/translation check; skip smoke/browser tests.


### Member balance filters (2026-11-13)

- User clarified the reference requests All / owes / awaiting repayment filter chips, not a redesign of member rows. MemberBalancesTable reuses AppFilterChipGroup above existing responsive rows/table: ALL includes settled members, OWES filters debtors, OWED filters receivers. Use backend status as supplied; no new balance calculations or API changes. Filters affect member details only, with shared empty state and VI/EN labels.
- Keep existing avatar/amount/details, total member count, overview and payment suggestions. Chips scroll horizontally with existing shared touch/keyboard behavior. Scoped ESLint/TypeScript and evaluation of the real component with isolated state/primitive mocks cover each filter, settled members, empty results and unmodified inputs. Skip smoke/browser tests.


### Settlement section alignment and project shapes (2026-11-13)

- User wants member balance filters aligned with the page-level Who pays whom header, not inset inside a padded card. MemberBalancesTable now puts shared AppSectionHeader and AppFilterChipGroup outside the data card; rows own data padding, AppCard p=0. Remove the feature pill override and inherit existing filter-chip corner geometry.
- SettlementOverview reuses AppSectionHeader for suggestions and payment history. History title/count remain visible even with no recorded payments; remove the duplicate inset history heading. Keep all row details, filter rules, authorization and payment/delete actions. Radius/corner styling comes from shared project components/tokens; no new radius scale or custom curves. Scoped ESLint/TypeScript; skip smoke/browser tests.


### Temporarily hide category budget details (2026-11-13)

- User requested hiding the View budget by category disclosure in Expenses/Budget. ExpenseOverview gates the disclosure and its CategorySpendingList behind local SHOW_CATEGORY_BUDGET_DETAILS=false. Keep category chart, budget controls, component and translations for later restoration; no data/API change. Scoped lint/TypeScript; skip smoke/browser tests.


### Mobile timeline width trial (2026-11-13)

- User approved trying a leftward rail shift to widen activity cards. DayTimelineList owns responsive rail/gap variables: mobile 16px/10px instead of 28px/6px, moving marker center left 6px and card left 8px; sm+ remains 28px/8px. Keep the 28px number badge and photo width. Transparent timeline wrapper allows the marker overhang inside the page inset.
- AppTimelineRail reads the inherited width only when explicit width is absent; AppTimelineRow and ActivityDistanceConnector share the inherited gap so connectors stay aligned. Other consumers retain previous fallback geometry. No negative margins, transforms, page-padding changes or custom radii. Scoped ESLint/TypeScript; skip smoke/browser tests, visual review pending.


### Compact mobile trip cards and header copy (2026-11-13)

- User proposed compact trip rows because a few large cards fill the mobile viewport, then explicitly removed the subtitle under My trips. MyTripsHeader omits its description subtitle. Default grid cards use TripCompactCard below sm: 72px cover at left, solid readable text, dates/destination/description/status/duration/currency, active star, open control and owner-only edit/delete menu. Keep project AppCard/radius/touch targets.
- TripCardItem retains the desktop card at sm+ and calculates owner access once for both responsive presentations; no navigation/API/filter/pagination changes. Do not invent total spending absent from Trip data. Three trips fitting without scrolling depends on viewport/filter height; no such guarantee.
- Scoped lint/TypeScript and evaluation of actual compact component with isolated UI mocks verify selection, active state, owner actions, non-owner restrictions, responsive visibility and description preservation. Skip smoke/browser tests; device layout remains unverified.


### Compact trip trailing actions (2026-11-13)

- Move the compact-card chevron out of the title into a fixed 44px trailing action column alongside the owner action menu. Chevron is a labeled AppButton text action with tooltip and 44px touch target; stack centered as a group independent of title length. Preserve whole-content selection and owner-only edit/delete, with sibling controls rather than nested buttons. Inherit project control radius; no new shape tokens. Scoped lint/TypeScript; skip smoke/browser tests.


### Trip photo-background mobile cards (2026-11-13, latest)

- User chose trying the reference photo as full card background. TripCompactCard uses existing cover with a dark text scrim, white copy and primary.dark fallback; min-height 120px grows for content. Preserve all metadata/active state/owner actions and desktop presentation. Root click opens trip; labeled content ButtonBase supports keyboard and stops duplicate activation; menu remains a sibling and stops propagation through existing AppActionMenu. Remove separate chevron. No absolute/grid layout or new corner tokens.
- Latest feedback reduces the three-dot visual background to 28px using the small radius token while retaining the 44px IconButton hit target. Keep the menu at upper right, subtle dark fill and visible focus. Scoped lint/TypeScript; skip smoke/browser tests, visual contrast and image crop on real devices remain unverified.


### Compact expense detail UI (2026-11-13)

- ExpenseDetailDialog uses an opt-in AppFinanceRow compact mode: name/email share the left group instead of placing email below the taller trailing group. Percent and split status share a wrapping caption row; payer/split avatars use 36px and row padding is slightly tighter. Default shared finance rows retain their previous structure.
- Summary uses solid paper, 16px title, 24px amount, smaller internal spacing; section gap is 16px. Detail group corners use the existing card token; sentence-case title in VI/EN. Preserve emails, amounts, percentages, settled flags, note/receipt and close/edit/readOnly behavior. No business/API changes.
- Scoped lint/TypeScript and actual-component evaluation with mocked primitives verify row data, percentages/statuses, edit/readOnly behavior and immutable expense input. Skip smoke/browser tests; exact row height, long-text rendering and device appearance remain unverified.
