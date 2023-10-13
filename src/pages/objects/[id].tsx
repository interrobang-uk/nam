import { Object } from "@prisma/client"
import prisma from "@/lib/db"
import { GetServerSideProps } from "next"
import useSWR from "swr"
import ObjectForm from "@/components/ObjectForm"
import Comments from "@/components/Comments"
import Link from "next/link"
import Revisions from "@/components/Revisions"

const ObjectPage = ({ object }: { object: Object }) => {
  const { data, error } = useSWR(`/api/objects/${object?.id}`, {
    fallbackData: object,
  })

  return (
    <>
      <h1 className="mb-3">{data?.name}</h1>

      <div className="row">
        <div className="col-8">
          <ObjectForm object={object} />
        </div>
        <div className="col">
          <Comments object={object} />
          <Revisions />
        </div>
      </div>
    </>
  )
}

export default ObjectPage

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const object = await prisma.object.findUnique({
    where: { id: query.id as string },
  })

  return {
    props: {
      object,
    },
  }
}
