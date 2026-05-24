const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Đang dọn dẹp dữ liệu cũ (Xóa dây chuyền)...');
  await prisma.ticket.deleteMany();
  await prisma.bookingCombo.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.room.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.combo.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Đang tạo tài khoản...');
  const hashedPw = await bcrypt.hash('123456', 10);
  const adminUser = await prisma.user.create({
    data: { email: 'admin@cinema.com', password: hashedPw, name: 'Trùm Rạp', role: 'ADMIN' }
  });
  const staff1 = await prisma.user.create({
    data: { email: 'nv1@cinema.com', password: hashedPw, name: 'Nhân viên Bán vé', role: 'STAFF' }
  });
  const staff2 = await prisma.user.create({
    data: { email: 'nv2@cinema.com', password: hashedPw, name: 'Nhân viên Soát vé', role: 'STAFF' }
  });
  const customer1 = await prisma.user.create({
    data: { email: 'khach@cinema.com', password: hashedPw, name: 'Khách Hàng VIP', role: 'CUSTOMER' }
  });
  const customer2 = await prisma.user.create({
    data: { email: 'khach2@cinema.com', password: hashedPw, name: 'Thanh Tùng', role: 'CUSTOMER' }
  });
  const customer3 = await prisma.user.create({
    data: { email: 'khach3@cinema.com', password: hashedPw, name: 'Hoàng Yến', role: 'CUSTOMER' }
  });

  console.log('🎁 Đang tạo Khuyến Mãi...');
  const promotions = [
    { title: "Giảm 20% Phim Mới", desc: "Áp dụng cho đơn từ 150k.", cta: "Nhận Ngay", icon: "Film", color: "#3b82f6", isActive: true, code: "CINEMA20", discountType: "PERCENT", discountValue: 20, minOrderValue: 150000 },
    { title: "Chào Bạn Mới", desc: "Giảm 50k cho đơn từ 200k.", cta: "Đăng Ký", icon: "Gift", color: "#7b2d8b", isActive: true, code: "WELCOME50K", discountType: "FIXED", discountValue: 50000, minOrderValue: 200000 },
    { title: "Học Sinh Sinh Viên", desc: "Giảm 30% cho HSSV.", cta: "Săn Vé", icon: "User", color: "#10b981", isActive: true, code: "STUDENT30", discountType: "PERCENT", discountValue: 30, minOrderValue: 0 },
    { title: "Suất Chiếu Sớm", desc: "Giảm 40% suất chiếu trước 10h.", cta: "Đặt Ngay", icon: "Clock", color: "#f59e0b", isActive: true, code: "EARLY40", discountType: "PERCENT", discountValue: 40, minOrderValue: 0 },
    { title: "Vé Cặp Đôi", desc: "Giảm 25% khi mua 2 vé.", cta: "Xem Chi Tiết", icon: "Heart", color: "#ec4899", isActive: true, code: "COUPLE25", discountType: "PERCENT", discountValue: 25, minOrderValue: 0 },
    { title: "Combo Gia Đình", desc: "Giảm 35% cho gia đình từ 4 vé.", cta: "Đặt Ngay", icon: "Users", color: "#14b8a6", isActive: true, code: "FAMILY35", discountType: "PERCENT", discountValue: 35, minOrderValue: 0 },
  ];
  await Promise.all(promotions.map(promo => prisma.promotion.create({ data: promo })));

  console.log('🍿 Đang tạo Bắp Nước...');
  // Thay vì createMany, tạo từng cái để lấy ID gán vào BookingCombo bên dưới
  const c1 = await prisma.combo.create({ data: { name: 'Combo 1 Bắp 1 Nước', price: 65000, stock: 100 } });
  const c2 = await prisma.combo.create({ data: { name: 'Combo 2 Bắp 2 Nước (Lớn)', price: 95000, stock: 100 } });
  const c3 = await prisma.combo.create({ data: { name: 'Snack Phô Mai', price: 35000, stock: 50 } });
  const c4 = await prisma.combo.create({ data: { name: 'Nước Ngọt Lớn (Pepsi/Coke)', price: 29000, stock: 150 } });
  const c5 = await prisma.combo.create({ data: { name: 'Bắp Caramel Khổng Lồ', price: 55000, stock: 80 } });
  const c6 = await prisma.combo.create({ data: { name: 'Combo Gia Đình (4 Bắp 4 Nước)', price: 175000, stock: 40 } });

  console.log('🎬 Đang nhập Phim...');
  const m1 = await prisma.movie.create({
    data: { title: 'Dune: Part Two', description: 'Hành trình trả thù và định đoạt số phận của Paul Atreides.', posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1080', duration: 166, releaseDate: new Date('2024-03-01'), status: 'NOW_SHOWING' }
  });
  const m2 = await prisma.movie.create({
    data: { title: 'Kung Fu Panda 4', description: 'Gấu Po trở thành thủ lĩnh tinh thần.', posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1080', duration: 94, releaseDate: new Date('2024-03-08'), status: 'NOW_SHOWING' }
  });

  const futureDate1 = new Date(); futureDate1.setDate(futureDate1.getDate() + 12); // Chiếu sau 12 ngày
  const futureDate2 = new Date(); futureDate2.setDate(futureDate2.getDate() + 45); // Chiếu sau 45 ngày

  const m3 = await prisma.movie.create({
    data: { title: 'Deadpool & Wolverine', description: 'Marvel Jesus is back!', posterUrl: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?q=80&w=1080', duration: 127, releaseDate: futureDate1, status: 'COMING_SOON' }
  });
  const m4 = await prisma.movie.create({
    data: { title: 'Spider-Man: Beyond the Spider-Verse', description: 'Cuộc phiêu lưu đa vũ trụ tiếp theo của Miles Morales.', posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1080', duration: 140, releaseDate: futureDate2, status: 'COMING_SOON' }
  });
  const m5 = await prisma.movie.create({
    data: { title: 'Oppenheimer', description: 'Câu chuyện về cha đẻ của bom nguyên tử.', posterUrl: 'https://images.unsplash.com/photo-1688753232845-d85c490a07a1?q=80&w=1080', duration: 180, releaseDate: new Date('2023-07-21'), status: 'NOW_SHOWING' }
  });
  const m6 = await prisma.movie.create({
    data: { title: 'Doraemon: Nobita và Bản Giao Hưởng Địa Cầu', description: 'Cuộc chiến âm nhạc giải cứu trái đất.', posterUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=1080', duration: 115, releaseDate: new Date('2024-05-24'), status: 'NOW_SHOWING' }
  });

  console.log('🏠 Đang xây Phòng chiếu và Xếp ghế...');
  const r1 = await prisma.room.create({ data: { name: 'Phòng 1 - IMAX', capacity: 30 } });
  const r2 = await prisma.room.create({ data: { name: 'Phòng 2 - 2D', capacity: 30 } });
  const r3 = await prisma.room.create({ data: { name: 'Phòng 3 - 3D', capacity: 30 } });
  const r4 = await prisma.room.create({ data: { name: 'Phòng 4 - Sweetbox', capacity: 30 } });
  const r5 = await prisma.room.create({ data: { name: 'Phòng 5 - Dolby Atmos', capacity: 30 } });
  
  const seatData = [];
  const rows = ['A', 'B', 'C'];
  // Tạo ghế cho cả 5 phòng
  for (const roomId of [r1.id, r2.id, r3.id, r4.id, r5.id]) {
    for (const row of rows) {
      for (let i = 1; i <= 10; i++) {
        seatData.push({ 
          roomId: roomId, row: row, number: i, type: row === 'C' ? 'VIP' : 'STANDARD' 
        });
      }
    }
  }
  
  // Khắc phục lỗi createMany không tương thích SQLite
  await Promise.all(seatData.map(seat => prisma.seat.create({ data: seat })));
  
  // Lấy ra các ghế để làm dữ liệu đặt vé mẫu
  const seatsR1 = await prisma.seat.findMany({ where: { roomId: r1.id }, take: 4 });
  const seatsR2 = await prisma.seat.findMany({ where: { roomId: r2.id }, take: 4 });
  const seatsR3 = await prisma.seat.findMany({ where: { roomId: r3.id }, take: 4 });

  console.log('⏰ Đang lên lịch Suất Chiếu (Linh động theo ngày hiện tại)...');
  const t = new Date();
  const tNext = new Date(t);
  tNext.setDate(tNext.getDate() + 1);
  
  const st1 = await prisma.showtime.create({
    data: {
      movieId: m1.id, roomId: r1.id, priceBase: 120000,
      startTime: new Date(t.setHours(18, 0, 0, 0)), endTime: new Date(t.setHours(21, 0, 0, 0)),
    }
  });
  const st2 = await prisma.showtime.create({
    data: {
      movieId: m1.id, roomId: r2.id, priceBase: 90000,
      startTime: new Date(t.setHours(19, 30, 0, 0)), endTime: new Date(t.setHours(22, 30, 0, 0)),
    }
  });
  const st3 = await prisma.showtime.create({
    data: {
      movieId: m2.id, roomId: r1.id, priceBase: 80000,
      startTime: new Date(t.setHours(15, 0, 0, 0)), endTime: new Date(t.setHours(17, 0, 0, 0)),
    }
  });
  const st4 = await prisma.showtime.create({
    data: {
      movieId: m5.id, roomId: r5.id, priceBase: 150000,
      startTime: new Date(tNext.setHours(20, 0, 0, 0)), endTime: new Date(tNext.setHours(23, 0, 0, 0)),
    }
  });
  const st5 = await prisma.showtime.create({
    data: {
      movieId: m6.id, roomId: r3.id, priceBase: 70000,
      startTime: new Date(tNext.setHours(9, 30, 0, 0)), endTime: new Date(tNext.setHours(11, 30, 0, 0)),
    }
  });

  console.log('⏰ Đang lên lịch Suất Chiếu Sớm (Sneak Shows) cho phim Coming Soon...');
  const tFuture = new Date(t);
  tFuture.setDate(tFuture.getDate() + 7); // Chiếu sớm vào 7 ngày sau
  
  await prisma.showtime.create({
    data: {
      movieId: m3.id, roomId: r1.id, priceBase: 150000,
      startTime: new Date(new Date(tFuture).setHours(19, 0, 0, 0)), endTime: new Date(new Date(tFuture).setHours(21, 30, 0, 0)),
    }
  });
  await prisma.showtime.create({
    data: {
      movieId: m4.id, roomId: r4.id, priceBase: 120000,
      startTime: new Date(new Date(tFuture).setHours(20, 0, 0, 0)), endTime: new Date(new Date(tFuture).setHours(22, 30, 0, 0)),
    }
  });

  console.log('🎟️ Đang tạo Giao dịch (Booking), Vé (Ticket) và Đơn bắp nước (BookingCombo)...');
  await prisma.booking.create({
    data: {
      userId: customer1.id,
      totalAmount: 305000, // 2 vé 120k + 1 combo 65k
      paymentMethod: 'CREDIT_CARD',
      status: 'COMPLETED',
      tickets: {
        create: [
          { showtimeId: st1.id, seatId: seatsR1[0].id, price: 120000, status: 'VALID' },
          { showtimeId: st1.id, seatId: seatsR1[1].id, price: 120000, status: 'VALID' }
        ]
      },
      comboItems: {
        create: [{ comboId: c1.id, quantity: 1 }]
      }
    }
  });
  
  await prisma.booking.create({
    data: {
      userId: customer2.id,
      totalAmount: 180000, // 2 vé 90k
      paymentMethod: 'E_WALLET',
      status: 'COMPLETED',
      tickets: {
        create: [
          { showtimeId: st2.id, seatId: seatsR2[0].id, price: 90000, status: 'VALID' },
          { showtimeId: st2.id, seatId: seatsR2[1].id, price: 90000, status: 'VALID' }
        ]
      }
    }
  });

  await prisma.booking.create({
    data: {
      userId: customer3.id,
      totalAmount: 135000, // 1 vé 80k + bắp caramel 55k
      paymentMethod: 'CASH',
      status: 'COMPLETED',
      tickets: {
        create: [
          { showtimeId: st3.id, seatId: seatsR1[2].id, price: 80000, status: 'VALID' }
        ]
      },
      comboItems: {
        create: [{ comboId: c5.id, quantity: 1 }]
      }
    }
  });

  await prisma.booking.create({
    data: {
      userId: customer1.id,
      totalAmount: 325000, // 1 vé 150k + combo gia đình 175k
      paymentMethod: 'CREDIT_CARD',
      status: 'COMPLETED',
      tickets: {
        create: [
          { showtimeId: st4.id, seatId: seatsR3[0].id, price: 150000, status: 'VALID' }
        ]
      },
      comboItems: {
        create: [{ comboId: c6.id, quantity: 1 }]
      }
    }
  });

  console.log('📈 Đang tạo dữ liệu Doanh thu lịch sử (30 ngày qua) để vẽ biểu đồ...');
  for (let i = 30; i >= 1; i--) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - i);
    
    const stPast = await prisma.showtime.create({
      data: {
        movieId: i % 3 === 0 ? m1.id : (i % 2 === 0 ? m2.id : m5.id),
        roomId: r1.id,
        priceBase: 100000,
        startTime: new Date(new Date(pastDate).setHours(18, 0, 0, 0)),
        endTime: new Date(new Date(pastDate).setHours(20, 0, 0, 0)),
      }
    });

    await prisma.booking.create({
      data: {
        userId: customer1.id,
        totalAmount: 265000 + (Math.floor(Math.random() * 5) * 10000), // Randomize cho biểu đồ nhấp nhô
        paymentMethod: i % 2 === 0 ? 'CREDIT_CARD' : 'CASH',
        status: 'COMPLETED',
        createdAt: pastDate,
        tickets: {
          create: [
            { showtimeId: stPast.id, seatId: seatsR1[0].id, price: 100000, status: 'USED' },
            { showtimeId: stPast.id, seatId: seatsR1[1].id, price: 100000, status: 'USED' }
          ]
        },
        comboItems: {
          create: [{ comboId: c1.id, quantity: 1 }]
        }
      }
    });
  }

  console.log('� Đang tạo Ca làm việc mẫu (Shift)...');
  const baseDay = new Date();
  await prisma.shift.create({
    data: {
      staffId: adminUser.id,
      startTime: new Date(baseDay.setHours(8, 0, 0, 0)),
      endTime: new Date(baseDay.setHours(16, 0, 0, 0)),
      cashStart: 2000000
    }
  });
  await prisma.shift.create({
    data: {
      staffId: staff1.id,
      startTime: new Date(baseDay.setHours(16, 0, 0, 0)),
      endTime: new Date(baseDay.setHours(23, 59, 0, 0)),
      cashStart: 5000000
    }
  });
  await prisma.shift.create({
    data: {
      staffId: staff2.id,
      startTime: new Date(tNext.setHours(8, 0, 0, 0)),
      endTime: new Date(tNext.setHours(16, 0, 0, 0)),
      cashStart: 2000000
    }
  });

  console.log('✅ BÙM! TẠO DỮ LIỆU THÀNH CÔNG 100%!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });