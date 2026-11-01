export const STUDY_NOTES = [
  { id: "study-plan", title: "Study plan", name: "Study-Plan.md" },
  { id: "teaching-notes", title: "Teaching notes", name: "Final-Exam-Teaching-Notes.md" },
  { id: "worked-examples", title: "Worked examples", name: "Final-Exam-Worked-Examples.md" },
  { id: "mock-exam-a", title: "Mock final exam A", name: "Mock-Final-Exam.md" },
  { id: "mock-memo-a", title: "Exam A memorandum", name: "Mock-Final-Exam-Memorandum.md" },
  { id: "mock-exam-b", title: "Mock final exam B", name: "Mock-Final-Exam-B.md" },
  { id: "mock-memo-b", title: "Exam B memorandum", name: "Mock-Final-Exam-B-Memorandum.md" }
].map(note => ({ ...note, url: "assets/maths/" + note.name }));

export const BOOK_DOWNLOAD = {
  url: "https://github.com/XalebXEn99/study_room/releases/download/study-resources-2026/os-book.zip",
  name: "os-book.zip"
};

export const YOUTUBE_COLLECTION = [
  { title: "Tekken movie", url: "https://youtu.be/C_Ch61m-PUs" },
  { title: "Streetfighter movie", url: "https://youtu.be/r0QEhffS8WE" },
  { title: "Devil May Cry (2007)", url: "https://youtu.be/kWkea7Vjp9I" },
  { title: "Hellsing (2001)", url: "https://youtu.be/NNt8FeJcEJQ" }
];

export const SPOTIFY_COLLECTION = [
  { title: "Replay 2025", url: "https://open.spotify.com/playlist/6g0Z73wQf2UDEXnCglvqCK" },
  { title: "Playlist farm", url: "https://open.spotify.com/playlist/4FXIexXCIREWCSREF6GosY" },
  { title: "City pop for my soul", url: "https://open.spotify.com/playlist/4wqF0CBDNfp8jgdrrtLXeG" }
];
