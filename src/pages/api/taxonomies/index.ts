import type { NextApiHandler } from "next"
import prisma from "@/lib/db"

const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        const taxonomies = await prisma.taxonomy.findMany()
        res.json(taxonomies)

        break
      case "POST":
        const data = JSON.parse(req.body)
        const taxonomy = await prisma.taxonomy.create({
          data: {
            ...data,
            parentId: data?.parentId || undefined,
          },
        })
        res.json(taxonomy)

        break
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
