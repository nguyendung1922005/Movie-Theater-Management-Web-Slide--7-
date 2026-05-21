const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();

// Cấu hình Middleware
app.use(cors());
app.use(express.json()); // Để server hiểu được dữ liệu JSON gửi lên

const JWT_SECRET = process.env.JWT_SECRET || 'chuoibimatcuaban';

// ==========================================
// 1. API XÁC THỰC (ĐĂNG NHẬP / ĐĂNG KÝ)
// ==========================================

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email đã được sử dụng" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hashedPassword, name, role: 'CUSTOMER' }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server khi đăng ký" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Email không tồn tại" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Sai mật khẩu" });
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server khi đăng nhập" });
  }
});

// Cập nhật thông tin cá nhân (Profile)
app.put('/api/users/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, error: "Vui lòng đăng nhập!" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: { name: name } // Cập nhật tên vào Database
    });

    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi server khi cập nhật thông tin" });
  }
});

// ==========================================
// 2. API ĐỒNG BỘ DỮ LIỆU FRONTEND
// ==========================================

// Lấy danh sách Bắp Nước (Combos) cho trang Checkout
app.get('/api/combos', async (req, res) => {
  try {
    const combos = await prisma.combo.findMany();
    res.json(combos);
  } catch (error) {
    res.status(500).json({ error: "Không thể lấy dữ liệu bắp nước" });
  }
});

// Lấy danh sách Phim (Movies)
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { releaseDate: 'desc' } 
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Không thể lấy dữ liệu phim" });
  }
});

// Lấy chi tiết một bộ phim theo ID
app.get('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await prisma.movie.findUnique({
      where: { id }
    });
    if (!movie) return res.status(404).json({ success: false, error: "Không tìm thấy phim" });
    res.json({ success: true, data: movie });
  } catch (error) {
    console.error("Lỗi lấy chi tiết phim:", error);
    res.status(500).json({ success: false, error: "Lỗi server khi lấy chi tiết phim" });
  }
});

// Lấy toàn bộ Suất Chiếu (Showtimes) kèm thông tin Phim và Phòng chiếu
app.get('/api/showtimes', async (req, res) => {
  try {
    const showtimes = await prisma.showtime.findMany({
      include: {
        movie: true,
        room: true
      },
      orderBy: { startTime: 'asc' }
    });
    res.json(showtimes);
  } catch (error) {
    console.error("Lỗi lấy danh sách suất chiếu:", error);
    res.status(500).json({ error: "Không thể lấy dữ liệu suất chiếu" });
  }
});

// Lấy suất chiếu của một bộ phim cụ thể (Dành cho trang Chi tiết phim)
app.get('/api/movies/:id/showtimes', async (req, res) => {
  try {
    const { id } = req.params;
    const showtimes = await prisma.showtime.findMany({
      where: { movieId: id }, 
      // Đã bỏ chặn gte: new Date() để cho phép hiển thị cả suất chiếu trong ngày dù đã qua giờ
      include: { room: true },
      orderBy: { startTime: 'asc' }
    });
    res.json(showtimes);
  } catch (error) {
    console.error("Lỗi lấy lịch chiếu phim:", error);
    res.status(500).json({ error: "Không thể lấy dữ liệu suất chiếu theo phim" });
  }
});

// Lấy danh sách Phòng chiếu
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi lấy phòng chiếu" });
  }
});

// Lấy danh sách Khuyến Mãi
app.get('/api/promotions', async (req, res) => {
  try {
    const promotions = await prisma.promotion.findMany({
      where: { isActive: true }
    });
    res.json({ success: true, data: promotions });
  } catch (error) {
    console.error("Lỗi lấy danh sách khuyến mãi:", error);
    res.status(500).json({ success: false, error: "Không thể lấy dữ liệu khuyến mãi" });
  }
});

