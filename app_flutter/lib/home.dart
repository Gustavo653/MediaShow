import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _counter = 0;
  String _lastMessage = '';
  bool _isConnected = false;
  late WebSocketChannel _channel;

  @override
  void initState() {
    super.initState();
    _connectToWebSocket();
  }

  void _connectToWebSocket() {
    _channel = WebSocketChannel.connect(Uri.parse('ws://192.168.0.17:3000'));
    _channel.stream.listen(
      (message) {
        setState(() {
          _isConnected = true;
          _lastMessage = message;
        });
      },
      onDone: () {
        setState(() {
          _isConnected = false;
        });
        Future.delayed(const Duration(seconds: 5), () {
          _connectToWebSocket();
        });
      },
      onError: (error) {
        setState(() {
          _isConnected = false;
        });
        Future.delayed(const Duration(seconds: 5), () {
          _connectToWebSocket();
        });
      },
    );
    setState(() {
      _isConnected = true;
    });
  }

  @override
  void dispose() {
    _channel.sink.close();
    super.dispose();
  }

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Você pressionou o botão esta quantidade de vezes:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 20),
            Text(
              'Status da conexão: ${_isConnected ? "Conectado" : "Desconectado"}',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            Text(
              'Última resposta do servidor: $_lastMessage',
              style: Theme.of(context).textTheme.titleMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _incrementCounter();
          _channel.sink.add('$_counter');
        },
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
