import { colors } from "@/constants/colors";

export function getStatusColor(status: string): string {
  switch (status) {
  case "waiting for payment":
    return colors.warning;
  case "waiting for confirmation":
    return colors.primary;
  case "processing":
    return colors.primary;
  case "sent":
    return colors.success;
  case "finished":
    return colors.success;
  case "cancelled":
    return colors.danger;
  default:
    return colors.danger;
  }
}

export function formatDate(date: Date): string {
  const aMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const y = date.getFullYear();
  const m = aMonths[date.getMonth()];
  const d = date.getDate();
  const hh = date.getHours();
  const mm = date.getMinutes();

  return `${d} ${m} ${y}, ${hh < 10 ? "0" : ""}${hh}:${mm < 10 ? "0" : ""}${mm}`;
}