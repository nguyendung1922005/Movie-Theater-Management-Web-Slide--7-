const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'sieu_mat_ma_123';

// Cấu hình CORS cho phép Frontend gọi thoải mái không bị chặn
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- MIDDLEWARE BẢO VỆ (Kiểm tra đăng nhập) ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ==========================================
// 1. ROUTES: AUTH (Đăng nhập / Đăng ký)
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: 'CUSTOMER' }
    });
    res.json({ message: "Đăng ký thành công!" });
  } catch (e) {
    res.status(400).json({ error: "Email này đã có người sử dụng." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Sai email hoặc mật khẩu." });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

// ==========================================
// 2. ROUTES: PHIM & SUẤT CHIẾU (Đã sửa lỗi cứng đầu)
// ==========================================
app.get('/api/movies', async (req, res) => {
  const { status } = req.query; // Bắt trạng thái NOW_SHOWING hoặc COMING_SOON từ Frontend
  
  try {
    const whereClause = status ? { status: status } : {};
    const movies = await prisma.movie.findMany({ where: whereClause });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tải danh sách phim." });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({ where: { id: req.params.id } });
    if (!movie) return res.status(404).json({ error: "Không tìm thấy phim." });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server." });
  }
});

app.get('/api/movies/:id/showtimes', async (req, res) => {
  const showtimes = await prisma.showtime.findMany({
    where: { movieId: req.params.id },
    include: { room: true }
  });
  res.json(showtimes);
});

// Lấy danh sách sơ đồ ghế của 1 suất chiếu
app.get('/api/showtimes/:id/seats', async (req, res) => {
  const showtimeId = req.params.id;
  try {
    const showtime = await prisma.showtime.findUnique({ where: { id: showtimeId }, include: { room: true } });
    if (!showtime) return res.status(404).json({ error: "Suất chiếu không tồn tại." });

    const allSeats = await prisma.seat.findMany({
      where: { roomId: showtime.roomId },
      orderBy: [{ row: 'asc' }, { number: 'asc' }]
    });

    const bookedTickets = await prisma.ticket.findMany({
      where: { showtimeId: showtimeId, status: 'VALID' },
      select: { seatId: true }
    });
    const bookedSeatIds = bookedTickets.map(ticket => ticket.seatId);

    const seatsWithStatus = allSeats.map(seat => ({
      ...seat,
      isBooked: bookedSeatIds.includes(seat.id)
    }));

    res.json({ success: true, seats: seatsWithStatus, priceBase: showtime.priceBase });
  } catch (error) {
    res.status(500).json({ error: "Lỗi tải ghế." });
  }
});

// ==========================================
// 3. ROUTES: ĐẶT VÉ & GIAO DỊCH
// ==========================================
app.post('/api/bookings', authenticateToken, async (req, res) => {
  const { showtimeId, seatIds, paymentMethod, totalAmount } = req.body;
  const userId = req.user.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const bookedTickets = await tx.ticket.findMany({
        where: { showtimeId, seatId: { in: seatIds }, status: 'VALID' }
      });
      if (bookedTickets.length > 0) throw new Error("Ghế đã có người đặt.");

      const booking = await tx.booking.create({
        data: {
          userId, totalAmount, paymentMethod, status: 'COMPLETED',
          tickets: {
            create: seatIds.map(sId => ({
              showtimeId, seatId: sId, price: totalAmount / seatIds.length, status: 'VALID'
            }))
          }
        }
      });
      return booking;
    });
    res.json({ success: true, booking: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/user/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        tickets: { include: { showtime: { include: { movie: true, room: true } }, seat: true } },
        comboItems: { include: { combo: true } }
      }
    });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy vé." });
  }
});

// ==========================================
// 4. ROUTES: ADMIN & QUẢN LÝ
// ==========================================
app.post('/api/admin/movies', authenticateToken, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.sendStatus(403);
  try {
    const movie = await prisma.movie.create({ data: req.body });
    res.json(movie);
  } catch (error) { res.status(400).json({ error: "Lỗi tạo phim" }); }
});

app.put('/api/admin/movies/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.sendStatus(403);
  try {
    const movie = await prisma.movie.update({ where: { id: req.params.id }, data: req.body });
    res.json(movie);
  } catch (error) { res.status(400).json({ error: "Lỗi cập nhật phim" }); }
});

app.delete('/api/admin/movies/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.sendStatus(403);
  try {
    await prisma.movie.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { res.status(400).json({ error: "Lỗi xóa phim" }); }
});
// ==========================================
// 5. ROUTES: KHUYẾN MÃI (PROMOTIONS)
// ==========================================
app.get('/api/promotions', async (req, res) => {
  try {
    // Chỉ lấy những khuyến mãi đang được bật (isActive: true)
    const promos = await prisma.promotion.findMany({
      where: { isActive: true }
    });
    res.json({ success: true, data: promos });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tải khuyến mãi." });
  }
});
const PORT = 3000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));