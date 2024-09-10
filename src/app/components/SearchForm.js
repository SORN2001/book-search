"use client"; // ทำให้คอมโพเนนต์นี้ทำงานในฝั่ง client

import { useState } from 'react';

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [filter, setFilter] = useState('title');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!filter) {
      setErrorMessage('กรุณาเลือกตัวกรองก่อนทำการค้นหา');
      return;
    }

    const queryParams = new URLSearchParams({
      query,
      category,
      filter,
    }).toString();

    // รีเซ็ตข้อความแจ้งเตือนเมื่อมีการกรอกข้อมูล
    setErrorMessage('');

    // เปลี่ยนเส้นทางไปยังหน้าผลลัพธ์การค้นหาพร้อมพารามิเตอร์การค้นหา
    window.location.href = `/search?${queryParams}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-gray-200 h-screen">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">เริ่มต้นการค้นหาของคุณ</h1>

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex-grow sm:flex-grow-[3]">
            <label htmlFor="search" className="block text-sm font-medium text-gray-500">
              กรุณาค้นหาหนังสือของคุณ
            </label>
            <input
              id="search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="ค้นหาหนังสือ"
            />
          </div>

          <div className="relative flex-grow sm:flex-grow-[0.25]">
            <label htmlFor="category" className="block text-sm font-medium text-gray-500">
              ประเภทหนังสือ
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-2 border border-gray-300 p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 pr-0"
            >
              <option value="">ทั้งหมด</option>
              <option value="1">กฎหมาย</option>
              <option value="2">การศึกษา</option>
            </select>
          </div>

          <div className="flex-shrink-0 mt-4 sm:mt-7">
            <button
              type="submit"
              className="bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto"
            >
              ค้นหา
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="mt-4 text-red-600">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 flex gap-6 flex-wrap justify-center text-gray-700">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filter"
              value="title"
              checked={filter === 'title'}
              onChange={() => setFilter('title')}
              className="accent-black"
            /> ชื่อหนังสือ
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filter"
              value="author"
              checked={filter === 'author'}
              onChange={() => setFilter('author')}
              className="accent-black"
            /> ชื่อผู้แต่ง
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filter"
              value="publisher"
              checked={filter === 'publisher'}
              onChange={() => setFilter('publisher')}
              className="accent-black"
            /> สำนักพิมพ์
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="filter"
              value="isbn"
              checked={filter === 'isbn'}
              onChange={() => setFilter('isbn')}
              className="accent-black"
            /> เลข ISBN
          </label>
        </div>
      </div>
    </div>
  );
}
