const fs = require('fs');

// Copy-paste your raw text list here
const rawText = `
Jujutsu Kaisen Season 2
9.7
17+
TV
23 eps
Jujutsu Kaisen Season 2
The Legend Of Hanuman
9.1
PG-13
TV
13 eps
The Legend Of Hanuman
The Legend Of Hanuman Season 2
9.1
PG-13
TV
13 eps
The Legend Of Hanuman Season 2
The Legend Of Hanuman Season 3
9.1
PG-13
TV
6 eps
The Legend Of Hanuman Season 3
Attack On Titan
9.1
17+
TV
25 eps
Attack On Titan
Ramayana: The Legend Of Prince Rama
9.1
G
Movie
1 eps
Ramayana: The Legend Of Prince Rama
Attack On Titan Season 3
9.1
17+
TV
12 eps
Attack On Titan Season 3
Attack On Titan Season 2
9.1
17+
TV
12 eps
Attack On Titan Season 2
Attack On Titan Season 4
9.1
17+
TV
16 eps
Attack On Titan Season 4
Attack On Titan Oad
9.1
17+
OVA
25 eps
Attack On Titan Oad
Hunter X Hunter
9
PG-13
TV
148 eps
Hunter X Hunter
One Piece
9
PG-13
TV
1122 eps
One Piece
Frieren: Beyond Journey'S End
9.0
PG-13
TV
28 eps
Frieren: Beyond Journey'S End
Bleach: Thousand-Year Blood War
9
17+
TV
13 eps
Bleach: Thousand-Year Blood War
Bleach: Thousand-Year Blood War Season 2
9
17+
TV
13 eps
Bleach: Thousand-Year Blood War Season 2
Bleach: Thousand-Year Blood War Season 3
9
17+
TV
14 eps
Bleach: Thousand-Year Blood War Season 3
The Unaware Atelier Meister
9
PG-13
TV
12 eps
The Unaware Atelier Meister
Demon Slayer Season 4
8.9
17+
TV
8 eps
Demon Slayer Season 4
Black Butler Season 5 : Emerald Witch Arc
8.9
17+
TV
13 eps
Black Butler Season 5 : Emerald Witch Arc
Death Note
8.9
17+
TV
37 eps
Death Note
Apothecary Diaries Season 2
8.85
PG-13
TV
24 eps
Apothecary Diaries Season 2
Vinland Saga
8.8
17+
TV
24 eps
Vinland Saga
One Punch Man
8.7
17+
TV
12 eps
One Punch Man
Naruto Shippuden
8.7
PG-13
TV
500 eps
Naruto Shippuden
Haikyu!!
8.7
PG-13
TV
25 eps
Haikyu!!
Code Geass
8.7
17+
TV
25 eps
Code Geass
Demon Slayer: Infinity Castle
8.67
17+
Movie
1 eps
Demon Slayer: Infinity Castle
Dan Da Dan Season 2
8.62
17+
TV
12 eps
Dan Da Dan Season 2
The Apothecary Diaries
8.6
PG-13
TV
24 eps
The Apothecary Diaries
Demon Slayer Season 2
8.6
17+
TV
11 eps
Demon Slayer Season 2
Demon Slayer Season 1
8.6
17+
TV
8 eps
Demon Slayer Season 1
Young Justice Season 3
8.6
TV-PG
TV Series
26 eps
Young Justice Season 3
Young Justice Season 2
8.6
TV-PG
TV Series
26 eps
Young Justice Season 2
Young Justice Season 1
8.6
TV-PG
TV Series
26 eps
Young Justice Season 1
Jujutsu Kaisen
8.5
17+
TV
24 eps
Jujutsu Kaisen
Demon Slayer Season 3
8.5
17+
TV
11 eps
Demon Slayer Season 3
Jojo'S Bizarre Adventure
8.5
17+
TV
26 eps
Jojo'S Bizarre Adventure
Mob Psycho 100
8.5
PG-13
TV
12 eps
Mob Psycho 100
Kaguya-Sama: Love Is War
8.5
PG-13
TV
12 eps
Kaguya-Sama: Love Is War
Jojo'S Bizarre Adventure Season 2
8.5
PG-13
ONA
24 eps
Jojo'S Bizarre Adventure Season 2
My Dress Up Darling Season 2
8.48
PG-13
TV
12 eps
My Dress Up Darling Season 2
Your Name
8.4
PG-13
Movie
1 eps
Your Name
Naruto
8.4
PG-13
TV
220 eps
Naruto
Lord Of Mysteries
8.4
17+
ONA
13 eps
Lord Of Mysteries
Vinland Saga Season 2
8.36
17+
TV
24 eps
Vinland Saga Season 2
The Fragrant Flower Blooms With Dignity
8.35
PG-13
TV
13 eps
The Fragrant Flower Blooms With Dignity
Blue Eye Samurai
8.31
17+
TV
8 eps
Blue Eye Samurai
Spy X Family
8.3
PG-13
TV
12 eps
Spy X Family
Solo Leveling
8.3
17+
TV
12 eps
Solo Leveling
Spy X Family Season 2
8.3
PG-13
TV
12 eps
Spy X Family Season 2
Dragon Ball Super
8.3
PG-13
TV
131 eps
Dragon Ball Super
Dragon Ball Z Kai
8.3
PG-13
TV
97 eps
Dragon Ball Z Kai
Chainsaw Man
8.3
17+
TV
12 eps
Chainsaw Man
Kaiju No. 8
8.3
PG-13
TV
12 eps
Kaiju No. 8
Mushoku Tensei: Jobless Reincarnation
8.3
17+
TV
11 eps
Mushoku Tensei: Jobless Reincarnation
Dragon Ball Z Kai Season 2
8.3
PG-13
TV
97 eps
Dragon Ball Z Kai Season 2
Dragon Ball Z Kai Season 3
8.3
PG-13
TV
97 eps
Dragon Ball Z Kai Season 3
Dragon Ball Z Kai Season 4
8.3
PG-13
TV
97 eps
Dragon Ball Z Kai Season 4
Dragon Ball Z Kai Season 5
8.3
PG-13
TV
97 eps
Dragon Ball Z Kai Season 5
Mushoku Tensei: Jobless Reincarnation Session 2
8.3
17+
TV
12 eps
Mushoku Tensei: Jobless Reincarnation Session 2
Solo Leveling Season 2
8.3
17+
TV
13 eps
Solo Leveling Season 2
Re: Zero – Starting Life In Another World
8.3
PG-13
Special
25 eps
Re: Zero – Starting Life In Another World
Ghost In The Shell – Arise: Pyrophoric Cult Season 1
8.27
R+
Movie
1 eps
Ghost In The Shell – Arise: Pyrophoric Cult Season 1
My Neighbor Totoro
8.22
G
Movie
1 eps
My Neighbor Totoro
Grave Of The Fireflies
8.21
PG-13
Movie
1 eps
Grave Of The Fireflies
Fairy Tail Season 4
8.19
PG-13
TV
102 eps
Fairy Tail Season 4
Detective Conan
8.17
PG-13
TV
N/A eps
Detective Conan
Baki Season 2
8.08
17+
ONA
27 eps
Baki Season 2
My Love Story With Yamada-Kun At Lv999
7.91
PG-13
TV
13 eps
My Love Story With Yamada-Kun At Lv999
My Hero Academia: You’Re Next
7.76
PG-13
TV
1 eps
My Hero Academia: You’Re Next
I Was Reincarnated As The 7Th Prince So I Can Take My Time Perfecting My Magical Ability Season 2
7.72
PG-13
TV
12 eps
I Was Reincarnated As The 7Th Prince So I Can Take My Time Perfecting My Magical Ability Season 2
Ne Zha 2
7.57
PG-13
Movie
1 eps
Ne Zha 2
Ne Zha
7.57
PG-13
Movie
1 eps
Ne Zha
Wolf King Season 2
7.54
PG-13
TV
16 eps
Wolf King Season 2
Ghost In The Shell: Arise – Border 2: Ghost Whispers
7.49
17+
Movie
1 eps
Ghost In The Shell: Arise – Border 2: Ghost Whispers
Ghost In The Shell: Arise - Border 1: Ghost Pain
7.48
17+
Movie
1 eps
Ghost In The Shell: Arise - Border 1: Ghost Pain
Baki
7.39
17+
ONA
26 eps
Baki
Ghost In The Shell Arise: Border: 4 Ghost Stands Alone
7.37
17+
Movie
1 eps
Ghost In The Shell Arise: Border: 4 Ghost Stands Alone
Ghost In The Shell Arise: Border 3 - Ghost Tears
7.33
17+
Movie
1 eps
Ghost In The Shell Arise: Border 3 - Ghost Tears
Patema Inverted
7.3
PG-13
Movie
1 eps
Patema Inverted
Robotics Notes
7.26
PG-13
TV
22 eps
Robotics Notes
Ghost In The Shell: Sac_2045 Season 2
7.15
17+
ONA
12 eps
Ghost In The Shell: Sac_2045 Season 2
Kiteretsu
7
PG
TV
331 eps
Kiteretsu
Reborn To Master The Blade: From Hero-King To Extraordinary Squire
6.73
PG-13
TV
12 eps
Reborn To Master The Blade: From Hero-King To Extraordinary Squire
Sakamoto Days Part 2
N/A
17+
TV
11 eps
Sakamoto Days Part 2
Shoot! Goal To The Future Season 1
N/A
PG-13
TV
13 eps
Shoot! Goal To The Future Season 1
Ghost In The Shell: The New Movie
N/A
17+
Movie
1 eps
Ghost In The Shell: The New Movie
After School Dice Club
N/A
PG-13
TV
12 eps
After School Dice Club
Chainsaw Man – The Movie: Reze Arc
N/A
17+
Movie
1 eps
Chainsaw Man – The Movie: Reze Arc
Dragon Ball Super Broly
N/A
PG-13
Movie
1 eps
Dragon Ball Super Broly
Takopi'S Original Sin
N/A
17+
ONA
6 eps
Takopi'S Original Sin
I Left My A-Rank Party To Help My Former Students Reach The Dungeon Depths!
N/A
PG-13
TV
24 eps
I Left My A-Rank Party To Help My Former Students Reach The Dungeon Depths!
May I Ask For One Final Thing
N/A
N/A
TV
N/A eps
May I Ask For One Final Thing
Food Wars!: Shokugeki No Soma
N/A
PG-13
TV
24 eps
Food Wars!: Shokugeki No Soma
Shinchan Spin Off
N/A
G
Movie
13 eps
Shinchan Spin Off
Let This Grieving Soul Retire! Season 2
N/A
PG-13
TV
N/A eps
Let This Grieving Soul Retire! Season 2
Ranma1/2 Season 2
N/A
PG-13
TV
12 eps
Ranma1/2 Season 2
Shinchan Spin Off Season 2
N/A
G
Movie
1 eps
Shinchan Spin Off Season 2
My Status As An Assassin Obviously Exceeds The Hero’S
N/A
N/A
TV
N/A eps
My Status As An Assassin Obviously Exceeds The Hero’S
Relife
N/A
PG-13
TV
13 eps
Relife
Girls’ Frontline
N/A
PG-13
TV
12 eps
Girls’ Frontline
The Witch And The Beast
N/A
17+
TV
12 eps
The Witch And The Beast
Reborn As A Vending Machine Season 2
N/A
PG-13
TV
12 eps
Reborn As A Vending Machine Season 2
Secrets Of The Silent Witch
N/A
PG-13
TV
13 eps
Secrets Of The Silent Witch
Shin-Chan Spin-Off Lone Wolf And Family
N/A
G
TV
35 eps
Shin-Chan Spin-Off Lone Wolf And Family
Shin-Chan Spin-Off O-O-O-No Shinnosuke Season 4
N/A
G
TV
13 eps
Shin-Chan Spin-Off O-O-O-No Shinnosuke Season 4
Shin-Chan Spin-Off Lone Wolf And Family Season 3
N/A
G
TV
35 eps
Shin-Chan Spin-Off Lone Wolf And Family Season 3
One Punch Man Season 3
N/A
17+
TV
12 eps
One Punch Man Season 3
My Hero Academia Season 8
N/A
PG-13
TV
12 eps
My Hero Academia Season 8
Howls Moving Castle
N/A
G
Movie
1 eps
Howls Moving Castle
Evangelion 2.22 You Can (Not) Advance
N/A
R+
Movie
1 eps
Evangelion 2.22 You Can (Not) Advance
Evangelion 1.11 You Are (Not) Alone
N/A
R+
Movie
1 eps
Evangelion 1.11 You Are (Not) Alone
Heroines Run The Show
N/A
PG-13
TV
12 eps
Heroines Run The Show
Classroom Of The Elite Season 2
N/A
PG-13
TV
13 eps
Classroom Of The Elite Season 2
A Wild Last Boss Appeared!
N/A
PG-13
TV
N/A eps
A Wild Last Boss Appeared!
Spy X Family Season 3
N/A
PG-13
TV
13 eps
Spy X Family Season 3
Food Wars!: Shokugeki No Soma Season 2
N/A
PG-13
TV
13 eps
Food Wars!: Shokugeki No Soma Season 2
Let'S Play
6.9/10
PG-13
TV
12 eps
Let'S Play
Tojima Wants To Be A Kamen Rider
N/A
PG-13
TV
24 eps
Tojima Wants To Be A Kamen Rider
Mechanical Marie
N/A
PG-13
TV
N/A eps
Mechanical Marie
Devil May Cry 2007
N/A
17+
TV
12 eps
Devil May Cry 2007
Food Wars!: Shokugeki No Soma Season 3
N/A
PG-13
OVA
12 eps
Food Wars!: Shokugeki No Soma Season 3
Hazbin Hotel Season 2
8.3/10
17+
TV
8 eps
Hazbin Hotel Season 2
Haikyu!! Season 3
8.27
PG-13
TV
10 eps
Haikyu!! Season 3
Dr. Stone Season 4: Science Future
8.25
PG-13
TV
N/A eps
Dr. Stone Season 4: Science Future
Overlord Season 2
8.22
17+
TV
51 eps
Overlord Season 2
Fairy Tail Season 3
8.22
PG-13
TV
51 eps
Fairy Tail Season 3
Hi
8.21
G
TV
11 eps
Hi
My Hero Academia Season 1
8.2
PG-13
TV
25 eps
My Hero Academia Season 1
My Hero Academia Season 2
8.2
PG-13
TV
25 eps
My Hero Academia Season 2
My Hero Academia Season 3
8.2
PG-13
TV
25 eps
My Hero Academia Season 3
My Hero Academia Two Heroes
8.2
PG-13
Movie
1 eps
My Hero Academia Two Heroes
My Hero Academia Heroes Rising
8.2
PG-13
Movie
1 eps
My Hero Academia Heroes Rising
My Hero Academia World Hero Mission
8.2
PG-13
Movie
1 eps
My Hero Academia World Hero Mission
My Hero Academia Season 4
8.2
PG-13
TV
25 eps
My Hero Academia Season 4
Black Clover
8.2
PG-13
TV
170 eps
Black Clover
Summer Time Rendering
8.2
17+
TV
25 eps
Summer Time Rendering
Blue Lock
8.2
PG-13
TV
24 eps
Blue Lock
My Hero Academia Season 5
8.2
PG-13
TV
25 eps
My Hero Academia Season 5
Dan Da Dan
8.2
17+
TV
12 eps
Dan Da Dan
My Hero Academia Season 6
8.2
PG-13
TV
25 eps
My Hero Academia Season 6
My Hero Academia Season 7
8.2
PG-13
TV
21 eps
My Hero Academia Season 7
Teogonia
8.2
PG-13
TV
12 eps
Teogonia
Dr. Stone Season 3
8.2
PG-13
TV
11 eps
Dr. Stone Season 3
Sk8 The Infinity
8.19
PG-13
TV
12 eps
Sk8 The Infinity
Fairy Tail Season 2
8.19
PG-13
TV
102 eps
Fairy Tail Season 2
Dr. Stone Ryusui - Special Episode
8.16
PG-13
TV Special
1 eps
Dr. Stone Ryusui - Special Episode
Black Clover Season 2
8.14
PG-13
TV
170 eps
Black Clover Season 2
Gachiakuta
8.12
PG-13
TV
24 eps
Gachiakuta
Dr. Stone
8.1
PG-13
TV
24 eps
Dr. Stone
That Time I Got Reincarnated As A Slime Season 1
8.1
PG-13
TV Special
12 eps
That Time I Got Reincarnated As A Slime Season 1
That Time I Got Reincarnated As A Slime Season 3
8.1
PG-13
TV
24 eps
That Time I Got Reincarnated As A Slime Season 3
That Time I Got Reincarnated As A Slime Season 2
8.1
PG-13
TV
12 eps
That Time I Got Reincarnated As A Slime Season 2
A Silent Voice
8.1
PG-13
Movie
1 eps
A Silent Voice
Re: Zero – Starting Life In Another World Season 3
8.1
PG-13
Special
16 eps
Re: Zero – Starting Life In Another World Season 3
Re: Zero – Starting Life In Another World Season 2
8.1
PG-13
Special
13 eps
Re: Zero – Starting Life In Another World Season 2
Ghost In The Shell Stand Alone Complex - Solid State Society
8.08
17+
TV Special
1 eps
Ghost In The Shell Stand Alone Complex - Solid State Society
Overlord Season 4
8.08
PG-13
TV
13 eps
Overlord Season 4
Kaiju No.8 Season 2
8.05
PG-13
TV
11 eps
Kaiju No.8 Season 2
Tsukimichi Moonlit Fantasy Season 2
8.02
PG-13
TV
25 eps
Tsukimichi Moonlit Fantasy Season 2
Delicious In Dungeon
8
17+
TV
24 eps
Delicious In Dungeon
My Dress Up Darling
8
PG-13
TV
12 eps
My Dress Up Darling
The Maid I Hired Recently Is Mysterious
8
PG-13
TV
11 eps
The Maid I Hired Recently Is Mysterious
Gods' Games We Play
8
PG-13
TV
13 eps
Gods' Games We Play
Assassination Classroom
8
PG-13
TV
22 eps
Assassination Classroom
True Beauty
8
PG-13
ONA
13 eps
True Beauty
Dragon Ball
8
PG-13
TV
291 eps
Dragon Ball
Horimiya
8
PG-13
TV
13 eps
Horimiya
Ranma1/2
8
PG-13
OVA
12 eps
Ranma1/2
Dragon Ball Daima
8
PG-13
TV
N/A eps
Dragon Ball Daima
Ponyo
8
G
Movie
1 eps
Ponyo
Clevatess
7.98
N/A
TV
12 eps
Clevatess
Buddy Daddies
7.9
PG-13
TV
12 eps
Buddy Daddies
Fire Force Season 2
7.9
PG-13
TV
24 eps
Fire Force Season 2
Blue Lock Season 2
7.9
PG-13
TV
14 eps
Blue Lock Season 2
Sakamoto Days
7.9
17+
TV
11 eps
Sakamoto Days
Fairy Tail
7.9
PG-13
TV
51 eps
Fairy Tail
Devil May Cry 2025
7.9
17+
TV
12 eps
Devil May Cry 2025
Wind Breaker Season 2
7.9
PG-13
TV
12 eps
Wind Breaker Season 2
Ghost In The Shell Season 2
7.9
17+
ONA
12 eps
Ghost In The Shell Season 2
Mobile Suit Gundam: The Witch From Mercury
7.88
17+
TV
12 eps
Mobile Suit Gundam: The Witch From Mercury
Fire Force Season 3
7.85
PG-13
TV
12 eps
Fire Force Season 3
Overlord Season 3
7.85
PG-13
TV
13 eps
Overlord Season 3
Blue Lock The Movie: Episode Nagi
7.81
PG-13
TV
1 eps
Blue Lock The Movie: Episode Nagi
Horimiya: The Missing Pieces Season 2
7.8
PG-13
TV
13 eps
Horimiya: The Missing Pieces Season 2
Dragon Ball Z: Bardock Â€“ The Father Of Goku
7.8
PG-13
TV Special
1 eps
Dragon Ball Z: Bardock Â€“ The Father Of Goku
Dragon Ball Z Special 02 Â€“  The History Of Trunks
7.8
PG-13
TV Special
1 eps
Dragon Ball Z Special 02 Â€“ The History Of Trunks
Look Back
7.8
PG-13
Movie
1 eps
Look Back
Haikyu!! The Dumpster Battle
7.8
PG-13
Movie
1 eps
Haikyu!! The Dumpster Battle
Tokyo Revengers
7.8
17+
TV
24 eps
Tokyo Revengers
Black Butler Season 4
7.74
17+
TV
24 eps
Black Butler Season 4
My Happy Marriage Season 2
7.7
PG-13
TV
13 eps
My Happy Marriage Season 2
My Happy Marriage
7.7
PG-13
TV
12 eps
My Happy Marriage
Classroom Of The Elite
7.7
PG-13
TV
12 eps
Classroom Of The Elite
Shinchan In The Dreaming World
7.7
G
Movie
1 eps
Shinchan In The Dreaming World
Suzume No Tojimari
7.6
PG-13
Movie
1 eps
Suzume No Tojimari
Mashle: Magic And Muscles
7.6
PG-13
TV
12 eps
Mashle: Magic And Muscles
Lookism
7.6
PG-13
ONA
8 eps
Lookism
Tomo Chan Is A Girl!
7.6
PG-13
TV
13 eps
Tomo Chan Is A Girl!
The Angel Next Door Spoils Me Rotten
7.6
PG-13
TV
12 eps
The Angel Next Door Spoils Me Rotten
Log Horizon Season 2
7.6
PG-13
TV
25 eps
Log Horizon Season 2
Tsukimichi: Moonlit Fantasy
7.6
PG-13
TV
12 eps
Tsukimichi: Moonlit Fantasy
Makeine: Too Many Losing Heroines!
7.6
PG-13
TV
12 eps
Makeine: Too Many Losing Heroines!
Mashle Magic And Muscles Season 2
7.6
PG-13
TV
12 eps
Mashle Magic And Muscles Season 2
Fire Force
7.6
PG-13
TV
24 eps
Fire Force
Campfire Cooking In Another World With My Absurd Skill
7.6
PG-13
TV
12 eps
Campfire Cooking In Another World With My Absurd Skill
The Glassworker
7.6
PG-13
TV
1 eps
The Glassworker
I Was Reincarnated As The 7Th Prince So I Can Take My Time Perfecting My Magical Ability
7.58
PG-13
TV
12 eps
I Was Reincarnated As The 7Th Prince So I Can Take My Time Perfecting My Magical Ability
More Than A Married Couple, But Not Lovers
7.5
PG-13
TV
12 eps
More Than A Married Couple, But Not Lovers
Shangri-La Frontier
7.5
PG-13
TV
25 eps
Shangri-La Frontier
Tower Of God
7.5
PG-13
TV
13 eps
Tower Of God
Log Horizon
7.5
PG-13
TV
25 eps
Log Horizon
Wind Breaker
7.5
PG-13
TV
13 eps
Wind Breaker
Weathering With You
7.5
PG-13
Movie
1 eps
Weathering With You
Wistoria: Wand And Sword
7.5
PG-13
TV
12 eps
Wistoria: Wand And Sword
Fairy Tail: 100 Years Quest
7.5
PG-13
TV
25 eps
Fairy Tail: 100 Years Quest
Tower Of God Season 2
7.5
PG-13
TV
13 eps
Tower Of God Season 2
Sword Art Online
7.5
PG-13
TV
25 eps
Sword Art Online
Rurouni Kenshin: Kyoto Disturbance
7.5
17+
OVA
23 eps
Rurouni Kenshin: Kyoto Disturbance
Rurouni Kenshin: Kyoto Disturbance Season 2
7.5
17+
OVA
23 eps
Rurouni Kenshin: Kyoto Disturbance Season 2
Trillion Game
7.5
PG-13
TV
26 eps
Trillion Game
Shangri-La Frontier Season 2
7.5
PG-13
TV
25 eps
Shangri-La Frontier Season 2
Toilet-Bound Hanako-Kun Season 2
7.5
PG-13
TV
12 eps
Toilet-Bound Hanako-Kun Season 2
Toilet-Bound Hanako-Kun
7.5
PG-13
TV
12 eps
Toilet-Bound Hanako-Kun
Valkyria Chronicles
7.5
PG-13
TV
26 eps
Valkyria Chronicles
Overflow
7.5
Rx
ONA
8 eps
Overflow
Bartender Glass Of God
7.42
PG-13
TV
12 eps
Bartender Glass Of God
I'M In Love With The Villainess
7.42
PG-13
TV
12 eps
I'M In Love With The Villainess
The World’S Finest Assassin Gets Reincarnated In Another World As An Aristocrat
7.4
G
ONA
12 eps
The World’S Finest Assassin Gets Reincarnated In Another World As An Aristocrat
Black Clover: Sword Of The Wizard King
7.4
PG-13
Movie
1 eps
Black Clover: Sword Of The Wizard King
Why Raeliana Ended Up At The Dukeâ€™S Mansion
7.4
PG-13
TV
12 eps
Why Raeliana Ended Up At The Dukeâ€™S Mansion
Goblin Slayer
7.4
17+
TV
12 eps
Goblin Slayer
Trapped In A Dating Sim: The World Of Otome Games Is Tough For Mobs
7.36
PG-13
TV
12 eps
Trapped In A Dating Sim: The World Of Otome Games Is Tough For Mobs
Shinchan - Mr. Smelly'S Ambition
7.35
G
Movie
1 eps
Shinchan - Mr. Smelly'S Ambition
Akudama Drive
7.3
17+
TV
12 eps
Akudama Drive
The Wrong Way To Use Healing Magic
7.3
PG-13
TV
13 eps
The Wrong Way To Use Healing Magic
Darling In The Franxx
7.3
PG-13
TV
24 eps
Darling In The Franxx
I Shall Survive Using Potions!
7.3
PG-13
TV
12 eps
I Shall Survive Using Potions!
The Elusive Samurai
7.3
17+
TV
12 eps
The Elusive Samurai
Twilight Of The Gods
7.3
PG-13
TV
1 eps
Twilight Of The Gods
The Super Cube
7.3
PG-13
ONA
12 eps
The Super Cube
The Reincarnation Of The Strongest Exorcist In Another World
7.24
PG-13
TV
13 eps
The Reincarnation Of The Strongest Exorcist In Another World
Fullmetal Alchemist The Sacred Star Of Milos
7.24
17+
Movie
1 eps
Fullmetal Alchemist The Sacred Star Of Milos
Viral Hit
7.2
PG-13
TV
12 eps
Viral Hit
My Hero Academia: Make It! Do-Or-Die Survival Training
7.2
PG-13
ONA
2 eps
My Hero Academia: Make It! Do-Or-Die Survival Training
Alya Sometimes Hides Her Feelings In Russian
7.2
PG-13
TV
12 eps
Alya Sometimes Hides Her Feelings In Russian
I'M Getting Married To A Girl I Hate In My Class
7.2
PG-13
TV
12 eps
I'M Getting Married To A Girl I Hate In My Class
Zatch Bell!
7.2
PG-13
TV
150 eps
Zatch Bell!
The Witcher Nightmare Of The Wolf
7.2
PG-13
OVA
1 eps
The Witcher Nightmare Of The Wolf
The God Of High School
7.2
PG-13
TV
13 eps
The God Of High School
Once Upon A Witch'S Death
7.2
PG-13
TV
12 eps
Once Upon A Witch'S Death
Paradox Live The Animation
7.2
PG-13
TV
12 eps
Paradox Live The Animation
Lost In Starlight
7.2
PG-13
Movie
1 eps
Lost In Starlight
Shinchan - The Mystery Of Tenkasu Academy
7.2
G
Movie
1 eps
Shinchan - The Mystery Of Tenkasu Academy
Welcome To The Outcast'S Restaurant!
7.2
PG-13
Special
N/A eps
Welcome To The Outcast'S Restaurant!
As A Reincarnated Aristocrat, I'Ll Use My Appraisal Skill To Rise In The World
7.18
PG-13
TV
12 eps
As A Reincarnated Aristocrat, I'Ll Use My Appraisal Skill To Rise In The World
The Daily Life Of The Immortal King Season 1
7.1
PG-13
ONA
12 eps
The Daily Life Of The Immortal King Season 1
The Daily Life Of The Immortal King Season 2
7.1
PG-13
ONA
12 eps
The Daily Life Of The Immortal King Season 2
The Daily Life Of The Immortal King Season 3
7.1
PG-13
ONA
12 eps
The Daily Life Of The Immortal King Season 3
The Daily Life Of The Immortal King Season 4
7.1
PG-13
ONA
12 eps
The Daily Life Of The Immortal King Season 4
An Archdemon'S Dilemma
7.1
PG-13
TV
12 eps
An Archdemon'S Dilemma
Days With My Stepsister
7.1
PG-13
TV
12 eps
Days With My Stepsister
365 Days To The Wedding
7.1
PG-13
TV
12 eps
365 Days To The Wedding
Possibly The Greatest Alchemist Of All Time
7.1
PG-13
TV
12 eps
Possibly The Greatest Alchemist Of All Time
Catch Me At The Ballpark!
7.1
R+
OVA
12 eps
Catch Me At The Ballpark!
I'Ve Been Killing Slimes For 300 Years And Maxed Out My Level Season 1
7.09
G
TV
12 eps
I'Ve Been Killing Slimes For 300 Years And Maxed Out My Level Season 1
I'Ve Been Killing Slimes For 300 Years And Maxed Out My Level Season 2
7.09
PG-13
TV
12 eps
I'Ve Been Killing Slimes For 300 Years And Maxed Out My Level Season 2
Shinchan - The Singing Bomb
7.05
G
Movie
1 eps
Shinchan - The Singing Bomb
One Piece: Clockwork Island Adventure
7.01
PG-13
Movie
1 eps
One Piece: Clockwork Island Adventure
The Many Sides Of Voice Actor Radio
7
PG
TV
12 eps
The Many Sides Of Voice Actor Radio
Nina The Starry Bride
7
PG-13
TV
12 eps
Nina The Starry Bride
Zenshu
7
PG-13
TV
12 eps
Zenshu
I Parry Everything
7
PG-13
TV
12 eps
I Parry Everything
The Shiunji Family Children
7
PG-13
TV
12 eps
The Shiunji Family Children
Mobile Suit Gundam: Gquuuuuux
7
PG-13
TV
12 eps
Mobile Suit Gundam: Gquuuuuux
Shinchan - The Spy
6.97
G
Movie
1 eps
Shinchan - The Spy
Naruto The Movie: Ninja Clash In The Land Of Snow
6.92
PG-13
Movie
1 eps
Naruto The Movie: Ninja Clash In The Land Of Snow
A Couple Of Cuckoos
6.91
PG-13
TV
24 eps
A Couple Of Cuckoos
Rent A Girlfriend Season 1
6.9
PG-13
TV
24 eps
Rent A Girlfriend Season 1
Rent A Girlfriend Season 2
6.9
PG-13
TV
12 eps
Rent A Girlfriend Season 2
Rent A Girlfriend Season 3
6.9
PG-13
TV
12 eps
Rent A Girlfriend Season 3
I'Ll Become A Villainess Who Goes Down In History
6.9
PG-13
TV
13 eps
I'Ll Become A Villainess Who Goes Down In History
One Punch Man Season 2
6.9
17+
TV
6 eps
One Punch Man Season 2
One Piece: The Movie (2000)
6.9
PG-13
Movie
1 eps
One Piece: The Movie (2000)
The Gorilla God'S Go-To Girl
6.9
17+
TV
12 eps
The Gorilla God'S Go-To Girl
Rent-A-Girlfriend Season 4
6.89
PG-13
TV
12 eps
Rent-A-Girlfriend Season 4
Leviathan
6.87
N/A
ONA
12 eps
Leviathan
Dekin No Mogura
6.81
PG-13
TV
12 eps
Dekin No Mogura
The Great Cleric
6.8
PG-13
TV
12 eps
The Great Cleric
Hokkaido Gals Are Super Adorable!
6.8
PG-13
TV
12 eps
Hokkaido Gals Are Super Adorable!
Villainess Level 99
6.8
PG-13
TV
12 eps
Villainess Level 99
Sword Art Online Alternative: Gun Gale Online
6.8
PG-13
TV
12 eps
Sword Art Online Alternative: Gun Gale Online
Kurozuka
6.8
17+
TV
12 eps
Kurozuka
Ameku M.D.: Doctor Detective
6.8
PG-13
TV
12 eps
Ameku M.D.: Doctor Detective
Yaiba Samurai Legend
6.8
PG-13
TV
24 eps
Yaiba Samurai Legend
Shinchan - The Legend Of Ninja Mononoke
6.8
G
Movie
1 eps
Shinchan - The Legend Of Ninja Mononoke
Shin-Chan The Kasukabe Boys Of The Evening Sun
6.8
G
Movie
1 eps
Shin-Chan The Kasukabe Boys Of The Evening Sun
Shinchan - Blitzkrieg! Pig'S Hoof'S Secret Mission
6.8
G
Movie
1 eps
Shinchan - Blitzkrieg! Pig'S Hoof'S Secret Mission
A Couple Of Cuckoos Season 2
6.77
PG-13
TV
12 eps
A Couple Of Cuckoos Season 2
A Salad Bowl Of Eccentrics
6.7
PG-13
Music
12 eps
A Salad Bowl Of Eccentrics
Shikimori'S Not Just A Cute
6.7
PG-13
TV
12 eps
Shikimori'S Not Just A Cute
Twilight Out Of Focus
6.7
PG-13
TV
12 eps
Twilight Out Of Focus
Junji Ito Collection
6.7
17+
TV
12 eps
Junji Ito Collection
No Longer Allowed In Another World
6.7
PG-13
TV
12 eps
No Longer Allowed In Another World
Banished From The Hero'S Party, I Decided To Live A Quiet Life In The Countryside
6.7
PG-13
TV
13 eps
Banished From The Hero'S Party, I Decided To Live A Quiet Life In The Countryside
Demon Lord, Retry! R
6.7
PG-13
TV
12 eps
Demon Lord, Retry! R
Berserk Of Gluttony
6.7
17+
TV
12 eps
Berserk Of Gluttony
Banished From The Hero'S Party, I Decided To Live A Quiet Life In The Countryside Season 2
6.7
PG-13
TV
12 eps
Banished From The Hero'S Party, I Decided To Live A Quiet Life In The Countryside Season 2
The Magical Girl And The Evil Lieutenant Used To Be Archenemies
6.7
PG-13
TV
12 eps
The Magical Girl And The Evil Lieutenant Used To Be Archenemies
Mononoke The Movie: Phantom In The Rain
6.7
17+
Movie
1 eps
Mononoke The Movie: Phantom In The Rain
Reborn As A Vending Machine
6.66
PG-13
TV
12 eps
Reborn As A Vending Machine
My Tiny Senpai
6.6
PG-13
TV
12 eps
My Tiny Senpai
A Condition Called Love
6.6
PG-13
TV
12 eps
A Condition Called Love
Overlord
6.6
17+
TV
13 eps
Overlord
New Saga
6.57
PG-13
TV
1 eps
New Saga
Even Given The Worthless “Appraiser” Class, I’M Actually The Strongest
6.53
17+
TV
12 eps
Even Given The Worthless “Appraiser” Class, I’M Actually The Strongest
I Got A Cheat Skill In Another World And Became Unrivaled In The Real World, Too
6.5
PG-13
13 eps
I Got A Cheat Skill In Another World And Became Unrivaled In The Real World, Too
Re Monster
6.5
17+
TV
12 eps
Re Monster
Masamune-Kun'S Revenge Season 2
6.5
17+
TV
12 eps
Masamune-Kun'S Revenge Season 2
Crayon Shin-Chan: Ora'S Dinosaur Diary
6.5
G
TV
1 eps
Crayon Shin-Chan: Ora'S Dinosaur Diary
Shinchan In Rakuga Kingdom
6.5
G
Movie
1 eps
Shinchan In Rakuga Kingdom
My Unique Skill Makes Me Op Even At Level 1
6.44
PG-13
TV
12 eps
My Unique Skill Makes Me Op Even At Level 1
You Are Ms. Servant
6.4
PG-13
TV
12 eps
You Are Ms. Servant
The Red Ranger Becomes An Adventurer In Another World
6.4
PG-13
TV
12 eps
The Red Ranger Becomes An Adventurer In Another World
Let This Grieving Soul Retire!
6.4
PG-13
TV
13 eps
Let This Grieving Soul Retire!
Ghost In The Shell: Stand Alone Complex
6.4
17+
TV
26 eps
Ghost In The Shell: Stand Alone Complex
Pokémon The Movie 23: Secrets Of The Jungle
6.4
PG
Movie
1 eps
Pokémon The Movie 23: Secrets Of The Jungle
Pokémon: Mewtwo Returns
6.4
PG
TV Special
1 eps
Pokémon: Mewtwo Returns
The Grimm Variations
6.3
G
Movie
6 eps
The Grimm Variations
Shinchan - Dangerous Family Holiday
6.3
G
Movie
1 eps
Shinchan - Dangerous Family Holiday
Pokémon The Movie 20: I Choose You!
6.3
PG
Movie
1 eps
Pokémon The Movie 20: I Choose You!
My Isekai Life
6.2
PG-13
TV
12 eps
My Isekai Life
Bucchigiri?!
6.2
PG-13
TV
12 eps
Bucchigiri?!
The Strongest Magician In The Demon Lord'S Army Was A Human
6.2
PG-13
TV
13 eps
The Strongest Magician In The Demon Lord'S Army Was A Human
Why Does Nobody Remember Me In This World?
6.2
PG-13
TV
12 eps
Why Does Nobody Remember Me In This World?
Haikyu!! Season 2
6.2
PG-13
TV
25 eps
Haikyu!! Season 2
Magic Maker: How To Make Magic In Another World
6.2
PG-13
TV
6 eps
Magic Maker: How To Make Magic In Another World
Shinchan The Movie Bakumori! Kung Fu Boys
6.2
G
Movie
1 eps
Shinchan The Movie Bakumori! Kung Fu Boys
Miss Kuroitsu From The Monster Development Department
6.2
PG-13
TV
1 eps
Miss Kuroitsu From The Monster Development Department
Kamikatsu: Working For God In A Godless World
6.1
17+
TV
12 eps
Kamikatsu: Working For God In A Godless World
Quality Assurance In Another World
6.1
PG-13
TV
13 eps
Quality Assurance In Another World
The Witcher Sirens Of The Deep
6.1
PG-13
OVA
1 eps
The Witcher Sirens Of The Deep
Shinchan - Invasion!! Alien Shiriri
6.1
G
Movie
12 eps
Shinchan - Invasion!! Alien Shiriri
Metallic Rouge
6
PG-13
TV
13 eps
Metallic Rouge
The Detective Is Already Dead
6
PG-13
TV
12 eps
The Detective Is Already Dead
My Oni Girl
6
PG-13
Movie
1 eps
My Oni Girl
Good Bye, Dragon Life
6
PG-13
TV
12 eps
Good Bye, Dragon Life
Tying The Knot With An Amagami Sister
5.9
PG-13
TV
24 eps
Tying The Knot With An Amagami Sister
She Professed Herself Pupil Of The Wise Man
5.9
PG-13
TV
12 eps
She Professed Herself Pupil Of The Wise Man
Pokémon The Movie 19: Volcanion And The Mechanical Marvel
5.9
PG
Movie
1 eps
Pokémon The Movie 19: Volcanion And The Mechanical Marvel
Pokémon The Movie 18: Hoopa And The Clash Of Ages
5.9
PG
Movie
1 eps
Pokémon The Movie 18: Hoopa And The Clash Of Ages
Vampire Dormitory
5.8
PG-13
TV
12 eps
Vampire Dormitory
Vtuber Legend: How I Went Viral After Forgetting To Turn Off My Stream
5.8
PG-13
TV
12 eps
Vtuber Legend: How I Went Viral After Forgetting To Turn Off My Stream
Assassination Classroom Season 2
5.7
PG-13
TV
25 eps
Assassination Classroom Season 2
Bye Bye, Earth
5.6
PG-13
TV
10 eps
Bye Bye, Earth
Zom 100: Bucket List Of The Dead
5.5
17+
TV
12 eps
Zom 100: Bucket List Of The Dead
Bye Bye, Earth Season 2
5.5
PG-13
TV
10 eps
Bye Bye, Earth Season 2
Pokémon The Movie 17: Diancie And The Cocoon Of Destruction
5.5
PG
Movie
1 eps
Pokémon The Movie 17: Diancie And The Cocoon Of Destruction
Ankit
1
R+
OVA
1 eps
Ankit
The Summer Hikaru Died
N/A
17+
TV
12 eps
The Summer Hikaru Died
Chained Soldier
N/A
R+
TV
12 eps
Chained Soldier
Ninja Scroll
N/A
R+
Movie
1 eps
Ninja Scroll
Haikyu!! Season 4
N/A
PG-13
TV
13 eps
Haikyu!! Season 4
Creature Commandos
N/A
PG
TV
1 eps
Creature Commandos
Dead Mount Death Play
N/A
17+
TV
12 eps
Dead Mount Death Play
Jujutsu Kaisen 0
N/A
17+
Movie
1 eps
Jujutsu Kaisen 0
Tatsuki Fujimoto 17-26
N/A
R+
ONA
8 eps
Tatsuki Fujimoto 17-26
With You, Our Love Will Make It Through
N/A
PG-13
TV
12 eps
With You, Our Love Will Make It Through
Spy X Family Code White
N/A
PG-13
Movie
1 eps
Spy X Family Code White
Ragna Crimson
N/A
17+
TV
24 eps
Ragna Crimson
My Hero Academia: Vigilantes
N/A
PG-13
TV
13 eps
My Hero Academia: Vigilantes
Doraemon Nobita'S Earth Symphony
N/A
PG
Movie
1 eps
Doraemon Nobita'S Earth Symphony
Campfire Cooking In Another World With My Absurd Skill Season 2
N/A
PG-13
TV
12 eps
Campfire Cooking In Another World With My Absurd Skill Season 2
Food Wars!: Shokugeki No Soma Season 4
N/A
PG-13
TV
12 eps
Food Wars!: Shokugeki No Soma Season 4
The Tunnel To Summer The Exit Of Goodbyes
N/A
PG-13
Movie
1 eps
The Tunnel To Summer The Exit Of Goodbyes
A Gatherer'S Adventure In Isekai
N/A
PG-13
TV
12 eps
A Gatherer'S Adventure In Isekai
Code Geass Season 2
N/A
17+
TV
25 eps
Code Geass Season 2
Voices Of A Distant Star
N/A
PG-13
OVA
1 eps
Voices Of A Distant Star
The Garden Of Words
N/A
PG-13
Movie
1 eps
The Garden Of Words
Suzume
N/A
PG-13
Movie
1 eps
Suzume
Isekai Suicide Squad
N/A
17+
TV
10 eps
Isekai Suicide Squad
Fairy Tail Season 5
N/A
PG-13
TV
102 eps
Fairy Tail Season 5
Welcome To Demon School! Iruma-Kun
N/A
PG-13
TV
23 eps
Welcome To Demon School! Iruma-Kun
Doraemon: Nobita'S Earth Symphony
N/A
PG
Movie
1 eps
Doraemon: Nobita'S Earth Symphony
My Clueless First Friend
N/A
PG-13
TV
13 eps
My Clueless First Friend
Kurukshetra - The Great War Of Mahabharata
N/A
N/A
N/A
N/A eps
Kurukshetra - The Great War Of Mahabharata
Bofuri: I Don’T Want To Get Hurt, So I’Ll Max Out My Defense
N/A
PG-13
TV
12 eps
Bofuri: I Don’T Want To Get Hurt, So I’Ll Max Out My Defense
Mahavatar Narsimha
N/A
N/A
N/A
N/A eps
Mahavatar Narsimha
Cell At Work!
N/A
PG-13
TV
13 eps
Cell At Work!
Jujutsu Kaisen: Execution
N/A
17+
Movie
1 eps
Jujutsu Kaisen: Execution
You've reached the end of the
`;

const lines = rawText.trim().split('\n');
const animeArray = [];

// Loop through the lines (every 5 lines = 1 anime based on your format)
for (let i = 0; i < lines.length; i += 5) {
    if (lines[i]) {
        animeArray.push({
            title: lines[i].trim(),
            rating: lines[i+1]?.trim() || "N/A",
            ageRating: lines[i+2]?.trim() || "N/A",
            type: lines[i+3]?.trim() || "N/A",
            episodesCount: lines[i+4]?.trim() || "N/A",
            description: `This is the full detail for ${lines[i].trim()}.`,
            poster: "https://via.placeholder.com/400x600", // You will update these in Admin Panel
            banner: "https://via.placeholder.com/1200x450",
            genres: ["Action", "Adventure"],
            isTrending: false
        });
    }
}

// Write to data.json
fs.writeFileSync('data.json', JSON.stringify(animeArray, null, 2));
console.log("data.json created with " + animeArray.length + " anime!");