import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'dart:convert';

class HomePage extends StatefulWidget {
  const HomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String _lastMessage = '';
  bool _isConnected = false;
  late WebSocketChannel _channel;
  String _lastSyncTime = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addPostFrameCallback((_) {
      _sendSerialNumberAutomatically();
    });
    _connectToWebSocket();
  }

  void _connectToWebSocket() {
    _channel = WebSocketChannel.connect(Uri.parse('ws://192.168.0.17:3000'));
    _channel.stream.listen(
      (message) {
        setState(() {
          _isConnected = true;
          _lastMessage = message;
          if (message == 'refresh') _sendSerialNumberAutomatically();
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
      _sendSerialNumberAutomatically();
    });
  }

  Future<void> _sendSerialNumberAutomatically() async {
    DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
    late String serialNumber;

    try {
      var androidInfo = await deviceInfo.androidInfo;
      print(androidInfo);
      serialNumber = androidInfo.id;
    } catch (e) {
      print('Erro ao obter o serial number do dispositivo: $e');
      return;
    }

    final jsonData = {
      "type": "subscribe",
      "serialNumber": serialNumber,
    };

    final jsonString = json.encode(jsonData);
    _channel.sink.add(jsonString);
    _lastSyncTime = DateTime.now().toString();
  }

  @override
  void dispose() {
    _channel.sink.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: SingleChildScrollView(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const Text(
                'Status da conexão:',
                style: TextStyle(fontSize: 18),
              ),
              Text(
                _isConnected ? "Conectado" : "Desconectado",
                style:
                    const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              const Text(
                'Última resposta do servidor:',
                style: TextStyle(fontSize: 18),
              ),
              Text(
                _lastMessage,
                style:
                    const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              const Text(
                'Última sincronização:',
                style: TextStyle(fontSize: 18),
              ),
              Text(
                _lastSyncTime,
                style:
                    const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
