## Running locally

1. Install dependencies:

`npm install`

2. Run the webpack dev server

`npm run serve`

The game will be accessible at http://localhost:8080. It's currently binding to 0.0.0.0 instead of 127.0.0.1, 
so it should be available at localhost even if you're running it within a VM (provided port 8080 is forwarded).

## Building for deployment

`npm run build`
