import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/api_client.dart';

/// Auth state model
class AuthState {
  final AuthUser? user;
  final String? accessToken;
  final String? refreshToken;
  final bool isAuthenticated;

  const AuthState({
    this.user,
    this.accessToken,
    this.refreshToken,
    this.isAuthenticated = false,
  });

  AuthState copyWith({
    AuthUser? user,
    String? accessToken,
    String? refreshToken,
    bool? isAuthenticated,
  }) => AuthState(
    user: user ?? this.user,
    accessToken: accessToken ?? this.accessToken,
    refreshToken: refreshToken ?? this.refreshToken,
    isAuthenticated: isAuthenticated ?? this.isAuthenticated,
  );
}

class AuthUser {
  final String id;
  final String email;
  final String fullName;
  final String role;
  final String? departmentId;

  const AuthUser({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    this.departmentId,
  });

  factory AuthUser.fromJson(Map<String, dynamic> json) => AuthUser(
    id: json['id'],
    email: json['email'],
    fullName: json['full_name'],
    role: json['role'],
    departmentId: json['department_id'],
  );
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState());

  Future<void> login(String email, String password) async {
    final client = ApiClient();
    final response = await client.post('/auth/login/', {
      'email': email,
      'password': password,
    });
    final user = AuthUser.fromJson(response['user']);
    state = state.copyWith(
      user: user,
      accessToken: response['access'],
      refreshToken: response['refresh'],
      isAuthenticated: true,
    );
    // Persist tokens to secure storage
    await client.saveTokens(response['access'], response['refresh']);
  }

  Future<void> logout() async {
    final client = ApiClient();
    await client.clearTokens();
    state = const AuthState();
  }
}

final authStateProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(),
);
