import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'features/dashboard/invigilator_home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const NexAIInvigilatorApp());
}

class NexAIInvigilatorApp extends StatelessWidget {
  const NexAIInvigilatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NexAI Invigilator',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const InvigilatorHomeScreen(),
    );
  }
}
