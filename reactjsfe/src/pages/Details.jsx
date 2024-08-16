import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

function Details() {
  const navigate = useNavigate();

  const stations = [
    {
      id: 1,
      name: "Hà Đông Hà Nội",
      code: "1608",
      address:
        "Số 54 Tổ dân phố số 2 Ngọc Trục, phường Đại Mỗ, quận Nam Từ Liêm, TP Hà Nội",
    },
  ];

  const handleViewDetail = () => {
    navigate("/details/view");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container flex-grow mx-auto mt-20">
        <h1 className="mt-10 mb-10 text-4xl font-extrabold text-center text-gray-800">
          Danh sách trạm quan trắc
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full overflow-hidden bg-white rounded-lg shadow-md">
            <thead className="text-white bg-primary">
              <tr>
                <th className="w-20 px-4 py-3 text-left">STT</th>
                <th className="px-4 py-3 text-left">Tên trạm</th>
                <th className="w-32 px-4 py-3 text-left">Mã trạm</th>
                <th className="px-4 py-3 text-left">Địa chỉ</th>
                <th className="w-32 px-4 py-3 text-left">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station, index) => (
                <tr key={station.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td
                    className="px-4 py-3 text-blue-500 cursor-pointer hover:underline"
                    onClick={handleViewDetail}
                  >
                    {station.name}
                  </td>
                  <td className="px-4 py-3">{station.code}</td>
                  <td className="px-4 py-3">{station.address}</td>
                  <td
                    className="px-4 py-3 text-blue-500 cursor-pointer hover:underline"
                    onClick={handleViewDetail}
                  >
                    Xem chi tiết
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Details;
