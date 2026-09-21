// ============================================================
// EDIT YOUR LOVE LETTER HERE
// Replace any text below with your real message later.
// Wrap words in **double asterisks** to make them bold.
// The salutation is the first line of the letter.
// The signature supports multiple lines separated by \n.
// ============================================================

export interface LoveLetterContent {
  envelopeFront: {
    title: string;
    subtitle: string;
    instruction: string;
  };
  letter: {
    salutation: string;
    body: string[];
    closing: string;
    signature: string;
    postscript?: string;
  };
  metadata: {
    date: string;
    location?: string;
  };
}

export const LOVE_LETTER_CONTENT: LoveLetterContent = {
  envelopeFront: {
    title: "For My Dearest Marilou",
    subtitle: "Our 2nd Anniversary",
    instruction: "Open this when you're ready.",
  },
  letter: {
    salutation: "**My Dearest Marilou, Lablab, babi, Wifey, Louvey, Love, and My Ms. Pretty Stranger,**",
    body: [
      "Happy 2nd Anniversary, my Loveee. ❤️",
      "Two years.",
      "When I think about that, I realize how many moments, conversations, smiles, challenges, and memories we've already shared. Two years may sound like a long time, but somehow, when I'm with you, it still feels like everything started just yesterday.",
      "And speaking of how everything started... HAHAHA, I still remember our first chats.",
      "I remember asking you, **\"Ikaw ni?\"** 😂",
      "Looking back at it now, I swear I feel like such a dumb, stupid guy. HAHAHAHA. I was probably overthinking everything, trying to figure things out, and then you hit me with:",
      "**\"Lain sad kaayu mag Myday kog di ako.\"** 😭😂",
      "Like... WHAT WAS I SUPPOSED TO SAY AFTER THAT?! HAHAHAHA.",
      "It's funny how something so simple became one of the little memories that I still remember until now. At that time, I probably didn't realize that the girl I was casually talking to would eventually become someone so important to me.",
      "I didn't know that those random conversations would turn into countless conversations.",
      "I didn't know that the person behind those messages would become someone I would laugh with, worry about, miss, care for, and love so deeply.",
      "And I definitely didn't know that the girl I was asking **\"Ikaw ni?\"** would someday become my **Lablab, babi, Wifey, Louvey, Love, and my Ms. Pretty Stranger.** ❤️",
      "Life really has a funny way of bringing people together.",
      "I want you to know how grateful I am that you became part of my life.",
      "Thank you for being there through the good days and even through the days when things weren't perfect. Thank you for the little things you do, the moments you may not even realize are important to me, and simply for being yourself.",
      "I may not always know the perfect words to say how much you mean to me. Sometimes I might not express it enough, and sometimes I may not show it in the way you deserve. But please remember this:",
      "**You are someone I genuinely treasure.**",
      "I treasure every memory we've made together—the simple moments, the laughter, the conversations, the quiet times, and even the little things that might seem ordinary to other people.",
      "Because when those moments are with you, they become special to me.",
      "Sometimes, I think about how funny it is that something that started with a simple chat could eventually become two years of memories.",
      "From that awkward **\"Ikaw ni?\"**",
      "to everything we've become now.",
      "We've grown, we've learned, we've had our happy moments, our difficult moments, our misunderstandings, our silly moments, and countless memories in between.",
      "These two years have taught me that love isn't only about the beautiful moments. It's also about understanding each other, choosing each other, learning from our mistakes, being patient, and continuing to stay together even when things aren't always easy.",
      "And if there is one thing I want you to know on this special day, it is that I don't take what we have for granted.",
      "I am thankful for you.",
      "Thank you for becoming one of the most meaningful parts of my life.",
      "I hope that when you look back at these memories someday, you'll smile and remember how much happiness we shared together.",
      "And I hope this isn't just the end of our second year.",
      "I hope it's another beginning.",
      "Another year of memories.",
      "Another year of laughter.",
      "Another year of learning about each other.",
      "Another year of choosing each other.",
      "And hopefully, many more years of us.",
      "Marilou, wherever life takes us, I want you to know that the time we've shared will always have a special place in my heart.",
      "And if someday we look back at the beginning of our story, I hope we'll laugh about that stupid guy who started everything by asking,",
      "**\"Ikaw ni?\"** 😂",
      "And you'll probably still remind me of your legendary answer:",
      "**\"Lain sad kaayu mag Myday kog di ako.\"** HAHAHAHA. ❤️",
      "Thank you for these two beautiful years.",
      "Thank you for being you.",
      "And thank you for being **my person**.",
      "**Happy 2nd Anniversary, my love.**",
      "Here's to the memories we've already made, the moments we're living now, and all the beautiful moments that are still waiting for us.",
      "From one awkward **\"Ikaw ni?\"** to two beautiful years of **us.**",
      "And hopefully, to a lifetime of stories we can laugh about together.",
    ],
    closing: "With all my love,",
    signature: "**Hector \"JayArKakesu\" Bartido Jr. Your One and Only Hubby** ❤️",
    postscript: "September 28, 2026",
  },
  metadata: {
    date: "September 28, 2026",
    location: "Our Special Place",
  },
};
