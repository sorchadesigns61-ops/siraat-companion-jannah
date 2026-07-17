export type Dhikr = {
  arabic: string;
  transliteration: string;
  translation: string;
  reference?: string;
  count?: number;
};

export type DhikrCategory = { id: string; title: string; description: string; items: Dhikr[] };

export const ADHKAR: DhikrCategory[] = [
  {
    id: "morning",
    title: "Morning Adhkar",
    description: "Recited after Fajr until sunrise.",
    items: [
      {
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
        transliteration: "Asbahnaa wa asbahal-mulku lillah, walhamdu lillah",
        translation: "We have entered the morning and the dominion belongs to Allah, and all praise is for Allah.",
        reference: "Muslim",
      },
      {
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        transliteration: "Allahumma bika asbahnaa, wa bika amsaynaa, wa bika nahyaa, wa bika namootu, wa ilaykan-nushoor",
        translation: "O Allah, by You we enter the morning and evening, live and die, and to You is the resurrection.",
        reference: "Abu Dawud, Tirmidhi",
      },
      {
        arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
        transliteration: "Hasbiyallahu laa ilaaha illaa Huwa, 'alayhi tawakkaltu wa Huwa Rabbul-'Arshil-'Adheem",
        translation: "Allah is sufficient for me. There is no god but Him. Upon Him I rely, and He is the Lord of the mighty Throne.",
        reference: "Abu Dawud",
        count: 7,
      },
    ],
  },
  {
    id: "evening",
    title: "Evening Adhkar",
    description: "Recited after Asr until Maghrib.",
    items: [
      {
        arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
        transliteration: "Amsaynaa wa amsal-mulku lillah, walhamdu lillah",
        translation: "We have entered the evening and the dominion belongs to Allah, and all praise is for Allah.",
        reference: "Muslim",
      },
      {
        arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        transliteration: "A'udhu bi kalimaatillahit-taammaati min sharri maa khalaq",
        translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        reference: "Muslim",
        count: 3,
      },
    ],
  },
  {
    id: "sleep",
    title: "Before Sleep",
    description: "Adhkar to seal the night with remembrance.",
    items: [
      {
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amootu wa ahyaa",
        translation: "In Your name, O Allah, I die and I live.",
        reference: "Bukhari",
      },
      {
        arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        transliteration: "Allahumma qini 'adhaabaka yawma tab'athu 'ibaadaka",
        translation: "O Allah, protect me from Your punishment on the day You resurrect Your servants.",
        reference: "Abu Dawud, Tirmidhi",
        count: 3,
      },
    ],
  },
  {
    id: "waking",
    title: "Upon Waking",
    description: "Begin the day with gratitude.",
    items: [
      {
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Alhamdu lillahil-ladhee ahyaanaa ba'da maa amaatanaa wa ilayhin-nushoor",
        translation: "All praise is for Allah who gave us life after taking it, and to Him is the resurrection.",
        reference: "Bukhari",
      },
    ],
  },
  {
    id: "travel",
    title: "Travel",
    description: "For safety and reliance upon Allah while travelling.",
    items: [
      {
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        transliteration: "Subhaanal-ladhee sakhkhara lanaa haadhaa wa maa kunnaa lahu muqrineen, wa innaa ilaa Rabbinaa lamunqaliboon",
        translation: "Glory to Him who has subjected this to us; we could never have accomplished it. And indeed to our Lord we will return.",
        reference: "Qur'an 43:13-14",
      },
    ],
  },
  {
    id: "hardship",
    title: "Hardship & Anxiety",
    description: "For distress, worry, and difficulty.",
    items: [
      {
        arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
        transliteration: "Laa ilaaha illaa Anta subhaanaka innee kuntu minadh-dhaalimeen",
        translation: "There is no god but You; glory be to You. Indeed, I was of the wrongdoers.",
        reference: "Qur'an 21:87",
      },
      {
        arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        transliteration: "Hasbunallahu wa ni'mal-wakeel",
        translation: "Allah is sufficient for us and He is the best Disposer of affairs.",
        reference: "Qur'an 3:173",
      },
    ],
  },
];
