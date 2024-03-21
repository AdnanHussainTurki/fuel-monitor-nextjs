import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '../../../lib/mongodb'

async function handler(req, res) {
    if (req.method !== 'GET') {
        return
    }
    const session = await getServerSession(req, res)
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
        .toArray()
    // Calculate the sum of all refuels for each vehicle
    for (let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i]
        const cursor = await db
            .collection('refuels')
            .aggregate([
                {
                    $match: {
                        vid: vehicle._id,
                    },
                },
                {
                    $addFields: {
                        spendingAsInt: {
                            $toInt: '$spending',
                        },
                    },
                },
                {
                    $group: {
                        _id: '$vid',
                        totalSpending: {
                            $sum: '$spendingAsInt',
                        },
                    },
                },
                {
                    $limit: 1,
                },
            ])
            .toArray()
        const cursor2 = await db
            .collection('refuels')
            .aggregate([
                {
                    $match: {
                        vid: vehicle._id,
                    },
                },
                {
                    $project: {
                        refuel_on: 1,
                        refueled_on: {
                            $dateFromString: {
                                dateString: '$refuel_on',
                            },
                        },
                        spending: 1,
                        spendingAsInt: {
                            $toInt: '$spending',
                        },
                        refuel_month: {
                            $month: '$refueled_on',
                        },
                        refuel_year: {
                            $year: '$refueled_on',
                        },
                        current_month: {
                            $month: new Date(),
                        },
                        current_year: {
                            $year: new Date(),
                        },
                    },
                },
                {
                    $addFields: {
                        refuel_month: {
                            $month: '$refueled_on',
                        },
                        refuel_year: {
                            $year: '$refueled_on',
                        },
                        current_month: {
                            $month: new Date(),
                        },
                        current_year: {
                            $year: new Date(),
                        },
                        spendingAsInt: {
                            $toInt: '$spending',
                        },
                    },
                },
                {
                    $match: {
                        $expr: {
                            $eq: ['$refuel_month', '$current_month'],
                        },
                    },
                },
                {
                    $group: {
                        _id: '$vid',
                        totalSpendingThisMonth: {
                            $sum: '$spendingAsInt',
                        },
                    },
                },
                {
                    $limit: 1,
                },
            ])
            .toArray()
        try {
            vehicles[i].total_spending = cursor[0]['totalSpending']
            vehicles[i].monthly_spending = cursor2[0]['totalSpendingThisMonth']
        } catch (error) {
            vehicles[i].total_spending = 0
            vehicles[i].monthly_spending = 0
        }
    }
    client.close()
    res.status(201).json({
        message: 'Vehicles Pulled!',
        vehicles: vehicles,
        email: userEmail,
    })
}
export default handler
