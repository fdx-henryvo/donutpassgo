# Donutpassgo Backend

Functionality:
- Fetch AD avatar photos
- Store members
  ```
    Member {
        id: string,
        name: string,
        donutCount: number,
        photoUrl?: string
        position?: number
    }
  ```
- GET (members) /rankings or /members
- PATCH /member/{memberId}/donuts ++
- GET /teams
  - teams comprise of members 1:M
  - seed teams with initial members
  - add and remove team members from teams
- Websocket Room code per team
- Websocket listen for button click and trigger