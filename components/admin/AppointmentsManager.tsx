"use client";

import { useState } from "react";
import { format } from "date-fns";
import { formatDuration, formatPrice } from "@/lib/utils";

interface Appointment {
  id: string;
  date: string;
  status: string;
  user: { name: string; phone: string };
  branch?: { name: string };
  appointmentServices: {
    service: { name: string; price: number; duration: number };
  }[];
}

export default function AppointmentsManager({
  initialAppointments,
  showBranch = false,
}: {
  initialAppointments: Appointment[];
  showBranch?: boolean;
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setFeedback(null);
    setUpdatingId(id);

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({
          type: "error",
          message:
            typeof data?.error === "string"
              ? data.error
              : "Failed to update appointment status.",
        });
        return;
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: data.status,
              }
            : appointment
        )
      );

      setFeedback({
        type: "success",
        message:
          status === "CONFIRMED"
            ? "Appointment confirmed and customer notified on WhatsApp."
            : status === "CANCELLED"
            ? "Appointment cancelled and customer notified on WhatsApp."
            : "Appointment updated successfully.",
      });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message: "Something went wrong while updating the appointment.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {feedback && (
        <div
          className={`border-b px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

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
            {appointments.map((appointment) => {
              const totalPrice = appointment.appointmentServices.reduce(
                (sum, item) => sum + item.service.price,
                0
              );
              const totalDuration = appointment.appointmentServices.reduce(
                (sum, item) => sum + item.service.duration,
                0
              );

              return (
                <tr key={appointment.id} className="border-t border-stone-100">
                  <td className="p-4">
                    <p className="font-medium">{appointment.user.name}</p>
                    <p className="text-sm text-stone-500">{appointment.user.phone}</p>
                  </td>
                  {showBranch && (
                    <td className="p-4 text-sm text-stone-600">
                      {appointment.branch?.name ?? "-"}
                    </td>
                  )}
                  <td className="p-4">
                    <ul className="space-y-1">
                      {appointment.appointmentServices.map((item, index) => (
                        <li key={index} className="text-sm">
                          {item.service.name} - {formatPrice(item.service.price)}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-stone-500 mt-1">
                      Total: {formatPrice(totalPrice)} | {formatDuration(totalDuration)}
                    </p>
                  </td>
                  <td className="p-4">
                    {format(new Date(appointment.date), "dd MMM yyyy, h:mm a")}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        appointment.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {appointment.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(appointment.id, "CONFIRMED")}
                          disabled={updatingId === appointment.id}
                          className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingId === appointment.id ? "Updating..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => updateStatus(appointment.id, "CANCELLED")}
                          disabled={updatingId === appointment.id}
                          className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
        <p className="p-8 text-center text-stone-500">No appointments yet</p>
      )}
    </div>
  );
}
