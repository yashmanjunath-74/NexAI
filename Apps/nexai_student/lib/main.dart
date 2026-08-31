import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'features/dashboard/student_home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const NexAIStudentApp());
}

class NexAIStudentApp extends StatelessWidget {
  const NexAIStudentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NexAI Student',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const StudentHomeScreen(),
    );
  }
}
