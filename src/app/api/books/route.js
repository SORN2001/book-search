import { PrismaClient } from '@prisma/client'; // นำเข้า PrismaClient จากไลบรารี @prisma/client เพื่อใช้ในการเชื่อมต่อและทำงานกับฐานข้อมูล
import { NextResponse } from 'next/server';  // นำเข้า NextResponse จาก Next.js เพื่อใช้ในการสร้างการตอบสนอง (response) ใน API routes

const prisma = new PrismaClient(); // สร้างอินสแตนซ์ของ PrismaClient เพื่อใช้ในการดำเนินการกับฐานข้อมูล เช่น การค้นหา การเพิ่มข้อมูล เป็นต้น

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category') || '';
    const filter = searchParams.get('filter') || 'title';

    try {
        // ตรวจสอบค่าของ filter ว่าเป็นค่าที่ถูกต้องหรือไม่
        if (!['title', 'author', 'publisher', 'isbn'].includes(filter)) {
            return NextResponse.json({ error: 'Invalid filter parameter' }, { status: 400 });
        }

        // สร้างเงื่อนไขการค้นหาตาม filter ที่เลือก
        const whereClause = {
            [filter]: {
                contains: query,
                // ไม่ใช้ mode ที่ไม่รองรับใน Prisma
            },
        };

        // ถ้ามีการระบุหมวดหมู่ ให้เพิ่มเงื่อนไขสำหรับ categoryId
        if (category) {
            whereClause.categoryId = parseInt(category, 10);
        }

        // ค้นหาหนังสือจากฐานข้อมูล
        const books = await prisma.book.findMany({
            where: whereClause,
            include: {
                category: true,
            },
        });

        // ส่งข้อมูลหนังสือกลับไปยังผู้ใช้
        return NextResponse.json(books);
    } catch (error) {
        console.error('Error fetching books:', error.message); // พิมพ์ข้อผิดพลาดลงในคอนโซล
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { title, author, publisher, publicationYear, isbn, keywords, coverImage, summary, categoryId } = body;

        // ตรวจสอบว่า required fields ได้รับค่าแล้ว
        if (!title || !author || !publicationYear) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
        console.error('Error creating book:', error.message); // พิมพ์ข้อผิดพลาดลงในคอนโซล
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}