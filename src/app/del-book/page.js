"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeleteBookForm() {
  const [books, setBooks] = useState([]); // สร้าง state เก็บรายการหนังสือที่ดึงมาจาก API
  const [selectedBookId, setSelectedBookId] = useState(""); // สร้าง state เก็บ ID ของหนังสือที่เลือกเพื่อลบ
  const [errorMessage, setErrorMessage] = useState(""); // สร้าง state เก็บข้อความแสดงข้อผิดพลาด
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); 
  const router = useRouter();

  // ใช้ useEffect เพื่อดึงข้อมูลหนังสือเมื่อ component ถูก mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books"); // เรียก API เพื่อดึงข้อมูลหนังสือ
        if (res.ok) {
          const data = await res.json(); // ถ้าการดึงข้อมูลสำเร็จ เก็บข้อมูลหนังสือไว้ใน state
          setBooks(data); 
        } else {
          setErrorMessage("Error fetching books."); // ถ้าการดึงข้อมูลไม่สำเร็จ ให้แสดงข้อความข้อผิดพลาด
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setErrorMessage("Internal Server Error");
      }
    };

    fetchBooks(); // เรียกฟังก์ชันเพื่อดึงข้อมูลหนังสือเมื่อ component ถูก mount
  }, []);

  // ฟังก์ชันที่ทำงานเมื่อกดปุ่มลบ
  const handleDeleteRequest = (e) => {
    e.preventDefault();

    if (!selectedBookId) { // ตรวจสอบว่าผู้ใช้ได้เลือกหนังสือหรือไม่
      setErrorMessage("กรุณาเลือกหนังสือ");
      return;
    }

    setIsConfirmModalOpen(true);
  };

  // ฟังก์ชันที่ทำงานเมื่อยืนยันการลบหนังสือ
  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`/api/books?id=${selectedBookId}`, {
        method: "DELETE", // ส่งคำขอแบบ DELETE ไปยัง API เพื่อทำการลบหนังสือ
      });

      if (res.ok) {
        setIsModalOpen(true); 
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Error occurred while deleting the book.");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      setErrorMessage("Internal Server Error");
    } finally {
      setIsConfirmModalOpen(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    router.push("/"); 
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
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
            ลบหนังสือ
          </h1>
        </div>

        <form onSubmit={handleDeleteRequest} className="flex flex-col gap-6">
          {/* Dropdown to select book */}
          <div>
            <label className="block text-sm font-medium text-gray-500">
              เลือกหนังสือ
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            >
              <option value="">-- กรุณาเลือกหนังสือ --</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} - {book.author}
                </option>
              ))}
            </select>
          </div>

          {/* Delete button */}
          <button
            type="submit"
            className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-800 transition-colors w-full"
          >
            ลบหนังสือ
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 text-red-600 text-center">{errorMessage}</div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-12 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h2 className="text-gray-500 text-3xl font-bold mb-12">
              คุณแน่ใจหรือว่าต้องการลบหนังสือ?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-800 transition duration-300"
              >
                ลบ
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-400 text-white px-6 py-4 rounded-lg hover:bg-gray-500 transition duration-300"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-12 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h2 className="text-gray-500 text-3xl font-bold mb-12">
              หนังสือถูกลบแล้ว
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
