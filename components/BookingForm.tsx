"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { format, addDays } from "date-fns";
import { ChevronRight, Check, MapPin } from "lucide-react";
import { TIME_SLOTS, formatPrice, formatDuration } from "@/lib/utils";
import type { Service, Branch } from "@prisma/client";

interface BookingFormProps {
  branches: Branch[];
}

export default function BookingForm({ branches }: BookingFormProps) {
  const searchParams = useSearchParams();
  const preselectedBranch = searchParams.get("branch");
  const preselectedService = searchParams.get("service");

  const [branchId, setBranchId] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (preselectedBranch && branches.some((b) => b.id === preselectedBranch)) {
      setBranchId(preselectedBranch);
    } else if (branches.length > 0 && !branchId) {
      setBranchId(branches[0].id);
    }
  }, [preselectedBranch, branches]);

  useEffect(() => {
    if (!branchId) {
      setServices([]);
      setServiceIds([]);
      return;
    }
    setServicesLoading(true);
    setServiceIds([]);
    fetch(`/api/services?branchId=${branchId}`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setServices(list);
        if (preselectedService && list.some((s: Service) => s.id === preselectedService)) {
          setServiceIds((prev) =>
            prev.includes(preselectedService) ? prev : [...prev, preselectedService]
          );
        }
      })
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false));
  }, [branchId, preselectedService]);

  useEffect(() => {
    if (preselectedBranch && typeof window !== "undefined" && window.location.hash === "#booking") {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [preselectedBranch]);

  const minDate = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const maxDate = format(addDays(new Date(), 30), "yyyy-MM-dd");

  const selectedServices = services.filter((s) => serviceIds.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const toggleService = (id: string) => {
    setServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !branchId || serviceIds.length === 0 || !date || !timeSlot) {
      setMessage({ type: "error", text: "Please fill all fields and select at least one service." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const dateTime = new Date(`${date}T${timeSlot}:00`);
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          branchId,
          serviceIds,
          date: dateTime.toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to book appointment");
      }

      setMessage({
        type: "success",
        text: "Appointment booked successfully! We'll confirm shortly.",
      });
      setName("");
      setPhone("");
      setServiceIds([]);
      setDate("");
      setTimeSlot("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedBranch = branches.find((b) => b.id === branchId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Branch <span className="text-stone-500 font-normal">(select nearby location)</span>
        </label>
        <div className="space-y-2">
          {branches.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setBranchId(b.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                branchId === b.id
                  ? "bg-primary-50 border-primary-200 ring-1 ring-primary-200"
                  : "bg-white border-stone-200 hover:border-stone-300"
              }`}
            >
              <MapPin size={20} className="text-primary-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-stone-800">{b.name}</p>
                <p className="text-sm text-stone-500">{b.address}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all bg-stone-50/50 focus:bg-white"
          placeholder="Your name"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-2">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all bg-stone-50/50 focus:bg-white"
          placeholder="+91 98765 43210"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Services <span className="text-stone-500 font-normal">(select one or more)</span>
        </label>
        {!branchId ? (
          <p className="text-sm text-stone-500 py-4">Select a branch first</p>
        ) : servicesLoading ? (
          <div className="py-8 text-center text-stone-500">Loading services...</div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide rounded-xl border border-stone-200 p-3 bg-stone-50/50">
            {services.map((s) => {
              const isSelected = serviceIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-primary-50 border-primary-200 ring-1 ring-primary-200"
                      : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                        isSelected ? "bg-primary-500 border-primary-500" : "border-stone-300"
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-stone-800 truncate">{s.name}</p>
                      <p className="text-sm text-stone-500">
                        {formatPrice(s.price)} · {formatDuration(s.duration)}
                      </p>
                    </div>
                  </div>
                  <span className="text-primary-600 font-semibold flex-shrink-0">
                    {formatPrice(s.price)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {branchId && services.length === 0 && !servicesLoading && (
          <p className="mt-1.5 text-sm text-amber-600">No services available at this branch</p>
        )}
        {serviceIds.length === 0 && branchId && services.length > 0 && (
          <p className="mt-1.5 text-sm text-amber-600">Select at least one service</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-stone-700 mb-2">
          Date
        </label>
        <input
          id="date"
          type="date"
          value={date}
          min={minDate}
          max={maxDate}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all bg-stone-50/50 focus:bg-white"
          required
        />
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium text-stone-700 mb-2">
          Time Slot
        </label>
        <select
          id="time"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          className="w-full px-4 py-3.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all bg-stone-50/50 focus:bg-white"
          required
        >
          <option value="">Select time</option>
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      {selectedServices.length > 0 && selectedBranch && (
        <div className="p-4 rounded-2xl bg-primary-50/80 border border-primary-100">
          <p className="text-sm font-medium text-stone-800 mb-1">{selectedBranch.name}</p>
          <p className="text-sm font-medium text-stone-800 mb-2">Selected services</p>
          <ul className="space-y-1.5 text-sm text-stone-700">
            {selectedServices.map((s) => (
              <li key={s.id} className="flex justify-between items-center gap-2">
                <span>
                  {s.name} <span className="text-stone-500">({s.duration} min)</span>
                </span>
                <span className="text-primary-600 font-semibold">{formatPrice(s.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-primary-100 flex justify-between text-sm font-semibold">
            <span className="text-stone-700">Total ({formatDuration(totalDuration)})</span>
            <span className="text-primary-600">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`p-4 rounded-2xl ${
            message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || serviceIds.length === 0 || !branchId}
        className="group w-full relative overflow-hidden bg-stone-900 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
      >
        <span className="flex items-center gap-2">
          {loading ? "Booking..." : "Confirm Appointment"}
          {!loading && <ChevronRight size={18} className="text-primary-400 group-hover:translate-x-0.5 transition-transform" />}
        </span>
      </button>
    </form>
  );
}
