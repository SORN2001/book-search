"use client"; // ทำให้คอมโพเนนต์นี้ทำงานในฝั่ง client

import { useState } from "react";

export default function SearchForm() {
  // กำหนด state สำหรับเก็บค่าตัวแปรต่างๆ ที่ใช้ในฟอร์ม
  const [query, setQuery] = useState(""); // เก็บค่าคำค้นหาจากผู้ใช้
  const [category, setCategory] = useState(""); // เก็บค่าหมวดหมู่ของหนังสือ
  const [filter, setFilter] = useState("title"); // เก็บค่าตัวกรองการค้นหา (ค่าเริ่มต้นคือ 'title')
  const [errorMessage, setErrorMessage] = useState(""); // เก็บข้อความแสดงข้อผิดพลาด (ถ้ามี)

  // ฟังก์ชันเมื่อกดปุ่มค้นหา
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บเมื่อส่งฟอร์ม

    // ตรวจสอบว่าผู้ใช้เลือกตัวกรองการค้นหาหรือยัง
    if (!filter) {
      setErrorMessage("กรุณาเลือกตัวกรองก่อนทำการค้นหา");
      return; // ถ้าไม่ได้เลือกตัวกรอง แสดงข้อความแจ้งเตือนแล้วหยุดการทำงาน
    }

    // สร้างพารามิเตอร์สำหรับการค้นหาใน URL
    const queryParams = new URLSearchParams({
      query,
      category,
      filter,
    }).toString();

    // รีเซ็ตข้อความแจ้งเตือนเมื่อมีการกรอกข้อมูล
    setErrorMessage("");

    // เปลี่ยนเส้นทางไปยังหน้าผลลัพธ์การค้นหาพร้อมพารามิเตอร์การค้นหา
    window.location.href = `/search?${queryParams}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-gray-200 h-screen">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">
        เริ่มต้นการค้นหาของคุณ
      </h1>

      {/* ฟอร์มค้นหา */}
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          {/* ช่องสำหรับใส่ข้อความค้นหา */}
          <div className="flex-grow sm:flex-grow-[3]">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-500"
            >
              กรุณาค้นหาหนังสือของคุณ
            </label>
            <input
              id="search"
              type="text"
              value={query} // ค่าจาก state 'query'
              onChange={(e) => setQuery(e.target.value)} // อัพเดตค่าเมื่อผู้ใช้พิมพ์ข้อความค้นหา
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="ค้นหาหนังสือ"
            />
          </div>

          {/* ช่องสำหรับเลือกหมวดหมู่หนังสือ */}
          <div className="relative flex-grow sm:flex-grow-[0.25]">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-500"
            >
              ประเภทหนังสือ
            </label>
            <select
              id="category"
              value={category} // ค่าจาก state 'category'
              onChange={(e) => setCategory(e.target.value)} // อัพเดตค่าเมื่อผู้ใช้เลือกหมวดหมู่
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 pr-0"
            >
              <option value="">ทั้งหมด</option> {/* เลือกหมวดหมู่ "ทั้งหมด" */}
              <option value="1">กฎหมาย</option> {/* เลือกหมวดหมู่ "กฎหมาย" */}
              <option value="2">การศึกษา</option>{" "} {/* เลือกหมวดหมู่ "การศึกษา" */}
              <option value="3">การเมือง</option>{" "} {/* เลือกหมวดหมู่ "การเมือง" */}
              <option value="4">คอมพิวเตอร์</option>{" "} {/* เลือกหมวดหมู่ "คอมพิวเตอร์" */}
              <option value="5">จิตวิทยา</option>{" "} {/* เลือกหมวดหมู่ "จิตวิทยา" */}
              <option value="6">ทั่วไป</option>{" "} {/* เลือกหมวดหมู่ "ทั่วไป" */}
              <option value="7">คณิตศาสตร์</option>{" "} {/* เลือกหมวดหมู่ "คณิตศาสตร์" */}
              <option value="8">วิทยาศาสตร์</option>{" "} {/* เลือกหมวดหมู่ "วิทยาศาสตร์" */}
              <option value="9">สังคมศาสตร์</option>{" "} {/* เลือกหมวดหมู่ "สังคมศาสตร์" */}
            </select>
          </div>

          {/* ปุ่มค้นหา */}
          <div className="flex-shrink-0 mt-4 sm:mt-7">
            <button
              type="submit"
              className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto"
            >
              ค้นหา
            </button>
          </div>
        </form>

        {/* แสดงข้อความแจ้งเตือนในกรณีที่เกิดข้อผิดพลาด */}
        {errorMessage && (
          <div className="mt-4 text-red-600">{errorMessage}</div>
        )}

        {/* ตัวเลือกฟิลเตอร์การค้นหา */}
        <div className="mt-6 flex gap-6 flex-wrap justify-center text-gray-700">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filter"
              value="title" // ฟิลเตอร์ค้นหาตามชื่อหนังสือ
              checked={filter === "title"} // ถ้าฟิลเตอร์ถูกเลือกจะติ๊กถูก
              onChange={() => setFilter("title")} // เมื่อคลิกจะอัพเดตฟิลเตอร์เป็น 'title'
              className="accent-black"
            />{" "}
            ชื่อหนังสือ
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filter"
              value="author" // ฟิลเตอร์ค้นหาตามชื่อผู้แต่ง
              checked={filter === "author"} // ถ้าฟิลเตอร์ถูกเลือกจะติ๊กถูก
              onChange={() => setFilter("author")} // เมื่อคลิกจะอัพเดตฟิลเตอร์เป็น 'author'
              className="accent-black"
            />{" "}
            ชื่อผู้แต่ง
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filter"
              value="publisher" // ฟิลเตอร์ค้นหาตามสำนักพิมพ์
              checked={filter === "publisher"} // ถ้าฟิลเตอร์ถูกเลือกจะติ๊กถูก
              onChange={() => setFilter("publisher")} // เมื่อคลิกจะอัพเดตฟิลเตอร์เป็น 'publisher'
              className="accent-black"
            />{" "}
            สำนักพิมพ์
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filter"
              value="isbn" // ฟิลเตอร์ค้นหาตามเลข ISBN
              checked={filter === "isbn"} // ถ้าฟิลเตอร์ถูกเลือกจะติ๊กถูก
              onChange={() => setFilter("isbn")} // เมื่อคลิกจะอัพเดตฟิลเตอร์เป็น 'isbn'
              className="accent-black"
            />{" "}
            เลข ISBN
          </label>
        </div>
      </div>
    </div>
  );
}
