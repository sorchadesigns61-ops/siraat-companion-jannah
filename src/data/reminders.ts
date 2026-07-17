export type Reminder = { text: string; source: string };

export const REMINDERS: Reminder[] = [
  { text: "And whoever fears Allah — He will make for him a way out.", source: "Qur'an 65:2" },
  { text: "Indeed, with hardship comes ease.", source: "Qur'an 94:6" },
  { text: "So remember Me; I will remember you.", source: "Qur'an 2:152" },
  { text: "The most beloved deeds to Allah are those done consistently, even if small.", source: "Sahih al-Bukhari" },
  { text: "Whoever treads a path in search of knowledge, Allah will make easy for him a path to Paradise.", source: "Sahih Muslim" },
  { text: "None of you truly believes until he loves for his brother what he loves for himself.", source: "Sahih al-Bukhari" },
  { text: "The strong person is not the one who overcomes others by strength, but the one who controls himself when angry.", source: "Sahih al-Bukhari" },
  { text: "Say: My Lord, increase me in knowledge.", source: "Qur'an 20:114" },
  { text: "Verily in the remembrance of Allah do hearts find rest.", source: "Qur'an 13:28" },
  { text: "A kind word is charity.", source: "Sahih al-Bukhari" },
  { text: "Smiling in the face of your brother is charity.", source: "Jami' at-Tirmidhi" },
  { text: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.", source: "Qur'an 39:53" },
];

export function reminderForDate(d = new Date()): Reminder {
  const day = Math.floor(d.getTime() / 86400000);
  return REMINDERS[day % REMINDERS.length];
}
