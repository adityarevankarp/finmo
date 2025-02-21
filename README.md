# Parking Lot System API

A RESTful API built with NestJS and TypeScript for managing a car parking lot system. The system allows initializing a parking lot, parking cars, freeing slots, and querying parking status without a database, using in-memory storage.

## Features
- Initialize and expand a parking lot
- Park and free cars by slot or registration number
- Query occupied slots, registration numbers, and slot numbers by color
- Containerized with Docker

## Prerequisites
- Node.js (v16 or later)
- npm
- Docker (optional, for containerized running)

## Setup

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/adityarevankarp/finmo.git
   cd parking-lot-system
   ```
2. Install dependencies:
  ```bash
  npm install
```
3.Start the app:
```bash
npm run start:dev
```
The API will be available at http://localhost:3000.

### Usnig Docker
```bash
docker build -t parking-lot-system .
docker run -p 3000:3000 parking-lot-system
```
## API Endpoints
### 1.Initialize Parking Lot
#### Method: `POST`
#### Endpoint: `/parking_lot`
#### Request Body:
```json
{
  "no_of_slot": 6
}
```
#### Response `Response (200 OK):`
```json
{
  "total_slot": 6
}
```
#### Errors:
#### 400 Bad Request: If already initialized or size ≤ 0
```json
{
  "statusCode": 400,
  "message": "Parking lot already initialized",
  "error": "Bad Request"
}
```

### 2.Expand Parking lot
#### Method: `PATCH`
#### Endpoint: `/parking_lot`
#### Request Body:
```json
{
  "increment_slot": 3
}
```
#### Response `Response (200 OK):`
```json
{
  "total_slot": 9
}
```
#### Errors:
#### 400 Bad Request: If already initialized or size ≤ 0
```json
{
 "statusCode": 400,
  "message": "Parking lot not initialized yet",
  "error": "Bad Request"
}
```


### 3.Park a Car
#### Method: `POST`
#### Endpoint: `/park`
#### Request Body:
```json
{
  "car_reg_no": "KA-01-AB-2211",
  "car_color": "white"
}
```
#### Response `Response (201 CREATED):`
```json
{
  "allocated_slot_number": 1
}
```
#### Errors:
#### 400 Bad Request: If lot is full or not initialized
```json
{
  "statusCode": 400,
  "message": "Parking lot is full",
  "error": "Bad Request"
}
```

### 4.Clear a Slot by slot_no & Registration_no
#### Method: `POST`
#### Endpoint: `/clear`
#### Request Body:
```json
{
  "slot_number": 1
}
```
```json
{
 "car_registration_no": "KA-01-AB-2211"
}
```
#### Response `Response (200 ok):`
```json
{
  "freed_slot_number": 1
}
```
#### Errors:
#### 400 Bad Request: If neither parameter provided or not initialized
```json
{
  "statusCode": 400,
  "message": "Must provide either slot_number or car_registration_no",
  "error": "Bad Request"
}
```
#### 404 Not Found: If slot is free or car not found
```
{
  "statusCode": 404,
  "message": "Slot is already free or does not exist",
  "error": "Not Found"
}
```

### 5.Get Parking Status
#### Method: `GET`
#### Endpoint: `/status`

#### Response `Response (200 OK):`
```json
[
  {
    "slot_no": 1,
    "registration_no": "KA-01-AB-2211",
    "color": "white"
  },
  {
    "slot_no": 2,
    "registration_no": "KA-02-CD-3344",
    "color": "black"
  }
]
```
#### Errors:
#### 400 Bad Request: not initialized
```json
{
  "statusCode": 400,
  "message": "Parking lot not initialized yet",
  "error": "Bad Request"
}
```

### 6. Get Registration Numbers by Color
#### Method: `GET`
#### Endpoint: `/registration_numbers/:color`
#### EG:- GET /parking/registration_numbers/white
#### Response `Response (200 OK):`

```json
[
  "KA-01-AB-2211",
  "KA-03-EF-5566"
]
```
#### Errors:
#### 400 Bad Request: not initialized
```json
{
  "statusCode": 400,
  "message": "Parking lot not initialized yet",
  "error": "Bad Request"
}
```
#### Returns [] if no cars match.


### 7. Get Slot Numbers by Color
#### Method: `GET`
#### Endpoint: `/slot_numbers/:color`
#### EG:- GET /parking/slot_numbers/white
#### Response `Response (200 OK):`

```json
[
  "1",
  "3"
]
```
#### Errors:
#### 400 Bad Request: not initialized
```json
{
  "statusCode": 400,
  "message": "Parking lot not initialized yet",
  "error": "Bad Request"
}
```
#### Returns [] if no cars match.

### Running Tests
```bash
npm run test
```
## Time Complexity

The parking lot system uses an in-memory `Map` to store slots, providing efficient access by slot number. Below is the time complexity for each major operation:

- **Initialize Parking Lot (`POST /parking_lot`)**: **O(n)**  
  Creates `n` slots in the `Map`, where `n` is the number of slots specified. Each insertion is O(1), repeated `n` times.

- **Expand Parking Lot (`PATCH /parking_lot`)**: **O(m)**  
  Adds `m` new slots to the `Map`, where `m` is the increment. Each insertion is O(1), repeated `m` times.

- **Park a Car (`POST /park`)**: **O(n)**  
  Checks if the lot is full (O(n)) and finds the first available slot by scanning from slot 1 (O(n) in worst case if all prior slots are occupied). Could be optimized to O(1) with a min-heap of available slots.

- **Clear Slot by Slot Number (`POST /clear` with `slot_number`)**: **O(1)**  
  Direct `Map` lookup by slot number, followed by a constant-time update.

- **Clear Slot by Registration Number (`POST /clear` with `car_registration_no`)**: **O(n)**  
  Linear search through all slots to find the matching registration number. Could be optimized to O(1) with an additional `Map` of registration numbers to slot numbers.

- **Get Parking Status (`GET /status`)**: **O(n)**  
  Scans all slots to collect occupied ones, where `n` is the total number of slots.

- **Get Registration Numbers by Color (`GET /registration_numbers/:color`)**: **O(n)**  
  Scans all slots to filter by color, where `n` is the total number of slots.




