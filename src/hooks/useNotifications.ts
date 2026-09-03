"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "booking" | "review" | "system" | "promotion";
  read: boolean;
  link?: string;
  created_at: string;
}

function getStorageKey(userId: string) {
  return `dinely_read_notifications_${userId}`;
}

function loadReadIds(userId: string): Set<string> {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      return new Set(JSON.parse(raw));
    }
  } catch {
    // ignore
  }
  return new Set();
}

function saveReadIds(userId: string, ids: Set<string>) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

export function useNotifications() {
  const { user } = useAuth();
  const userId = user?._id || "";

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const json = await res.json();
        const serverNotifications: Notification[] = json.data || [];

        if (userId) {
          // Merge with locally persisted read state
          const readIds = loadReadIds(userId);
          const merged = serverNotifications.map((n) => ({
            ...n,
            read: readIds.has(n.id) ? true : n.read,
          }));
          setNotifications(merged);
          setUnreadCount(merged.filter((n) => !n.read).length);
        } else {
          setNotifications(serverNotifications);
          setUnreadCount(json.unreadCount || 0);
        }
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
    // Refresh every 30 seconds
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!userId) return;

      // Persist to localStorage
      const readIds = loadReadIds(userId);
      readIds.add(id);
      saveReadIds(userId, readIds);

      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Persist to server (best-effort)
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
      } catch {
        // Server persist failed, localStorage already saved
      }
    },
    [userId],
  );

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    // Persist all current notification IDs to localStorage
    const readIds = loadReadIds(userId);
    notifications.forEach((n) => readIds.add(n.id));
    saveReadIds(userId, readIds);

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    // Persist to server (best-effort)
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
    } catch {
      // Server persist failed, localStorage already saved
    }
  }, [userId, notifications]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh: load,
  };
}
