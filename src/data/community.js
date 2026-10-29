// Curated prototype content, not recommendation-model output.
export const communityPosts = [
  {
    id: "campus-1",
    authorId: 1,
    title: "Testing a simpler energy dashboard",
    description:
      "I tested our energy dashboard wireframes with five classmates. The biggest change: showing daily usage before detailed charts. Sharing the Figma prototype and what I changed after testing.",
    category: "Project showcase",
    skills: "Figma, UI/UX, User research",
    date: "2026-10-24",
    status: "In progress",
  },
  {
    id: "campus-2",
    authorId: 2,
    title: "My first working room-occupancy sensor",
    description:
      "Connected a PIR sensor to an Arduino and logged occupancy events with Python. Next step is handling noisy readings before connecting it to a dashboard.",
    category: "Personal experiment",
    skills: "Arduino, Python, IoT",
    date: "2026-10-23",
    status: "In progress",
  },
  {
    id: "campus-3",
    authorId: 3,
    title: "Learning JavaScript by building a study timer",
    description:
      "My first personal project: a study timer with start, pause, and reset. I am learning how to keep the interface in sync with changing state. Next, I want to try React.",
    category: "Learning update",
    skills: "JavaScript, HTML, CSS",
    date: "2026-10-22",
    status: "In progress",
  },
  {
    id: "campus-4",
    authorId: 4,
    title: "FastAPI workshop: from route to working endpoint",
    description:
      "Ran a hands-on session on request validation and API routes. We built a small book directory and practiced handling invalid inputs.",
    category: "Workshop",
    skills: "Python, FastAPI, PostgreSQL",
    date: "2026-10-21",
    status: "Completed",
  },
];
// Each suggestion is explicit fixture data. Do not replace this with invented AI scores.
export const recommendedMembers = {
  1: [
    {
      personId: 2,
      role: "IoT developer",
      reasons: [
        "Arduino and IoT skills support the sensor integration role.",
        "Python logging experiment provides relevant work to review.",
      ],
      evidenceId: "campus-2",
    },
    {
      personId: 3,
      role: "Frontend developer (mentored)",
      reasons: [
        "HTML, CSS, and JavaScript provide a foundation for the frontend.",
        "A first-project opportunity; React onboarding would be needed.",
      ],
      evidenceId: "campus-3",
    },
  ],
  2: [
    {
      personId: 4,
      role: "Backend collaborator",
      reasons: [
        "Python and FastAPI complement the React frontend.",
        "API workshop activity provides relevant context; NLP experience is not listed.",
      ],
      evidenceId: "campus-4",
    },
    {
      personId: 3,
      role: "Frontend developer (mentored)",
      reasons: [
        "JavaScript learning activity shows interest in building interfaces.",
        "Would need React mentoring; not a match for the ML developer role.",
      ],
      evidenceId: "campus-3",
    },
  ],
  3: [
    {
      personId: 1,
      role: "UI designer",
      reasons: [
        "Figma and user research fit the open design role.",
        "Dashboard testing post shows an example of iterative interface work.",
      ],
      evidenceId: "campus-1",
    },
    {
      personId: 3,
      role: "JavaScript developer (mentored)",
      reasons: [
        "JavaScript is a required project skill.",
        "The study timer is beginner-level work to review, not proof of security expertise.",
      ],
      evidenceId: "campus-3",
    },
  ],
  4: [
    {
      personId: 1,
      role: "Design collaborator",
      reasons: [
        "UI/UX and user research could support accessible route screens.",
        "No Flutter experience is listed; this does not fill the mobile developer role.",
      ],
      evidenceId: "campus-1",
    },
  ],
  5: [
    {
      personId: 2,
      role: "Data collection collaborator",
      reasons: [
        "Python logging experience could help collect source data.",
        "Pandas and data-analysis experience are not listed.",
      ],
      evidenceId: "campus-2",
    },
  ],
  6: [
    {
      personId: 1,
      role: "Design collaborator",
      reasons: [
        "Accessible design is a listed interest.",
        "Figma and user research complement the frontend team.",
      ],
      evidenceId: "campus-1",
    },
  ],
};
