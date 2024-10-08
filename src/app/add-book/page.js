"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [isbn, setIsbn] = useState("");
  const [keywords, setKeywords] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [summary, setSummary] = useState("");
  const [categoryId, setCategoryId] = useState("1"); // ค่าเริ่มต้นเป็นหมวดหมู่ที่ 1
  const [errorMessage, setErrorMessage] = useState(""); //ข้อความแจ้งเตือนในกรณีเกิดข้อผิดพลาด
  const [isModalOpen, setIsModalOpen] = useState(false); // State สำหรับการเปิดปิดโมดอล
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าข้อมูลที่จำเป็นถูกกรอกครบหรือไม่
    if (!title || !author || !publicationYear) {
      setErrorMessage("กรุณากรอกข้อมูลที่จำเป็น"); // ถ้าไม่ครบให้แจ้งเตือน
      return;
    }

    try {
      // ส่งข้อมูลไปยัง API ที่ "/api/books" ด้วยวิธี POST
      const res = await fetch("/api/books", {
        method: "POST", // ใช้ Post
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          publisher,
          publicationYear: parseInt(publicationYear, 10), // แปลงปีที่พิมพ์เป็นตัวเลข
          isbn,
          //keywords,
          coverImage,
          summary,
          categoryId: categoryId ? parseInt(categoryId, 10) : null, // แปลง categoryId เป็นตัวเลข ถ้าเป็นค่าว่างให้เป็น null
        }),
      });

      if (res.ok) {
        setIsModalOpen(true); // เปิดโมดอลเมื่อเพิ่มสำเร็จ
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Error occurred while adding the book.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      setErrorMessage("Internal Server Error");
    }
  };

  // ฟังก์ชันสำหรับการนำทางกลับไปยังหน้าก่อนหน้า
  const handleGoBack = () => {
    router.back(); // นำทางกลับไปหน้าที่แล้ว
  };

  // ฟังก์ชันสำหรับการปิดโมดอลและนำทางไปหน้าแรก
  const handleModalClose = () => {
    setIsModalOpen(false); // ปิดโมดอล
    router.push("/"); // นำทางกลับไปหน้าแรก
  };

  // ฟังก์ชันสำหรับการนำทางไปยังหน้าลบหนังสือ
  const handleDeleteBook = () => {
    router.push("/del-book"); // นำทางไปยังหน้าลบหนังสือ
  };

  return (
    <div className="py-10 bg-gradient-to-b from-gray-200 to-gray-400 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white p-12 rounded-xl shadow-md">
        <div className="flex items-center justify-between max-w-4xl mx-auto mb-5">
          <button
            onClick={handleGoBack}
            className="text-blue-600 hover:text-blue-800 text-4xl p-3 rounded-full transition duration-300 ease-in-out"
          >
            ←
          </button>
          <h1 className="text-4xl font-bold text-gray-800 text-center flex-1">
            เพิ่มหนังสือใหม่
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ช่องกรอกชื่อหนังสือ */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              ชื่อหนังสือ
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="กรอกชื่อหนังสือ"
              required
            />
          </div>

          {/* ช่องกรอกชื่อผู้แต่ง */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              ชื่อผู้แต่ง
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="กรอกชื่อผู้แต่ง"
              required
            />
          </div>

          {/* สำนักพิมพ์ */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              สำนักพิมพ์
            </label>
            <input
              type="text"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="กรอกสำนักพิมพ์"
            />
          </div>

          {/* ปีที่พิมพ์ */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              ปีที่พิมพ์
            </label>
            <input
              type="number"
              value={publicationYear}
              onChange={(e) => setPublicationYear(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="กรอกปีที่พิมพ์"
              required
            />
          </div>

          {/* ISBN */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              ISBN
            </label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="กรอก ISBN"
            />
          </div>

          {/* ลิงก์รูปปก */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              ลิงก์รูปปก
            </label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="กรอกลิงก์รูปปก"
            />
          </div>

          {/* สรุปหนังสือ */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
            คำอธิบายหนังสือ
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="กรอกคำอธิบายหนังสือ"
            />
          </div>

          {/* หมวดหมู่ */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              หมวดหมู่
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="1">กฎหมาย</option>
              <option value="2">การศึกษา</option>
              <option value="3">การเมือง</option>
              <option value="4">คอมพิวเตอร์</option>
              <option value="5">จิตวิทยา</option>
              <option value="6">ทั่วไป</option>
              <option value="7">คณิตศาสตร์</option>
              <option value="8">วิทยาศาสตร์</option>
              <option value="9">สังคมศาสตร์</option>
            </select>
          </div>

          {/* ปุ่มเพิ่มหนังสือ */}
          <button
            type="submit"
            className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors w-full"
          >
            เพิ่มหนังสือ
          </button>

          {/* ปุ่มลบหนังสือ */}
          <div className="py-5 flex items-center justify-between max-w-4xl mx-auto mb-5">
            <button
              type="button"
              onClick={handleDeleteBook}
              className="text-1xl font-bold text-red-500 hover:underline"
            >
              ลบหนังสือ
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-4 text-red-600 text-center">{errorMessage}</div>
        )}
      </div>

      {/* โมดอลแจ้งเตือน */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-12 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h2 className="text-gray-500 text-3xl font-bold mb-12">
              หนังสือใหม่ถูกเพิ่มแล้ว
            </h2>
            <button
              onClick={handleModalClose}
              className="bg-gray-950 text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
