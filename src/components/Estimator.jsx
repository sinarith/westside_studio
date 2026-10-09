import { Check } from "lucide-react";
export default function Estimator({
  packages,
  addons,
  selected,
  people,
  setPeople,
  lightroom,
  setLightroom,
  video,
  total,
}) {
  const pkg = packages.find((p) => p.id === selected);
  return (
    <section className="calculator section">
      <div className="section-label">03 / ESTIMATOR</div>
      <div className="calc-wrap">
        <div>
          <h2>
            Build your
            <br />
            <span>shoot.</span>
          </h2>
          <p>
            Get an instant base estimate. Cars, houses/MLOs and special props
            are quoted separately.
          </p>
          <div className="estimate">
            <small>ESTIMATED BASE TOTAL</small>
            <b>
              ${total}
              {video ? "+" : ""}
            </b>
            <span>
              {video ? "Short cinematic video" : "Photography package"} ·{" "}
              {video
                ? "10–15 sec"
                : people + " person" + (people > 1 ? "s" : "")}
            </span>
          </div>
        </div>
        <div className="controls">
          <div className="control">
            <label>NUMBER OF PEOPLE</label>
            <div className="stepper">
              <button onClick={() => setPeople(Math.max(1, people - 1))}>
                −
              </button>
              <b>{people}</b>
              <button onClick={() => setPeople(people + 1)}>+</button>
            </div>
            {people > 8 && (
              <small>
                +${people - 8} for {people - 8} extra person
                {people - 8 > 1 ? "s" : ""}
              </small>
            )}
          </div>
          <div className="control">
            <label>LIGHTROOM EDIT</label>
            <button
              className={"toggle " + (lightroom ? "on" : "")}
              onClick={() => setLightroom(!lightroom)}
            >
              <span>{lightroom ? "INCLUDED +$2" : "ADD +$2"}</span>
              <i>
                <Check size={13} />
              </i>
            </button>
          </div>
          <div className="addons">
            <label>POPULAR CUSTOM ADD-ONS</label>
            {addons.slice(1).map((a) => (
              <div className="addon" key={a.id}>
                <span>{a.name}</span>
                <small>{a.description}</small>
                <b>QUOTE</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
