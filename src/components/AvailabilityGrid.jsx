import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, addDays } from "date-fns";
import classNames from "classnames";

const AvailabilityGrid = () => {
  const [availability, setAvailability] = useState([]);
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailability();
    generateDates();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms/availability-grid", {
        withCredentials: true,
      });
      setAvailability(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener la disponibilidad:", error);
      setLoading(false);
    }
  };

  const generateDates = () => {
    const today = new Date();
    const next30Days = Array.from({ length: 30 }, (_, i) =>
      format(addDays(today, i), "MM-dd")
    );
    setDates(next30Days);
  };

  const getCellStyle = (status) => {
    return classNames("text-center p-1 rounded text-xs", {
      "bg-green-200 text-green-800": status === "libre",
      "bg-yellow-200 text-yellow-800": status === "ocupado",
      "bg-red-200 text-red-800": status === "mantenimiento",
      "bg-gray-200 text-gray-700": !status,
    });
  };

  if (loading) return <div className="text-center p-4">Cargando disponibilidad...</div>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 sticky top-0 z-10">
            <th className="p-2 border text-left">Habitación</th>
            {dates.map((date) => (
              <th key={date} className="p-1 border text-center whitespace-nowrap">
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {availability.map((room) => (
            <tr key={room.number} className="border-b hover:bg-gray-50">
              <td className="p-2 font-medium border text-left">#{room.number}</td>
              {dates.map((date) => {
                const status = room.availability?.[date];
                return (
                  <td key={date} className={getCellStyle(status)}>
                    {status || ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvailabilityGrid;
