import { CustomField } from "@prisma/client"
import Field from "./Field"
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

const MapContainer = ({ google, coordinates, onChange }) => (
  <Map
    google={google}
    zoom={12}
    initialCenter={coordinates}
    containerStyle={{
      position: "relative",
      height: "100%",
    }}
  >
    <Marker
      position={coordinates}
      draggable={true}
      onDragend={(x, y, z) =>
        onChange({
          lat: z.latLng?.lat?.(),
          lng: z.latLng?.lng?.(),
        })
      }
    />
  </Map>
)

const Preview = GoogleApiWrapper({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
})(MapContainer)

const CustomFieldUI = (field: CustomField) => {
  const { setValue, getValues } = useFormContext()

  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>(
    getValues(`data.${field.name}`)
  )

  useEffect(() => {
    if (field.type === "map") {
      setValue(`data.${field.name}.lat`, coordinates?.lat)
      setValue(`data.${field.name}.lng`, coordinates?.lng)
    }
  }, [coordinates, setValue, field.name, field.type])

  if (field.type === "map")
    return (
      <fieldset className="card p-3">
        <div className="row">
          <div className="col">
            <legend className="h4 mb-3">{field?.name}</legend>

            <Field
              name={`data.${field.name}.lat`}
              label="Latitude"
              required={field.required}
            />

            <Field
              name={`data.${field.name}.lng`}
              label="Longitude"
              required={field.required}
            />
          </div>

          <div className="col-8 mapppp">
            <Preview
              coordinates={coordinates}
              onChange={newCoordinates => setCoordinates(newCoordinates)}
            />
          </div>
        </div>
      </fieldset>
    )

  return (
    <Field
      name={`data.${field.name}`}
      label={field.name}
      key={field.id}
      type={field.type}
      required={field.required}
    />
  )
}

export default CustomFieldUI
