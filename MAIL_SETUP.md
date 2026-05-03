# 📧 Hướng Dẫn Sửa Lỗi Gửi Email (Gmail SMTP)

## ✅ Những Thay Đổi Đã Làm

### 1. **Mail Service** (`src/mail/mail.service.ts`)
   - ✅ Cập nhật `from` field để luôn sử dụng `process.env.MAIL_USER` (không fallback)
   - ✅ Thêm `replyTo` field để Gmail chắc chắn nhận diện email
   - ✅ Thêm logging chi tiết để debug lỗi gửi email
   - ✅ Cải thiện error messages

### 2. **Mail Module** (`src/mail/mail.module.ts`)
   - ✅ Thêm `logger: true` và `debug: true` vào transport config
   - ✅ Cấu hình SMTP đúng cách cho Gmail (TLS port 587)

### 3. **Auth Service** (`src/auth/auth.service.ts`)
   - ✅ Cải thiện error handling cho phần gửi email
   - ✅ Thêm logging chi tiết để theo dõi từng bước
   - ✅ Hiển thị chi tiết lỗi email nếu có

---

## 🔧 Kiểm Tra Cấu Hình `.env`

Đảm bảo `.env` của bạn có:

```env
# Database Configuration (PostgreSQL - Neon)
DATABASE_URL=postgresql://...

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Mail Configuration (Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=0lesontruong0@gmail.com
MAIL_PASS=tvlc izip tsgs tyci

# Application Port
PORT=3000

# Application URL (for verification links)
APP_URL=http://localhost:3000
```

---

## 🚨 Các Vấn Đề Thường Gặp & Cách Khắc Phục

### **Vấn đề 1: Gmail từ chối gửi email**

**Nguyên nhân:** 
- App Password sai format
- Chưa bật "Less secure app access" hoặc App Password

**Giải pháp:**

1. Truy cập [Google Account Security](https://myaccount.google.com/security)
2. Bật **2-Step Verification** (nếu chưa bật)
3. Tạo **App Password** cho "Mail" và "Windows Computer":
   - Google sẽ cấp mã 16 ký tự (4 nhóm x 4 ký tự)
   - Copy mã này vào `MAIL_PASS` trong `.env`
   
   ```
   Ví dụ: tvlc izip tsgs tyci
   ```

### **Vấn đề 2: Lỗi "from" không được phép**

**Nguyên nhân:**
- Địa chỉ "from" khác với địa chỉ Gmail được xác thực

**Giải pháp:**
- Đảm bảo `MAIL_USER` = `0lesontruong0@gmail.com`
- ✅ Đã sửa trong code: `from: process.env.MAIL_USER` (không fallback)

### **Vấn đề 3: Không thấy logging khi gửi email**

**Giải pháp:**
- Chạy server ở mode development: `npm run start:dev`
- Xem logs trong terminal để debug

---

## 🧪 Test Gửi Email

### **1. Chạy Server:**
```bash
npm run start:dev
```

### **2. Gửi Request Đăng Ký (từ Terminal hoặc Postman):**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-test-email@gmail.com",
    "password": "TestPass123"
  }'
```

### **3. Kiểm tra Logs:**
Nếu thành công, bạn sẽ thấy:
```
📧 Đang gửi email xác thực tới: your-test-email@gmail.com
Từ: 0lesontruong0@gmail.com
✅ Email xác thực đã gửi thành công
```

Nếu lỗi, bạn sẽ thấy:
```
❌ Lỗi gửi email xác thực: [ERROR DETAILS]
Chi tiết lỗi: { message: "...", code: "...", ... }
```

---

## 📋 Checklist

- [ ] `.env` có `MAIL_USER=0lesontruong0@gmail.com`
- [ ] `.env` có `MAIL_PASS=tvlc izip tsgs tyci` (hoặc App Password mới)
- [ ] Gmail account có 2-Step Verification bật
- [ ] App Password được tạo từ Google Account
- [ ] Server chạy ở mode development (`npm run start:dev`)
- [ ] Test gửi email qua API
- [ ] Kiểm tra email inbox (có thể đến Spam)

---

## 💡 Debugging Tips

1. **Xem chi tiết logs:** Thêm `logger: true` trong mail.module.ts ✅ (đã làm)
2. **Kiểm tra lỗi từng bước:**
   - Tạo user thành công? → Kiểm tra database
   - Tạo token thành công? → Kiểm tra column `emailToken`
   - Gửi email thành công? → Kiểm tra inbox + spam folder
3. **Test với curl hoặc Postman** trước khi test UI

---

## 📞 Liên Hệ Support

Nếu vẫn lỗi sau các bước này, cung cấp thông tin:
- Chi tiết lỗi từ terminal
- `.env` config (ẩn password)
- Network logs (nếu có)
