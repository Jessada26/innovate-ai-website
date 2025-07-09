import React from "react";
import { useRouter } from "next/router";

const MenuLogo: React.FC = () => {
  const router = useRouter();
  return (
    <div className="menu-logo" onClick={() => router.push("/")}>
      <a>
        <label>
          Innovate AI
        </label>
      </a>
    </div>
  );
};

export default MenuLogo;
