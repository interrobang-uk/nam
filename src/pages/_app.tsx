import Link from "next/link"
import { SWRConfig } from "swr"
import "../styles/index.scss"
import { useRouter } from "next/router"

const defaultFetcher = (url: string) => fetch(url).then(res => res.json())

const NavLink = ({ href, children, disabled }) => {
  const { asPath } = useRouter()

  const active = asPath.endsWith(href)

  if (disabled)
    return <li className="nav-item px-3 py-1 text-secondary">{children}</li>

  return (
    <li className="nav-item">
      <Link
        href={href}
        className={active ? "nav-link active" : "nav-link text-white"}
        aria-current={active ? "page" : false}
      >
        {children}
      </Link>
    </li>
  )
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SWRConfig value={{ fetcher: defaultFetcher }}>
      <main className="d-flex flex-nowrap" style={{ minHeight: "100vh" }}>
        <div
          className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
          style={{ width: 280 }}
        >
          <Link
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <span className="fs-4">NAM</span>
          </Link>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            <NavLink href="#" disabled>
              Dashboard
            </NavLink>

            <NavLink href="/">Items</NavLink>
            <NavLink href="/custom-fields">Custom fields</NavLink>
            <NavLink href="/workflows">Workflows</NavLink>
            <NavLink href="/taxonomies">Taxonomies</NavLink>

            <NavLink href="#" disabled>
              User groups
            </NavLink>
          </ul>
          <hr />
          <div className="dropdown">
            <a
              href="#"
              className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://avatars.githubusercontent.com/u/14189497?v=4"
                alt=""
                width="32"
                height="32"
                className="rounded-circle me-2"
              />
              <strong>Jaye Hackett</strong>
            </a>
            <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
              <li>
                <a className="dropdown-item" href="#">
                  Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Profile
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ width: "100%" }}>
          <header className="p-3 bg-body-secondary">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-between gap-2">
              <form role="search" className="d-flex gap-2">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search..."
                  aria-label="Search"
                />

                <button className="btn btn-outline-secondary dropdown-toggle">
                  Views
                </button>

                <button className="btn btn-outline-secondary dropdown-toggle">
                  Filter
                </button>

                <button className="btn btn-outline-secondary dropdown-toggle">
                  Sorted by 1 field
                </button>

                <button className="btn btn-primary dropdown-toggle">
                  Run workflow
                </button>
              </form>{" "}
              <Link href="#" className="btn btn-secondary">
                Export CSV
              </Link>
            </div>
          </header>

          <div className="p-3">
            <Component {...pageProps} />
          </div>
        </div>
      </main>
    </SWRConfig>
  )
}
