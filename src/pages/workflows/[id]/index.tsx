import { Workflow } from "@prisma/client"
import prisma from "@/lib/db"
import { GetServerSideProps } from "next"
import useSWR from "swr"
import { useState } from "react"
import { JsonValue } from "@prisma/client/runtime/library"
import Field from "@/components/Field"
import RunWorkflowForm from "@/components/RunWorkflowForm"

const WorkflowPage = ({ workflow }: { workflow: Workflow }) => {
  const { data, error } = useSWR(`/api/workflows/${workflow?.id}`, {
    fallbackData: workflow,
  })

  return (
    <>
      <p className="h5">Running workflow</p>
      <h1 className="mb-3">{data?.name}</h1>
      <RunWorkflowForm workflow={workflow} />
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