// Lấy danh sách ghế của một suất chiếu (Kèm trạng thái đã đặt hay chưa)
app.get('/api/showtimes/:id/seats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const showtime = await prisma.showtime.findUnique({
      where: { id },
      include: { room: true }
    });
    if (!showtime) return res.status(404).json({ success: false, error: "Không tìm thấy suất chiếu" });

    // Lấy toàn bộ ghế của phòng đó và danh sách vé đã bán
    const seats = await prisma.seat.findMany({ where: { roomId: showtime.roomId } });
    const tickets = await prisma.ticket.findMany({ where: { showtimeId: id, status: 'VALID' } });
    const bookedSeatIds = new Set(tickets.map(t => t.seatId));

    const seatsWithStatus = seats.map(seat => ({
      id: seat.id,
      row: seat.row,
      number: seat.number,
      type: seat.type,
      isBooked: bookedSeatIds.has(seat.id)
    }));

    res.json({ success: true, priceBase: showtime.priceBase, seats: seatsWithStatus });
  } catch (error) {
    console.error("Lỗi lấy sơ đồ ghế:", error);
    res.status(500).json({ success: false, error: "Lỗi server khi tải sơ đồ ghế" });
  }
});

// Lấy danh sách Vé của tôi (My Tickets)
app.get('/api/tickets/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, error: "Vui lòng đăng nhập!" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const bookings = await prisma.booking.findMany({
      where: { userId: userId },
      include: {
        tickets: {
          include: {
            seat: true,
            showtime: {
              include: {
                movie: true,
                room: true
              }
            }
          }
        },
        comboItems: {
          include: { combo: true }
        }
      },
      orderBy: { createdAt: 'desc' } // Vé mới mua xếp lên đầu
    });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Lỗi lấy danh sách vé:", error);
    res.status(500).json({ success: false, error: "Lỗi server khi tải vé" });
  }
});

// Xử lý Đặt Vé & Thanh Toán (Booking)
app.post('/api/bookings', async (req, res) => {
  const { showtimeId, seatIds, seats, comboItems, paymentMethod, totalAmount } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, error: "Vui lòng đăng nhập để thanh toán!" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id; 

    // Kiểm tra xem User có còn tồn tại trong DB không (tránh lỗi do chạy seed.js reset DB)
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return res.status(401).json({ success: false, error: "Phiên đăng nhập đã cũ hoặc tài khoản bị xóa. Vui lòng đăng nhập lại!" });
    }

    // Hỗ trợ mảng seats (từ Client Checkout) hoặc seatIds (từ Staff POS)
    const ticketData = seats ? seats.map(s => ({
      showtimeId: showtimeId,
      seatId: s.id,
      price: s.price,
      status: 'VALID'
    })) : seatIds.map(seatId => ({
      showtimeId: showtimeId,
      seatId: seatId,
      price: Math.round(totalAmount / seatIds.length), 
      status: 'VALID'
    }));

    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        totalAmount: Math.round(totalAmount),
        paymentMethod: paymentMethod || 'CREDIT_CARD',
        status: 'COMPLETED',
        tickets: { create: ticketData },
        ...(comboItems && comboItems.length > 0 && {
          comboItems: {
            create: comboItems.map(item => ({ comboId: item.comboId, quantity: item.quantity }))
          }
        })
      }
    });

    res.json({ success: true, message: "Đặt vé thành công!", bookingId: booking.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Thanh toán thất bại, vui lòng thử lại!" });
  }
});

// ==========================================
// 3. API DÀNH CHO NHÂN VIÊN (STAFF)
// ==========================================

// API Quét vé (Cập nhật trạng thái vé từ VALID sang USED)
app.post('/api/staff/tickets/:id/scan', async (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, error: "Vui lòng đăng nhập!" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Kiểm tra quyền (Chỉ STAFF và ADMIN mới được soát vé)
    if (decoded.role !== 'STAFF' && decoded.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: "Bạn không có quyền thực hiện thao tác này!" });
    }

    // Tìm vé trong hệ thống
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        showtime: { include: { movie: true, room: true } },
        seat: true
      }
    });

    if (!ticket) return res.status(404).json({ success: false, error: "Mã vé không tồn tại trong hệ thống!" });
    if (ticket.status === 'USED') return res.status(400).json({ success: false, error: "Tít tít! Vé này ĐÃ ĐƯỢC SỬ DỤNG trước đó!" });
    if (ticket.status !== 'VALID') return res.status(400).json({ success: false, error: "Vé không hợp lệ!" });

    // Cập nhật trạng thái thành USED
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { status: 'USED' }
    });

    res.json({ success: true, message: "Quét vé thành công! Mời khách vào.", data: ticket });
  } catch (error) {
    console.error("Lỗi quét vé:", error);
    res.status(500).json({ success: false, error: "Lỗi server khi quét vé!" });
  }
});

