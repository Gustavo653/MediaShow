import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'dart:convert';
import 'dart:async';

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
  List<Map<String, dynamic>> _mediaList = [];
  int _currentIndex = 0;
  Timer? _timer;

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
          _mediaList = List<Map<String, dynamic>>.from(json.decode(message));
          _startSlideshow();
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

  void _startSlideshow() {
    if (_mediaList.isNotEmpty && _timer == null) {
      _currentIndex = 0;
      _showImage(_currentIndex);
      _timer = Timer.periodic(
          Duration(seconds: _mediaList[_currentIndex]['mediaTime'] as int),
          (_) {
        _currentIndex = (_currentIndex + 1) % _mediaList.length;
        _showImage(_currentIndex);
      });
    }
  }

  void _stopSlideshow() {
    _timer?.cancel();
    _timer = null;
  }

  void _showImage(int index) {
    final currentMedia = _mediaList[index];
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        String mediaName = currentMedia['mediaName'] as String;
        String mediaTime = "Tempo: ${currentMedia['mediaTime']}s";
        String lastSyncText = "Últ. Sinc.: $_lastSyncTime";
        String connectionStatus = _isConnected ? "Conec." : "Descon.";
        String appBarTitle = "$mediaName - $lastSyncText - $connectionStatus - $mediaTime";
        return Scaffold(
          appBar: AppBar(
            title: Text(appBarTitle),
          ),
          body: Center(
            child: Image.network(currentMedia['mediaUrl'] as String),
          ),
        );
      },
    );
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
    _lastSyncTime = DateFormat('dd/MM/yyyy HH:mm:ss').format(DateTime.now());
  }

  @override
  void dispose() {
    _channel.sink.close();
    _stopSlideshow();
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
