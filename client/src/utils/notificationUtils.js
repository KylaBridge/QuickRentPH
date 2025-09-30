/**
 * NOTIFICATIONS UTILITIES - Shared notification data and utilities
 *
 * This module provides centralized notification data and utility functions
 * that can be used across Dashboard and Notifications pages.
 */

export const notificationData = [
  {
    id: 1,
    type: "info",
    title: "New rental request to DSLR Camera from @holygram",
    time: "2 hours ago",
    status: "unread",
    category: "requests",
  },
  {
    id: 2,
    type: "success",
    title: "Your rental request for Laptop was approved by @giksjar",
    time: "8 hours ago",
    status: "read",
    category: "requests",
  },
  {
    id: 3,
    type: "warning",
    title: "Reminder to return the Mountain Bike tomorrow to @winsykal",
    time: "1 day ago",
    status: "unread",
    category: "reminders",
  },
  {
    id: 4,
    type: "message",
    title: "You have a new message from @janedoe",
    time: "3 days ago",
    status: "unread",
    category: "messages",
  },
  {
    id: 5,
    type: "payment",
    title: "Payment for Karaoke Set already transferred by @2hollis",
    time: "1 week ago",
    status: "unread",
    category: "payments",
  },
  {
    id: 6,
    type: "message",
    title: "You have a new message from @2hollis",
    time: "2 weeks ago",
    status: "unread",
    category: "messages",
  },
  {
    id: 7,
    type: "info",
    title: "New rental request to Electric Guitar from @lolibahia",
    time: "1 month ago",
    status: "unread",
    category: "requests",
  },
  {
    id: 8,
    type: "success",
    title: "Your rental request for Grand Piano was approved by @musikan",
    time: "4 months ago",
    status: "read",
    category: "requests",
  },
  {
    id: 9,
    type: "payment",
    title: "Deposit for Projector rental already transferred by @jigshall",
    time: "2 months ago",
    status: "unread",
    category: "payments",
  },
  {
    id: 10,
    type: "payment",
    title: "Downpayment for DSLR Camera received",
    time: "5 months ago",
    status: "unread",
    category: "payments",
  },
  {
    id: 11,
    type: "warning",
    title: "Reminder to return the Sound System Set tomorrow to @jackdoe",
    time: "3 weeks ago",
    status: "unread",
    category: "reminders",
  },
  {
    id: 12,
    type: "warning",
    title: "Reminder to return the Karaoke Set today to @sidlilly",
    time: "2 months ago",
    status: "unread",
    category: "reminders",
  },
];

//Sort notifications by time (most recent first)
export const sortNotificationsByTime = (notifications) => {
  const timeToMinutes = (timeStr) => {
    const [value, unit] = timeStr.split(" ");
    const numValue = parseInt(value);
    switch (unit) {
      case "minute":
      case "minutes":
        return numValue;
      case "hour":
      case "hours":
        return numValue * 60;
      case "day":
      case "days":
        return numValue * 60 * 24;
      case "week":
      case "weeks":
        return numValue * 60 * 24 * 7;
      case "month":
      case "months":
        return numValue * 60 * 24 * 30; // Approximation
      case "year":
      case "years":
        return numValue * 60 * 24 * 365; // Approximation
      default:
        return 0;
    }
  };
  return notifications.sort(
    (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
  );
};

//Get the most recent notifications (for dashboard preview)
export const getRecentNotifications = (count = 5) => {
  const sortedNotifications = sortNotificationsByTime([...notificationData]);
  return sortedNotifications.slice(0, count);
};

//Get notification type color classes
export const getNotificationTypeColor = (type) => {
  switch (type) {
    case "success":
      return "bg-green-500";
    case "warning":
      return "bg-orange-500";
    case "message":
      return "bg-purple-500";
    case "payment":
      return "bg-blue-500";
    case "info":
    default:
      return "bg-blue-500";
  }
};
