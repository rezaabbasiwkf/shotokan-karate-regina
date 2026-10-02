export function ageFromDob(value: string, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const birth = new Date(`${value}T12:00:00`);
  const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  if (Number.isNaN(birth.getTime()) || birth > currentDate) return "";
  const [year, month, day] = value.split("-").map(Number);
  if (birth.getFullYear() !== year || birth.getMonth() + 1 !== month || birth.getDate() !== day) return "";
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return String(age);
}
