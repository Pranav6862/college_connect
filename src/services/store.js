import { initial } from "../data/mock";
const KEY = "college-connect-v1";
export function loadData() {
  try {
    return {
      sentInvitations: [],
      ...initial,
      ...JSON.parse(localStorage.getItem(KEY) || "{}"),
    };
  } catch {
    return initial;
  }
}
export function saveData(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
