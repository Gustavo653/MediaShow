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
  late WebSocketChannel _channel;

  @override
  void initState() {
    super.initState();
    _channel = WebSocketChannel.connect(Uri.parse('ws://192.168.0.17:3000'));
    _channel.stream.listen((message) {
      setState(() {
        _lastMessage = message;
      });
      print('Mensagem recebida do servidor: $message');
    }, onDone: () {
      print('Conexão WebSocket fechada');
    }, onError: (error) {
      print('Erro na conexão WebSocket: $error');
    });
    print('Conexão WebSocket estabelecida');
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
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline6,
            ),
            const SizedBox(height: 20),
            Text(
              'Última resposta do servidor: $_lastMessage',
              style: Theme.of(context).textTheme.subtitle1,
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
