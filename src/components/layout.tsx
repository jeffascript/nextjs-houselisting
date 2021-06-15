import React, { FunctionComponent, ReactNode } from "react";
import Link from "next/link";
// import { useAuth } from "src/auth/useAuth";

export interface LayoutProps {
  main: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ main }) => {
  const authenticated = false;

  const logout = () => console.log("logged out");

  return (
    <React.Fragment>
      <div className="bg-gradient-to-tr from-indigo-800 to-blue-400 max-w-screen-2xl mx-auto text-white">
        <nav className="bg-gray-800" style={{ height: "64px" }}>
          <div className="px-6 flex items-center justify-between h-16">
            <Link href="/">
              <a>
                <img
                  src="/home-color.svg"
                  alt="home house"
                  className="inline-block w-6"
                />
              </a>
            </Link>

            {authenticated ? (
              <>
                <Link href="/houses/add">
                  <a>Add House</a>
                </Link>
                <button onClick={() => logout()}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <a> Login / Signup</a>
                </Link>
              </>
            )}
          </div>
        </nav>
        <main style={{ minHeight: "calc(100vh - 64px)" }}> {main}</main>
      </div>
    </React.Fragment>
  );
};

export default Layout;
