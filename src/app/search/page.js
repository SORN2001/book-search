"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 7;

export default function SearchPage() {
  const [books, setBooks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setQuery(queryParams.get("query") || "");
    setCategory(queryParams.get("category") || "");
    setFilter(queryParams.get("filter") || "");

    async function fetchBooks() {
      try {
        const response = await fetch(
          `/api/books?query=${queryParams.get(
            "query"
          )}&category=${queryParams.get("category")}&filter=${queryParams.get(
            "filter"
          )}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setBooks(data);
          setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
        } else {
          setErrorMessage("รูปแบบการตอบกลับไม่เป็นไปตามที่คาดไว้");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ:", error);
        setErrorMessage(
          "ไม่สามารถดึงข้อมูลหนังสือได้ กรุณาลองใหม่อีกครั้งในภายหลัง"
        );
      }
    }

    fetchBooks();
  }, [router]);

  const handleViewDetails = (bookId) => {
    router.push(`/books/${bookId}`);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, books.length);

  const paginatedBooks = books.slice(startIndex, endIndex);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 ${
            i === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-200"
        >
          หน้าแรก
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-200"
        >
          หน้าก่อน
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-200"
        >
          หน้าถัดไป
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-200"
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
          onClick={handleGoBack}
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
        <p className="text-red-600 text-center mb-4">{errorMessage}</p>
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
            {Array.isArray(paginatedBooks) && paginatedBooks.length > 0 ? (
              paginatedBooks.map((book, index) => (
                <tr
                  key={book.id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="border p-4 text-center text-gray-700">
                    {startIndex + index + 1}
                  </td>
                  <td className="border p-4 text-gray-700">{book.title}</td>
                  <td className="border p-4 text-gray-700">{book.author}</td>
                  <td className="border p-4 text-gray-700">{book.publisher}</td>
                  <td className="border p-4 text-center">
                    <button
                      onClick={() => handleViewDetails(book.id)}
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
                  ไม่มีข้อมูลหนังสือ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {renderPagination()}
    </div>
  );
}
