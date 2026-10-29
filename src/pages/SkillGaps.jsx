import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowUpRight,
  CalendarDays,
  ArrowRight,
  Users,
  FolderKanban,
  Info,
  Download,
} from "lucide-react";
import { Heading, Empty, Modal, Avatar } from "../components/UI";
import { buildSkillGaps, normalizeSkill } from "../services/skillGaps";
export default function SkillGaps({ data, open }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All requested skills");
  const [sort, setSort] = useState("Largest gap");
  const [selectedKey, setSelectedKey] = useState(null);
  const rows = useMemo(() => buildSkillGaps(data), [data]);
  const selected = rows.find((r) => r.key === selectedKey);
  const result = rows
    .filter(
      (r) =>
        r.name.toLowerCase().includes(q.toLowerCase()) &&
        (filter === "All requested skills" ||
          (filter === "Demand exceeds supply" ? r.gap > 0 : r.supply === 0)),
    )
    .sort((a, b) =>
      sort === "Most requested"
        ? b.demand - a.demand || b.gap - a.gap
        : sort === "Skill A–Z"
          ? a.name.localeCompare(b.name)
          : b.gap - a.gap ||
            b.demand - a.demand ||
            a.name.localeCompare(b.name),
    );
  const gaps = rows.filter((r) => r.gap > 0),
    zero = rows.filter((r) => r.supply === 0);
  const plan = (row) => {
    setSelectedKey(null);
    open("workshop", {
      title: `${row.name}: practical foundations`,
      skills: row.name,
    });
  };
  function exportCSV() {
    const escape = (v) => '"' + String(v).replaceAll('"', '""') + '"';
    const csv = [
      [
        "Skill",
        "Recruiting projects requesting skill",
        "Students listing skill",
        "Demand-supply difference",
        "Status",
      ],
      ...rows.map((r) => [r.name, r.demand, r.supply, r.gap, r.status]),
    ]
      .map((r) => r.map(escape).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "college-connect-skill-gaps.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <Heading title="Skill Gaps">
        <button className="secondary" onClick={exportCSV}>
          <Download size={16} />
          Export CSV
        </button>
        <Link className="secondary" to="/workshops">
          <CalendarDays size={16} />
          Workshops
        </Link>
      </Heading>
      <div className="skill-gap-overview">
        <div>
          <FolderKanban size={21} />
          <strong>
            {new Set(rows.flatMap((r) => r.projects.map((p) => p.id))).size}
          </strong>
          <span>Recruiting projects</span>
        </div>
        <div>
          <Users size={21} />
          <strong>{gaps.length}</strong>
          <span>Skills with demand above supply</span>
        </div>
        <div>
          <Info size={21} />
          <strong>{zero.length}</strong>
          <span>Requested skills with no students listed</span>
        </div>
      </div>
      <div className="gap-method">
        <Info size={18} />
        <div>
          <strong>Project demand vs. self-declared student skills</strong>
          <p>
            Demand counts recruiting projects requesting each skill, once per
            project. Supply counts students listing that skill, once per
            student. The difference is a planning signal—not an
            unfilled-position count. Post mentions and workshop attendance do
            not count as skill proficiency.
          </p>
          <span>
            Mock campus data + your local requirements and profile ·
            Case-insensitive exact skill names · No AI scoring
          </span>
        </div>
      </div>
      <div className="filter-panel gap-filters">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search skill gaps"
            placeholder="Search a skill"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter skill gaps"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {[
            "All requested skills",
            "Demand exceeds supply",
            "No students listed",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Sort skill gaps"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {["Largest gap", "Most requested", "Skill A–Z"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <div className="results-line">{result.length} requested skills</div>
      {result.length ? (
        <section className="panel table-wrap gap-table">
          <table>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Projects requesting</th>
                <th>Students listing skill</th>
                <th>Demand − supply</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {result.map((r) => (
                <tr key={r.key}>
                  <th scope="row">
                    <button onClick={() => setSelectedKey(r.key)}>
                      {r.name}
                      <ArrowUpRight size={13} />
                    </button>
                  </th>
                  <td>
                    <button
                      className="gap-number"
                      aria-label={`${r.demand} projects requesting ${r.name}`}
                      onClick={() => setSelectedKey(r.key)}
                    >
                      {r.demand}
                    </button>
                  </td>
                  <td>
                    <button
                      className="gap-number"
                      aria-label={`${r.supply} students listing ${r.name}`}
                      onClick={() => setSelectedKey(r.key)}
                    >
                      {r.supply}
                    </button>
                  </td>
                  <td>
                    <strong className={r.gap ? "gap-shortage" : ""}>
                      {r.gap > 0 ? `+${r.gap}` : "0"}
                    </strong>
                  </td>
                  <td>
                    <span className={`state ${r.gap ? "amber" : ""}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button className="secondary" onClick={() => plan(r)}>
                      <CalendarDays size={14} />
                      Plan workshop
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <Empty title="No matching skill gaps">
          <button
            className="text-link"
            onClick={() => {
              setQ("");
              setFilter("All requested skills");
            }}
          >
            Reset filters
          </button>
        </Empty>
      )}
      {selected && (
        <Modal
          title={`${selected.name} — demand & supply`}
          onClose={() => setSelectedKey(null)}
        >
          <div className="gap-detail-summary">
            <div>
              <strong>{selected.demand}</strong>
              <span>Recruiting projects</span>
            </div>
            <div>
              <strong>{selected.supply}</strong>
              <span>Students listing skill</span>
            </div>
            <span className={`state ${selected.gap ? "amber" : ""}`}>
              {selected.status}
            </span>
          </div>
          <h3>Projects requesting {selected.name}</h3>
          <div className="gap-source-list">
            {selected.projects.map((p) => (
              <Link
                to={`/projects/${p.id}`}
                onClick={() => setSelectedKey(null)}
                key={p.id}
              >
                <FolderKanban size={17} />
                <div>
                  <strong>{p.title}</strong>
                  <span>
                    {p.owner} · {p.size - p.members} total team seats open
                  </span>
                </div>
                <ArrowUpRight size={15} />
              </Link>
            ))}
          </div>
          <h3>Students listing {selected.name}</h3>
          {selected.students.length ? (
            <div className="gap-source-list">
              {selected.students.map((s) => (
                <Link
                  to={s.id === "self" ? "/profile" : `/people/${s.id}`}
                  onClick={() => setSelectedKey(null)}
                  key={s.id}
                >
                  <Avatar name={s.initials} color={s.color} small />
                  <div>
                    <strong>{s.name}</strong>
                    <span>{s.course}</span>
                  </div>
                  <ArrowUpRight size={15} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="gap-no-students">
              No student in this mock campus lists this skill. This does not
              mean nobody is learning it.
            </p>
          )}
          <h3>Related workshops</h3>
          {data.workshops
            .filter((w) =>
              (w.skills || "")
                .split(",")
                .some((s) => normalizeSkill(s) === selected.key),
            )
            .map((w) => (
              <div className="list-row" key={w.id}>
                <Link to="/workshops" onClick={() => setSelectedKey(null)}>
                  {w.title}
                </Link>
                <span>{w.date}</span>
              </div>
            ))}
          {!data.workshops.some((w) =>
            (w.skills || "")
              .split(",")
              .some((s) => normalizeSkill(s) === selected.key),
          ) && (
            <p className="evidence-notice">No workshop lists this skill yet.</p>
          )}
          <p className="evidence-notice">
            Students are not reserved or assigned by this report. Availability
            and experience need individual review.
          </p>
          <div className="modal-actions">
            <button className="secondary" onClick={() => setSelectedKey(null)}>
              Close
            </button>
            <button className="primary" onClick={() => plan(selected)}>
              <CalendarDays size={16} />
              Plan {selected.name} workshop
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
