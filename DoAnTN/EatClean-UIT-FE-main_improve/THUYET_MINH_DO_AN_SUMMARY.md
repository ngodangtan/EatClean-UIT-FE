# TỔNG HỢP CÔNG NGHỆ VÀ KIẾN TRÚC HỆ THỐNG - THUYẾT MINH ĐỒ ÁN TỐT NGHIỆP

**Tên đề tài:** Xây dựng ứng dụng Web/App gợi ý thực đơn ăn sạch bằng trí tuệ nhân tạo (EatClean AI)
**Mô hình Kiến trúc:** Client-Server (RESTful API), Microservices-oriented, Retrieval-Augmented Generation (RAG)

Tài liệu này cung cấp luận cứ học thuật và chi tiết kỹ thuật chuyên sâu về các công nghệ được lựa chọn, phương pháp luận phát triển và cấu trúc hệ thống. Sinh viên có thể sử dụng trực tiếp các phần này để đưa vào báo cáo thuyết minh đồ án.

---

## 1. KIẾN TRÚC TỔNG THỂ CỦA HỆ THỐNG (SYSTEM ARCHITECTURE)

Hệ thống EatClean AI được thiết kế theo mô hình **N-Tier Architecture** (Kiến trúc phân tầng) kết hợp với **Service-Oriented Architecture** (SOA) ở phía Backend. Sự phân tách này mang lại tính mở rộng cao, dễ dàng bảo trì và khả năng phục vụ đa nền tảng (Web và Mobile) cùng một lúc.

Hệ thống bao gồm 3 thành phần chính:
1. **Frontend (Client-side):** Giao diện người dùng trên nền tảng Web (React.js) và Mobile App.
2. **Backend (Server-side):** Hệ thống API trung tâm (Node.js/Express) xử lý logic nghiệp vụ, quản lý dữ liệu và điều phối các tác vụ AI.
3. **AI & Data Layer:** Lớp cơ sở dữ liệu (MongoDB, ChromaDB) và các Engine trí tuệ nhân tạo (LM Studio).

Luồng dữ liệu (Data Flow) xuyên suốt được bảo vệ qua nhiều lớp kiểm tra chặt chẽ: từ Validation (Joi/AJV), tính toán dinh dưỡng tất định (Deterministic Nutrition Engine), đến kiểm duyệt an toàn y tế (Disease Constraints), trước khi đưa vào mô hình AI sinh (Generative AI).

---

## 2. CÔNG NGHỆ BACKEND (CORE API SERVER)

Backend là "bộ não" của toàn bộ hệ thống, xử lý lượng lớn dữ liệu sức khỏe và điều phối luồng làm việc của trí tuệ nhân tạo.

### 2.1. Ngôn ngữ & Nền tảng cốt lõi
- **Node.js (JavaScript/ES6+):** Được chọn nhờ khả năng xử lý bất đồng bộ (Asynchronous/Non-blocking I/O), đặc biệt phù hợp cho một ứng dụng I/O-intensive phải liên tục giao tiếp với Database, Vector Store và AI Models.
- **Express.js:** Framework tinh gọn, linh hoạt, hỗ trợ xây dựng hệ thống RESTful API theo chuẩn REST với hệ thống routing và middleware mạnh mẽ.

### 2.2. Hệ quản trị Cơ sở dữ liệu (Database Management)
- **MongoDB (NoSQL):** Phù hợp với cấu trúc dữ liệu không đồng nhất và linh hoạt của hồ sơ sức khỏe (Health Profile), lịch sử kế hoạch bữa ăn (Meal Plan) đa dạng cấu trúc.
- **Mongoose ODM:** Lớp trung gian giúp định nghĩa Schema chặt chẽ, ràng buộc dữ liệu cấp độ DB và quản lý các mối quan hệ (ví dụ: liên kết `User` và `MealPlan`).
- **ChromaDB (Vector Database):** Đóng vai trò hạt nhân trong kiến trúc RAG. ChromaDB lưu trữ hàng nghìn công thức nấu ăn và hướng dẫn y tế dưới dạng **Vector Embeddings** (1024 chiều), cho phép tìm kiếm tương đồng ngữ nghĩa (Semantic Search) cực kỳ nhanh chóng.

