import { Object } from "@prisma/client"
import prisma from "@/lib/db"
import Link from "next/link"
import useSWR from "swr"
import { useState } from "react"

const HomePage = ({ objects }: { objects: Object[] }) => {
  const [selectAll, setSelectAll] = useState<boolean>(false)

  return (
    <>
      <h1 className="mb-3">Objects</h1>

      <table className="table mb-3">
        <thead>
          <tr>
            <th scope="col">
              <input
                type="checkbox"
                className="form-check-input"
                checked={selectAll}
                onChange={e => setSelectAll(e.target.checked)}
              />
            </th>
            <th scope="col">Item</th>
            <th scope="col">Taxonomies</th>
            <th scope="col">Location</th>
            <th scope="col">Assignee</th>
            <th scope="col">Comments</th>
          </tr>
        </thead>
        <tbody>
          {objects.map(object => (
            <tr key={object.id}>
              <td>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`select-${object.id}`}
                  checked={selectAll}
                />
              </td>
              <th scope="row">
                <Link href={`/objects/${object.id}`}>{object.name}</Link>
              </th>
              <td>x</td>
              <td>y</td>
              <td>z</td>
              <td>a</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link className="btn btn-primary" href="/objects/new">
        + New object
      </Link>
    </>
  )
}

export default HomePage

export const getServerSideProps = async () => {
  const objects = await prisma.object.findMany()

  return {
    props: {
      objects,
    },
  }
}
