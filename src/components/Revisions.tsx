import { relativeDate } from "@/lib/formatters"
import Link from "next/link"

const Revisions = () => (
  <>
    <h2 className="mt-5 mb-3 h4">Revisions</h2>
    <ol className="timeline">
      <li>
        <h3 className="h6 mb-0">
          <Link href="/" className="link-secondary">
            Edited
          </Link>
        </h3>
        <small>{relativeDate("2023-10-10")} | Demo User</small>
      </li>
      <li>
        <h3 className="h6 mb-0">
          <Link href="/" className="link-secondary">
            Edited
          </Link>
        </h3>
        <small>{relativeDate("2023-05-10")} | Demo User</small>
      </li>
      <li>
        <h3 className="h6 mb-0">
          <Link href="/" className="link-secondary">
            Edited
          </Link>
        </h3>
        <small>{relativeDate("2022-11-10")} | Demo User</small>
      </li>
    </ol>
    <Link href="#">See history</Link>
  </>
)

export default Revisions
