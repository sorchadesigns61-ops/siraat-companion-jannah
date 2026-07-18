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
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
        transliteration: "Allahumma innee as'alukal-'afwa wal-'aafiyata fid-dunyaa wal-aakhirah",
        translation: "O Allah, I ask You for pardon and well-being in this life and the next.",
        reference: "Ibn Majah, Abu Dawud",
      },
      {
        arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        transliteration: "Bismillahil-ladhee laa yadurru ma'as-mihi shay'un fil-ardi wa laa fis-samaa'i wa Huwas-Samee'ul-'Aleem",
        translation: "In the name of Allah, with whose name nothing on earth or in the heavens can cause harm; He is the All-Hearing, the All-Knowing.",
        reference: "Abu Dawud, Tirmidhi",
        count: 3,
      },
      {
        arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا",
        transliteration: "Radeetu billahi Rabban, wa bil-Islaami deenan, wa bi Muhammadin ﷺ nabiyyan",
        translation: "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.",
        reference: "Abu Dawud, Tirmidhi",
        count: 3,
      },
      {
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        transliteration: "Subhaanallahi wa bihamdih",
        translation: "Glory is to Allah, and all praise is for Him.",
        reference: "Muslim",
        count: 100,
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
      {
        arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي",
        transliteration: "Allahumma 'aafinee fee badanee, Allahumma 'aafinee fee sam'ee, Allahumma 'aafinee fee basaree",
        translation: "O Allah, grant well-being to my body, my hearing, and my sight.",
        reference: "Abu Dawud",
        count: 3,
      },
      {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ",
        transliteration: "Allahumma innee a'udhu bika minal-kufri wal-faqri, wa a'udhu bika min 'adhaabil-qabr",
        translation: "O Allah, I seek refuge in You from disbelief and poverty, and from the punishment of the grave.",
        reference: "Abu Dawud",
        count: 3,
      },
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
        transliteration: "Allahumma innee as'aluka 'ilman naafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan",
        translation: "O Allah, I ask You for beneficial knowledge, wholesome provision, and accepted deeds.",
        reference: "Ibn Majah",
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
      {
        arabic: "سُبْحَانَ اللَّهِ (٣٣) وَالْحَمْدُ لِلَّهِ (٣٣) وَاللَّهُ أَكْبَرُ (٣٤)",
        transliteration: "Subhaanallah (33), Alhamdulillah (33), Allahu Akbar (34)",
        translation: "Glory to Allah, all praise is for Allah, Allah is the Greatest.",
        reference: "Bukhari, Muslim",
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
      {
        arabic: "اللَّهُمَّ رَحْمَتَكَ أَرْجُو، فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَهَ إِلَّا أَنْتَ",
        transliteration: "Allahumma rahmataka arjoo, falaa takilnee ilaa nafsee tarfata 'ayn, wa aslih lee sha'nee kullah, laa ilaaha illaa Anta",
        translation: "O Allah, I hope for Your mercy — do not leave me to myself even for the blink of an eye. Rectify all of my affairs. There is no god but You.",
        reference: "Abu Dawud",
      },
      {
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
        transliteration: "Allahumma innee a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayni wa ghalabatir-rijaal",
        translation: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debt, and being overpowered by others.",
        reference: "Bukhari",
      },
      {
        arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
        transliteration: "Yaa Hayyu yaa Qayyoom, bi rahmatika astagheeth, aslih lee sha'nee kullah, wa laa takilnee ilaa nafsee tarfata 'ayn",
        translation: "O Ever-Living, O Sustainer of all, by Your mercy I seek help. Rectify all my affairs and do not entrust me to myself even for the blink of an eye.",
        reference: "Nasa'i, Hakim",
      },
    ],
  },
  {
    id: "forgiveness",
    title: "Forgiveness & Repentance",
    description: "Return to Allah — His mercy is greater than any sin.",
    items: [
      {
        arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
        transliteration: "Astaghfirullaha wa atoobu ilayh",
        translation: "I seek Allah's forgiveness and turn to Him in repentance.",
        reference: "Bukhari",
        count: 100,
      },
      {
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        transliteration: "Sayyidul-Istighfar: Allahumma Anta Rabbee, laa ilaaha illaa Ant…",
        translation: "The chief supplication for forgiveness: O Allah, You are my Lord — none is worthy of worship but You. You created me and I am Your servant. I keep Your covenant to the best of my ability. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I confess my sin, so forgive me — for none forgives sins except You.",
        reference: "Bukhari",
      },
      {
        arabic: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
        transliteration: "Rabbanaa dhalamnaa anfusanaa wa in lam taghfir lanaa wa tarhamnaa lanakoonanna minal-khaasireen",
        translation: "Our Lord, we have wronged ourselves. If You do not forgive us and have mercy on us, we will surely be among the losers.",
        reference: "Qur'an 7:23",
      },
      {
        arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
        transliteration: "Rabbighfir lee wa tub 'alayya innaka Antat-Tawwaabur-Raheem",
        translation: "My Lord, forgive me and accept my repentance — indeed You are the Ever-Relenting, the Most Merciful.",
        reference: "Tirmidhi",
        count: 100,
      },
    ],
  },
  {
    id: "guidance",
    title: "Guidance & Steadfastness",
    description: "For a firm heart on the straight path.",
    items: [
      {
        arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        transliteration: "Ihdinas-siraatal-mustaqeem",
        translation: "Guide us to the straight path.",
        reference: "Qur'an 1:6",
      },
      {
        arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
        transliteration: "Yaa muqallibal-quloob, thabbit qalbee 'alaa deenik",
        translation: "O Turner of hearts, keep my heart firm upon Your religion.",
        reference: "Tirmidhi",
      },
      {
        arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
        transliteration: "Rabbanaa laa tuzigh quloobanaa ba'da idh hadaytanaa wa hab lanaa min ladunka rahmah, innaka Antal-Wahhaab",
        translation: "Our Lord, do not let our hearts deviate after You have guided us, and grant us mercy from Yourself. Indeed You are the Bestower.",
        reference: "Qur'an 3:8",
      },
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
        transliteration: "Allahumma innee as'alukal-hudaa wat-tuqaa wal-'afaafa wal-ghinaa",
        translation: "O Allah, I ask You for guidance, God-consciousness, chastity, and contentment.",
        reference: "Muslim",
      },
    ],
  },
  {
    id: "sustenance",
    title: "Sustenance & Barakah",
    description: "For lawful provision and blessing in what you have.",
    items: [
      {
        arabic: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
        transliteration: "Allahumma ikfinee bi halaalika 'an haraamik, wa aghninee bi fadlika 'amman siwaak",
        translation: "O Allah, suffice me with what You have made lawful, freeing me from the unlawful, and enrich me by Your grace so I need none but You.",
        reference: "Tirmidhi",
      },
      {
        arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
        transliteration: "Allahumma baarik lanaa feemaa razaqtanaa wa qinaa 'adhaaban-naar",
        translation: "O Allah, bless us in what You have provided for us, and save us from the punishment of the Fire.",
        reference: "Ibn Majah",
      },
      {
        arabic: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
        transliteration: "Rabbi innee limaa anzalta ilayya min khayrin faqeer",
        translation: "My Lord, I am in need of whatever good You send down to me.",
        reference: "Qur'an 28:24",
      },
    ],
  },
  {
    id: "family",
    title: "Family & Parents",
    description: "For loved ones, spouses, and children.",
    items: [
      {
        arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        transliteration: "Rabbir-hamhumaa kamaa rabbayaanee sagheeraa",
        translation: "My Lord, have mercy on them as they raised me when I was small.",
        reference: "Qur'an 17:24",
      },
      {
        arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
        transliteration: "Rabbanaa hab lanaa min azwaajinaa wa dhurriyyaatinaa qurrata a'yun waj'alnaa lil-muttaqeena imaamaa",
        translation: "Our Lord, grant us from our spouses and offspring the coolness of our eyes, and make us leaders for the God-conscious.",
        reference: "Qur'an 25:74",
      },
      {
        arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي، رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
        transliteration: "Rabbij-'alnee muqeemas-salaati wa min dhurriyyatee, Rabbanaa wa taqabbal du'aa'",
        translation: "My Lord, make me an establisher of prayer, and my offspring too. Our Lord, and accept my supplication.",
        reference: "Qur'an 14:40",
      },
    ],
  },
];
