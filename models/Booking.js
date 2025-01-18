const express = require('express');
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    facultyName: String,
    courseName: String,
    division: String,
    batch: String,
    date: String,
    startTime: String,
    endTime: String,
    venue: String,
    desc: String,
    emailAdd: String,
    year: String,
    type: String,
});

module.exports = mongoose.model('Booking', bookingSchema);