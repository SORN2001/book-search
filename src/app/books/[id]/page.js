// src/app/books/[id]/page.js
import { PrismaClient } from "@prisma/client";
import Image from "next/image";

const prisma = new PrismaClient();

export async function generateStaticParams() {
  // สร้างพารามิเตอร์สำหรับการเรนเดอร์ทุกหน้าของหนังสือ โดยการดึงค่า id ของหนังสือทั้งหมดในฐานข้อมูล
  const books = await prisma.book.findMany({ select: { id: true } });
  return books.map((book) => ({
    id: book.id.toString(), // ต้องแปลง id จากตัวเลขเป็น string เพื่อใช้ในเส้นทาง
  }));
}

// ฟังก์ชันดึงข้อมูลหนังสือตาม id ที่ระบุ โดยจะรวมข้อมูลหมวดหมู่ของหนังสือด้วย (ถ้ามี)
export async function getBookData(id) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) }, // แปลง id เป็นตัวเลขเพื่อค้นหาในฐานข้อมูล
      include: { category: true }, // รวมข้อมูลหมวดหมู่ของหนังสือ
    });
    return book;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null; // กรณีเกิดข้อผิดพลาด ส่งค่า null กลับมา
  }
}

// ฟังก์ชันหลักสำหรับแสดงรายละเอียดของหนังสือ
export default async function BookDetailPage({ params }) {
  const book = await getBookData(params.id); // ดึงข้อมูลหนังสือ

  if (!book) { // กรณีที่ไม่มีข้อมูลหนังสือ ให้แสดงหน้าข้อความว่าไม่พบหนังสือ
    return (
      <div className="py-10 bg-gray-200 min-h-screen">
        <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">
          ไม่พบหนังสือ
        </h1>
        <p className="text-center text-lg text-gray-600">
          หนังสือที่คุณค้นหาไม่พบในระบบ
        </p>
      </div>
    );
  }

  // กรณีที่พบหนังสือ แสดงข้อมูลหนังสือในหน้าเว็บ
  return ( 
    <div className="py-10 bg-gradient-to-b from-gray-200 to-gray-400 min-h-screen">
      {/* ปุ่มกลับไปยังหน้าก่อนหน้า */}
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-5">
        <a
          href="javascript:history.back()"
          className="text-blue-600 hover:text-blue-800 text-4xl p-3 rounded-full transition duration-300 ease-in-out"
          aria-label="กลับไป"
        >
          ←
        </a>
        <h1 className="text-4xl font-bold text-gray-800 text-center flex-1">
          ข้อมูลหนังสือ
        </h1>
      </div>

      {/* ส่วนแสดงข้อมูลหนังสือ */}
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto flex flex-col md:flex-row">
        {/* แสดงภาพปกหนังสือ */}
        <div className="md:w-1/3 w-full mb-6 md:mb-0 pr-0 md:pr-4">
          {book.coverImage ? (
            <Image
              src={book.coverImage} // ถ้ามีภาพปกหนังสือ จะแสดงภาพนั้น
              alt={book.title}
              width={300}
              height={450}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-[450px] bg-gray-200 flex items-center justify-center rounded-lg">
              <p className="text-gray-500">ไม่มีภาพปก</p>
            </div>
          )}
        </div>

        {/* แสดงรายละเอียดหนังสือ */}
        <div className="md:w-2/3 w-full">
          <h2 className="text-3xl font-bold mb-6 text-blue-800">
            {book.title} {/* แสดงชื่อหนังสือ */}
          </h2>
          <p className="text-lg mb-3">
            <strong className="text-blue-500">ผู้แต่ง :</strong>{" "}
            <span className="text-gray-700">{book.author}</span> {/* แสดงชื่อผู้แต่ง */}
          </p>
          <p className="text-lg mb-3">
            <strong className="text-blue-500">สำนักพิมพ์ :</strong>{" "}
            <span className="text-gray-700">{book.publisher || "ไม่ระบุ"}</span> {/* แสดงสำนักพิมพ์ */}
          </p>
          <p className="text-lg mb-3">
            <strong className="text-blue-500">ปีที่พิมพ์ :</strong>{" "}
            <span className="text-gray-700">
              {book.publicationYear || "ไม่ระบุ"} {/* แสดงปีที่พิมพ์ */}
            </span>
          </p>
          <p className="text-lg mb-3">
            <strong className="text-blue-500">เลข ISBN :</strong>{" "}
            <span className="text-gray-700">{book.isbn || "ไม่ระบุ"}</span> {/* แสดงเลข ISBN */}
          </p>
          <p className="text-lg mb-3">
            <strong className="text-blue-500">หมวดหมู่ :</strong>{" "}
            <span className="text-gray-700">
              {book.category?.name || "ไม่ระบุ"} {/* แสดงหมวดหมู่หนังสือ */}
            </span>
          </p>
          <p className="text-lg mt-6">
            <strong className="text-blue-500">คำอธิบาย :</strong>{" "}
            <span className="text-gray-700">
              {book.summary || "ไม่มีคำอธิบาย"} {/* แสดงคำอธิบายหนังสือ */}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
