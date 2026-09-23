import React from 'react';
import { COMPARISON_ROWS } from '../algorithms/metadata';
import { Scale, CheckCircle2, ArrowRightLeft, BookOpen } from 'lucide-react';

export const ComparisonView: React.FC = () => {
  return (
    <div className="flex-1 h-[calc(100vh-57px)] bg-slate-50 overflow-y-auto p-6 select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                BẢNG SO SÁNH 5 THUẬT TOÁN ĐỒ THỊ KINH ĐIỂN
              </h2>
              <p className="text-xs text-slate-500">
                Toán rời rạc & Lý thuyết đồ thị · Đại học Bách Khoa / Đại học Công nghệ
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mt-2">
            Bảng tổng hợp đối chiếu mục tiêu, đối tượng duyệt, ý tưởng giải thuật, độ phức tạp tính toán và điều kiện áp dụng để sinh viên dễ dàng đưa vào bài tập lớn hoặc đề cương ôn thi.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Thuật toán</th>
                  <th className="py-3 px-4">Bài toán giải quyết</th>
                  <th className="py-3 px-4">Đối tượng duyệt</th>
                  <th className="py-3 px-4">Ý tưởng chính</th>
                  <th className="py-3 px-4">Kết quả đầu ra</th>
                  <th className="py-3 px-4">Độ phức tạp</th>
                  <th className="py-3 px-4">Điều kiện tiên quyết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {COMPARISON_ROWS.map((row, index) => (
                  <tr key={row.name} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-3.5 px-4 font-bold text-indigo-700 text-sm whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {row.problem}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 border border-indigo-200 text-indigo-800 whitespace-nowrap">
                        {row.targetObject}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed min-w-[200px]">
                      {row.coreIdea}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 leading-relaxed min-w-[160px]">
                      {row.output}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {row.complexity}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-[11px] leading-relaxed min-w-[180px]">
                      {row.condition}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Conceptual Distinctions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Euler vs Hamilton */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
              Sự khác biệt cốt lõi: Euler vs Hamilton
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li>
                <strong className="text-slate-900">• Euler (Cạnh):</strong> Yêu cầu đi qua <strong>mỗi cạnh đúng 1 lần</strong>. Bài toán có điều kiện cần và đủ rõ ràng (Định lý Euler: bậc đỉnh chẵn/lẻ) và giải được trong thời gian tuyến tính <strong>O(V + E)</strong>.
              </li>
              <li>
                <strong className="text-slate-900">• Hamilton (Đỉnh):</strong> Yêu cầu đi qua <strong>mỗi đỉnh đúng 1 lần</strong>. Đây là bài toán <strong>NP-đầy đủ</strong>, không có điều kiện cần và đủ đơn giản, thuật toán chung dựa vào <strong>Quay lui (Backtracking)</strong> với độ phức tạp giai thừa <strong>O(V!)</strong>.
              </li>
            </ul>
          </div>

          {/* Kruskal vs Prim vs Dijkstra */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
              Sự khác biệt: Kruskal vs Prim vs Dijkstra
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li>
                <strong className="text-slate-900">• Kruskal (Cạnh toàn cục):</strong> Xây dựng MST bằng cách sắp xếp cạnh từ nhỏ đến lớn và hợp nhất các thành phần rời nhau (DSU). Phù hợp đồ thị thưa (ít cạnh).
              </li>
              <li>
                <strong className="text-slate-900">• Prim (Mở rộng từ 1 đỉnh):</strong> Xây dựng MST bằng cách bắt đầu từ 1 đỉnh và liên tục chọn cạnh nhẹ nhất qua lát cắt (Cut). Phù hợp đồ thị dày (nhiều cạnh).
              </li>
              <li>
                <strong className="text-slate-900">• Dijkstra:</strong> Tìm đường đi ngắn nhất từ 1 đỉnh nguồn đến các đỉnh khác. Khác với MST (tối thiểu hóa tổng trọng số toàn cây), Dijkstra tối thiểu hóa <strong>khoảng cách tích lũy</strong> từ nguồn và <strong>bắt buộc trọng số không âm</strong>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
