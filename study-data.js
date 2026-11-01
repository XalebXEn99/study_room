const mathsNotes = [
  { id: "study-plan", title: "Study plan", name: "Study-Plan.md" },
  { id: "teaching-notes", title: "Teaching notes", name: "Final-Exam-Teaching-Notes.md" },
  { id: "worked-examples", title: "Worked examples", name: "Final-Exam-Worked-Examples.md" },
  { id: "mock-exam-a", title: "Mock final exam A", name: "Mock-Final-Exam.md" },
  { id: "mock-memo-a", title: "Exam A memorandum", name: "Mock-Final-Exam-Memorandum.md" },
  { id: "mock-exam-b", title: "Mock final exam B", name: "Mock-Final-Exam-B.md" },
  { id: "mock-memo-b", title: "Exam B memorandum", name: "Mock-Final-Exam-B-Memorandum.md" }
].map(note => ({ ...note, collection: "maths", url: "assets/maths/" + note.name }));

export const STUDY_NOTES = [
  ...mathsNotes,
  {
    id: "sdp-exam-tips",
    title: "SDP exam tips",
    name: "SDP-Exam-Tips.md",
    collection: "sdp",
    url: "assets/sdp/SDP-Exam-Tips.md"
  }
];

export const BOOK_DOWNLOAD = {
  url: "https://github.com/XalebXEn99/study_room/releases/download/study-resources-2026/os-book.zip",
  name: "os-book.zip"
};

export const YOUTUBE_COLLECTION = [
  { title: "SDP - Software Development Party", url: "https://www.youtube.com/playlist?list=PLek4jWKl7ylE" }
];

export const SPOTIFY_COLLECTION = [
  { title: "Replay 2025", url: "https://open.spotify.com/playlist/6g0Z73wQf2UDEXnCglvqCK" },
  { title: "Playlist farm", url: "https://open.spotify.com/playlist/4FXIexXCIREWCSREF6GosY" },
  { title: "City pop for my soul", url: "https://open.spotify.com/playlist/4wqF0CBDNfp8jgdrrtLXeG" },
  { title: "Playlist 4", url: "https://open.spotify.com/playlist/37i9dQZF1DX08mhnhv6g9b" },
  { title: "Playlist 5", url: "https://open.spotify.com/playlist/7ED3tauJjkhapme2NOK4Se" },
  { title: "Playlist 6", url: "https://open.spotify.com/playlist/0w2wAaeArRZqB7bFgDTVlA" },
  { title: "Playlist 7", url: "https://open.spotify.com/playlist/62aVuuh673VINeAGi8zKPG" },
  { title: "Playlist 8", url: "https://open.spotify.com/playlist/5R0nzmDPHvv2w1oHhSLzuY" }
];
