import { ArrowRight } from "lucide-react";
export default function Pricing({
  packages,
  selected,
  video,
  choose,
  setVideo,
}) {
  return (
    <section id="pricing" className="pricing section">
      <div className="section-label">02 / PRICING</div>
      <div className="pricing-head">
        <div>
          <h2>
            Simple packages.
            <br />
            <span>No hidden base fees.</span>
          </h2>
        </div>
        <p>
          Choose your group size, add editing or request custom props. Final
          custom-scene pricing is confirmed before the shoot.
        </p>
      </div>
      <div className="package-grid">
        {packages.map((p, i) => (
          <button
            className={
              "package " + (selected === p.id && !video ? "active" : "")
            }
            key={p.id}
            onClick={() => choose(p.id)}
          >
            <div className="package-top">
              <small>0{i + 1}</small>
              <span>
                {p.people === 8
                  ? "UP TO 8"
                  : p.people + " PERSON" + (p.people > 1 ? "S" : "")}
              </span>
            </div>
            <h3>{p.name}</h3>
            <strong>
              ${p.price}
              <sup> USD</sup>
            </strong>
            <p>{p.description}</p>
            <div className="package-link">
              SELECT <ArrowRight size={14} />
            </div>
          </button>
        ))}
      </div>
      <button
        className={"video-card " + (video ? "active" : "")}
        onClick={() => setVideo(true)}
      >
        <div>
          <span className="pill">VIDEO</span>
          <h3>SHORT CINEMATIC</h3>
          <p>
            10–15 seconds · starting at $15 · custom graphics & direction quoted
            by request.
          </p>
        </div>
        <strong>$15+</strong>
      </button>
    </section>
  );
}
