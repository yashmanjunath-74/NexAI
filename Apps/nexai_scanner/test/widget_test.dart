import 'package:flutter_test/flutter_test.dart';
import 'package:nexai_scanner/main.dart';

void main() {
  testWidgets('NexAI Scanner App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const NexAIScannerApp());
    expect(find.text('NexAI Scanner Station'), findsOneWidget);
    expect(find.text('ENTER SESSION KEY'), findsOneWidget);
  });
}
