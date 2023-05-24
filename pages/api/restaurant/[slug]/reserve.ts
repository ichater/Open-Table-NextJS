import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../server/db/client";
import { times } from "../../../../data";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const {
      bookerEmail,
      bookerPhone,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest,
    } = req.body as {
      bookerEmail: string;
      bookerPhone: string;
      bookerFirstName: string;
      bookerLastName: string;
      bookerOccasion: string;
      bookerRequest: string;
    };

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
        id: true,
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

    const tableSeatArr = (function () {
      const tableNumberObj: any = {};
      searchTimeWithTables.tables.forEach(({ seats, id }) => {
        seats in tableNumberObj
          ? tableNumberObj[seats].push(id)
          : (tableNumberObj[seats] = [id]);
      });
      return tableNumberObj;
    })();

    const tablesToBook: number[] = [];
    let seatsRemaining = parseInt(partySize);

    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tableSeatArr[4].length) {
          tablesToBook.push(tableSeatArr[4][0]);
          tableSeatArr[4].shift();
          seatsRemaining = seatsRemaining - 4;
        } else {
          tablesToBook.push(tableSeatArr[2][0]);
          tableSeatArr[2].shift();
          seatsRemaining = seatsRemaining - 2;
        }
      } else {
        if (tableSeatArr[2].length) {
          tablesToBook.push(tableSeatArr[2][0]);
          tableSeatArr[2].shift();
          seatsRemaining = seatsRemaining - 2;
        } else {
          tablesToBook.push(tableSeatArr[4][0]);
          tableSeatArr[4].shift();
          seatsRemaining = seatsRemaining - 4;
        }
      }
    }

    const booking = await prisma.booking.create({
      data: {
        number_of_people:
          typeof parseInt(partySize) === "number" ? parseInt(partySize) : 0,
        booking_time: new Date(`${day}T${time}`),
        booker_email: bookerEmail,
        booker_phone: bookerPhone,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        booker_occasion: bookerOccasion,
        booker_request: bookerRequest,
        restaurant_id: restaurant.id,
      },
    });

    const bookingsOnTablesData = tablesToBook.map((table_id) => ({
      table_id,
      booking_id: booking.id,
    }));

    await prisma.bookingsOnTables.createMany({
      data: bookingsOnTablesData,
    });

    return res.json({
      booking,
    });
  }
}

// http://localhost:3000/api/restautant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-05-22&time=14:00:00.000Z&partySize=4
