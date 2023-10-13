import { Workflow } from "@prisma/client"
import prisma from "@/lib/db"
import { GetServerSideProps } from "next"
import useSWR from "swr"
import WorkflowForm from "@/components/WorkflowForm"

const WorkflowPage = ({ workflow }: { workflow: Workflow }) => {
  const { data, error } = useSWR(`/api/workflows/${workflow?.id}`, {
    fallbackData: workflow,
  })

  return (
    <>
      <h1 className="mb-3">{data?.name}</h1>

      <WorkflowForm workflow={workflow} />
    </>
  )
}

export default WorkflowPage

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const workflow = await prisma.workflow.findUnique({
    where: { id: query.id as string },
  })

  return {
    props: {
      workflow,
    },
  }
}
