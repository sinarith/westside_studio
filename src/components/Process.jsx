function Step({ n, title, text }) {
  return (
    <article className="step">
      <span>{n}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
export default function Process() {
  return (
    <section className="process section">
      <div className="section-label">05 / HOW IT WORKS</div>
      <div className="process-grid">
        <Step
          n="01"
          title="SEND A REQUEST"
          text="Tell us your server, group size, date, location and what you want to create."
        />
        <Step
          n="02"
          title="PLAN THE SCENE"
          text="We confirm the package, poses, location, props and any custom pricing."
        />
        <Step
          n="03"
          title="SHOOT DAY"
          text="Join the server at the agreed time and we capture the scene."
        />
        <Step
          n="04"
          title="DELIVERY"
          text="Your finished photos or video are delivered after editing."
        />
      </div>
    </section>
  );
}
