# SlotManagementSystem

The Interactive Slot Management System is designed to automate the scheduling of Internal Assessments (IA) and Laboratory Continuous Assessments (Lab CA) for faculty and students. The system provides a user-friendly interface that allows faculty members to efficiently book, manage, and edit slots, while students can easily access their timetables. The project aims to eliminate scheduling conflicts by ensuring that no two events overlap in time or venue.

Key Features:
1.Faculty Dashboard:
Faculty members can log in and access a personalized dashboard where they can book IA and Lab CA slots. They can select specific academic years, courses, divisions, batches, venues, dates, and times for each assessment. The system validates these selections to ensure there are no conflicting slots based on time or venue.

2.Slot Conflict Validation:
The system checks for conflicting bookings by validating the combination of date, time, and venue before allowing a new slot to be booked. This ensures that no two slots overlap, preventing scheduling conflicts and making the booking process more efficient and error-free.

3.Calendar View with FullCalendar:
Faculty members have an intuitive calendar view powered by FullCalendar that displays all booked IA and Lab CA slots. This view is organized by division and batch, allowing faculty to manage and review their bookings easily. Faculty can also edit or delete existing slots directly within the calendar interface.

4.Student Timetable:
Students can select their academic year and view the timetable displaying all IA and Lab CA slots for their division and batch. This helps students stay informed about their upcoming assessments and avoid any scheduling confusion.

5.Role-Based Access Control:
The system uses role-based access control (RBAC) to differentiate between faculty and student users. Faculty members can access all functionalities related to slot booking and management, while students have a read-only view of their assessment schedule.

6.Email Notification Feature:
Faculty members can enter any number of email addresses in a form field and send notifications about the booked exam slots. This feature allows faculty to inform students or other faculty members about assessment schedules, ensuring that everyone is kept up-to-date on important changes.

7.Efficient Booking Process:
By automating the booking system, this project significantly reduces the manual effort and time involved in scheduling assessments. The system ensures that all slots are booked without overlaps, reducing administrative overhead and improving the overall efficiency of the scheduling process.

Technologies Used:
Frontend:
HTML, CSS, JavaScript: These technologies are used to create the user interface and ensure a responsive.
FullCalendar: Used for providing a calendar view that allows faculty to easily manage and visualize booked IA and Lab CA slots.
Backend:
Node.js, Express.js: These technologies power the backend, enabling efficient handling of requests and interactions between the frontend and the MongoDB database.
Database:
MongoDB: The system uses MongoDB for data storage, managing information such as booked slots, user credentials, and role-based access.
Email Service:
Nodemailer: This feature uses Nodemailer to send emails from the system, enabling faculty to notify students and other faculty members about IA and Lab CA schedules.