# TaskFlow - Hệ thống Quản lý Công việc

Ứng dụng quản lý công việc với hai vai trò: **Quản lý (MANAGER)** và **Nhân viên (STAFF)**.

## Tính năng chính

### Với vai trò Quản lý (MANAGER)

- **Giao việc**: Tạo và giao công việc cho nhân viên
  - Chọn loại công việc (Báo Cáo, Công Việc...)
  - Nhập tiêu đề và mô tả công việc
  - Chọn người thực hiện
  - Đặt ngày bắt đầu và hạn chót
- **Quản lý công việc**: Sửa, xóa công việc đã giao
- **Nhắc nhở**: Gửi email nhắc nhở nhân viên hoàn thành công việc
- **Quản lý danh mục**: Tạo và quản lý các loại công việc (Báo Cáo, Công Việc...)
- **Xem thống kê**: Tổng số task, đã hoàn thành, chưa hoàn thành

### Với vai trò Nhân viên (STAFF)

- **Xem công việc**: Xem danh sách công việc được giao
- **Hoàn thành công việc**:
  - Ghi chú kết quả công việc
  - Upload ảnh bằng chứng (nếu có)
  - Xem thời gian hoàn thành

## Hướng dẫn sử dụng

### Đăng ký tài khoản

1. Truy cập trang đăng ký
2. Điền thông tin: Username, Email, Họ tên, Số điện thoại, Mật khẩu
3. Hệ thống sẽ gửi mã OTP qua email
4. Nhập mã OTP để kích hoạt tài khoản

### Đăng nhập

1. Nhập Username và Password
2. Hệ thống sẽ phân quyền tự động:
   - **MANAGER**: Truy cập trang quản lý
   - **STAFF**: Truy cập trang nhân viên

### Quy trình làm việc

#### Quản lý giao việc:

1. Đăng nhập với tài khoản MANAGER
2. Click "Giao việc"
3. Chọn loại công việc (Báo Cáo, Công Việc...)
4. Điền tiêu đề và mô tả công việc (📋 Ghi chú cho nhân viên)
5. Chọn người thực hiện
6. Đặt ngày bắt đầu và hạn chót
7. Click "Giao việc"

#### Nhân viên hoàn thành công việc:

1. Đăng nhập với tài khoản STAFF
2. Xem danh sách công việc được giao
3. Click "Hoàn thành"
4. Nhập ghi chú kết quả công việc (📝 Nhân viên note)
5. (Tùy chọn) Upload ảnh bằng chứng
6. Click "Xác nhận hoàn thành"

#### Quản lý nhắc nhở:

1. Đăng nhập với tài khoản MANAGER
2. Click nút "Nhắc nhở" trên công việc
3. Xác nhận gửi email → Hệ thống sẽ gửi email nhắc nhở

## Công nghệ sử dụng

- **Frontend**: React 19 + TypeScript + Vite
- **Router**: React Router 7
- **HTTP Client**: Axios
- **Styling**: Custom CSS
- **Deployment**: Vercel

## Cấu trúc thư mục

```
src/
├── api/                    # Cấu hình API clients
├── app/                    # App entry, router
├── features/
│   ├── auth/              # Đăng ký, đăng nhập, OTP
│   ├── todo/              # Quản lý công việc
│   └── profile/           # Quản lý hồ sơ
├── layouts/               # Layout components
└── shared/               # Components, hooks, utilities dùng chung
```

## Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd taskManagement-client

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
```

## Biến môi trường

Tạo file `.env`:

```env
VITE_API_URL=http://160.22.107.121:8081
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/verify-otp` - Xác thực OTP
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

### Users
- `GET /api/users/me` - Lấy thông tin user hiện tại
- `PUT /api/users/me` - Cập nhật hồ sơ
- `PUT /api/users/me/password` - Đổi mật khẩu
- `GET /api/users/employees` - Lấy danh sách nhân viên (MANAGER)

### Tasks
- `GET /api/tasks` - Lấy danh sách công việc
- `POST /api/tasks` - Tạo công việc mới (MANAGER)
- `PUT /api/tasks/{id}` - Cập nhật công việc (MANAGER)
- `DELETE /api/tasks/{id}` - Xóa công việc (MANAGER)
- `POST /api/tasks/{id}/complete` - Hoàn thành công việc (STAFF)
- `POST /api/tasks/{id}/remind` - Gửi nhắc nhở (MANAGER)

### Task Categories
- `GET /api/task-categories` - Lấy danh sách loại công việc
- `POST /api/task-categories` - Tạo loại công việc (MANAGER)
- `PUT /api/task-categories/{id}` - Cập nhật loại công việc (MANAGER)
- `DELETE /api/task-categories/{id}` - Xóa loại công việc (MANAGER)

## Giấy phép

MIT License
