import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowUpRight } from "lucide-react";
import { Tags } from "./UI";
export default function ActivityProfile({ posts, own = false }) {
  const skills = [
    ...new Set(
      posts.flatMap((p) =>
        (p.skills || "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      ),
    ),
  ];
  return (
    <section className="panel activity-profile">
      <div className="section-heading">
        <h2>
          <FileText size={17} />
          Activity & Learning
        </h2>
        {own && (
          <Link to="/posts">
            Manage posts <ArrowUpRight size={15} />
          </Link>
        )}
      </div>
      <p className="evidence-notice">
        Built from published posts. Mentioned skills are not verified expertise.
      </p>
      {skills.length > 0 && (
        <>
          <h3>Skills explored in posts</h3>
          <Tags items={skills} />
        </>
      )}
      {posts.length ? (
        <div className="profile-timeline">
          {posts.map((post) => (
            <Link
              to={`${own ? "/posts" : "/student-posts"}#post-${post.id}`}
              key={post.id}
            >
              <span className="timeline-marker" />
              <div>
                <span className="eyebrow">
                  {post.category} · {post.date}
                </span>
                <h3>{post.title}</h3>
                <span className="timeline-skills">{post.skills}</span>
              </div>
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-activity">
          <p>No activity published yet. Learning updates count, too.</p>
          {own && (
            <Link className="text-link" to="/posts">
              Create your first post
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
