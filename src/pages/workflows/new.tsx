import prisma from "@/lib/db"
import { GetServerSideProps } from "next"
import WorkflowForm from "@/components/WorkflowForm"

const ObjectPage = () => {
  return (
    <>
      <h1 className="mb-3">New workflow</h1>

      <WorkflowForm />
    </>
  )
}

export default ObjectPage
