import { CustomField, Object, Taxonomy } from "@prisma/client"
import prisma from "@/lib/db"
import Link from "next/link"
import FieldForm from "@/components/CustomFieldForm"
import useSWR from "swr"
import { useState } from "react"
import CustomFieldForm from "@/components/CustomFieldForm"
import TaxonomyForm from "@/components/TaxonomyForm"
import Contexts from "@/components/Contexts"

const Taxonomy = ({
  taxonomy,
  taxonomies,
}: {
  taxonomy: Taxonomy
  taxonomies: Taxonomy[]
}) => {
  const { data, error } = useSWR<Taxonomy[]>("/api/taxonomies", {
    fallbackData: taxonomies,
  })

  const children = data?.filter(tax => tax.parentId === taxonomy.id)

  return (
    <>
      <li>
        <Link href={`/taxonomies/${taxonomy.id}`}>{taxonomy.name}</Link>
      </li>
      {children && children.length > 0 && (
        <ul>
          {children.map(child => (
            <Taxonomy key={child.id} taxonomy={child} taxonomies={taxonomies} />
          ))}
        </ul>
      )}
    </>
  )
}

const Taxonomies = ({ taxonomies }: { taxonomies: Taxonomy[] }) => {
  const { data, error } = useSWR<Taxonomy[]>("/api/taxonomies", {
    fallbackData: taxonomies,
  })

  const [editing, setEditing] = useState<boolean>(false)

  const topLevelTaxonomies = data?.filter(taxon => !taxon.parentId)

  return (
    <>
      <h1 className="mb-3">Taxonomies</h1>

      <Contexts />

      <ul>
        {topLevelTaxonomies?.map(taxonomy => (
          <Taxonomy
            taxonomy={taxonomy}
            taxonomies={taxonomies}
            key={taxonomy.id}
          />
        ))}
      </ul>

      <h2 className="h4 mt-4">Add new taxonomy</h2>

      <TaxonomyForm />

      {/* <button className="btn btn-primary">+ New taxon</button> */}
    </>
  )
}

export default Taxonomies

export const getServerSideProps = async () => {
  const taxonomies = await prisma.taxonomy.findMany()

  return {
    props: {
      taxonomies,
    },
  }
}
