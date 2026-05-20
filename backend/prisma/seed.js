const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Đang dọn dẹp dữ liệu cũ (nếu có)...');
  // Phải xóa theo thứ tự: Con trước, Cha sau để không bị lỗi khóa ngoại
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
  await prisma.user.create({
    data: { email: 'admin@cinema.com', password: hashedPw, name: 'Trùm Rạp', role: 'ADMIN' }
  });
  await prisma.user.create({
    data: { email: 'khach@cinema.com', password: hashedPw, name: 'Khách Vip', role: 'CUSTOMER' }
  });

  console.log('🎁 Đang tạo Khuyến Mãi...');
  await prisma.promotion.createMany({
    data: [
      { title: "Tuesday Special", desc: "Đồng giá vé 50k vào thứ 3 hàng tuần.", cta: "Nhận Ngay", icon: "Ticket", color: "#e8192c", isActive: true },
      { title: "Thẻ Thành Viên", desc: "Tích điểm đổi bắp nước cực đã.", cta: "Đăng Ký", icon: "Gift", color: "#7b2d8b", isActive: true },
      { title: "Vé Đi Nhóm", desc: "Mua 4 tặng 1, tha hồ rủ bạn bè.", cta: "Đặt Ngay", icon: "Tag", color: "#c47a00", isActive: true },
    ]
  });

  console.log('🍿 Đang tạo Bắp Nước...');
  await prisma.combo.createMany({
    data: [
      { name: 'Combo 1 Bắp 1 Nước', price: 65000, stock: 100 },
      { name: 'Combo 2 Bắp 2 Nước (Lớn)', price: 95000, stock: 100 }
    ]
  });

  console.log('🎬 Đang nhập Phim...');
  const movie1 = await prisma.movie.create({
    data: { title: 'Avengers: Endgame', description: 'Trận chiến cuối cùng bảo vệ vũ trụ.', posterUrl: 'https://images.unsplash.com/photo-1598472237441-b5422956195e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', duration: 181, releaseDate: new Date('2024-05-01'), status: 'NOW_SHOWING' }
  });
  const movie2 = await prisma.movie.create({
    data: { title: 'Interstellar', description: 'Hành trình vượt không gian và thời gian.', posterUrl: 'https://images.unsplash.com/photo-1690906379371-9513895a2615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', duration: 169, releaseDate: new Date('2024-05-10'), status: 'NOW_SHOWING' }
  });
  const movie3 = await prisma.movie.create({
    data: { title: 'Your Name', description: 'Câu chuyện hoán đổi thân xác kỳ diệu.', posterUrl: 'https://images.unsplash.com/photo-1636755393526-a2249074de99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', duration: 112, releaseDate: new Date('2024-05-15'), status: 'NOW_SHOWING' }
  });
  // Phim sắp chiếu
  await prisma.movie.create({
    data: { title: 'Neon Requiem', description: 'Thế giới Cyberpunk 2077.', posterUrl: 'https://images.unsplash.com/photo-1680909426935-1c907d543577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', duration: 130, releaseDate: new Date('2026-10-10'), status: 'COMING_SOON' }
  });

  console.log('🏠 Đang xây Phòng chiếu và Xếp ghế...');
  const room1 = await prisma.room.create({ data: { name: 'Phòng 1 - IMAX', capacity: 30 } });
  
  // Tự động tạo 3 hàng ghế (A, B, C), mỗi hàng 10 ghế
  const seatData = [];
  const rows = ['A', 'B', 'C'];
  for (const row of rows) {
    for (let i = 1; i <= 10; i++) {
      seatData.push({ 
        roomId: room1.id, 
        row: row, 
        number: i, 
        type: row === 'C' ? 'VIP' : 'STANDARD' // Hàng C là ghế VIP
      });
    }
  }
  await prisma.seat.createMany({ data: seatData });

  console.log('⏰ Đang lên lịch Suất Chiếu...');
  const today = new Date();
  await prisma.showtime.create({
    data: {
      movieId: movie1.id,
      roomId: room1.id,
      startTime: new Date(today.setHours(18, 0, 0, 0)),
      endTime: new Date(today.setHours(21, 0, 0, 0)),
      priceBase: 90000
    }
  });
  await prisma.showtime.create({
    data: {
      movieId: movie2.id,
      roomId: room1.id,
      startTime: new Date(today.setHours(21, 30, 0, 0)),
      endTime: new Date(today.setHours(23, 30, 0, 0)),
      priceBase: 80000
    }
  });

  console.log('✅ BÙM! TẠO DỮ LIỆU THÀNH CÔNG 100%!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });