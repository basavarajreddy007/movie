import { useState, useRef, useMemo } from "react";
import type { MovieCredits, CastMember, CrewMember } from "../types/movies";
import { ChevronLeft, ChevronRight, UsersIcon, Clapperboard } from "./icons";
import "../styles/castCarousel.css";

interface Props {
  credits: MovieCredits | null;
  loading?: boolean;
}

const IMPORTANT_CREW_JOBS = [
  "Director",
  "Writer",
  "Screenplay",
  "Producer",
  "Executive Producer",
  "Original Music Composer",
  "Director of Photography",
  "Editor",
];

export function CastCarousel({ credits, loading = false }: Props) {
  const [activeTab, setActiveTab] = useState<"cast" | "crew">("cast");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const cast = useMemo(() => {
    return credits?.cast ? credits.cast.slice(0, 25) : [];
  }, [credits]);

  const crew = useMemo(() => {
    if (!credits?.crew) return [];

    // Filter and prioritize key crew members
    const seen = new Set<string>();
    const keyCrew: CrewMember[] = [];

    // First pass: important jobs
    for (const member of credits.crew) {
      if (member.job && IMPORTANT_JOBS_SET.has(member.job)) {
        const key = `${member.id}-${member.job}`;
        if (!seen.has(key)) {
          seen.add(key);
          keyCrew.push(member);
        }
      }
    }

    // Second pass: other crew up to limit
    for (const member of credits.crew) {
      const key = `${member.id}-${member.job}`;
      if (!seen.has(key) && keyCrew.length < 25) {
        seen.add(key);
        keyCrew.push(member);
      }
    }

    return keyCrew;
  }, [credits]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -320 : 320;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const hasCast = cast.length > 0;
  const hasCrew = crew.length > 0;

  if (!loading && !hasCast && !hasCrew) {
    return null;
  }

  return (
    <section className="cast-carousel-section" aria-label="Movie Cast and Crew">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="cast-tabs-wrapper">
            <button
              type="button"
              onClick={() => setActiveTab("cast")}
              className={`cast-tab-item ${
                activeTab === "cast"
                  ? "cast-tab-item-active"
                  : "cast-tab-item-inactive"
              }`}
            >
              <UsersIcon size={14} />
              <span>Top Cast {hasCast ? `(${cast.length})` : ""}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("crew")}
              className={`cast-tab-item ${
                activeTab === "crew"
                  ? "cast-tab-item-active"
                  : "cast-tab-item-inactive"
              }`}
            >
              <Clapperboard size={14} />
              <span>Key Crew {hasCrew ? `(${crew.length})` : ""}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            className="carousel-nav-btn"
            aria-label="Scroll left"
            title="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            className="carousel-nav-btn"
            aria-label="Scroll right"
            title="Next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="carousel-scroll-container"
        tabIndex={0}
        role="region"
        aria-label={activeTab === "cast" ? "Cast member list" : "Crew member list"}
      >
        {activeTab === "cast" ? (
          hasCast ? (
            cast.map((member: CastMember) => {
              const hasPhoto = member.profile_path && !imageErrors[member.id];
              const photoUrl = hasPhoto
                ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                : null;

              return (
                <article key={`${member.id}-${member.order ?? 0}`} className="cast-card">
                  <div className="cast-avatar-box">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={member.name}
                        className="cast-avatar-img"
                        loading="lazy"
                        onError={() => handleImageError(member.id)}
                      />
                    ) : (
                      <div className="cast-avatar-placeholder">
                        <span>{member.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="cast-info-box">
                    <h3 className="cast-actor-name" title={member.name}>
                      {member.name}
                    </h3>
                    <p className="cast-character-name" title={member.character}>
                      {member.character || "Character role"}
                    </p>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 py-4">No cast details available.</p>
          )
        ) : hasCrew ? (
          crew.map((member: CrewMember, idx: number) => {
            const hasPhoto = member.profile_path && !imageErrors[member.id];
            const photoUrl = hasPhoto
              ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
              : null;

            return (
              <article key={`${member.id}-${member.job}-${idx}`} className="cast-card">
                <div className="cast-avatar-box">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={member.name}
                      className="cast-avatar-img"
                      loading="lazy"
                      onError={() => handleImageError(member.id)}
                    />
                  ) : (
                    <div className="cast-avatar-placeholder">
                      <span>{member.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="cast-info-box">
                  <h3 className="cast-actor-name" title={member.name}>
                    {member.name}
                  </h3>
                  <span className="cast-role-tag truncate max-w-full" title={member.job}>
                    {member.job || member.department || "Crew"}
                  </span>
                </div>
              </article>
            );
          })
        ) : (
          <p className="text-xs text-slate-500 py-4">No crew details available.</p>
        )}
      </div>
    </section>
  );
}

const IMPORTANT_JOBS_SET = new Set(IMPORTANT_CREW_JOBS);

export default CastCarousel;
