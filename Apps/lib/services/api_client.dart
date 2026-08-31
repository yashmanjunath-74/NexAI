import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Singleton API client wrapping Dio with JWT support
class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  late final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  static const _accessKey  = 'nexai_access_token';
  static const _refreshKey = 'nexai_refresh_token';

  ApiClient._internal() {
    final baseUrl = dotenv.env['API_BASE_URL'] ?? 'http://10.0.2.2:8000/api/v1';
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: _accessKey);
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            final refreshToken = await _storage.read(key: _refreshKey);
            if (refreshToken != null) {
              try {
                final res = await _dio.post('/auth/refresh/', data: {'refresh': refreshToken});
                final newAccess = res.data['access'] as String;
                await _storage.write(key: _accessKey, value: newAccess);
                error.requestOptions.headers['Authorization'] = 'Bearer $newAccess';
                return handler.resolve(await _dio.fetch(error.requestOptions));
              } catch (_) {
                await clearTokens();
              }
            }
          }
          handler.next(error);
        },
      ),
    );
  }

  Future<Map<String, dynamic>> post(String path, Map<String, dynamic> data) async {
    final response = await _dio.post(path, data: data);
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> get(String path, {Map<String, dynamic>? params}) async {
    final response = await _dio.get(path, queryParameters: params);
    return response.data as Map<String, dynamic>;
  }

  Future<void> saveTokens(String access, String refresh) async {
    await _storage.write(key: _accessKey, value: access);
    await _storage.write(key: _refreshKey, value: refresh);
  }

  Future<void> clearTokens() async {
    await _storage.deleteAll();
  }
}
