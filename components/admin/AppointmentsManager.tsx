"use client";

import { useState } from "react";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";

interface Appointment {
  id: string;
  date: string;
  status: string;
  user: { name: string; phone: string };
  branch?: { name: string };
  appointmentServices: { service: { name: string; price: number; duration: number } }[];
}

export default function AppointmentsManager({
  initialAppointments,
  showBranch = false,
}: {
  initialAppointments: Appointment[];
  showBranch?: boolean;
}) {
  const [appointments, setAppointments] = useState(initialAppointments);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setAppointments((a) =>
          a.map((x) => (x.id === id ? { ...x, status } : x))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone-50">
            <tr>
              <th className="text-left p-4 font-semibold">Customer</th>
              {showBranch && <th className="text-left p-4 font-semibold">Branch</th>}
              <th className="text-left p-4 font-semibold">Services</th>
              <th className="text-left p-4 font-semibold">Date & Time</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => {
              const totalPrice = a.appointmentServices.reduce(
                (sum, as) => sum + as.service.price,
                0
              );
              const totalDuration = a.appointmentServices.reduce(
                (sum, as) => sum + as.service.duration,
                0
              );
              return (
                <tr key={a.id} className="border-t border-stone-100">
                  <td className="p-4">
                    <p className="font-medium">{a.user.name}</p>
                    <p className="text-sm text-stone-500">{a.user.phone}</p>
                  </td>
                  {showBranch && (
                    <td className="p-4 text-sm text-stone-600">
                      {a.branch?.name ?? "—"}
                    </td>
                  )}
                  <td className="p-4">
                    <ul className="space-y-1">
                      {a.appointmentServices.map((as, i) => (
                        <li key={i} className="text-sm">
                          {as.service.name} — {formatPrice(as.service.price)}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-stone-500 mt-1">
                      Total: {formatPrice(totalPrice)} · {totalDuration} min
                    </p>
                  </td>
                  <td className="p-4">
                    {format(new Date(a.date), "dd MMM yyyy, h:mm a")}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        a.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : a.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {a.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(a.id, "CONFIRMED")}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(a.id, "CANCELLED")}
                          className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {appointments.length === 0 && (
        <p className="p-8 text-center text-stone-500">
          No appointments yet
        </p>
      )}
    </div>
  );
}
