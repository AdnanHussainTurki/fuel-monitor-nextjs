import { ObjectId } from 'mongodb'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '../../../lib/mongodb'

async function handler(req, res) {
  if (req.method !== 'GET') {
    return
  }
  const session = await getSession({ req: req })
  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' })
    return
  }
  const userEmail = session.user.email
  const client = await connectToDatabase()
  const db = await client.db()
  const vehicles = await db
    .collection('vehicles')
    .find({ user_email: userEmail })
    .sort({ createdAt: -1 })
    .toArray();
  // Calculate the sum of all refuels for each vehicle
  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i]
    const cursor =  await db
      .collection('refuels')
      .aggregate([
        {
          '$match': {
            'vid': vehicle._id,
          }
        }, {
          '$addFields': {
            'spendingAsInt': {
              '$toInt': '$spending'
            }
          }
        }, {
          '$group': {
            '_id': '$vid', 
            'totalSpending': {
              '$sum': '$spendingAsInt'
            }
          }
        },
        {
          '$limit': 1
        }
      ]).toArray()
      console.log(cursor)
      console.log(cursor[0])
      console.log(cursor.length)
      const cursor2 =  await db
      .collection('refuels')
      .aggregate([
        {
          '$match': {
            'vid': vehicle._id,
          }
        }, {
          '$addFields': {
            'spendingAsInt': {
              '$toInt': '$spending'
            }
          }
        }, {
          '$match': {
            '$expr': {
              '$eq': [
                {
                  '$month': new Date("$refuel_on")
                }, {
                  '$month': new Date()
                }
              ]
            }
          }
        }, {
          '$group': {
            '_id': '$vid', 
            'totalSpendingThisMonth': {
              '$sum': '$spendingAsInt'
            }
          }
        },
        {
          '$limit': 1
        }
      ]).toArray()
      console.log(cursor2)
      console.log(cursor2[0])
      console.log(cursor2.length)
      vehicles[i].total_spending = cursor[0].totalSpending
      vehicles[i].monthly_spending = cursor2[0].totalSpendingThisMonth
    
  }
  client.close()
  res.status(201).json({ message: 'Vehicles Pulled!', vehicles: vehicles, email: userEmail })
}
export default handler
