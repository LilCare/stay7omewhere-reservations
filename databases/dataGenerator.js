const faker = require('faker');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const seed = require('./seedHelpers.js')

const writeUsers = fs.createWriteStream(path.resolve(__dirname, 'data', 'users.csv'));
writeUsers.write('userID,username\n', 'utf8');

function writeTenMillionUsers(writer, encoding, callback) {
  let i = 10; //10000000;
  let id = 0;
  function write() {
    let ok = true;
    do {
      i -= 1;
      id += 1;
      const username = faker.internet.userName();
      const data = `${id},${username}\n`;
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
    // see if we should continue, or wait
    // don't pass the callback, because we're not done yet.
       ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
      if (i > 0) {
    // had to stop early!
    // write some more once it drains
        writer.once('drain', write);
      }
    }
  write()
}

writeTenMillionUsers(writeUsers, 'utf-8', () => {
  writeUsers.end();
});

const writeRooms = fs.createWriteStream(path.resolve(__dirname, 'data', 'rooms.csv'));
writeRooms.write('rID,rMax_guests,rNightly_price,rCleaning_fee,rService_fee,rTaxes_fees,rBulkDiscount,rRequired_Week_Booking_Days,rRating,rReviews\n', 'utf8');

function writeTenMillionRooms(writer, encoding, callback) {
  let i = 10; //1000000;
  let id = 0;
  let pseudoRandomID = 0

  const pseduoMaxGuests = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const pseduoNightlyPrice = [89, 100, 105, 150, 189, 205, 235, 289, 300, 325];
  const pseduoCleaningFee = [35, 45, 55, 65, 75, 81, 40, 80, 59, 49];
  const pseudoTaxesFees = [null, 3, null, 5, null, null, null, null, 8, 10];
  const pseudoBulkDiscount = [0.05, null, null, null, 0.05, null, null, null, 0.05, null];
  const pseudoRequiredDays = [3, 3, 3, 4, 4, 5, 5, 6, 7, 3];
  const pseudoRating = [2.7, 3.5, 3.6, 3.7, 4.1, 4.5, 4.6, 4.7, 4.8, 4.9];
  const pseudoReview = [15, 63, 71, 89, 157, 186, 203, 879, 1017, 5203];

  function write() {
    let ok = true;
    do {
      i -= 1;
      id += 1;

      let rMax_guests = pseduoMaxGuests[pseudoRandomID];
      let rNightly_price = pseduoNightlyPrice[pseudoRandomID];
      let rCleaning_fee = pseduoCleaningFee[pseudoRandomID]; 
      let rService_fee = 0.13;  //13% pNightly_price + pCleaning_Fee
      let rTaxes_fees = pseudoTaxesFees[pseudoRandomID];
      let rBulkDiscount = pseudoBulkDiscount[pseudoRandomID];
      let rRequired_Week_Booking_Days = pseudoRequiredDays[pseudoRandomID]; 
      let rRating = pseudoRating[pseudoRandomID];
      let rReviews = pseudoReview[pseudoRandomID];
      
      let data = `${id},${rMax_guests},${rNightly_price},${rCleaning_fee},${rService_fee},${rTaxes_fees},${rBulkDiscount},${rRequired_Week_Booking_Days},${rRating},${rReviews}\n`;
      pseudoRandomID = (pseudoRandomID === 9) ? 0 : pseudoRandomID += 1;

      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
    // see if we should continue, or wait
    // don't pass the callback, because we're not done yet.
       ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
      if (i > 0) {
      // had to stop early!
      // write some more once it drains
        writer.once('drain', write);
      }
    }
  write()
}
  
writeTenMillionRooms(writeRooms, 'utf-8', () => {
  writeRooms.end();
});

const writeBookings = fs.createWriteStream(path.resolve(__dirname, 'data', 'bookings.csv'));
writeBookings.write('bID,bProperty_ID,bUser_ID,bGuest_Total,bCheckin_Date,bCheckout_Date\n', 'utf8');

function writeTenMillionBookings(writer, encoding, callback) {
  let k = 10; //10000000;
  let rID = 0;
  let id = 0;
  let pseudoRandomBookingsID = 0;
  let pseudoRandomStayID = 0;
  let pseudoRandomGuestsID = 0;

  const pseudoBookingsPerMonth = [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 8];
  const pseudoStay = [3, 3, 3, 4, 4, 4, 5, 6, 9, 12];
  const pseudoGuestTotal = [3, 4, 3, 4, 4, 6, 3, 6, 9, 11];
  
  function write() {
    let ok = true;

    do {
      k -= 1;
      rID += 1;
      let startDate = moment().format(); // Gets the current date and time YYYY-MM-DDT##:##:-##:##
        let endMoment = moment().endOf('month');
        let endDate = endMoment.format(); // Gets last day of the month in form ^

      for (let i = 0; i < 4; i++) {
        let generatedDates = new Set();
        // let bookingsPerMonth = Math.floor(Math.pow(Math.random(), 4) * 9);

        let bookingsPerMonth = pseudoBookingsPerMonth[pseudoRandomBookingsID];
        pseudoRandomBookingsID = (pseudoRandomBookingsID === 14) ? 0 : pseudoRandomBookingsID += 1;

        for (let j = 0; j < bookingsPerMonth; j++) { //iterates through the random bookings count
          let checkinMoment = moment(faker.date.between(startDate, endDate)); //.format('YYYY-MM-DD');
          let randomStay = pseudoStay[pseudoRandomStayID];
          pseudoRandomStayID = (pseudoRandomStayID === 9) ? 0 : pseudoRandomStayID += 1;
          let checkin = checkinMoment.format('YYYY-MM-DD');
          let checkoutMoment = checkinMoment.add(randomStay, 'days')//.format('YYYY-MM-DD');

          if (moment.max(checkoutMoment, endMoment) === checkinMoment) {
              checkoutMoment = endMoment;
            }
            
          let checkout = checkoutMoment.format('YYYY-MM-DD');

        if ( !( generatedDates.has(checkin) || generatedDates.has(checkout) ) ) {
            id += 1;
            let stayLength = checkoutMoment.diff(checkinMoment, 'days');
            
            for (let l = 0; l <= stayLength; l++) {
              let date = checkinMoment.add(l, 'days').format('YYYY-MM-DD');
              generatedDates.add(date);
            }
            let bProperty_ID = rID;
            let bUser_ID = Math.ceil(Math.random() * 10); //10000000
            let bGuest_Total = pseudoGuestTotal[pseudoRandomGuestsID];
            pseudoRandomGuestsID = (pseudoRandomGuestsID === 9) ? 0 : pseudoRandomGuestsID += 1;
            let data = `${id},${bProperty_ID},${bUser_ID},${bGuest_Total},${checkin},${checkout}\n`;
            
            if (k === 0) {
              writer.write(data, encoding, callback);
            } else {
              // see if we should continue, or wait
              // don't pass the callback, because we're not done yet.
              ok = writer.write(data, encoding);
            }
          }
        }
        startDate = moment().startOf('month').add(i + 1, 'months').format();
        endMoment = moment().endOf('month').add(i + 1, 'months')
        endDate = endMoment.format();
      }
    } while (k > 0 && ok);
      if (k > 0) {
        // had to stop early!
        // write some more once it drains
        writer.once('drain', write);
      }
    }
  write()
}

writeTenMillionBookings(writeBookings, 'utf-8', () => {
  writeBookings.end();
});

const gzip = zlib.createGzip();

const usersInp = fs.createReadStream(path.resolve(__dirname, 'data', 'users.csv'));
const usersOut = fs.createWriteStream(path.resolve(__dirname, 'data', 'users.csv.gz'));
  
usersInp.pipe(gzip)
  .on('error', () => {
    // handle error
  })
  .pipe(usersOut)
  .on('error', () => {
    // handle error
  });

const roomsInp = fs.createReadStream(path.resolve(__dirname, 'data', 'rooms.csv'));
const roomsOut = fs.createWriteStream(path.resolve(__dirname, 'data', 'rooms.csv.gz'));
  
roomsInp.pipe(gzip)
  .on('error', () => {
    // handle error
  })
  .pipe(roomsOut)
  .on('error', () => {
    // handle error
  });

const bookingsInp = fs.createReadStream(path.resolve(__dirname, 'data', 'bookings.csv'));
const bookingsOut = fs.createWriteStream(path.resolve(__dirname, 'data', 'bookings.csv.gz'));
  
bookingsInp.pipe(gzip)
  .on('error', () => {
    // handle error
  })
  .pipe(bookingsOut)
  .on('error', () => {
    // handle error
  });
