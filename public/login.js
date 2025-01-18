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

// Get elements
const userBtn = document.getElementById('userBtn');
const userLoginBtn = document.getElementById('userLoginBtn');
const adminBtn = document.getElementById('adminBtn');
const loginBtn = document.getElementById('loginBtn');
const userEmailInput = document.getElementById('userEmail');
const adminEmailInput = document.getElementById('adminEmail');
const passkeyInput = document.getElementById('passkey');
const userTypeSelection = document.getElementById('user-type-selection');
const adminLoginDiv = document.getElementById('admin-login');
const userLoginDiv = document.getElementById('user-login');
const year = document.getElementById('year'); // Ensure this is declared only once
// Handle User selection
userBtn.addEventListener('click', () => {
    userTypeSelection.style.display = 'none';
    userLoginDiv.style.display = 'block'; // Show the user login form
});

// Handle User login
userLoginBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission if it's inside a form

    const userEmail = userEmailInput.value.trim();
    const selectedYear = year.value; // Use the correct variable

    console.log('Email:', userEmail);
    console.log('Selected Year:', selectedYear);

    if (userEmail.endsWith('@somaiya.edu')) {
        if (selectedYear === 'SY') {
            window.location.href = '/SY/front.html';
        } else if (selectedYear === 'TY') {
            window.location.href = '/TY/front.html';
        } else if (selectedYear === 'LY') {
            window.location.href = '/LY/front.html';
        } else if (selectedYear === 'MTECH-IT') {
            window.location.href = '/MTECH-IT/front.html';
        } else if (selectedYear === 'MTECH-AIDS') {
            window.location.href = '/MTECH-AIDS/front.html';
        } else {
            alert('Please select a valid course.');
        }
    } else {
        alert('Only users with a Somaiya email are allowed to log in.');
    }
});

// Handle Admin selection
adminBtn.addEventListener('click', () => {
    userTypeSelection.style.display = 'none';
    adminLoginDiv.style.display = 'block';
});

// Handle Admin login
loginBtn.addEventListener('click', () => {
    const adminEmail = adminEmailInput.value.trim();
    const enteredPasskey = passkeyInput.value.trim();

    if (facultyEmails.includes(adminEmail) && enteredPasskey === passkey) {
        // If email is in the facultyEmails list and passkey matches
        window.location.href = '/faculty.html'; // Redirect to faculty dashboard
    } else {
        alert('Invalid email or passkey');
    }
});

