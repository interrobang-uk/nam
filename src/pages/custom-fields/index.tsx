import { CustomField, Object } from "@prisma/client"
import prisma from "@/lib/db"
import Link from "next/link"
import FieldForm from "@/components/CustomFieldForm"
import useSWR from "swr"
import { useState } from "react"
import CustomFieldForm from "@/components/CustomFieldForm"

const FieldEditor = (field: CustomField) => {
  const [editing, setEditing] = useState<boolean>(false)

  return (
    <li className="list-group-item p-0" key={field.id}>
      {editing ? (
        <div className="p-3 bg-body-secondary">
          <header className="d-flex justify-content-end">
            <button
              onClick={() => setEditing(false)}
              type="button"
              className="btn-close"
              aria-label="Close"
            ></button>
          </header>

          <FieldForm field={field} onClose={() => setEditing(false)} />
        </div>
      ) : (
        <div className="py-2 px-3 d-flex justify-content-between align-items-center">
          {field.name || (
            <small className="text-body-secondary">Untitled field</small>
          )}

          <button
            className="btn btn-outline-secondary"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>
      )}
    </li>
  )
}

const HomePage = ({ fields }: { fields: CustomField[] }) => {
  const { data } = useSWR("/api/custom-fields", { fallbackData: fields })

  return (
    <>
      <h1 className="mb-3">Custom fields</h1>
      <ul className="list-group">
        {data.map((field: CustomField) => (
          <FieldEditor {...field} key={field.id} />
        ))}
      </ul>
      <h2 className="h4 mt-4">Add new field</h2>
      <CustomFieldForm />
    </>
  )
}

export default HomePage

export const getServerSideProps = async () => {
  const fields = await prisma.customField.findMany()

  return {
    props: {
      fields,
    },
  }
}
