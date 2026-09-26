// load_test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Test Configuration: 1000 Virtual Users ramp up over 30s
export const options = {
    stages: [
        { duration: '10s', target: 200 },  // Ramp up to 200 users
        { duration: '20s', target: 1000 }, // Spike to 1000 concurrent users
        { duration: '10s', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<150'],  // 95% of requests must complete in < 150ms
        http_req_failed: ['rate<0.01'],    // Error rate must be less than 1%
    },
};

export default function () {
    const url = 'http://localhost:4000/api/user/book-slot';
    const payload = JSON.stringify({
        userId: '65f1a2b3c4d5e6f7a8b9c0d1',
        barberId: '65f1a2b3c4d5e6f7a8b9c0d2',
        slotDate: '2026_10_05',
        slotTime: '10:00 AM',
        paymentMethod: 'Cash',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Mock JWT
        },
    };

    const res = http.post(url, payload, params);

    // Assertions
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has success key': (r) => r.json().success !== undefined,
    });

    sleep(0.1); // Small pause between iterations
}
