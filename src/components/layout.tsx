import React, { FunctionComponent, ReactNode } from "react";
import Link from "next/link";
// import { useAuth } from "src/auth/useAuth";

export interface LayoutProps {
  main: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ main }) => {
  const authenticated = false;

  return (
    <React.Fragment>
      <div className="bg-gray-900 max-w-screen-2xl mx-auto text-white">
        <nav className="bg-gray-800 h-16">
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
                <button onClick={() => {}}>Logout</button>
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
        {main}
      </div>
    </React.Fragment>
  );
};

export default Layout;