### 2.3. Lớp Trí Tuệ Nhân Tạo (AI Layer) & Kiến trúc RAG
Hệ thống không sử dụng ChatGPT API (đám mây) để đảm bảo quyền riêng tư dữ liệu y tế của người dùng, thay vào đó áp dụng giải pháp AI chạy cục bộ (Local LLM):
- **LM Studio:** Đóng vai trò là máy chủ AI cục bộ cung cấp 2 endpoint:
  - **Embedding Model (`bge-m3`):** Chuyển đổi văn bản tự nhiên (tên món ăn, mục tiêu sức khỏe) thành mảng vector để truy vấn ChromaDB.
  - **Generative Text Model (Chat Model):** Tiếp nhận Prompt và sinh ra nội dung bữa ăn chi tiết.
- **RAG (Retrieval-Augmented Generation):** Đây là kỹ thuật cốt lõi giúp hệ thống đạt điểm xuất sắc. Thay vì để AI "ảo giác" (Hallucination) và bịa ra công thức sai lệch y khoa, hệ thống:
  1. Dùng từ khóa sức khỏe truy vấn ChromaDB để lấy ra top 3 công thức tham khảo chuẩn y khoa.
  2. Bơm các công thức này vào Prompt (Ngữ cảnh nền tảng).
  3. AI dựa vào đó để sáng tạo ra thực đơn mới nhưng vẫn **bám sát khung y tế an toàn**.

### 2.4. Tính toán Dinh dưỡng & Ràng buộc Y tế (Deterministic Engines)
- **Nutrition Engine:** Sử dụng các công thức y khoa chuẩn (Mifflin-St Jeor để tính BMR, hệ số TDEE) để đưa ra con số Calo và Macros (Carbs, Protein, Fat) chính xác tuyệt đối. AI không được phép tính toán các con số này nhằm tránh sai sót.
- **Disease Engine:** Hệ thống bộ lọc nguyên liệu cứng (Hard-coded Constraints). Ví dụ: Người dùng bị bệnh Gout (High Uric Acid) sẽ bị hệ thống tự động lọc bỏ các nguyên liệu chứa purine cao trước khi gửi yêu cầu cho AI.

### 2.5. Bảo mật & Xác thực (Security & Authentication)
- **JSON Web Token (JWT):** Quản lý phiên đăng nhập không trạng thái (Stateless), sử dụng chiến lược Access Token (ngắn hạn) và Refresh Token (dài hạn) để tối ưu cả bảo mật lẫn trải nghiệm người dùng.
- **Bcrypt:** Băm (Hash) mật khẩu nhiều vòng (Salt rounds) để chống tấn công Rainbow Table.
- **Joi & AJV:** Validate cấu trúc request đầu vào từ User và validate kết quả JSON đầu ra từ mô hình AI.

---

## 3. CÔNG NGHỆ FRONT-END (WEB APPLICATION)

Phiên bản Web hướng đến việc cung cấp một bảng điều khiển (Dashboard) trực quan để người dùng quản lý hồ sơ sức khỏe và xem chi tiết kế hoạch ăn uống.

### 3.1. Nền tảng phát triển
- **React.js 18:** Thư viện UI mạnh mẽ dựa trên kiến trúc Component-based. Khả năng Virtual DOM giúp tối ưu hóa hiệu suất khi render các danh sách thực đơn phức tạp.
- **TypeScript:** Cung cấp Static Typing, giúp bắt lỗi ngay trong quá trình code, định nghĩa rõ ràng các Interface dữ liệu (HealthProfile, MealPlan) trả về từ Backend, tăng tính ổn định của ứng dụng.
- **Vite:** Công cụ Build Tool thế hệ mới, thay thế Webpack. Vite tận dụng Native ES Modules giúp tốc độ khởi động server dev (HMR) cực nhanh.

### 3.2. Quản lý trạng thái và Điều hướng
- **React Router DOM v6:** Xử lý điều hướng trang dưới dạng Single Page Application (SPA), giúp chuyển trang mượt mà không cần tải lại toàn bộ trình duyệt. Hỗ trợ Nested Routes cho các màn hình chi tiết.
- **React Hooks:** Sử dụng triệt để Functional Components với `useState` (quản lý state nội bộ), `useEffect` (gọi API, xử lý side-effects) và Custom Hooks để tái sử dụng logic.

