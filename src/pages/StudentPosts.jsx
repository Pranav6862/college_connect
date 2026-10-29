import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ArrowUpRight, FileText, Users } from "lucide-react";
import { communityPosts } from "../data/community";
import { people } from "../data/mock";
import { Heading, Avatar, Tags, Empty } from "../components/UI";
export default function StudentPosts({ data, open }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All categories");
  const own = data.posts.map((p) => ({
    ...p,
    isOwn: true,
    author: {
      name: data.profile.name,
      initials: data.profile.name
        .split(" ")
        .map((s) => s[0])
        .join(""),
      course: `${data.profile.course} · ${data.profile.year}`,
    },
  }));
  const all = [
    ...own,
    ...communityPosts.map((p) => ({
      ...p,
      author: people.find((s) => s.id === p.authorId),
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  const filtered = all.filter(
    (p) =>
      (category === "All categories" || p.category === category) &&
      (p.title + " " + p.description + " " + p.skills + " " + p.author.name)
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  return (
    <>
      <Heading title="Student Posts">
        <Link className="secondary" to="/posts">
          My Posts
        </Link>
        <button className="primary" onClick={() => open("post")}>
          <Plus size={16} />
          Create Post
        </button>
      </Heading>
      <div className="posts-layout">
        <div>
          <div className="post-composer">
            <Avatar
              name={
                own[0]?.author.initials ||
                data.profile.name
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
              }
              color="sage"
            />
            <button onClick={() => open("post")}>
              Share work, an achievement, or something you learned…
              <Plus size={18} />
            </button>
          </div>
          <div className="filter-panel student-post-filters">
            <div className="search-field">
              <Search size={17} />
              <input
                aria-label="Search student posts"
                placeholder="Search posts, skills, or students"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              aria-label="Filter student post category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {["All categories", ...new Set(all.map((p) => p.category))].map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </select>
          </div>
          <div className="feed">
            {filtered.map((p) => (
              <article
                className="panel post campus-post"
                id={`post-${p.id}`}
                key={p.id}
              >
                <div className="post-author">
                  <Link to={p.isOwn ? "/profile" : `/people/${p.authorId}`}>
                    <Avatar name={p.author.initials} color={p.author.color} />
                  </Link>
                  <div>
                    <Link to={p.isOwn ? "/profile" : `/people/${p.authorId}`}>
                      <strong>{p.author.name}</strong>
                    </Link>
                    <span>{p.author.course}</span>
                  </div>
                  <time>{p.date}</time>
                </div>
                <div className="post-meta">
                  <span>{p.category}</span>
                  {p.status && <span className="post-status">{p.status}</span>}
                </div>
                <h2>{p.title}</h2>
                <p>{p.description}</p>
                <Tags
                  items={p.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)}
                />
                <div className="campus-post-footer">
                  <Link
                    className="text-link"
                    to={p.isOwn ? "/profile" : `/people/${p.authorId}`}
                  >
                    View activity profile <ArrowUpRight size={15} />
                  </Link>
                  {p.isOwn && (
                    <Link className="text-link" to="/posts">
                      Edit post
                    </Link>
                  )}
                </div>
              </article>
            ))}
            {!filtered.length && (
              <Empty title="No matching posts">
                <button
                  className="text-link"
                  onClick={() => {
                    setQ("");
                    setCategory("All categories");
                  }}
                >
                  Reset filters
                </button>
              </Empty>
            )}
          </div>
        </div>
        <aside className="posts-aside">
          <section className="panel">
            <span className="aside-icon">
              <FileText size={21} />
            </span>
            <h2>Your evolving profile</h2>
            <p>
              Published work and learning updates appear on your profile
              automatically.
            </p>
            <div className="profile-source-row">
              <span>Published posts</span>
              <strong>{data.posts.length}</strong>
            </div>
            <div className="profile-source-row">
              <span>Activity topics</span>
              <strong>
                {
                  new Set(
                    data.posts.flatMap((p) =>
                      p.skills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    ),
                  ).size
                }
              </strong>
            </div>
            <Link to="/profile" className="secondary full">
              View Activity & Learning <ArrowUpRight size={15} />
            </Link>
            <p className="evidence-notice">
              Post topics stay separate from your self-declared skills.
            </p>
          </section>
          <section className="panel">
            <span className="aside-icon">
              <Users size={21} />
            </span>
            <h2>Looking for teammates?</h2>
            <Link className="primary full" to="/recruitment">
              Project Recruitment <ArrowUpRight size={15} />
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
