import prisma from "@/lib/db"
import { GetServerSideProps } from "next"
import ObjectForm from "@/components/ObjectForm"

const ObjectPage = () => {
  return (
    <>
      <h1 className="mb-3">New object</h1>

      <ObjectForm />
    </>
  )
}

export default ObjectPage
