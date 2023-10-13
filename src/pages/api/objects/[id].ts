import type { NextApiHandler } from "next"
import prisma from "@/lib/db"

const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET": {
        const object = await prisma.object.findUnique({
          where: {
            id: req.query["id"] as string,
          },
        })
        res.json(object)

        break
      }
      case "PUT": {
        const data = JSON.parse(req.body)
        const object = await prisma.object.update({
          where: {
            id: req.query["id"] as string,
          },
          data,
        })
        res.json(object)

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
