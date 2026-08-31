import 'package:flutter/material.dart';

class InvigilatorShell extends StatelessWidget {
  final Widget child;
  const InvigilatorShell({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('NexAI — Invigilator')),
      body: child,
    );
  }
}
