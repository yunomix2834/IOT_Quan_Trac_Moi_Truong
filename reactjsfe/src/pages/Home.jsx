import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-background text-foreground font-manrope">
      <header
        className={`p-5 sm:pr-10 sm:pl-10 fixed w-full z-50 transition-colors duration-300 sm:flex justify-between items-center ${
          isScrolled ? "bg-[#423292]" : "bg-transparent"
        }`}
      >
        <a
          href="/"
          className="text-xl font-extrabold tracking-wide text-white transition-transform transform cursor-pointer md:text-4xl drop-shadow-2xl hover:scale-105"
        >
          HTQT Tự Động
        </a>

        <div className="flex items-center pt-3 space-x-8 sm:pt-0 md:space-x-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full px-4 py-2 text-black bg-white rounded-lg sm:w-auto"
            />
            <button className="absolute right-2 top-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </div>
          <button className="focus:outline-none">
            <svg
              className="w-6 h-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="relative flex flex-col items-center justify-center h-screen pt-16 bg-primary">
        <div
          className="absolute inset-0 bg-center bg-cover opacity-50"
          style={{
            backgroundImage:
              "url('https://images.hdqwalls.com/wallpapers/water-stream-night-forest-4k-e3.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 opacity-50 bg-primary"></div>
        <div className="relative z-10 text-center">
          <h2 className="w-auto mb-4 text-xl font-extrabold leading-tight tracking-widest text-white transition-transform transform md:text-3xl lg:text-5xl drop-shadow-2xl hover:scale-105">
            Website Quan trắc môi trường
          </h2>

          <p className="mb-8 font-semibold leading-relaxed tracking-wider text-gray-200 transition-transform transform text-md md:text-xl lg:text-2xl drop-shadow-lg hover:scale-105">
            Hệ thống quan trắc môi trường, dự đoán tự động
          </p>

          <div className="flex justify-center space-x-4">
            <button className="flex items-center px-8 py-3 space-x-2 transition-transform transform rounded-lg drop-shadow-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                />
              </svg>
              <Link to="/dashboard">
                <span className="font-bold text-white">TRUY CẬP HỆ THỐNG</span>
              </Link>{" "}
            </button>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-muted-foreground">
        Website quan trắc môi trường © 2024
      </footer>
    </div>
  );
}
