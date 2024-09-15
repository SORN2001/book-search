"use client"; // ทำให้คอมโพเนนต์นี้ทำงานในฝั่ง client

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 7; // กำหนดจำนวนหนังสือต่อหน้าสำหรับการแสดงผล

export default function SearchPage() {
  const [books, setBooks] = useState([]); // เก็บข้อมูลหนังสือที่ได้จากการค้นหา
  const [errorMessage, setErrorMessage] = useState(""); // เก็บข้อความแสดงข้อผิดพลาด (ถ้ามี)
  const [query, setQuery] = useState(""); // เก็บคำค้นหาที่รับมาจาก URL
  const [category, setCategory] = useState(""); // เก็บประเภทของหนังสือที่เลือกมาจาก URL
  const [filter, setFilter] = useState(""); // เก็บฟิลเตอร์การค้นหาจาก URL
  const [currentPage, setCurrentPage] = useState(1); // เก็บหมายเลขหน้าปัจจุบัน
  const [totalPages, setTotalPages] = useState(1); // เก็บจำนวนหน้าทั้งหมดที่คำนวณได้
  const router = useRouter(); // ใช้ `router` สำหรับการจัดการเส้นทางใน Next.js

  // ใช้ useEffect เพื่อดึงข้อมูลการค้นหาหลังจากหน้าถูกโหลด
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search); // รับพารามิเตอร์จาก URL
    setQuery(queryParams.get("query") || ""); // เก็บค่าคำค้นหาจาก URL
    setCategory(queryParams.get("category") || ""); // เก็บค่าประเภทหนังสือจาก URL
    setFilter(queryParams.get("filter") || ""); // เก็บค่าฟิลเตอร์การค้นหาจาก URL

    // ฟังก์ชันเพื่อดึงข้อมูลหนังสือตามคำค้นหา
    async function fetchBooks() {
      try {
        const response = await fetch(
          `/api/books?query=${queryParams.get(
            "query"
          )}&category=${queryParams.get("category")}&filter=${queryParams.get(
            "filter"
          )}`
        ); // ส่ง request เพื่อดึงข้อมูลหนังสือ
        const data = await response.json(); // แปลง response เป็น JSON

        if (Array.isArray(data)) {
          setBooks(data); // ถ้าข้อมูลที่ได้มาเป็น array ให้ตั้งค่าหนังสือ
          setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE)); // คำนวณจำนวนหน้าทั้งหมด
        } else {
          setErrorMessage("รูปแบบการตอบกลับไม่เป็นไปตามที่คาดไว้"); // ถ้าข้อมูลไม่ถูกต้อง แสดงข้อความผิดพลาด
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ:", error); // ล็อกข้อผิดพลาด
        setErrorMessage(
          "ไม่สามารถดึงข้อมูลหนังสือได้ กรุณาลองใหม่อีกครั้งในภายหลัง"
        ); // แสดงข้อความแจ้งเตือนผู้ใช้ว่ามีปัญหา
      }
    }

    fetchBooks(); // เรียกใช้งานฟังก์ชันดึงข้อมูลหนังสือ
  }, [router]); // จะทำงานเมื่อ `router` เปลี่ยน

  // ฟังก์ชันจัดการเมื่อผู้ใช้กดปุ่ม "ดูรายละเอียด"
  const handleViewDetails = (bookId) => {
    router.push(`/books/${bookId}`); // เปลี่ยนเส้นทางไปยังหน้ารายละเอียดของหนังสือ
  };

  // ฟังก์ชันจัดการเมื่อผู้ใช้กดปุ่ม "ย้อนกลับ"
  const handleGoBack = () => {
    router.back(); // กลับไปยังหน้าก่อนหน้า
  };

  // ฟังก์ชันจัดการเปลี่ยนหน้า
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // อัพเดตหมายเลขหน้าปัจจุบัน
  };

  // คำนวณดัชนีเริ่มต้นและสิ้นสุดของหนังสือในหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, books.length);

  // กรองข้อมูลหนังสือสำหรับหน้าปัจจุบัน
  const paginatedBooks = books.slice(startIndex, endIndex);

  // ฟังก์ชันแสดงปุ่มการเปลี่ยนหน้า (pagination)
  const renderPagination = () => {
    const pages = []; // สร้างปุ่มหน้าทั้งหมด
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)} // เมื่อกดจะเปลี่ยนหน้า
          className={`px-4 py-2 mx-1 ${
            i === currentPage ? "bg-blue-500 text-white" : "bg-gray-500"
          }`} // ถ้าเป็นหน้าปัจจุบันจะเปลี่ยนสี
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(1)} // ไปยังหน้าแรก
          disabled={currentPage === 1} // ปิดใช้งานถ้าอยู่หน้าแรกแล้ว
          className="px-4 py-2 mx-1 bg-gray-500"
        >
          หน้าแรก
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)} // ไปยังหน้าก่อนหน้า
          disabled={currentPage === 1} // ปิดใช้งานถ้าอยู่หน้าแรกแล้ว
          className="px-4 py-2 mx-1 bg-gray-500"
        >
          หน้าก่อน
        </button>
        {pages} {/* แสดงปุ่มหน้าทั้งหมด */}
        <button
          onClick={() => handlePageChange(currentPage + 1)} // ไปยังหน้าถัดไป
          disabled={currentPage === totalPages} // ปิดใช้งานถ้าอยู่หน้าสุดท้ายแล้ว
          className="px-4 py-2 mx-1 bg-gray-500"
        >
          หน้าถัดไป
        </button>
        <button
          onClick={() => handlePageChange(totalPages)} // ไปยังหน้าสุดท้าย
          disabled={currentPage === totalPages} // ปิดใช้งานถ้าอยู่หน้าสุดท้ายแล้ว
          className="px-4 py-2 mx-1 bg-gray-500"
        >
          หน้าสุดท้าย
        </button>
      </div>
    );
  };

  return (
    <div className="py-10 bg-gradient-to-b from-gray-200 to-gray-400 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-5">
        <button
          onClick={handleGoBack} // เรียกใช้งานฟังก์ชันย้อนกลับ
          className="text-blue-600 hover:text-blue-800 text-4xl p-3 rounded-full transition duration-300 ease-in-out"
        >
          ←
        </button>
        <h1 className="text-4xl font-bold text-gray-800 text-center flex-1">
          ผลการค้นหาหนังสือ
        </h1>
      </div>

      {/* Error message */}
      {errorMessage && (
        <p className="text-red-600 text-center mb-4">{errorMessage}</p> // แสดงข้อความแจ้งเตือนในกรณีที่เกิดข้อผิดพลาด
      )}

      {/* Book list */}
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl mx-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black text-white-900">
              <th className="border p-4 text-left">ลำดับ</th>
              <th className="border p-4 text-left">ชื่อหนังสือ</th>
              <th className="border p-4 text-left">ชื่อผู้แต่ง</th>
              <th className="border p-4 text-left">สำนักพิมพ์</th>
              <th className="border p-4 text-left">ข้อมูล</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(paginatedBooks) && paginatedBooks.length > 0 ? ( // ถ้ามีข้อมูลหนังสือให้แสดงในตาราง
              paginatedBooks.map((book, index) => (
                <tr
                  key={book.id} // ใช้ ID ของหนังสือเป็น key
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="border p-4 text-center text-gray-700">
                    {startIndex + index + 1} {/* แสดงลำดับหนังสือ */}
                  </td>
                  <td className="border p-4 text-gray-700">{book.title}</td> {/* แสดงชื่อหนังสือ */}
                  <td className="border p-4 text-gray-700">{book.author}</td> {/* แสดงชื่อผู้แต่ง */}
                  <td className="border p-4 text-gray-700">{book.publisher}</td> {/* แสดงชื่อสำนักพิมพ์ */}
                  <td className="border p-4 text-center">
                    <button
                      onClick={() => handleViewDetails(book.id)} // เมื่อกดจะแสดงรายละเอียดหนังสือ
                      className="text-blue-500 hover:underline"
                    >
                      !!!
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="border p-4 text-center text-gray-700"
                >
                  ไม่มีข้อมูลหนังสือ {/* แสดงข้อความถ้าไม่มีข้อมูลหนังสือ */}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* แสดงการควบคุม pagination */}
      {renderPagination()} 
    </div>
  );
}
