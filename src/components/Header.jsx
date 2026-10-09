import { ArrowRight, Menu, X } from "lucide-react";
export default function Header({ menu, setMenu }) {
  return (
    <header className="nav">
      <a className="logo" href="#home">
        <span>WS</span>
        <b>WestSide Studio</b>
      </a>
      <nav className={menu ? "open" : ""}>
        {["home", "services", "pricing", "gallery", "book"].map((x) => (
          <a key={x} href={"#" + x} onClick={() => setMenu(false)}>
            {x}
          </a>
        ))}
      </nav>
      <a className="nav-cta" href="#book">
        BOOK A SHOOT <ArrowRight size={15} />
      </a>
      <button
        className="menu"
        onClick={() => setMenu(!menu)}
        aria-label="Toggle menu"
      >
        {menu ? <X /> : <Menu />}
      </button>
    </header>
  );
}
