const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Booking = require('./models/Booking');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/SBdb')
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

const facultyEmails = [
    'sonalipatil@somaiya.edu',
	'nandanaprabhu@somaiya.edu',
	'neelkamalsurve@somaiya.edu',
	'sangeetanagpure@somaiya.edu',
	'ravindradivekar@somaiya.edu',
	'sujatapathak@somaiya.edu',
	'kirankumarisinha@somaiya.edu',
	'erajohri@somaiya.edu',
	'purnimaahirao@somaiya.edu',
	'suchitrapatil@somaiya.edu',
	'sunayanavj@engg.somaiya.edu',
	'yogitaborse@somaiya.edu',
	'deeptipatole@somaiya.edu',
	'khushikhanchandani@somaiya.edu',
	'avanisakhapara@somaiya.edu',
	'ashwinidalvi@somaiya.edu',
	'sanjayvidhani@somaiya.edu',
	'diptipawade@somaiya.edu',
	'sagar.korde@somaiya.edu',
	'chirag.desai@somaiya.edu',
	'sonali.w@somaiya.edu',
	'Pankaj.mishra@somaiya.edu',
	'venkataramanan@somaiya.edu',
	'vaibhav.chunekar@somaiya.edu',
	'anagha.raich@somaiya.edu',
	'snigdha.b@somaiya.edu',
	'l.sahu@somaiya.edu',
	'abhijeet.p@somaiya.edu',
	'sarika.d@somaiya.edu',
	'utkarshita.s@somaiya.edu'
]; 
const passkey = 'SOMAIYA_FACULTY'; 

const transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
        user: 'utkarshita18@gmail.com',  
        pass: 'rwix mmza xskd vvkv'   
    },
    debug: true
});


// Main page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/student-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/student.html'));
});

app.get('/faculty-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/faculty.html'));
});



app.post('/login', async(req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    if (facultyEmails.includes(normalizedEmail) && passkey === 'SOMAIYA_FACULTY')  {
        res.redirect('/faculty.html'); 
    } else {
        res.redirect('/student.html'); 
    }
        
});



['SY', 'TY', 'LY', 'MTECH-IT', 'MTECH-AIDS'].forEach(year => {
    ['IA', 'Lab-CA'].forEach(type => {
        app.get(`/${year}/${type}`, (req, res) => {
            res.sendFile(path.join(__dirname, `public/${year}/${type}/index.html`));
        });

        app.post(`/${year}/${type}/book`, async (req, res) => {
            console.log('Request body:', req.body);
            try {
                const { facultyName, courseName, division, batch, date, startTime, endTime, venue, desc, emailAdd } = req.body;
                const existingBooking = await Booking.findOne({ date, venue });
                if (existingBooking && (startTime < existingBooking.endTime && endTime > existingBooking.startTime)) {
                    return res.status(400).json({ message: 'Venue already booked for this date and time.' });
                }
                const booking = new Booking({ facultyName, courseName, division, batch, date, startTime, endTime, venue, desc, emailAdd, year, type });
                await booking.save();


                /*sending mail*/ 
                const mailOptions = {
                    from: 'utkarshita18@gmail.com',  
                    to: `${emailAdd}`,  
                    subject: `Slot Booking Confirmation`,
                    text: `This is a test email to verify functionality.
                    Dear Faculty,

                    Your slot has been successfully booked with the following details:
                    ${type}
                    Course: ${courseName}
                    Division: ${division}
                    ${batch ? 'Batch: ' + batch : ''}
                    Date: ${date}
                    Time: ${startTime} - ${endTime}
                    Venue: ${venue}
                    

                    Thank you for booking the slot.

                    Best regards,
                    Admin Team` 
                    
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });



                res.json({ message: 'Slot booked successfully!' });
            } catch (error) {
                console.error('Error booking slot:', error);
                res.json({ message: 'Error booking slot.' });
            }
        });

    });
});


['SY', 'TY', 'LY', 'MTECH-IT', 'MTECH-AIDS'].forEach(year => {
    ['IA', 'Lab-CA'].forEach(type => {
        app.get(`/${year}/${type}/calendar`, (req, res) => {
            res.sendFile(path.join(__dirname, `public/${year}/${type}/calendar.html`));
        });

        // Endpoint to fetch events for the calendar
        app.get(`/${year}/${type}/calendar/events`, async (req, res) => {
            const division = req.query.division;
            const batch = req.query.batch;        
            const query = { year, type };

            if (type === 'IA' && division) {
                query.division = division;  // Filter by division for IA
            }
            if (type === 'Lab-CA' && batch) {
                query.batch = batch;  // Filter by batch for Lab CA
            }
            try {
                const events = await Booking.find({ year, type });
                const formattedData = events.map(slot => ({
                    title: slot.facultyName,
                    start: `${slot.date}T${slot.startTime}`,
                    end: `${slot.date}T${slot.endTime}`,
                    extendedProps: {
                        courseName: slot.courseName,
                        division: slot.division,
                        batch: slot.batch,
                        venue: slot.venue,
                        desc: slot.desc
                    },
                    description: `${slot.courseName} - ${slot.venue} - ${slot.division} - ${slot.desc} - ${slot.batch ? '/ ' + slot.batch : ''}`
                }));
                res.json(formattedData);
            } catch (err) {
                console.error("Error fetching events", err);
                res.status(500).send("Error fetching events");
            }
        });
    });
});


// Routes for IA and Lab CA Slot Booking Pages
['SY', 'TY', 'LY', 'MTECH-IT', 'MTECH-AIDS'].forEach(year => {
    ['IA', 'Lab-CA'].forEach(type => {

        app.get(`/${year}/${type}/edit`, (req, res) => {
            res.sendFile(path.join(__dirname, `public/${year}/${type}/edit.html`));
        });

        // Endpoint to fetch slots for editing
        app.get(`/${year}/${type}/edit/slots`, async (req, res) => {
            try {
                const slots = await Booking.find({ year, type }).sort({ date: 1, startTime: 1 });
                res.json(slots);
            } catch (err) {
                console.error("Error fetching slots", err); 
                res.status(500).send("Error fetching slots.");
            }
        });

        // Endpoint to handle slot editing
        app.put(`/${year}/${type}/edit/slot/:id`, async (req, res) => {
            try {
                const { id } = req.params;
                const { date, startTime, endTime, venue, desc } = req.body;
                await Booking.findByIdAndUpdate(id, { date, startTime, endTime, venue , desc});
                res.json({ message: 'Slot updated successfully' });
            } catch (err) {
                res.status(500).send("Error updating slot");
            }
        });

        // Endpoint to handle slot deletion
        app.delete(`/${year}/${type}/edit/slot/:id`, async (req, res) => {
            try {
                const { id } = req.params;
                await Booking.findByIdAndDelete(id);
                res.json({ message: 'Slot deleted successfully' });
            } catch (err) {
                console.error('Error deleting slot:', err);
                res.status(500).send("Error deleting slot");
            }
        });
    });
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
