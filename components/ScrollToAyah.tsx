"use client";
import { useEffect } from "react";

export default function ScrollToAyah() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          element.classList.add("bg-green-900/20");
          setTimeout(() => element.classList.remove("bg-green-900/20"), 3000);
        }, 500);
      }
    }
  }, []);

  return null; 
}