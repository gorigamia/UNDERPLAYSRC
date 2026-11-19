// src/services/gameCoversDatabase.js
// Banco de dados expandido de capas para trilhas sonoras de games e rádios in-game
// Totalmente integrado com a biblioteca de jogos e OSTs (G:\MUSICAS\GAMES MUSIC, Zophar's Domain, GTA, Retro & Next-Gen)

export const GAME_COVERS_DATABASE = [
  // ==========================================
  // G:\MUSICAS\GAMES MUSIC & RETRO FAVORITES
  // ==========================================
  {
    id: 'actraiser',
    keywords: ['actraiser', 'act raiser', 'fillmore', 'birth of the people', 'yuzo koshiro actraiser'],
    franchise: 'ActRaiser (SNES)',
    title: 'ActRaiser Original Soundtrack',
    artist: 'Yuzo Koshiro / Enix',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x02.jpg'
  },
  {
    id: 'batman-robin-adventures',
    keywords: ['adventures of batman & robin', 'adventures of batman and robin', 'jesper kyd batman', 'batman & robin'],
    franchise: 'The Adventures of Batman & Robin',
    title: 'The Adventures of Batman & Robin OST',
    artist: 'Jesper Kyd / SEGA',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co20t0.jpg'
  },
  {
    id: 'after-burner',
    keywords: ['after burner', 'after burner ii', 'after burner - black falcon', 'final take off', 'hiroshi kawaguchi after burner'],
    franchise: 'After Burner Series',
    title: 'After Burner II / Black Falcon OST',
    artist: 'Hiroshi Kawaguchi / SEGA Sound Team',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzp.jpg'
  },
  {
    id: 'amplitude',
    keywords: ['amplitude', 'amplitude ps2', 'harmonix', 'kassidy amplitude'],
    franchise: 'Amplitude (PS2)',
    title: 'Amplitude Original Game Soundtrack',
    artist: 'Harmonix / Sony Computer Entertainment',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0j.jpg'
  },
  {
    id: 'asterix',
    keywords: ['asterix', 'asterix & obelix', 'alberto jose gonzalez'],
    franchise: 'Asterix (SNES / GB)',
    title: 'Asterix Soundtrack',
    artist: 'Alberto Jose Gonzalez / Infogrames',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1m1j.jpg'
  },
  {
    id: 'batman-return-joker',
    keywords: ['return of the joker', 'batman - return of the joker', 'naoki kodaka', 'sunsoft batman'],
    franchise: 'Batman: Return of the Joker',
    title: 'Batman: Return of the Joker OST',
    artist: 'Naoki Kodaka / Sunsoft',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x05.jpg'
  },
  {
    id: 'beyond-good-and-evil',
    keywords: ['beyond good & evil', 'beyond good and evil', 'christophe heral', 'christophe héral', 'propaganda bge', 'hyllis'],
    franchise: 'Beyond Good & Evil',
    title: 'Beyond Good & Evil Original Soundtrack',
    artist: 'Christophe Héral / Ubisoft',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0k.jpg'
  },
  {
    id: 'bully-rockstar',
    keywords: ['bully', 'canis canem edit', 'shawn lee', 'walking theme bully', 'slingshot bully', 'jimmy hopkins', 'bullworth'],
    franchise: 'Bully / Canis Canem Edit',
    title: 'Bully Original Soundtrack',
    artist: 'Shawn Lee / Rockstar Games',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg'
  },
  {
    id: 'castlevania-dracula-x',
    keywords: ['castlevania', 'dracula x', 'castlevania - dracula x', 'vampire\'s kiss', 'vampires kiss', 'rondo of blood', 'vampire killer', 'bloody tears', 'kinuyo yamashita', 'richter belmont'],
    franchise: 'Castlevania Series',
    title: 'Castlevania: Dracula X / Rondo of Blood OST',
    artist: 'Konami Kukeiha Club / Michiru Yamane',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x3c.jpg'
  },
  {
    id: 'chip-n-dale',
    keywords: ['chip \'n dale', 'chip n dale rescue rangers', 'rescue rangers capcom', 'harumi fujita'],
    franchise: 'Chip \'n Dale Rescue Rangers',
    title: 'Chip \'n Dale Rescue Rangers OST',
    artist: 'Harumi Fujita / Capcom',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x05.jpg'
  },
  {
    id: 'chuchu-rocket',
    keywords: ['chuchu rocket', 'chuchu rocket!', 'tomoya ohtani', 'sonic team chuchu'],
    franchise: 'ChuChu Rocket! (Dreamcast)',
    title: 'ChuChu Rocket! Original Soundtrack',
    artist: 'Tomoya Ohtani / SEGA Sonic Team',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co21i5.jpg'
  },
  {
    id: 'conkers-bad-fur-day',
    keywords: ['conker\'s bad fur day', 'conkers bad fur day', 'conker', 'robin beanland', 'sloprano', 'great mighty poo', 'windy and the windmill', 'rareware conker'],
    franchise: 'Conker\'s Bad Fur Day (N64)',
    title: 'Conker\'s Bad Fur Day OST',
    artist: 'Robin Beanland / Rare',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzl.jpg'
  },
  {
    id: 'cool-spot',
    keywords: ['cool spot', 'tommy tallarico cool spot', 'rave dance cool spot', 'spot 7up'],
    franchise: 'Cool Spot (Mega Drive / SNES)',
    title: 'Cool Spot Soundtrack',
    artist: 'Tommy Tallarico / Virgin Games',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzk.jpg'
  },
  {
    id: 'crash-twinsanity',
    keywords: ['crash twinsanity', 'spiralmouth', 'twinsanity', 'n. sanely insane', 'worm chase', 'cortex twinsanity'],
    franchise: 'Crash Twinsanity (PS2/Xbox)',
    title: 'Crash Twinsanity Original Soundtrack',
    artist: 'Spiralmouth / Paul O\'Rourke',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0j.jpg'
  },
  {
    id: 'diddy-kong-racing',
    keywords: ['diddy kong racing', 'david wise dkr', 'hot top volcano', 'ancient lake', 'spaceport alpha', 'taj the genie'],
    franchise: 'Diddy Kong Racing (N64)',
    title: 'Diddy Kong Racing OST',
    artist: 'David Wise / Rare',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzl.jpg'
  },
  {
    id: 'donkey-kong-64',
    keywords: ['donkey kong 64', 'dk64', 'grant kirkhope dk64', 'dk rap', 'jungle japes', 'hideout helm', 'frantic factory'],
    franchise: 'Donkey Kong 64 (N64)',
    title: 'Donkey Kong 64 Original Soundtrack',
    artist: 'Grant Kirkhope / Rare',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzl.jpg'
  },
  {
    id: 'dragon-ball-z-budokai-3',
    keywords: ['dragon ball z - budokai 3', 'budokai 3', 'hironobu kageyama budokai 3', 'kenji yamamoto budokai 3'],
    franchise: 'Dragon Ball Z: Budokai 3',
    title: 'Dragon Ball Z: Budokai 3 Soundtrack',
    artist: 'Kenji Yamamoto / Bandai',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2k05.jpg'
  },
  {
    id: 'earthworm-jim',
    keywords: ['earthworm jim', 'earthworm jim 2', 'tommy tallarico', 'new junk city', 'what the heck', 'andy asteroids'],
    franchise: 'Earthworm Jim (Mega Drive / SNES)',
    title: 'Earthworm Jim Anthology Soundtrack',
    artist: 'Tommy Tallarico / Shiny Entertainment',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzk.jpg'
  },
  {
    id: 'final-fantasy-iv',
    keywords: ['final fantasy iv', 'final fantasy 4', 'the prelude ffiv', 'red wings', 'theme of love ffiv', 'nobuo uematsu ffiv', 'cecil theme'],
    franchise: 'Final Fantasy IV (SNES)',
    title: 'Final Fantasy IV Original Sound Version',
    artist: 'Nobuo Uematsu / Square',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzn.jpg'
  },
  {
    id: 'final-fantasy-xi',
    keywords: ['final fantasy xi', 'treasures of aht urhgan', 'bustle of the capital', 'naoshi mizuta', 'nobuo uematsu ffxi'],
    franchise: 'Final Fantasy XI Online',
    title: 'Final Fantasy XI: Treasures of Aht Urhgan OST',
    artist: 'Naoshi Mizuta & Nobuo Uematsu / Square Enix',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3nn5.jpg'
  },
  {
    id: 'final-zone',
    keywords: ['final zone', 'motoi sakuraba final zone', 'next war', 'wolf team'],
    franchise: 'Final Zone (Mega Drive)',
    title: 'Final Zone Original Soundtrack',
    artist: 'Motoi Sakuraba / Wolf Team',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0s.jpg'
  },
  {
    id: 'futurama',
    keywords: ['futurama', 'christopher tyng', 'futurama ost', 'futurama game', 'front-end-shorted'],
    franchise: 'Futurama: The Game',
    title: 'Futurama Original Game Soundtrack',
    artist: 'Christopher Tyng / Fox Interactive',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0j.jpg'
  },
  {
    id: 'grandia-series',
    keywords: ['grandia', 'grandia iii', 'grandia xtreme', 'grandia (ps1)', 'noriyuki iwadare', 'theme of grandia', 'justin grandia'],
    franchise: 'Grandia Series',
    title: 'Grandia Original Soundtrack',
    artist: 'Noriyuki Iwadare / Game Arts',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzv.jpg'
  },
  {
    id: 'gta2-radio-stations',
    keywords: ['gta2', 'gta 2', 'head radio gta2', 'kgbh', 'futuro fm', 'osmosis', 'heavenly', 'lithium fm', 'rebel radio gta2', 'tsunami gta2', 'zaibatsu', 'k-jah gta2', 'vallejo gta2', 'claude speed'],
    franchise: 'Grand Theft Auto 2',
    title: 'Grand Theft Auto 2 In-Game Radio',
    artist: 'Rockstar Games / DMA Design',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0m.jpg'
  },
  {
    id: 'harvest-moon',
    keywords: ['harvest moon', 'bokujou monogatari', 'chackey', 'pack-in-video', 'natsume harvest moon'],
    franchise: 'Harvest Moon (SNES)',
    title: 'Harvest Moon (Bokujou Monogatari) OST',
    artist: 'Tsuyoshi Tanaka (CHACKey) / Natsume',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1m1j.jpg'
  },
  {
    id: 'zelda-ocarina-of-time',
    keywords: ['ocarina of time', 'zelda oot', 'gerudo valley', 'song of storms', 'zelda lullaby', 'lost woods', 'title theme oot', 'koji kondo oot', 'kokiri forest', 'water temple'],
    franchise: 'The Legend of Zelda: Ocarina of Time',
    title: 'The Legend of Zelda: Ocarina of Time OST',
    artist: 'Koji Kondo / Nintendo',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.jpg'
  },
  {
    id: 'new-tetris',
    keywords: ['the new tetris', 'new tetris', 'neil d. voss', 'neil d voss', 'h2o entertainment', 'tetris n64'],
    franchise: 'The New Tetris (N64)',
    title: 'The New Tetris Original Soundtrack',
    artist: 'Neil D. Voss / Nintendo',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x07.jpg'
  },
  {
    id: 'ogre-battle-64',
    keywords: ['ogre battle 64', 'person of lordly caliber', 'hitoshi sakimoto ogre', 'masaharu iwata', 'overture ogre battle', 'quest nintendo'],
    franchise: 'Ogre Battle 64: Person of Lordly Caliber',
    title: 'Ogre Battle 64 OST',
    artist: 'Hitoshi Sakimoto & Masaharu Iwata',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tnt.jpg'
  },
  {
    id: 'ms-phantasy-star-1',
    keywords: ['phantasy star (fm)', 'phantasy star (mp3)', 'phantasy star 1', 'phantasy star i', 'alisa landale', 'lutz', 'myau', 'camineet'],
    franchise: 'Phantasy Star (Master System)',
    title: 'Phantasy Star Original Sound Track',
    artist: 'Tokuhiko Uwabo (Bo) / SEGA',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x03.jpg'
  },
  {
    id: 'md-phantasy-star-2',
    keywords: ['phantasy star ii', 'phantasy star 2', 'tokuhiko uwabo', 'rise or fall', 'rolf', 'nei', 'algo star system', 'motavia', 'bo', 'my home', 'pressure'],
    franchise: 'Phantasy Star II (Mega Drive)',
    title: 'Phantasy Star II Original Soundtrack',
    artist: 'Tokuhiko Uwabo (Bo) / SEGA',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co20su.jpg'
  },
  {
    id: 'md-phantasy-star-3',
    keywords: ['phantasy star iii', 'phantasy star 3', 'generations of doom', 'izuho numata', 'izuho takeuchi', 'opening theme phantasy star iii', 'rhys phantasy star'],
    franchise: 'Phantasy Star III: Generations of Doom',
    title: 'Phantasy Star III OST',
    artist: 'Izuho Numata / SEGA',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co20su.jpg'
  },
  {
    id: 'md-phantasy-star-4',
    keywords: ['phantasy star iv', 'phantasy star 4', 'the end of the millennium', 'end of the millennium', 'chaz ashley', 'alys brangwin', 'ikenoue', 'her last breath', 'izuho numata'],
    franchise: 'Phantasy Star IV: The End of the Millennium',
    title: 'Phantasy Star IV OST',
    artist: 'Izuho Takeuchi (Numata) / SEGA',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co20sv.jpg'
  },
  {
    id: 'quake-ii',
    keywords: ['quake ii', 'quake 2', 'sonic mayhem', 'sascha dikiciyan', 'quad machine', 'descent into cerberon', 'sparse01', 'id software quake'],
    franchise: 'Quake II (PC / N64)',
    title: 'Quake II: The Sound of Carnage',
    artist: 'Sonic Mayhem (Sascha Dikiciyan) / id Software',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1nm4.jpg'
  },
  {
    id: 'sonic-the-hedgehog-1',
    keywords: ['sonic the hedgehog (mp3)', 'green hill zone', 'star light zone', 'spring yard zone', 'scrap brain', 'masato nakamura sonic 1'],
    franchise: 'Sonic the Hedgehog (Mega Drive / Master System)',
    title: 'Sonic the Hedgehog OST',
    artist: 'Masato Nakamura / SEGA',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co21i5.jpg'
  },
  {
    id: 'sonic-the-hedgehog-2',
    keywords: ['sonic the hedgehog 2', 'chemical plant', 'casino night', 'mystic cave', 'naofumi hataya', 'masato nakamura sonic 2'],
    franchise: 'Sonic the Hedgehog 2 (Mega Drive / Master System)',
    title: 'Sonic the Hedgehog 2 OST',
    artist: 'Masato Nakamura & Naofumi Hataya / SEGA',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co21i5.jpg'
  },
  {
    id: 'tony-hawk-pro-skater-1',
    keywords: ['tony hawk\'s pro skater', 'tony hawk s pro skater', 'thps 1', 'brian bright', 'goldfinger superman', 'warehouse thps'],
    franchise: 'Tony Hawk\'s Pro Skater (PS1 / N64)',
    title: 'Tony Hawk\'s Pro Skater Official Soundtrack',
    artist: 'Neversoft / Activision',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co294v.jpg'
  },
  {
    id: 'toy-story-game',
    keywords: ['toy story (mp3)', 'toy story snes', 'toy story genesis', 'randy newman', 'you\'ve got a friend in me', 'strange things'],
    franchise: 'Toy Story (SNES / Mega Drive)',
    title: 'Toy Story Video Game Soundtrack',
    artist: 'Randy Newman / Disney Interactive',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1m1j.jpg'
  },
  {
    id: 'turok-dinosaur-hunter',
    keywords: ['turok: dinosaur hunter', 'turok - dinosaur hunter', 'darren mitchell', 'turok n64', 'iguana entertainment'],
    franchise: 'Turok: Dinosaur Hunter (N64)',
    title: 'Turok: Dinosaur Hunter OST',
    artist: 'Darren Mitchell / Acclaim',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x3k.jpg'
  },
  {
    id: 'wave-race-64',
    keywords: ['wave race 64', 'wave race', 'kazumi totaka wave race', 'dolphin park', 'southern island', 'sunny beach wave race'],
    franchise: 'Wave Race 64 (N64)',
    title: 'Wave Race 64 Original Soundtrack',
    artist: 'Kazumi Totaka / Nintendo',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzc.jpg'
  },
  {
    id: 'wonder-boy-monster-land',
    keywords: ['wonder boy in monster land', 'wonder boy monster land', 'shinichi sakamoto', 'monster land fm', 'westone wonder boy'],
    franchise: 'Wonder Boy in Monster Land (Master System / Arcade)',
    title: 'Wonder Boy in Monster Land OST',
    artist: 'Shinichi Sakamoto / Westone',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzs.jpg'
  },

  // ==========================================
  // GTA SERIES - RÁDIOS & SOUNDTRACKS
  // ==========================================
  {
    id: 'gta-iii-lips-106',
    keywords: ['lips 106', 'lips106', 'gta iii', 'gta 3', 'liberty city lips'],
    franchise: 'Grand Theft Auto III',
    title: 'Lips 106',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/4/46/Lips106-GTAIII-Logo.png/revision/latest?cb=20211107194602',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0m.jpg'
  },
  {
    id: 'gta-iii-head-radio',
    keywords: ['head radio', 'headradio', 'michael hunt'],
    franchise: 'Grand Theft Auto III',
    title: 'Head Radio',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/6/6f/HeadRadio-GTAIII-Logo.png/revision/latest?cb=20211107194452',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0m.jpg'
  },
  {
    id: 'gta-iii-flashback',
    keywords: ['flashback 95.6', 'flashback fm', 'toni flashback', 'scarface flashback'],
    franchise: 'Grand Theft Auto III',
    title: 'Flashback 95.6',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/a/a2/Flashback95.6-GTAIII-Logo.png/revision/latest?cb=20211107194411',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0m.jpg'
  },
  {
    id: 'gta-vice-city-flash-fm',
    keywords: ['flash fm', 'flashfm', 'toni vice city', 'out of touch', 'hall and oates'],
    franchise: 'Grand Theft Auto: Vice City',
    title: 'Flash FM',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/3/30/FlashFM-GTAVC-Logo.png/revision/latest?cb=20211107194833',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0n.jpg'
  },
  {
    id: 'gta-vice-city-wave-103',
    keywords: ['wave 103', 'wave103', 'adam first'],
    franchise: 'Grand Theft Auto: Vice City',
    title: 'Wave 103',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/7/7b/Wave103-GTAVC-Logo.png/revision/latest?cb=20211107195159',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0n.jpg'
  },
  {
    id: 'gta-vice-city-vrock',
    keywords: ['v-rock', 'vrock', 'lazlow vrock', 'love fist'],
    franchise: 'Grand Theft Auto: Vice City',
    title: 'V-Rock',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/e/e2/V-Rock-GTAVC-Logo.png/revision/latest?cb=20211107195133',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0n.jpg'
  },
  {
    id: 'gta-sa-radio-los-santos',
    keywords: ['radio los santos', 'julio g', 'los santos radio'],
    franchise: 'Grand Theft Auto: San Andreas',
    title: 'Radio Los Santos',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/5/53/RadioLosSantos-GTASA-Logo.png/revision/latest?cb=20211107195537',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0o.jpg'
  },
  {
    id: 'gta-sa-k-rose',
    keywords: ['k-rose', 'krose', 'mary-beth maybell', 'all my exes'],
    franchise: 'Grand Theft Auto: San Andreas',
    title: 'K-Rose',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/b/b3/K-Rose-GTASA-Logo.png/revision/latest?cb=20211107195350',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0o.jpg'
  },
  {
    id: 'gta-sa-k-dst',
    keywords: ['k-dst', 'kdst', 'the dust', 'tommy the nightmare smith'],
    franchise: 'Grand Theft Auto: San Andreas',
    title: 'K-DST',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/e/e9/K-DST-GTASA-Logo.png/revision/latest?cb=20211107195315',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0o.jpg'
  },
  {
    id: 'gta-iv-vladivostok',
    keywords: ['vladivostok fm', 'vladivostokfm', 'ruslana', 'schweine', 'glukoza'],
    franchise: 'Grand Theft Auto IV',
    title: 'Vladivostok FM',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/9/91/VladivostokFM-GTAIV-Logo.png/revision/latest?cb=20211107195932',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0q.jpg'
  },
  {
    id: 'gta-v-non-stop-pop',
    keywords: ['non-stop-pop', 'non stop pop', 'cara delevingne pop'],
    franchise: 'Grand Theft Auto V',
    title: 'Non-Stop-Pop FM',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/8/80/Non-Stop-PopFM-GTAV-Logo.png/revision/latest?cb=20211107200236',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg'
  },
  {
    id: 'gta-v-west-coast-classics',
    keywords: ['west coast classics', 'dj pooh', 'dr dre gta'],
    franchise: 'Grand Theft Auto V',
    title: 'West Coast Classics',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/f/fe/WestCoastClassics-GTAV-Logo.png/revision/latest?cb=20211107200508',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg'
  },
  {
    id: 'gta-v-radio-mirror-park',
    keywords: ['radio mirror park', 'twin shadow mirror park'],
    franchise: 'Grand Theft Auto V',
    title: 'Radio Mirror Park',
    artist: 'Rockstar Games',
    coverUrl: 'https://static.wikia.nocookie.net/gtawiki/images/3/36/RadioMirrorPark-GTAV-Logo.png/revision/latest?cb=20211107200346',
    fallbackUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg'
  },
  {
    id: 'rockstar-general',
    keywords: ['rockstar games', 'rockstar north', 'rockstar sound team', 'red dead redemption', 'rdr2'],
    franchise: 'Rockstar Games Official Soundtracks',
    title: 'Rockstar Games Soundtrack Collection',
    artist: 'Rockstar Games',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg'
  },

  // ==========================================
  // RACING GAMES (NFS, ETS2, FORZA, BURNOUT)
  // ==========================================
  {
    id: 'nfs-underground',
    keywords: ['need for speed underground', 'nfs underground', 'get low lil jon'],
    franchise: 'Need for Speed Underground',
    title: 'Need for Speed: Underground OST',
    artist: 'EA Games Soundtrack',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co20se.jpg'
  },
  {
    id: 'nfs-underground-2',
    keywords: ['need for speed underground 2', 'nfs underground 2', 'riders on the storm snoop dogg', 'nfsu2'],
    franchise: 'Need for Speed Underground 2',
    title: 'Need for Speed: Underground 2 OST',
    artist: 'EA Games Soundtrack',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co20sf.jpg'
  },
  {
    id: 'nfs-most-wanted',
    keywords: ['need for speed most wanted', 'nfs most wanted', 'nfsmw'],
    franchise: 'Need for Speed: Most Wanted (2005)',
    title: 'Need for Speed: Most Wanted OST',
    artist: 'EA Games Soundtrack',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1v5j.jpg'
  },
  {
    id: 'ets2',
    keywords: ['euro truck simulator', 'euro truck simulator 2', 'ets2', 'american truck simulator', 'ats'],
    franchise: 'Euro Truck Simulator 2',
    title: 'Euro Truck Simulator 2 Radio & OST',
    artist: 'SCS Software',
    coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7a.jpg'
  }
];

