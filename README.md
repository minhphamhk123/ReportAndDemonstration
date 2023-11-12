# Hệ Thống Báo Cáo Kiểm Định Chất Lượng Đào Tạo

## Mô Tả

Repository này chứa mã nguồn và tài liệu liên quan đến hệ thống báo cáo kiểm định chất lượng đào tạo. Hệ thống này được phát triển bằng ReactJS để tạo giao diện người dùng hiện đại và MongoDB để lưu trữ dữ liệu kiểm định. Ngoài ra, hệ thống sử dụng Google Drive API và Google Docs API để tạo và quản lý minh chứng đào tạo.

## Các Tính Năng Chính

1. **Quản lý Báo Cáo**: Tạo, chỉnh sửa, và xem lại báo cáo kiểm định chất lượng đào tạo. Hệ thống hỗ trợ nhiều loại báo cáo và tự động cập nhật dữ liệu từ nguồn MongoDB.

2. **Quản lý Minh Chứng**: Liên kết và quản lý minh chứng đào tạo trên Google Drive. Minh chứng được tạo tự động và liên kết với báo cáo tương ứng.

3. **Giao Diện Người Dùng Thân Thiện**: Giao diện người dùng được thiết kế để đơn giản, dễ sử dụng và thân thiện với người dùng.

4. **Tích Hợp Google API**: Sử dụng Google Drive API và Google Docs API để tương tác với dữ liệu và tài liệu từ Google Drive và Google Docs.

## Cài Đặt

### Yêu Cầu

- Node.js và npm đã được cài đặt.
- MongoDB đã được cài đặt và chạy.
- Tạo một dự án trên [Google Cloud Console](https://console.developers.google.com/) để có được các khóa API cho Google Drive và Google Docs.

### Bước 1: Sao Chép Dự Án

```bash
git clone https://github.com/your-username/quality-assurance-reporting.git
cd quality-assurance-reporting
```

### Bước 2: Cài Đặt Gói Phụ Thuộc

```bash
npm install
```

### Bước 3: Cấu Hình Biến Môi Trường

Tạo một tệp `.env` trong thư mục gốc của dự án và cung cấp các thông tin cấu hình cần thiết:

```plaintext
PORT=3000
MONGODB_URI=mongodb://localhost:27017/quality-assurance
GOOGLE_DRIVE_CLIENT_ID=your-google-drive-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-google-drive-client-secret
GOOGLE_DOCS_CLIENT_ID=your-google-docs-client-id
GOOGLE_DOCS_CLIENT_SECRET=your-google-docs-client-secret
```

### Bước 4: Khởi Chạy Ứng Dụng

```bash
npm run dev
```

Ứng dụng sẽ khởi chạy tại `http://localhost:3000`.

## Tài Liệu Tham Khảo

- [React Documentation](https://reactjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Google Drive API Documentation](https://developers.google.com/drive)
- [Google Docs API Documentation](https://developers.google.com/docs)

## Tác Giả

- Tên: Minh Phạm
- GitHub: [My github](https://github.com/minhphamhk123)
