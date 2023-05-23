import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../server/db/client";
import { times } from "../../../../data";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant)
    return res.status(400).json({
      errorMessage: `No restaurant matching ${slug}`,
    });

  const { open_time: openTime, close_time: closeTime } = restaurant;

  const avalibleTimesArr = times
    .slice(
      times.findIndex((time) => time.time === openTime),
      times.findIndex((time) => time.time === closeTime)
    )
    .map((time) => time.time);

  if (!avalibleTimesArr.includes(time))
    return res.status(400).json({
      errorMessage: `Restaurant not open at ${time}`,
    });

  const searchTimesWithTables = await findAvailableTables({
    day,
    time,
    res,
    restaurant,
  });

  if (!searchTimesWithTables)
    return res.status(400).json({
      errorMessage: `No available tables`,
    });

  const searchTimeWithTables = searchTimesWithTables.find(
    (t) => t.date.toISOString() === new Date(`${day}T${time}`).toISOString()
  );

  if (!searchTimeWithTables)
    return res.status(400).json({
      errorMessage: `No available tables`,
    });

  const tableSeats = () => {
    const tableNumberObj: any = {};
    searchTimeWithTables.tables.forEach(({ seats, id }) => {
      seats in tableNumberObj
        ? tableNumberObj[seats].push(id)
        : (tableNumberObj[seats] = [id]);
    });
    return tableNumberObj;
  };

  const tableSeatArr = tableSeats();

  return res.json({
    avalibleTimesArr,
    tableSeatArr,
    searchTimeWithTables,
  });
}

// http://localhost:3000/api/restautant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-05-22&time=14:00:00.000Z&partySize=4