export const LEGENDARY_COMPOSERS = [
  { name: 'koji kondo', keywords: ['koji kondo', 'kondo koji'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1m1j.jpg' },
  { name: 'david wise', keywords: ['david wise', 'wise david'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzl.jpg' },
  { name: 'yuzo koshiro', keywords: ['yuzo koshiro', 'koshiro yuzo'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x02.jpg' },
  { name: 'tokuhiko uwabo', keywords: ['tokuhiko uwabo', 'uwabo tokuhiko', 'bo tokuhiko', 'tokuhiko "bo" uwabo', 'bo'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co20su.jpg' },
  { name: 'nobuo uematsu', keywords: ['nobuo uematsu', 'uematsu nobuo'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzo.jpg' },
  { name: 'yasunori mitsuda', keywords: ['yasunori mitsuda', 'mitsuda yasunori'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tnt.jpg' },
  { name: 'yoko shimomura', keywords: ['yoko shimomura', 'shimomura yoko'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzu.jpg' },
  { name: 'akira yamaoka', keywords: ['akira yamaoka', 'yamaoka akira'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpg' },
  { name: 'gustavo santaolalla', keywords: ['gustavo santaolalla', 'santaolalla'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg' },
  { name: 'mick gordon', keywords: ['mick gordon'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1nm4.jpg' },
  { name: 'jeremy soule', keywords: ['jeremy soule'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tnw.jpg' },
  { name: 'marcin przybylowicz', keywords: ['marcin przybyłowicz', 'marcin przybylowicz'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg' },
  { name: 'martin o\'donnell', keywords: ['martin o\'donnell', 'marty o\'donnell', 'michael salvatori'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x3k.jpg' },
  { name: 'harry gregson-williams', keywords: ['harry gregson-williams', 'norihiko hibino'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x76.jpg' },
  { name: 'shoji meguro', keywords: ['shoji meguro', 'meguro shoji', 'atlus sound team'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r76.jpg' },
  { name: 'keiichi okabe', keywords: ['keiichi okabe', 'okabe keiichi', 'monaca'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x7c.jpg' },
  { name: 'masayoshi soken', keywords: ['masayoshi soken', 'soken masayoshi'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3nn5.jpg' },
  { name: 'c418', keywords: ['c418', 'daniel rosenfeld'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x4d.jpg' },
  { name: 'grant kirkhope', keywords: ['grant kirkhope', 'banjo kazooie', 'goldeneye 007'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzl.jpg' },
  { name: 'michiru yamane', keywords: ['michiru yamane', 'yamane michiru'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x3c.jpg' },
  { name: 'barry leitch', keywords: ['barry leitch'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co20t2.jpg' },
  { name: 'tommy tallarico', keywords: ['tommy tallarico'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzk.jpg' },
  { name: 'hiroshi kawaguchi', keywords: ['hiroshi kawaguchi', 'hiro master'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzp.jpg' },
  { name: 'jun senoue', keywords: ['jun senoue', 'crush 40'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co21i5.jpg' },
  { name: 'kenji yamamoto', keywords: ['kenji yamamoto'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzi.jpg' },
  { name: 'mahito yokota', keywords: ['mahito yokota'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wza.jpg' },
  { name: 'noriyuki iwadare', keywords: ['noriyuki iwadare', 'iwadare noriyuki'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzv.jpg' },
  { name: 'neil d voss', keywords: ['neil d. voss', 'neil d voss', 'neil voss'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x07.jpg' },
  { name: 'hitoshi sakimoto', keywords: ['hitoshi sakimoto', 'sakimoto hitoshi'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tnt.jpg' },
  { name: 'izuho numata', keywords: ['izuho numata', 'izuho takeuchi'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co20sv.jpg' },
  { name: 'sonic mayhem', keywords: ['sonic mayhem', 'sascha dikiciyan'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1nm4.jpg' },
  { name: 'darren mitchell', keywords: ['darren mitchell'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x3k.jpg' },
  { name: 'kazumi totaka', keywords: ['kazumi totaka', 'totaka kazumi'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzc.jpg' },
  { name: 'shinichi sakamoto', keywords: ['shinichi sakamoto', 'sakamoto shinichi'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzs.jpg' },
  { name: 'robin beanland', keywords: ['robin beanland'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzl.jpg' },
  { name: 'christophe heral', keywords: ['christophe heral', 'christophe héral'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x0k.jpg' },
  { name: 'shawn lee', keywords: ['shawn lee'], coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg' },
];

/**
 * Extrai nome do jogo e compositor a partir de padrões comuns em tags de rádio
 */
export function extractGameAndComposer(artist = '', title = '') {
  const full = `${artist} ${title}`;
  let extractedGame = null;
  let extractedComposer = null;

  // 1. Extrai tags entre colchetes [Jogo], parênteses (Jogo), ou chaves {Jogo}
  const tagMatches = [...full.matchAll(/\[([^\]]+)\]|\(([^)]+)\)|\{([^}]+)\}/g)];
  for (const match of tagMatches) {
    const tagContent = (match[1] || match[2] || match[3] || '').trim();
    if (!/^(feat|ft|remix|radio edit|official|audio|video|prod|version|mix|extended|live)/i.test(tagContent)) {
      if (!extractedGame) {
        extractedGame = tagContent;
      }
    }
  }

  // 2. Procura se algum compositor lendário está listado no artista ou título
  const fullLower = full.toLowerCase();
  for (const comp of LEGENDARY_COMPOSERS) {
    for (const kw of comp.keywords) {
      if (fullLower.includes(kw)) {
        extractedComposer = comp.name;
        break;
      }
    }
    if (extractedComposer) break;
  }

  return {
    game: extractedGame,
    composer: extractedComposer,
    rawArtist: artist,
    rawTitle: title,
  };
}

/**
 * Procura capa no banco de dados de games baseado no artista e título da faixa.
 */
export function findGameCover(artist, title) {
  if (!artist && !title) return null;

  const rawFull = `${artist || ''} ${title || ''}`.toLowerCase();
  const rawTitle = (title || '').toLowerCase();
  const rawArtist = (artist || '').toLowerCase();

  const { game, composer } = extractGameAndComposer(artist, title);
  const gameLower = game ? game.toLowerCase() : null;

  // 1. Se extraiu o nome do jogo da tag, busca correspondência com o banco
  if (gameLower) {
    for (const entry of GAME_COVERS_DATABASE) {
      if (
        entry.franchise.toLowerCase().includes(gameLower) ||
        entry.title.toLowerCase().includes(gameLower)
      ) {
        return entry.coverUrl || entry.fallbackUrl || null;
      }
      for (const kw of entry.keywords) {
        if (gameLower.includes(kw.toLowerCase()) || kw.toLowerCase().includes(gameLower)) {
          return entry.coverUrl || entry.fallbackUrl || null;
        }
      }
    }
  }

  // 2. Procura por correspondência de keywords nas entradas do banco
  for (const entry of GAME_COVERS_DATABASE) {
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();
      if (
        rawFull.includes(kwLower) ||
        rawTitle.includes(kwLower) ||
        rawArtist.includes(kwLower)
      ) {
        return entry.coverUrl || entry.fallbackUrl || null;
      }
    }
  }

  // 3. Detecção de Compositor e Sound Teams
  if (composer) {
    const matchedComposer = LEGENDARY_COMPOSERS.find((c) => c.name === composer);
    if (matchedComposer?.coverUrl) {
      return matchedComposer.coverUrl;
    }
  }

  for (const comp of LEGENDARY_COMPOSERS) {
    for (const kw of comp.keywords) {
      if (rawFull.includes(kw) || rawArtist.includes(kw)) {
        return comp.coverUrl;
      }
    }
  }

  // 4. Rockstar Games / GTA fallback
  if (rawArtist.includes('rockstar') || rawFull.includes('rockstar games')) {
    const defaultRockstar = GAME_COVERS_DATABASE.find((e) => e.id === 'rockstar-general');
    return defaultRockstar ? defaultRockstar.coverUrl : null;
  }

  return null;
}
