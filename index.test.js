const request = require('supertest');
const express = require('express');
const app = require('./index'); // Assuming the server is exported in index.js

describe('POST /api/contact', () => {
    it('should save contact and send an email', async () => {
        const response = await request(app)
            .post('/api/contact')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                message: 'This is a test message.'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Email sent successfully');
    });

    it('should return 500 if email sending fails', async () => {
        const response = await request(app)
            .post('/api/contact')
            .send({
                name: '',
                email: '',
                message: ''
            });

        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe('Failed to save contact');
    });
});
