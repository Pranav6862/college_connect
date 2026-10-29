import React, { useEffect, useRef } from "react";
import {
  X,
  ArrowUpRight,
  Leaf,
  Brain,
  Shield,
  Bus,
  ChartNoAxesCombined,
  BookOpen,
  Users,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
const icons = {
  leaf: Leaf,
  brain: Brain,
  shield: Shield,
  bus: Bus,
  chart: ChartNoAxesCombined,
  book: BookOpen,
};
export const Avatar = ({ name = "", color = "", small = false }) => (
  <span className={`avatar ${color} ${small ? "small" : ""}`}>{name}</span>
);
export const Tags = ({ items }) => (
  <div className="tags">
    {items.map((x) => (
      <span key={x}>{x}</span>
    ))}
  </div>
);
export function ProjectCard({ project: p }) {
  let Icon = icons[p.icon] || BookOpen;
  return (
    <article className="project-card">
      <div className="card-top">
        <span className={`project-icon ${p.color}`}>
          <Icon size={23} />
        </span>
        <span className="status">
          <i /> {p.status}
        </span>
      </div>
      <div className="eyebrow">{p.category}</div>
      <Link className="card-title" to={`/projects/${p.id}`}>
        {p.title}
        <ArrowUpRight size={17} />
      </Link>
      <p className="summary">{p.summary}</p>
      <Tags items={p.skills} />
      <div className="card-bottom">
        <span>
          <Avatar name={p.initials} small />
          {p.owner}
        </span>
        <span>
          <Users size={14} />
          {p.members}/{p.size}
        </span>
      </div>
      <Link className="card-foot" to={`/projects/${p.id}`}>
        <span>
          {p.roles.length} open {p.roles.length === 1 ? "role" : "roles"}
        </span>
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}
export function Modal({ title, onClose, children }) {
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        let nodes = ref.current.querySelectorAll(
          "button,input,textarea,select,a[href]",
        );
        let first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={ref}
        tabIndex={-1}
      >
        <div className="modal-heading">
          <h2 id="modal-title">{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
export function Empty({ title, children }) {
  return (
    <div className="empty">
      <BookOpen size={28} />
      <h3>{title}</h3>
      {children}
    </div>
  );
}
export function Heading({ title, children }) {
  return (
    <div className="page-heading">
      <h1>{title}</h1>
      <div className="heading-actions">{children}</div>
    </div>
  );
}
