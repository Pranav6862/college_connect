import { projects, people } from "../data/mock";
// Descriptive counts only: one project requesting a skill is one demand signal,
// not a role-level vacancy. Self-declared skills are never inferred from posts.
export function normalizeSkill(value) {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}
export function buildSkillGaps(data) {
  const recruiting = [...projects, ...data.requirements].filter(
    (p) => p.status === "Recruiting" && p.members < p.size,
  );
  const students = [
    ...people,
    {
      ...data.profile,
      id: "self",
      skills: (data.profile.skills || "").split(","),
      initials: data.profile.name
        .split(" ")
        .map((x) => x[0])
        .join(""),
      course: `${data.profile.course} · ${data.profile.year}`,
    },
  ];
  const rows = new Map();
  for (const project of recruiting) {
    for (const skill of new Set(
      project.skills.map(normalizeSkill).filter(Boolean),
    )) {
      if (!rows.has(skill))
        rows.set(skill, {
          key: skill,
          name: project.skills.find((s) => normalizeSkill(s) === skill).trim(),
          projects: [],
          students: [],
          learningPosts: [],
        });
      rows.get(skill).projects.push(project);
    }
  }
  for (const row of rows.values()) {
    row.students = students.filter((s) =>
      s.skills.some((skill) => normalizeSkill(skill) === row.key),
    );
    row.demand = row.projects.length;
    row.supply = row.students.length;
    row.gap = Math.max(0, row.demand - row.supply);
    row.status =
      row.supply === 0
        ? "No students listed"
        : row.gap > 0
          ? "Demand exceeds supply"
          : "Supply meets demand";
  }
  return [...rows.values()].sort(
    (a, b) =>
      b.gap - a.gap || b.demand - a.demand || a.name.localeCompare(b.name),
  );
}
