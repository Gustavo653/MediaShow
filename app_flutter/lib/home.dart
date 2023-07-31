import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:video_player/video_player.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'dart:convert';
import 'dart:async';

class HomePage extends StatefulWidget {
  const HomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final String _serverWS = 'ws://192.168.0.17:3000';
  String _lastMessage = '';
  bool _isConnected = false;
  String _serialNumber = '';
  late WebSocketChannel _channel;
  String _lastSyncTime = '';
  List<Map<String, dynamic>> _mediaList = [];
  int _currentIndex = 0;
  Timer? _timer;
  bool _isShowingImageDialog = false;
  late VideoPlayerController _videoController;
  late WebViewController _webViewController;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await _connectToWebSocket();
    });
  }

  Future<void> _connectToWebSocket() async {
    _channel = WebSocketChannel.connect(Uri.parse(_serverWS));
    _channel.stream.listen(
      (message) {
        _handleReceivedMessage(message);
      },
      onDone: () async {
        setState(() {
          _isConnected = false;
        });
        await Future.delayed(const Duration(seconds: 5));
        await _connectToWebSocket();
      },
      onError: (error) async {
        setState(() {
          _isConnected = false;
        });
        await Future.delayed(const Duration(seconds: 5));
        await _connectToWebSocket();
      },
    );
    setState(() {
      _isConnected = true;
      _sendSerialNumberAutomatically();
    });
  }

  void _handleReceivedMessage(String message) {
    setState(() {
      _lastMessage = message;
      if (message == 'refresh') {
        _sendSerialNumberAutomatically();
      }
      _mediaList = List<Map<String, dynamic>>.from(json.decode(message));
      _startSlideshow();
    });
  }

  void _startSlideshow() {
    if (_mediaList.isNotEmpty) {
      _stopSlideshow();

      _showMedia(_currentIndex);

      int currentMediaTime = _mediaList[_currentIndex]['mediaTime'] as int;

      _timer = Timer.periodic(Duration(seconds: currentMediaTime), (timer) {
        _currentIndex = (_currentIndex + 1) % _mediaList.length;
        currentMediaTime = _mediaList[_currentIndex]['mediaTime'] as int;
        _showMedia(_currentIndex);
        timer.cancel();
        _startSlideshow();
      });
    }
  }

  void _stopSlideshow() {
    _timer?.cancel();
    _timer = null;
  }

  void _showMedia(int index) {
    final currentMedia = _mediaList[index];

    if (_isShowingImageDialog) {
      Navigator.of(context).pop();
    }

    String mediaName = currentMedia['mediaName'] as String;
    String mediaTime = "Tempo: ${currentMedia['mediaTime']}s";
    String lastSyncText = "Últ. Sinc.: $_lastSyncTime";
    String connectionStatus = _isConnected ? "Conec." : "Descon.";
    String appBarTitle =
        "$mediaName - $lastSyncText - $connectionStatus - $mediaTime";

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        _isShowingImageDialog = true;
        return WillPopScope(
          onWillPop: () async {
            _isShowingImageDialog = false;
            return true;
          },
          child: Scaffold(
            appBar: AppBar(
              title: Text(appBarTitle),
            ),
            body: _buildMediaContent(currentMedia),
          ),
        );
      },
    );
  }

  Widget _buildMediaContent(Map<String, dynamic> currentMedia) {
    if (currentMedia['mediaType'] == 'video') {
      _videoController =
          VideoPlayerController.networkUrl(Uri.parse(currentMedia['mediaUrl']))
            ..initialize().then((_) {
              setState(() {});
            });
      return Center(
        child: _videoController.value.isInitialized
            ? AspectRatio(
                aspectRatio: _videoController.value.aspectRatio,
                child: VideoPlayer(_videoController),
              )
            : Container(),
      );
    } else if (currentMedia['mediaType'] == 'image') {
      return Center(
        child: Image.network(currentMedia['mediaUrl'] as String),
      );
    } else if (currentMedia['mediaType'] == 'web_woauth') {
      _webViewController = WebViewController()
        ..loadRequest(
          Uri.parse(currentMedia['mediaUrl'] as String),
        );
      return WebViewWidget(controller: _webViewController);
    } else {
      return const Text('Tipo de mídia não suportado!');
    }
  }

  Future<void> _sendSerialNumberAutomatically() async {
    DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
    late String serialNumber;

    try {
      var androidInfo = await deviceInfo.androidInfo;
      serialNumber = androidInfo.id;
      _serialNumber = androidInfo.id;
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
    _timer?.cancel();
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
              const Text(
                'IP Servidor:',
                style: TextStyle(fontSize: 18),
              ),
              Text(
                _serverWS,
                style:
                    const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const Text(
                'ID Dispositivo:',
                style: TextStyle(fontSize: 18),
              ),
              Text(
                _serialNumber,
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
