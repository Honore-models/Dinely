"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, CheckCheck, Clock, ShoppingBag, Calendar, Star, Info, Tag, X } from "lucide-react";
import { useNotifications, type Notification } from "@/hooks/useNotifications";

const typeConfig: Record<Notification["type"], { icon: typeof Bell; color: string; bg: string }> = {
  order: { icon: ShoppingBag, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-950" },
  booking: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-950" },
  review: { icon: Star, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-950" },
  system: { icon: Info, color: "text-neutral-500", bg: "bg-neutral-100 dark:bg-neutral-800" },
  promotion: { icon: Tag, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-950" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

interface NotificationDropdownProps {
  variant?: "default" | "compact";
}

export function NotificationDropdown({ variant = "default" }: NotificationDropdownProps) {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      router.push(notification.link);
    }
    setOpen(false);
  };

  if (variant === "compact") {
    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="relative grid h-10 w-10 place-items-center rounded-xl text-neutral-600 transition hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
            <NotificationContent
              notifications={notifications}
              loading={loading}
              unreadCount={unreadCount}
              onNotificationClick={handleNotificationClick}
              onMarkAllRead={markAllAsRead}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative grid h-9 w-9 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
          <NotificationContent
            notifications={notifications}
            loading={loading}
            unreadCount={unreadCount}
            onNotificationClick={handleNotificationClick}
            onMarkAllRead={markAllAsRead}
          />
        </div>
      )}
    </div>
  );
}

function NotificationContent({
  notifications,
  loading,
  unreadCount,
  onNotificationClick,
  onMarkAllRead,
}: {
  notifications: Notification[];
  loading: boolean;
  unreadCount: number;
  onNotificationClick: (n: Notification) => void;
  onMarkAllRead: () => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-xs font-semibold text-[#22c51f] hover:text-[#1bad1a]"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="space-y-1 p-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 rounded-xl p-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
                  <div className="h-2.5 w-full animate-pulse rounded bg-neutral-100 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <Bell size={20} className="text-neutral-400" />
            </div>
            <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">No notifications yet</p>
            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">We&apos;ll notify you when something happens</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-50 dark:divide-neutral-800">
            {notifications.map((notification) => {
              const config = typeConfig[notification.type];
              const Icon = config.icon;
              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => onNotificationClick(notification)}
                  className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-neutral-50 dark:hover:bg-neutral-800 ${
                    !notification.read ? "bg-green-50/50 dark:bg-green-950/20" : ""
                  }`}
                >
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${config.bg}`}>
                    <Icon size={18} className={config.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${!notification.read ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-300"}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#22c51f]" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                      <Clock size={10} />
                      {timeAgo(notification.created_at)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-neutral-100 px-4 py-2.5 dark:border-neutral-800">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="w-full text-center text-xs font-semibold text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            {unreadCount > 0 ? `Mark all ${unreadCount} as read` : "All caught up!"}
          </button>
        </div>
      )}
    </>
  );
}
