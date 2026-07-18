export type ComfortAyah = {
  arabic: string;
  translation: string;
  reference: string;
  note?: string;
};

// A mood → gentle ayah(s) map. Not a fatwa — a soft reminder.
export const COMFORT_BY_MOOD: Record<string, ComfortAyah[]> = {
  grateful: [
    {
      arabic: "لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
      translation: "If you are grateful, I will surely increase you.",
      reference: "Qur'an 14:7",
      note: "Shukr multiplies blessing — even the ability to say Alhamdulillah is itself a gift.",
    },
  ],
  hopeful: [
    {
      arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
      translation: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
      reference: "Qur'an 39:53",
      note: "Whatever the day looked like, His door is still open.",
    },
  ],
  sorrowful: [
    {
      arabic: "إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ",
      translation: "I only complain of my grief and sorrow to Allah.",
      reference: "Qur'an 12:86",
      note: "Ya'qub ﷺ turned his heartbreak toward Allah alone. You can too.",
    },
    {
      arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      translation: "For indeed, with hardship comes ease. Indeed, with hardship comes ease.",
      reference: "Qur'an 94:5-6",
    },
  ],
  distracted: [
    {
      arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      translation: "Truly, in the remembrance of Allah do hearts find rest.",
      reference: "Qur'an 13:28",
      note: "One dhikr, one ayah, one breath — that is enough to begin returning.",
    },
  ],
  peaceful: [
    {
      arabic: "هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ",
      translation: "It is He who sent down tranquillity into the hearts of the believers.",
      reference: "Qur'an 48:4",
      note: "Sakīnah is His gift — protect it with gratitude.",
    },
  ],
  anxious: [
    {
      arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
      translation: "And whoever relies upon Allah — He is sufficient for him.",
      reference: "Qur'an 65:3",
    },
    {
      arabic: "لَا تَخَفْ وَلَا تَحْزَنْ ۖ إِنَّ اللَّهَ مَعَنَا",
      translation: "Do not fear and do not grieve — indeed Allah is with us.",
      reference: "Qur'an 9:40",
    },
  ],
  repentant: [
    {
      arabic: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ",
      translation: "Indeed, Allah loves those who turn to Him in repentance and loves those who purify themselves.",
      reference: "Qur'an 2:222",
      note: "Your return is loved by Him — do not let shame keep you distant.",
    },
  ],
};

export function comfortForMood(mood: string | null | undefined): ComfortAyah | null {
  if (!mood) return null;
  const list = COMFORT_BY_MOOD[mood];
  if (!list || list.length === 0) return null;
  // Stable-ish daily rotation per mood
  const seed = Math.floor(Date.now() / (1000 * 60 * 60 * 6));
  return list[seed % list.length];
}
