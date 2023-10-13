import { Object, Taxonomy } from "@prisma/client"
import prisma from "@/lib/db"
import { GetServerSideProps } from "next"
import useSWR from "swr"
import ObjectForm from "@/components/ObjectForm"
import TaxonomyForm from "@/components/TaxonomyForm"
import { useRouter } from "next/router"

const TaxonomyPage = ({ taxonomy }: { taxonomy: Taxonomy }) => {
  const { data, error } = useSWR(`/api/taxonomies/${taxonomy?.id}`, {
    fallbackData: taxonomy,
  })

  const { push } = useRouter()

  return (
    <>
      <h1 className="mb-3">{data?.name}</h1>

      <TaxonomyForm taxonomy={taxonomy} onClose={() => push("/taxonomies")} />
    </>
  )
}

export default TaxonomyPage

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const taxonomy = await prisma.taxonomy.findUnique({
    where: { id: query.id as string },
  })

  return {
    props: {
      taxonomy,
    },
  }
}
