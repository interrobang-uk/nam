import { Workflow } from "@prisma/client"
import prisma from "@/lib/db"
import Link from "next/link"

const HomePage = ({ workflows }: { workflows: Workflow[] }) => {
  return (
    <>
      <h1 className="mb-3">Workflows</h1>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">
            Accession and acquisition
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Workset 2
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Workset 3
          </a>
        </li>
      </ul>

      <ul className="list-group mb-3">
        {workflows.map(workflow => (
          <div
            key={workflow.id}
            className="list-group-item py-2 px-3 d-flex justify-content-between align-items-center key={workflow.id}"
          >
            <Link href={`/workflows/${workflow.id}`}>{workflow.name}</Link>

            <Link
              className="btn btn-outline-secondary"
              href={`/workflows/${workflow.id}/edit`}
            >
              Edit
            </Link>
          </div>
        ))}
      </ul>

      <Link href="/workflows/new" className="btn btn-primary">
        + New workflow
      </Link>
    </>
  )
}

export default HomePage

export const getServerSideProps = async () => {
  const workflows = await prisma.workflow.findMany()

  return {
    props: {
      workflows,
    },
  }
}