### 3.3. Thiết kế Giao diện (UI/UX)
- **Tailwind CSS v3:** CSS Framework theo mô hình Utility-first. Giúp phát triển giao diện cực nhanh, nhất quán và dung lượng CSS sinh ra cực nhỏ nhờ cơ chế PurgeCSS.
- **Thiết kế Responsive:** Hệ thống hoàn toàn tương thích đa thiết bị (Mobile-first design) bằng các breakpoint của Tailwind (`sm:`, `md:`, `lg:`).
- **Radix UI:** Các component Headless giúp xử lý logic UI phức tạp (như Modal, Dropdown) mà vẫn đảm bảo tính tùy biến giao diện cao và chuẩn trợ năng (Accessibility - a11y).
- **Google Fonts (Be Vietnam Pro):** Xử lý triệt để vấn đề hiển thị dấu Tiếng Việt, mang lại trải nghiệm bản địa hóa hoàn hảo.

---

## 4. CÔNG NGHỆ MOBILE APP (ỨNG DỤNG ĐIỆN THOẠI)

*(Lưu ý: Bạn hãy xóa phần framework không liên quan (React Native hoặc Flutter) để khớp với phần code thực tế mà bạn nộp)*

Ứng dụng Mobile đóng vai trò như một trợ lý sức khỏe cá nhân bỏ túi, tận dụng tối đa các cảm biến và tính năng của hệ điều hành di động.

### 4.1. Khung phát triển (Framework)
- **Phương án 1 - React Native (Expo) / TypeScript:** Cho phép chia sẻ tư duy logic và cấu trúc với nền tảng Web (cùng hệ sinh thái React). Viết code một lần, biên dịch đa nền tảng (Cross-platform) cho cả iOS và Android.
- **Phương án 2 - Flutter (Dart):** Framework mạnh mẽ của Google, vẽ UI trực tiếp qua Engine Skia/Impeller, đảm bảo giao diện đồng nhất tuyệt đối trên mọi thiết bị và mang lại hiệu năng mượt mà gần mức Native.

### 4.2. Quản lý Giao diện & Trạng thái
- Tương tự như Web, kiến trúc UI được phân mảnh thành các Widget/Component tái sử dụng (như các Card chứa món ăn, Form điền sức khỏe).
- Quản lý trạng thái thông qua các công cụ chuyên dụng (như Redux Toolkit, Zustand, hoặc Riverpod) để chia sẻ dữ liệu sức khỏe xuyên suốt các màn hình.

### 4.3. Các tính năng đặc thù (Native Features)
- **Tương tác API:** Kết nối chung một nguồn RESTful API duy nhất từ Node.js Backend để đảm bảo dữ liệu đồng bộ thời gian thực (Real-time Sync) giữa thiết bị di động và máy tính.
- **Tích hợp cảm biến sức khỏe:** Sử dụng thư viện gọi Native (HealthKit cho iOS, Google Fit cho Android) để đọc dữ liệu tự động như số bước chân (Steps) và lượng calo tiêu thụ (Active Calories). Dữ liệu này được làm đầu vào cho tính năng `daily_health_based` trong việc tạo kế hoạch linh hoạt hàng ngày.
- **Push Notifications (Thông báo nội bộ):** Hệ thống Local Notifications nhắc nhở người dùng theo giờ các bữa ăn chính hoặc tạo các routine nhắc nhở uống nước.

---

## 5. CÁC ĐIỂM NHẤN HỌC THUẬT VÀ KỸ THUẬT (DÙNG ĐỂ BẢO VỆ ĐỒ ÁN)

Để chứng minh độ phức tạp và tính thực tiễn của đề tài, báo cáo thuyết minh và slide bảo vệ cần xoáy sâu vào các điểm sáng kỹ thuật sau:

### 5.1. Giải pháp chống "Ảo giác AI" (Hallucination Mitigation)
Sự kết hợp giữa **Kiến trúc RAG** và **Disease Engine** tạo ra một rào chắn an toàn kép (Dual-layer Guardrail):
- *Lớp 1 (Truy xuất):* Lớp RAG cung cấp dữ liệu nền tảng là các công thức chuẩn y khoa, ép AI phải sáng tạo dựa trên "sự thật" (Grounding).
- *Lớp 2 (Hậu kiểm):* Thuật toán quét văn bản (Unicode-aware lookaround regex) đảm bảo không có từ khóa nguyên liệu độc hại nào lọt vào kết quả JSON. Nếu phát hiện vi phạm quy tắc y khoa (ví dụ: tư vấn đường tinh luyện cho bệnh nhân tiểu đường), hệ thống tự động gạt bỏ và yêu cầu AI sinh lại (Retry Mechanism).

