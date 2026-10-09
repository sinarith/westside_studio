import { ArrowRight, Camera, Disc3, Zap } from "lucide-react";
function Service({ icon, num, title, text }) {
  return (
    <article className="service">
      <div className="service-icon">{icon}</div>
      <small>{num}</small>
      <h3>{title}</h3>
      <p>{text}</p>
      <ArrowRight className="service-arrow" />
    </article>
  );
}
export default function Services() {
  return (
    <>
      <section id="services" className="intro section">
        <div className="section-label">01 / WHAT WE DO</div>
        <div>
          <h2>
            We turn your FiveM
            <br />
            <span>moments into scenes.</span>
          </h2>
          <p className="lead">
            Whether you're building a gang identity, celebrating a new character
            or creating content for your server, we create polished frames that
            feel like they belong on a movie poster.
          </p>
        </div>
      </section>
      <section className="service-grid">
        <Service
          icon={<Camera />}
          num="01"
          title="PHOTO SESSIONS"
          text="Single portraits, couples, trios, squads and full gang sessions."
        />
        <Service
          icon={<Disc3 />}
          num="02"
          title="CINEMATIC VIDEO"
          text="10–15 second edits with camera movement, graphics and atmosphere."
        />
        <Service
          icon={<Zap />}
          num="03"
          title="CREATIVE DIRECTION"
          text="We can help plan poses, locations, cars, props and the overall scene."
        />
      </section>
    </>
  );
}
