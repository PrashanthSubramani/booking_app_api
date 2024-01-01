const express = require('express');
const app= express();
const PORT = 8000;
app.use(express.json());

const rooms = [
    {
        "id": 1 ,
        "numberOfSeatsAvailable" : 30,
        "amenitiesInRoom" : "tv,ac,heater",
        "pricePerHour" : 80
    }
];

const bookings =[
    {
        id: 1,
        customerName : "Mangai",
        date : "03/17/2022",
        startTime : "17:00:00",
        endTime : "20:00:00",
        roomID : 1
      }
];


const customers = [
    { name: 'Selva',
     bookings: [ 
        {
            customer: 'Selva',
            bookingDate: '20230612',
            startTime: '12:00pm',
            endTime: '11:59am',
            bookingID: 1,
            roomId: 1,
            status: 'booked',
            booked_On: '3/7/2023'
          }
      ] }
];


app.get('/rooms/all', (req, res)=> {
    res.status(200).json({RoomsList : rooms});
})


app.post('/room/create',(req, res)=>{
    try{
        const createRooms = req.body;
        const idExists = rooms.find((el)=> el.id === createRooms.id)
        if(idExists !== undefined){
            res.status(400).send({
                message: "Room already exists"
            });
        }else{
            rooms.push(createRooms)
            res.status(200).send({
                message: "Room Created Succesfully"
            });
        }
 
    }catch(error){
        res.status(500).send(
            {
                message: 'Internal Server Error',
                error:error.message
            })
    }
    
})

app.post('/booking/create',(req, res)=>{
    try{
        const id  = req.body.roomID;
        const bookRoom = req.body;
        const currentDate = new Date().toLocaleDateString();
        console.log(id);
        const roomExits = rooms.find((room)=> room.id === id);

        if(!roomExits){
            return res.status(400).json({ message: "Room does not exist.", RoomsList: rooms });
        }

        const isRoomBooked = bookings.some((booking)=>{
            return booking.roomId === id && booking.bookingDate === bookRoom.bookingDate;
        })
        
        if(isRoomBooked){
            return res.status(400).json(
                {
                    message:"Hall already booked for this date, choose another hall",
                    Bookings:bookings
                }
            )
        }

        const newBookingId = (bookings.length + 1);
        const newBooking = {
            ...bookRoom,
            bookkingID: newBookingId,
            roomId : id,
            status: "booked",
            booked_On : currentDate
        }

        bookings.push(newBooking);

        const customerDetailsIndex = customers.findIndex((cust)=> cust.name === newBooking.customer);
        if(customerDetailsIndex !== -1){
            customers[customerDetailsIndex].bookings.push(newBooking);
        }else{
            customers.push({ name: newBooking.customer, bookings: [newBooking] });
        }
        return res.status(201).json({ message: "Hall booked", Bookings: bookings, added: newBooking });
    }catch(error){
        res.status(500).send(
            {
                message: 'Internal Server Error',
                error:error.message
            })
    }
    
})

app.get('/',(req, res)=>{

    try{
        res.status(200).json({BookingList : bookings});
    }catch(error){
        res.status(500).send({
            message: "Internal Server Error."
        })
    }
   
    
})


app.get('/allcustomers',(req, res)=>{
    try{
        res.status(200).json({CustomerList : customers});
    }catch(error){
        res.status(500).send({
            message: "Internal Server Error."
        })
    }
})


app.get('/customer/:name',(req, res)=>{
    try{
        const name = req.params.name;
        console.log(name);
        const CustomerExits = customers.find((customers)=> customers.name === name);

        if(!CustomerExits){
            res.status(404).json({ error: 'Customer not found' });
            return;
        }else{
              res.json(CustomerExits);
        }

        // res.status(200).json({CustomerList : customers});
    }catch(error){
        res.status(500).send({
            message: "Internal Server Error.",
            error : error.message
        })
    }
})


app.listen(PORT,()=>console.log('App listening to ' + PORT));