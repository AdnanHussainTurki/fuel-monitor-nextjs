import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../../lib/mongodb";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const data = req.body;
  const {
    vid,
    spending,
    meter_reading,
    rate_per_litre,
    refuel_on,
    percent_before_refuel,
  } = data;
  if (!vid || !spending || !meter_reading || !rate_per_litre || !refuel_on) {
    res.status(422).json({
      message: "Invalid input.",
    });
    return;
  }
  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }
  const userEmail = session.user.email;
  const client = await connectToDatabase();
  const db = await client.db();
  const existingUser = await db
    .collection("vehicles")
    .findOne({ _id: ObjectId(vid), user_email: userEmail });
  if (!existingUser) {
    res.status(422).json({ message: "Vehicle not found!" });
    client.close();
    return;
  }

  const refuel = await db
    .collection("refuels")
    .insertOne({
      vid: ObjectId(vid),
      spending,
      meter_reading,
      rate_per_litre,
      refuel_on,
      percent_before_refuel,
      user_email: userEmail,
      created_at: new Date(),
    });
  client.close();
  res.status(201).json({ message: "Refueled!", refuel: refuel});
}
export default handler;
