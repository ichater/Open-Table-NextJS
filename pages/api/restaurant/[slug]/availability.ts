import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../data";
import { prisma } from "../../../../server/db/client";

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

  if (!day || !time || !partySize) {
    res.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

  const searchTimes = times.find((t) => {
    return t.time === time;
  })?.searchTimes;

  if (!searchTimes) {
    res.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes && searchTimes[0]}`),
        lte: new Date(
          `${day}T${searchTimes && searchTimes[searchTimes.length - 1]}`
        ),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce((obj, table) => {
        return { ...obj, [table.table_id]: true };
      }, {});
  });

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
    },
  });

  if (!restaurant) {
    res.status(400).json({
      errorMessage: "Invalid data provided",
    });
  }

  const tables = restaurant?.tables;

  const searchTimesWithTables = searchTimes?.map((time) => ({
    date: new Date(`${day}T${time}`),
    time: time,
    tables,
  }));

  searchTimesWithTables?.forEach((t) => {
    t.tables = t.tables?.filter((table) => {
      if (bookingTablesObj[t.date.toISOString()]) {
        if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  const availbilities = searchTimesWithTables?.map((t) => {
    const sumSeats = t.tables?.reduce((sum, table) => sum + table.seats, 0);
    return {
      time: t.time,
      available: sumSeats && sumSeats >= parseInt(partySize),
    };
  });

  return res.json({
    availbilities,
  });
}

// http://localhost:3000/api/restautant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-05-22&time=14:00:00.000Z&partySize=4
// vivaan-fine-indian-cuisine-ottawa