import { recommendedMembers } from "../data/community";
import { people } from "../data/mock";
// Explicit category fixtures only. No scoring, AI processing, or inferred expertise.
const categoryExamples = {
  Sustainability: 1,
  IoT: 1,
  "Artificial Intelligence": 2,
  Cybersecurity: 3,
  "Mobile Apps": 4,
  "Data Analysis": 5,
  "Web Development": 6,
};
export function getMemberSuggestions(project) {
  if (recommendedMembers[project.id])
    return { kind: "project", members: recommendedMembers[project.id] };
  const examples = recommendedMembers[categoryExamples[project.category]] || [];
  return {
    kind: "category",
    members: examples.map((example) => {
      const person = people.find((p) => p.id === example.personId);
      return {
        ...example,
        role: person.role,
        reasons: [
          `${person.skills.join(", ")} are listed on this student's profile.`,
          `${person.interests} are their stated interests. Review their linked work against your roles before inviting.`,
        ],
      };
    }),
  };
}
