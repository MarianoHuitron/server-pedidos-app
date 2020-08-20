module.exports = (io) => {
    io.on('connection', (socket) => {

        socket.emit('Conectado', {connected: true});


        socket.on('pay-success', () => {
            console.log('pay-success')
            socket.broadcast.emit('pay-success');
        });
    });
}