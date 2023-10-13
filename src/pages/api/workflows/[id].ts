import type { NextApiHandler } from "next"
import prisma from "@/lib/db"

const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET": {
        const workflow = await prisma.workflow.findUnique({
          where: {
            id: req.query["id"] as string,
          },
        })
        res.json(workflow)

        break
      }
      case "POST": {
        // apply workflow
        const data = JSON.parse(req.body)
        const workflow = await prisma.workflow.findUnique({
          where: {
            id: req.query["id"] as string,
          },
        })

        console.log(data)

        switch (workflow?.type) {
          case "createObject":
            {
              const workflow = await prisma.object.create({
                data: {
                  name: data.objectName,
                  data,
                },
              })
              res.json(workflow)
            }
            break
          case "editObject":
            {
              const workflow = await prisma.object.update({
                where: {
                  id: data.objectId as string,
                },
                data: {
                  data,
                },
              })
              res.json(workflow)
            }
            break
        }
      }
      case "PUT": {
        const data = JSON.parse(req.body)
        const workflow = await prisma.workflow.update({
          where: {
            id: req.query["id"] as string,
          },
          data,
        })
        res.json(workflow)

        break
      }
      default:
        throw "Method not allowed"
        break
    }
  } catch (e: any) {
    console.error(e)
    res.status(400).json({ error: e?.name || e })
  }
}

export default handler
