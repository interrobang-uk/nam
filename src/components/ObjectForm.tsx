import { FormProvider, useForm } from "react-hook-form"
import Field from "./Field"
import { CustomField, Object, Taxonomy } from "@prisma/client"
import useSWR from "swr"
import { useRouter } from "next/router"
import CustomFieldUI from "./CustomField"

type ObjectInput = Pick<CustomField, "name">

const Taxon = ({ taxon }) => {
  const { data } = useSWR<Taxonomy[]>(`/api/taxonomies`)

  const children = data?.filter(t => t.parentId === taxon.id)

  return (
    <>
      <li className="list-group-item form-check" key={taxon.id}>
        <input type="checkbox" className="form-check-input" id={taxon.id} />
        <label htmlFor={taxon.id} className="form-check-label">
          {taxon.name}
        </label>
      </li>
      {children?.length ? (
        <ul>
          {children.map(child => (
            <Taxon key={child.id} taxon={child} />
          ))}
        </ul>
      ) : (
        ""
      )}
    </>
  )
}

const ObjectForm = ({
  object,
  onClose,
}: {
  object?: Object
  onClose?: () => void
}) => {
  const helpers = useForm<ObjectInput>({
    defaultValues: object,
  })

  const { mutate } = useSWR(
    object ? `/api/objects/${object?.id}` : `/api/objects`
  )

  const { data } = useSWR(`/api/custom-fields`)
  const { data: taxonomies } = useSWR<Taxonomy[]>(`/api/taxonomies`)
  const { replace } = useRouter()

  const onSubmit = async (values: ObjectInput) => {
    if (object) {
      // update
      const res = await fetch(`/api/objects/${object?.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      })
      if (res.ok) {
        mutate()
        if (onClose) onClose()
      }
    } else {
      //  create
      const res = await fetch(`/api/objects`, {
        method: "POST",
        body: JSON.stringify(values),
      })
      if (res.ok) {
        mutate()
        const data = await res.json()
        replace(`/objects/${data.id}`)
      }
    }
  }

  return (
    <FormProvider {...helpers}>
      <form onSubmit={helpers.handleSubmit(onSubmit)}>
        <Field name="name" label="Name" required />

        <fieldset className="card p-3 mb-3">
          <legend>Taxonomies</legend>

          <ul className="">
            {taxonomies
              ?.filter(taxon => !taxon.parentId)
              ?.map(taxon => (
                <Taxon taxon={taxon} key={taxon.id} />
              ))}
          </ul>
        </fieldset>

        <fieldset className="card p-3 mb-3">
          <legend>Custom fields</legend>

          {data?.map((field: CustomField) => (
            <CustomFieldUI {...field} key={field.id} />
          ))}
        </fieldset>

        <button className="btn btn-primary">
          {object ? "Save changes" : "Create"}
        </button>
      </form>
    </FormProvider>
  )
}

export default ObjectForm