// API Clock In (Bắt đầu ca)
app.post('/api/staff/shift/clock-in', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, error: "Vui lòng đăng nhập!" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const shift = await prisma.shift.create({
      data: {
        staffId: decoded.id,
        startTime: new Date(),
        cashStart: 0 
      }
    });
    res.json({ success: true, data: shift });
  } catch (error) {
    console.error("Lỗi Clock In:", error);
    res.status(500).json({ success: false, error: "Lỗi server khi bắt đầu ca!" });
  }
});

// API Clock Out (Kết thúc ca)
app.post('/api/staff/shift/clock-out', async (req, res) => {
  const { reportedCash } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, error: "Vui lòng đăng nhập!" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const activeShift = await prisma.shift.findFirst({
      where: { staffId: decoded.id, endTime: null },
      orderBy: { startTime: 'desc' }
    });

    if (!activeShift) {
      return res.status(400).json({ success: false, error: "Không tìm thấy ca làm việc đang mở!" });
    }

    const shift = await prisma.shift.update({
      where: { id: activeShift.id },
      data: {
        endTime: new Date(),
        cashEnd: reportedCash
      }
    });
    res.json({ success: true, data: shift });
  } catch (error) {
    console.error("Lỗi Clock Out:", error);
    res.status(500).json({ success: false, error: "Lỗi server khi kết thúc ca!" });
  }
});

// ==========================================
// 4. API DÀNH CHO ADMIN
// ==========================================

// Lấy thống kê doanh thu theo tháng
app.get('/api/admin/revenue', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { status: 'COMPLETED' },
      include: { tickets: true }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyStats = {};
    
    monthNames.forEach(m => {
      monthlyStats[m] = { month: m, revenue: 0, tickets: 0 };
    });

    let totalRevenue = 0;
    let totalTickets = 0;

    bookings.forEach(b => {
      const monthIndex = new Date(b.createdAt).getMonth();
      const monthName = monthNames[monthIndex];
      
      monthlyStats[monthName].revenue += (b.totalAmount / 1000000); // Quy ra Triệu VNĐ
      monthlyStats[monthName].tickets += b.tickets.length;

      totalRevenue += b.totalAmount;
      totalTickets += b.tickets.length;
    });

    const chartData = Object.values(monthlyStats).map(stat => ({
      month: stat.month,
      revenue: parseFloat(stat.revenue.toFixed(2)),
      tickets: stat.tickets
    }));

    res.json({ success: true, chartData, totalRevenue, totalTickets });
  } catch (error) {
    console.error("Lỗi lấy thống kê doanh thu:", error);
    res.status(500).json({ success: false, error: "Lỗi server!" });
  }
});

// Lấy toàn bộ giao dịch để làm Report / Revenue chi tiết
app.get('/api/admin/transactions', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        tickets: {
          include: {
            showtime: {
              include: { movie: true, room: true }
            }
          }
        },
        comboItems: {
          include: { combo: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi server!" });
  }
});

// Thêm suất chiếu mới
app.post('/api/admin/showtimes', async (req, res) => {
  try {
    const { movieId, roomId, startTime, endTime, priceBase } = req.body;
    const showtime = await prisma.showtime.create({
      data: {
        movieId,
        roomId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        priceBase: priceBase || 80000
      },
      include: { movie: true, room: true }
    });
    res.json({ success: true, data: showtime });
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi thêm suất chiếu" });
  }
});

// Cập nhật suất chiếu (Edit / Drag & Drop)
app.put('/api/admin/showtimes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { movieId, roomId, startTime, endTime } = req.body;
    const showtime = await prisma.showtime.update({
      where: { id },
      data: { movieId, roomId, startTime: new Date(startTime), endTime: new Date(endTime) }
    });
    res.json({ success: true, data: showtime });
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi cập nhật suất chiếu" });
  }
});

// Xóa suất chiếu
app.delete('/api/admin/showtimes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.ticket.deleteMany({ where: { showtimeId: id } }); // Xóa vé trước
    await prisma.showtime.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi xóa suất chiếu" });
  }
});

// ==========================================
// KHỞI ĐỘNG SERVER
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend đang chạy tưng bừng trên cổng ${PORT}`);
});
