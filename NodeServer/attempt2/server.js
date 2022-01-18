const net = require("net");

// Create a simple server
var server = net.createServer(function (conn) {
    console.log("Server: Client connected");

    // If connection is closed
    conn.on("end", function() {
        console.log("Server: Client disconnected");
        server.close();
        process.exit(0);
    });

    // Handle data from client
    conn.on("data", function(data) {
        data = JSON.parse(data);
        console.log("Response from client: %s", data.response);
    });

    // Let's response with a hello message
    conn.write(
        JSON.stringify(
            { response: "Hey there client!" }
        )
    );
});

// Listen for connections
server.listen(8080, "localhost", function () {
    console.log("Server: Listening");
});