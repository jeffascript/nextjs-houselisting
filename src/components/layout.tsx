import React, { FunctionComponent, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "src/auth/useAuth";

export interface ILayoutProps {
  main: ReactNode;
}

const Layout: FunctionComponent<ILayoutProps> = ({ main }) => {
  const { logout, user, authenticated } = useAuth();
  /****
   * We now remove the placeholders we were using since we have context values
   *   const authenticated = true;
   *   const logout = () => null;
   ****/

  return (
    <React.Fragment>
      {/* text color and whole page theming done here */}
      <div className="bg-gradient-to-tr from-indigo-800 to-blue-400 max-w-screen-2xl mx-auto text-white">
        <nav className="bg-gray-800" style={{ height: "64px" }}>
          <div className="px-6 flex items-center justify-between h-16">
            <Link href="/">
              <a>
                <Image
                  //   placeholder="blur"
                  //   blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  src="/home-color.svg"
                  alt="home house"
                  className="inline-block w-6"
                  width="20px"
                  height="20px"
                  //   layout="responsive"  // "fixed" | "intrinsic" | "responsive"
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