### 5.2. Sự phân tách trách nhiệm (Separation of Concerns) trong Logic tạo thực đơn
Điểm thông minh của hệ thống là **không phụ thuộc hoàn toàn vào toán học của AI**. AI vốn rất kém trong việc cộng trừ các con số phức tạp. Hệ thống xử lý triệt để điểm yếu này bằng cách:
1. Backend Node.js thực thi thuật toán y khoa (BMR, TDEE, Tỉ lệ Macro) để chốt số liệu Calo/Carbs/Fat/Protein.
2. AI chỉ đảm nhiệm phần phân tích ngôn ngữ tự nhiên và sáng tạo (Viết tên món, mô tả, phối hợp nguyên liệu).
3. Backend làm nhiệm vụ "hòa trộn" (Merge) kết quả tính toán số học từ bước 1 và kết quả ngôn ngữ từ bước 2 thành một gói JSON thống nhất trả về cho người dùng.

### 5.3. Tính khả mở và Đồng bộ Đa Nền tảng (Cross-platform Scalability)
Hệ thống thể hiện tính thiết kế chuyên nghiệp qua việc tách bạch hoàn toàn Server (API) và Client.
- Việc thiết kế API chuẩn RESTful cho phép hệ thống mở rộng sang bất kỳ giao diện nào trong tương lai (Smartwatch, Smart Fridge) mà không cần can thiệp logic cốt lõi. 
- Mọi dữ liệu sửa đổi trên nền tảng Mobile (Ví dụ: Cập nhật cân nặng mới) lập tức phản ánh trong thuật toán tạo thực đơn khi người dùng thao tác trên màn hình Web, thể hiện sức mạnh của thiết kế Stateless Architecture với JSON Web Token.

---

## 6. DANH SÁCH CÁC API CHÍNH (RESTful ENDPOINTS) ĐÃ TRIỂN KHAI

Để đảm bảo luồng hoạt động xuyên suốt giữa Web, Mobile và AI, hệ thống đã thiết kế và triển khai tập hợp các API cốt lõi dưới đây (chuẩn OpenAPI 3.0):

### 6.1. Nhóm API Xác thực (Authentication Endpoints - `/api/auth`)
- `POST /api/auth/login`: Xác thực thông tin đăng nhập, trả về Access Token (JWT) và Refresh Token.
- `POST /api/auth/register`: Tạo tài khoản người dùng mới, tự động mã hóa mật khẩu (Bcrypt) và trả về JWT Token.
- `GET /api/auth/profile`: Lấy thông tin cá nhân cơ bản của tài khoản đang đăng nhập.
- `POST /api/auth/logout`: Xóa phiên đăng nhập, đưa Token vào Blacklist để chống tái sử dụng.

### 6.2. Nhóm API Hồ sơ Sức khỏe (Health Profile Endpoints - `/api/health-profile`)
- `POST /api/health-profile`: Tạo mới hoặc cập nhật toàn diện hồ sơ sức khỏe (yêu cầu Access Token hợp lệ). Dữ liệu bao gồm các thông số y tế (các bệnh lý mắc phải), thói quen vận động và sở thích ẩm thực.
- `GET /api/health-profile`: Truy xuất hồ sơ sức khỏe hiện tại của người dùng để hiển thị lên giao diện Web/Mobile.
- `DELETE /api/health-profile`: Xóa hoàn toàn hồ sơ sức khỏe của người dùng khỏi hệ thống.

### 6.3. Nhóm API Tạo Kế hoạch Bữa ăn (Meal Plan Endpoints - `/api/meal-plans`)
- `POST /api/meal-plans/generate`: **(API Cốt lõi cực kỳ quan trọng)** Kích hoạt toàn bộ Pipeline AI. Nhận các tham số mục tiêu (Giảm cân, Cải thiện sức khỏe, hoặc Theo dõi bệnh lý) để tính toán Macro và gọi LLM Model sinh ra một kế hoạch bữa ăn hoàn chỉnh từ 1-4 tuần.
- `GET /api/meal-plans`: Trả về kế hoạch bữa ăn hiện tại (Active Meal Plan) của người dùng.
- `GET /api/meal-plans/:planId/shopping-list`: Tự động trích xuất và tổng hợp danh sách nguyên liệu đi chợ (Shopping List) từ thực đơn đã tạo.

### 6.4. Nhóm API Yêu thích (Favorite Endpoints - `/api/favorites`)
- `POST /api/favorites`: Lưu lại các thực đơn hoặc bữa ăn mà người dùng đánh dấu yêu thích.
- `GET /api/favorites`: Truy xuất danh sách các mục đã được yêu thích.
