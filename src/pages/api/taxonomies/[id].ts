import type { NextApiHandler } from "next"
import prisma from "@/lib/db"

const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET": {
        const taxonomy = await prisma.taxonomy.findUnique({
          where: {
            id: req.query["id"] as string,
          },
        })
        res.json(taxonomy)

        break
      }
      case "PUT": {
        const data = JSON.parse(req.body)
        const taxonomy = await prisma.taxonomy.update({
          where: {
            id: req.query["id"] as string,
          },
          data,
        })
        res.json(taxonomy)

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
