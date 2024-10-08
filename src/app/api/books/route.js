import { PrismaClient } from '@prisma/client'; // นำเข้า PrismaClient จากไลบรารี @prisma/client เพื่อใช้ในการเชื่อมต่อและทำงานกับฐานข้อมูล
import { NextResponse } from 'next/server';  // นำเข้า NextResponse จาก Next.js เพื่อใช้ในการสร้างการตอบสนอง (response) ใน API routes

const prisma = new PrismaClient(); // สร้างอินสแตนซ์ของ PrismaClient เพื่อใช้ในการดำเนินการกับฐานข้อมูล เช่น การค้นหา การเพิ่มข้อมูล เป็นต้น

export async function GET(req) {
    const { searchParams } = new URL(req.url); // ฟังก์ชัน GET ใช้สำหรับจัดการ HTTP GET requests
    const query = searchParams.get('query') || ''; // ดึงค่าของ query จาก search parameters หรือให้ค่าเริ่มต้นเป็นค่าว่าง
    const category = searchParams.get('category') || ''; // ดึงค่าของ category จาก search parameters หรือให้ค่าเริ่มต้นเป็นค่าว่าง
    const filter = searchParams.get('filter') || 'title'; // ดึงค่าของ filter จาก search parameters หรือให้ค่าเริ่มต้นเป็น 'title'

    try {
        // ตรวจสอบค่าของ filter ว่าเป็นค่าที่ถูกต้องหรือไม่
        if (!['title', 'author', 'publisher', 'isbn'].includes(filter)) {
            return NextResponse.json({ error: 'Invalid filter parameter' }, { status: 400 });
            // ถ้า filter ไม่ถูกต้อง ให้ส่ง response พร้อมข้อความ error และสถานะ 400
        }

        // สร้างเงื่อนไขการค้นหาตาม filter ที่เลือก
        const whereClause = {
            [filter]: {
                contains: query,
                // ใช้การค้นหาแบบ "contains" เพื่อค้นหาข้อมูลที่ตรงกับค่าของ query
            },
        };

        // ถ้ามีการระบุหมวดหมู่ ให้เพิ่มเงื่อนไขสำหรับ categoryId
        if (category) {
            whereClause.categoryId = parseInt(category, 10);
            // เพิ่มเงื่อนไขการค้นหาด้วย categoryId โดยแปลงค่าเป็น integer
        }

        // ค้นหาหนังสือจากฐานข้อมูล
        const books = await prisma.book.findMany({
            where: whereClause, // ใช้ whereClause ในการกำหนดเงื่อนไขการค้นหาข้อมูลหนังสือ
            include: {
                category: true, // รวมข้อมูลของ category ด้วยในผลลัพธ์การค้นหา
            },
        });

        // ส่งผลลัพธ์ของการค้นหาหนังสือกลับไปยังผู้ใช้
        return NextResponse.json(books);
    } catch (error) {
        console.error('Error fetching books:', error.message); // แสดงข้อความข้อผิดพลาดลงในคอนโซลถ้าเกิดข้อผิดพลาดในระหว่างการดำเนินการ
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }); // ส่ง response พร้อมข้อความ error และสถานะ 500 ถ้าเกิดข้อผิดพลาดในเซิร์ฟเวอร์
    }
}

export async function POST(req) {
    // ฟังก์ชัน POST ใช้สำหรับจัดการ HTTP POST requests
    try {
        const body = await req.json(); // รับข้อมูลจาก body ของ request ในรูปแบบ JSON
        const { title, author, publisher, publicationYear, isbn, keywords, coverImage, summary, categoryId } = body; // ดึงข้อมูลที่จำเป็นจาก body

        // ตรวจสอบว่า required fields ได้รับค่าแล้ว
        if (!title || !author || !publicationYear) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
            // ถ้า required fields ไม่ครบ ให้ส่ง response พร้อมข้อความ error และสถานะ 400
        }

        // สร้างหนังสือใหม่ในฐานข้อมูล
        const newBook = await prisma.book.create({
            data: {
                title,
                author,
                publisher,
                publicationYear,
                isbn,
                keywords,
                coverImage,
                summary,
                categoryId,
            },
        });

        return NextResponse.json(newBook); // ส่งข้อมูลของหนังสือที่สร้างใหม่กลับไปยังผู้ใช้
    } catch (error) {
        console.error('Error creating book:', error.message);
        // แสดงข้อความข้อผิดพลาดลงในคอนโซลถ้าเกิดข้อผิดพลาดในระหว่างการดำเนินการ
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }); 
        // ส่ง response พร้อมข้อความ error และสถานะ 500 ถ้าเกิดข้อผิดพลาดในเซิร์ฟเวอร์
    }
}

export async function DELETE(req) {
    // ฟังก์ชัน DELETE ใช้สำหรับจัดการ HTTP DELETE requests
    try {
        const { searchParams } = new URL(req.url); // ดึง searchParams จาก URL ของ request
        const id = searchParams.get('id'); // ดึง id จาก searchParams

        // ตรวจสอบว่าได้รับ id หรือไม่
        if (!id) {
            return NextResponse.json({ error: 'Missing book ID' }, { status: 400 });
            // ถ้าไม่ได้รับ id ให้ส่ง response พร้อมข้อความ error และสถานะ 400
        }

        // ลบหนังสือจากฐานข้อมูลตาม id ที่ระบุ
        const deletedBook = await prisma.book.delete({
            where: {
                id: parseInt(id, 10), // แปลงค่า id เป็น integer
            },
        });

        return NextResponse.json(deletedBook); // ส่งข้อมูลของหนังสือที่ถูกลบกลับไปยังผู้ใช้
    } catch (error) {
        console.error('Error deleting book:', error.message); // แสดงข้อความข้อผิดพลาดลงในคอนโซลถ้าเกิดข้อผิดพลาด
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }); // ส่ง response พร้อมข้อความ error และสถานะ 500 ถ้าเกิดข้อผิดพลาดในเซิร์ฟเวอร์
    }
}
